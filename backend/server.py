from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import uuid
import base64
import html
import requests
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional

# Runtime configuration
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT == "production"

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

if IS_PRODUCTION and not os.environ.get("JWT_SECRET"):
    raise RuntimeError("JWT_SECRET must be set in production")

JWT_SECRET = os.environ.get("JWT_SECRET", "development-only-jwt-secret")
JWT_ALGORITHM = "HS256"
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "true" if IS_PRODUCTION else "false").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin").strip().lower()
ADMIN_INITIAL_PASSWORD = os.environ.get("ADMIN_INITIAL_PASSWORD", "").strip()
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "").strip()
QUOTE_REQUEST_TO_EMAIL = os.environ.get("QUOTE_REQUEST_TO_EMAIL", "").strip()
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
]

# Create the main app
app = FastAPI(title="KETE Kohvik API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== PASSWORD & JWT HELPERS ==============

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Pole sisse logitud")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Vale tokeni tüüp")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Kasutajat ei leitud")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Seanss aegunud")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Vale token")

# ============== PYDANTIC MODELS ==============

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    role: str

class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: str
    category: str  # soups, mains, drinks

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: str
    category: str

class OpeningHours(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day: str
    hours: str
    is_closed: bool = False

class OpeningHoursUpdate(BaseModel):
    day: str
    hours: str
    is_closed: bool = False

class ContactInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    address: str
    phone: str
    facebook: str
    email: str

class QuoteRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    event_type: str
    event_date: Optional[str] = None
    guest_count: int = Field(..., ge=1, le=100)
    package_type: str
    timing: Optional[str] = None
    details: Optional[str] = None

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    alt: str
    order: int = 0

class GalleryImageCreate(BaseModel):
    url: str
    alt: str
    order: int = 0

class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    hero_title: str = "KETE Kohvik"
    hero_subtitle: str = "Aravete, Järvamaa"
    hero_description: str = ""
    about_title: str = ""
    about_text: str = ""
    quote_eyebrow: str = "Päring Peosaalile"
    quote_title: str = "Peosaal üritusteks Järvamaal"
    quote_description: str = "Anna meile mõne põhiandmega märku ja teeme sulle sobiva pakkumise. Mida täpsemalt kirjeldad külaliste arvu, kuupäeva ja soovitud lahendust, seda kiiremini saame vastata."
    quote_form_eyebrow: str = "Küsi Pakkumist"
    quote_form_title: str = "Saadame sulle personaalse vastuse"
    quote_form_description: str = "Täida vorm ja saadame sulle peosaali või toitlustuse pakkumise vastavalt sinu soovile."
    quote_panel_badge: str = "Peo planeerimiseks"
    quote_panel_kicker: str = "Selge ülevaade enne, kui pakkumist küsid"
    quote_fact_1_value: str = "100"
    quote_fact_1_label: str = "külalist"
    quote_fact_1_detail: str = "Avar saal sünnipäevaks, juubeliks või firmaõhtuks."
    quote_fact_2_value: str = "3"
    quote_fact_2_label: str = "lahendust"
    quote_fact_2_detail: str = "Peosaal, kohvilaud või toitlustusega terviklahendus."
    quote_fact_3_value: str = "1"
    quote_fact_3_label: str = "päring"
    quote_fact_3_detail: str = "Kirjelda soovid ära ja saame teha personaalse pakkumise."
    quote_steps_title: str = "Kuidas see käib"
    quote_step_1: str = "Kirjuta meile kuupäev, külaliste arv ja ürituse tüüp."
    quote_step_2: str = "Võrdleme sinu soovid peosaali ja toitlustuse võimalustega."
    quote_step_3: str = "Saad personaalse vastuse, mille põhjal on lihtne edasi otsustada."

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    user = await db.users.find_one({"username": request.username.lower()})
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Vale kasutajanimi või parool")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, user["username"])
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=86400,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=604800,
        path="/"
    )
    
    return {"id": user_id, "username": user["username"], "role": user["role"]}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Välja logitud"}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"id": user["_id"], "username": user["username"], "role": user["role"]}

# ============== MENU ENDPOINTS ==============

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).to_list(100)
    return items

@api_router.get("/menu/{category}", response_model=List[MenuItem])
async def get_menu_by_category(category: str):
    items = await db.menu_items.find({"category": category}, {"_id": 0}).to_list(100)
    return items

@api_router.post("/admin/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate, user: dict = Depends(get_current_user)):
    menu_item = MenuItem(**item.model_dump())
    await db.menu_items.insert_one(menu_item.model_dump())
    return menu_item

@api_router.put("/admin/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemCreate, user: dict = Depends(get_current_user)):
    result = await db.menu_items.update_one(
        {"id": item_id},
        {"$set": item.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Menüüelement ei leitud")
    updated = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/menu/{item_id}")
async def delete_menu_item(item_id: str, user: dict = Depends(get_current_user)):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menüüelement ei leitud")
    return {"message": "Kustutatud"}

# ============== OPENING HOURS ENDPOINTS ==============

@api_router.get("/hours", response_model=List[OpeningHours])
async def get_opening_hours():
    hours = await db.opening_hours.find({}, {"_id": 0}).to_list(10)
    return hours

@api_router.put("/admin/hours/{day}")
async def update_opening_hours(day: str, hours: OpeningHoursUpdate, user: dict = Depends(get_current_user)):
    result = await db.opening_hours.update_one(
        {"day": day},
        {"$set": hours.model_dump()},
        upsert=True
    )
    return {"message": "Uuendatud"}

# ============== CONTACT ENDPOINTS ==============

@api_router.get("/contact", response_model=ContactInfo)
async def get_contact():
    contact = await db.contact_info.find_one({}, {"_id": 0})
    if not contact:
        return ContactInfo(
            address="Maarjamõisa tee 11, Aravete alevik, 73501 Järva maakond",
            phone="+372 5804 1520",
            facebook="https://www.facebook.com/profile.php?id=100063569081108",
            email="info@ketekohvik.ee"
        )
    return contact

@api_router.put("/admin/contact")
async def update_contact(contact: ContactInfo, user: dict = Depends(get_current_user)):
    await db.contact_info.update_one({}, {"$set": contact.model_dump()}, upsert=True)
    return {"message": "Kontaktandmed uuendatud"}

def send_quote_request_email(request_data: QuoteRequest):
    if not RESEND_API_KEY or not RESEND_FROM_EMAIL or not QUOTE_REQUEST_TO_EMAIL:
        logger.error("Quote request email config is incomplete")
        raise HTTPException(
            status_code=503,
            detail="Päringut ei saa praegu saata. Helista palun numbril +372 5804 1520."
        )

    event_date = html.escape(request_data.event_date or "Täpsustamisel")
    timing = html.escape(request_data.timing or "Täpsustamisel")
    details = html.escape(request_data.details or "Lisainfo puudub")
    name = html.escape(request_data.name)
    phone = html.escape(request_data.phone)
    email_address = html.escape(request_data.email)
    event_type = html.escape(request_data.event_type)
    package_type = html.escape(request_data.package_type)

    subject = f"Uus peosaali pakkumise päring: {request_data.event_type}"
    text_content = (
        "KETE Kohviku peosaali uus päring\n\n"
        f"Nimi: {request_data.name}\n"
        f"Telefon: {request_data.phone}\n"
        f"E-post: {request_data.email}\n"
        f"Ürituse tüüp: {request_data.event_type}\n"
        f"Soovitud kuupäev: {event_date}\n"
        f"Külaliste arv: {request_data.guest_count}\n"
        f"Soovitud lahendus: {request_data.package_type}\n"
        f"Kellaaeg või ajavahemik: {timing}\n"
        f"Lisainfo: {details}\n"
    )
    html_content = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">Uus peosaali pakkumise päring</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; font-weight: 700;">Nimi</td><td style="padding: 8px 0;">{name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Telefon</td><td style="padding: 8px 0;">{phone}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">E-post</td><td style="padding: 8px 0;">{email_address}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Ürituse tüüp</td><td style="padding: 8px 0;">{event_type}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Soovitud kuupäev</td><td style="padding: 8px 0;">{event_date}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Külaliste arv</td><td style="padding: 8px 0;">{request_data.guest_count}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Soovitud lahendus</td><td style="padding: 8px 0;">{package_type}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Kellaaeg või ajavahemik</td><td style="padding: 8px 0;">{timing}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700; vertical-align: top;">Lisainfo</td><td style="padding: 8px 0;">{details}</td></tr>
      </table>
    </div>
    """

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "from": RESEND_FROM_EMAIL,
            "to": [QUOTE_REQUEST_TO_EMAIL],
            "reply_to": request_data.email,
            "subject": subject,
            "text": text_content,
            "html": html_content
        },
        timeout=15
    )

    if response.status_code >= 400:
        logger.error("Resend quote request failed: %s", response.text)
        raise HTTPException(
            status_code=502,
            detail="Päringu saatmine ebaõnnestus. Proovi uuesti või helista meile."
        )

@api_router.post("/quote-request")
async def create_quote_request(request_data: QuoteRequest):
    send_quote_request_email(request_data)
    return {"message": "Päring saadetud"}

# ============== GALLERY ENDPOINTS ==============

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery():
    images = await db.gallery.find({}, {"_id": 0}).sort("order", 1).to_list(50)
    return images

@api_router.post("/admin/gallery", response_model=GalleryImage)
async def add_gallery_image(image: GalleryImageCreate, user: dict = Depends(get_current_user)):
    gallery_image = GalleryImage(**image.model_dump())
    await db.gallery.insert_one(gallery_image.model_dump())
    return gallery_image

@api_router.put("/admin/gallery/{image_id}")
async def update_gallery_image(image_id: str, image: GalleryImageCreate, user: dict = Depends(get_current_user)):
    result = await db.gallery.update_one(
        {"id": image_id},
        {"$set": image.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pilt ei leitud")
    return {"message": "Pilt uuendatud"}

@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, user: dict = Depends(get_current_user)):
    result = await db.gallery.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pilt ei leitud")
    return {"message": "Pilt kustutatud"}

# ============== SITE SETTINGS ENDPOINTS ==============

@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    settings = await db.site_settings.find_one({}, {"_id": 0})
    if not settings:
        return SiteSettings()
    return SiteSettings(**settings)

@api_router.put("/admin/settings")
async def update_settings(settings: SiteSettings, user: dict = Depends(get_current_user)):
    await db.site_settings.update_one({}, {"$set": settings.model_dump()}, upsert=True)
    return {"message": "Seaded uuendatud"}

# ============== SEED DATA ==============

async def seed_admin():
    """Create admin user only when bootstrap credentials are provided."""
    admin = await db.users.find_one({"username": ADMIN_USERNAME})
    if admin:
        return

    if not ADMIN_INITIAL_PASSWORD:
        logger.warning("Admin bootstrap skipped because ADMIN_INITIAL_PASSWORD is not set")
        return

    if len(ADMIN_INITIAL_PASSWORD) < 12:
        raise RuntimeError("ADMIN_INITIAL_PASSWORD must be at least 12 characters long")

    hashed = hash_password(ADMIN_INITIAL_PASSWORD)
    await db.users.insert_one({
        "username": ADMIN_USERNAME,
        "password_hash": hashed,
        "role": "admin",
        "created_at": datetime.now(timezone.utc)
    })
    logger.info("Admin kasutaja loodud env bootstrapi kaudu")

async def seed_initial_data():
    """Seed initial menu, hours, contact, gallery data"""
    
    # Seed menu items if empty
    menu_count = await db.menu_items.count_documents({})
    if menu_count == 0:
        menu_items = [
            # Soups
            {"id": str(uuid.uuid4()), "name": "Päevasupp", "description": "Värske kodune supp päeva retsepti järgi", "price": "€4", "category": "soups"},
            {"id": str(uuid.uuid4()), "name": "Lihasupp", "description": "Traditsiooniline eesti lihasupp kartuli ja juurviljadega", "price": "€5", "category": "soups"},
            {"id": str(uuid.uuid4()), "name": "Köögiviljasupp", "description": "Kerge taimetoitlaste supp hooajaliste köögiviljadega", "price": "€4", "category": "soups"},
            # Mains
            {"id": str(uuid.uuid4()), "name": "Kodune Pasta", "description": "Kreemjas pasta päeva kastmega ja värskete ürtidega", "price": "€7", "category": "mains"},
            {"id": str(uuid.uuid4()), "name": "Kartulikaste Lihaga", "description": "Traditsiooniline kartuliroog hakklihakastmega", "price": "€8", "category": "mains"},
            {"id": str(uuid.uuid4()), "name": "Praad Päevapakkumine", "description": "Vahelduv pearoog köögi valikust", "price": "€9", "category": "mains"},
            {"id": str(uuid.uuid4()), "name": "Pannkoogid", "description": "Magusad pannkoogid moosi ja hapukoorega", "price": "€6", "category": "mains"},
            # Drinks
            {"id": str(uuid.uuid4()), "name": "Kohv", "description": "Värskelt pruulitud aromaatne kohv", "price": "€2", "category": "drinks"},
            {"id": str(uuid.uuid4()), "name": "Cappuccino", "description": "Itaalia stiilis piimakohv", "price": "€3", "category": "drinks"},
            {"id": str(uuid.uuid4()), "name": "Tee", "description": "Valik erinevaid teesid", "price": "€2", "category": "drinks"},
            {"id": str(uuid.uuid4()), "name": "Kodune Limonaad", "description": "Värske limonaad hooajaliste marjadega", "price": "€3", "category": "drinks"},
        ]
        await db.menu_items.insert_many(menu_items)
        logger.info("Menüü andmed lisatud")
    
    # Seed opening hours if empty
    hours_count = await db.opening_hours.count_documents({})
    if hours_count == 0:
        hours = [
            {"id": str(uuid.uuid4()), "day": "Esmaspäev", "hours": "11:00 – 15:00", "is_closed": False},
            {"id": str(uuid.uuid4()), "day": "Teisipäev", "hours": "11:00 – 15:00", "is_closed": False},
            {"id": str(uuid.uuid4()), "day": "Kolmapäev", "hours": "11:00 – 15:00", "is_closed": False},
            {"id": str(uuid.uuid4()), "day": "Neljapäev", "hours": "11:00 – 15:00", "is_closed": False},
            {"id": str(uuid.uuid4()), "day": "Reede", "hours": "10:00 – 15:00", "is_closed": False},
            {"id": str(uuid.uuid4()), "day": "Laupäev", "hours": "", "is_closed": True},
            {"id": str(uuid.uuid4()), "day": "Pühapäev", "hours": "", "is_closed": True},
        ]
        await db.opening_hours.insert_many(hours)
        logger.info("Lahtiolekuajad lisatud")
    
    # Seed contact info if empty
    contact = await db.contact_info.find_one({})
    if not contact:
        await db.contact_info.insert_one({
            "address": "Maarjamõisa tee 11, Aravete alevik, 73501 Järva maakond",
            "phone": "+372 5804 1520",
            "facebook": "https://www.facebook.com/profile.php?id=100063569081108",
            "email": "info@ketekohvik.ee"
        })
        logger.info("Kontaktandmed lisatud")
    
    # Seed gallery if empty
    gallery_count = await db.gallery.count_documents({})
    if gallery_count == 0:
        gallery = [
            {"id": str(uuid.uuid4()), "url": "https://visitestonia.com/images/3104696/ketekohvik3.JPG", "alt": "KETE Kohvik interjöör", "order": 1},
            {"id": str(uuid.uuid4()), "url": "https://visitestonia.com/images/3104698/ketekohvik5.JPG", "alt": "KETE Kohvik sisevaade", "order": 2},
            {"id": str(uuid.uuid4()), "url": "https://visitestonia.com/images/3104702/ketekohvik9.JPG", "alt": "KETE Kohvik atmosfäär", "order": 3},
            {"id": str(uuid.uuid4()), "url": "https://visitestonia.com/images/3104703/ketekohvik10.JPG", "alt": "KETE Kohvik detail", "order": 4},
        ]
        await db.gallery.insert_many(gallery)
        logger.info("Galerii pildid lisatud")

# ============== STARTUP ==============

@app.on_event("startup")
async def startup():
    await seed_admin()
    await seed_initial_data()
    # Create indexes
    await db.users.create_index("username", unique=True)
    logger.info("KETE Kohvik API käivitatud")

@app.on_event("shutdown")
async def shutdown():
    client.close()

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "KETE Kohvik API", "version": "1.0"}
