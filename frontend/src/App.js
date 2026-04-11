import { useState, useEffect } from "react";
import "@/App.css";
import { 
    Coffee, 
    Utensils, 
    Clock, 
    Phone, 
    MapPin, 
    Facebook,
    PartyPopper,
    Star,
    Users,
    Menu,
    X,
    Heart,
    Map
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Logo - SVG version without background
const LOGO_URL = "/kete-logo.svg";

// Images
const IMAGES = {
    hero: "https://visitestonia.com/images/3104699/ketekohvik6.JPG",
    about: "https://visitestonia.com/images/3104694/ketekohvik1.JPG",
    interior: "https://visitestonia.com/images/3104695/ketekohvik2.JPG",
    gallery: [
        "https://visitestonia.com/images/3104696/ketekohvik3.JPG",
        "https://visitestonia.com/images/3104698/ketekohvik5.JPG",
        "https://visitestonia.com/images/3104702/ketekohvik9.JPG",
        "https://visitestonia.com/images/3104703/ketekohvik10.JPG"
    ],
    food: [
        "https://images.unsplash.com/photo-1680420572234-1acdf5b8fb89?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwzfHxob21lbWFkZSUyMGZvb2QlMjBzb3VwJTIwcGFzdGElMjBjYWZlJTIwZGlzaHxlbnwwfHx8fDE3NzU4OTA4Njd8MA&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1746649347365-95dbb17911e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2QlMjBzb3VwJTIwcGFzdGElMjBjYWZlJTIwZGlzaHxlbnwwfHx8fDE3NzU4OTA4Njd8MA&ixlib=rb-4.1.0&q=85"
    ]
};

// Menu data - Kete Kohvik style (budget-friendly café 1-10€)
const MENU_SOUPS = [
    { name: "Päevasupp", description: "Värske kodune supp päeva retsepti järgi", price: "€4" },
    { name: "Lihasupp", description: "Traditsiooniline eesti lihasupp kartuli ja juurviljadega", price: "€5" },
    { name: "Köögiviljasupp", description: "Kerge taimetoitlaste supp hooajaliste köögiviljadega", price: "€4" }
];

const MENU_MAINS = [
    { name: "Kodune Pasta", description: "Kreemjas pasta päeva kastmega ja värskete ürtidega", price: "€7" },
    { name: "Kartulikaste Lihaga", description: "Traditsiooniline kartuliroog hakklihakastmega", price: "€8" },
    { name: "Praad Päevapakkumine", description: "Vahelduv pearoog köögi valikust", price: "€9" },
    { name: "Pannkoogid", description: "Magusad pannkoogid moosi ja hapukoorega", price: "€6" }
];

const MENU_DRINKS = [
    { name: "Kohv", description: "Värskelt pruulitud aromaatne kohv", price: "€2" },
    { name: "Cappuccino", description: "Itaalia stiilis piimakohv", price: "€3" },
    { name: "Tee", description: "Valik erinevaid teesid", price: "€2" },
    { name: "Kodune Limonaad", description: "Värske limonaad hooajaliste marjadega", price: "€3" }
];

// Services data
const SERVICES = [
    {
        icon: <Coffee size={32} />,
        title: "Hubane Kohvik",
        description: "Nostalgilisel sisekujundusel põhinev mõnus atmosfäär vanas külapoes. Ideaalne koht lõunasöögiks või kohvipausiks."
    },
    {
        icon: <PartyPopper size={32} />,
        title: "Peosaal",
        description: "100-kohaline peosaal pulmadeks, sünnipäevadeks, kokkutulekuteks ja pidulikeks üritusteks. Kaunistame ruumi vastavalt teie soovidele."
    },
    {
        icon: <Utensils size={32} />,
        title: "Kodused Road",
        description: "Maitsvad kodused road värskest toorainest. Supid, praed, magustoidud ja hea kohv – kõik valmistatud südamega."
    }
];

// Header Component
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#meist", label: "Meist" },
        { href: "#teenused", label: "Teenused" },
        { href: "#menuu", label: "Menüü" },
        { href: "#galerii", label: "Galerii" },
        { href: "#kontakt", label: "Kontakt" }
    ];

    return (
        <header className={`header ${isScrolled ? "py-3" : "py-5"} transition-all duration-300`}>
            <div className="section-container flex items-center justify-between">
                {/* Logo */}
                <a href="#" data-testid="logo" className="flex items-center">
                    <img 
                        src={LOGO_URL} 
                        alt="KETE Kohvik logo" 
                        className="h-12 md:h-14 w-auto object-contain"
                    />
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm uppercase tracking-widest text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-300"
                            data-testid={`nav-${link.label.toLowerCase()}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA Button */}
                <a href="tel:+37258041520" className="hidden md:block">
                    <Button 
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-xs uppercase tracking-widest px-6"
                        data-testid="header-call-btn"
                    >
                        <Phone size={16} className="mr-2" />
                        Helista
                    </Button>
                </a>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#F5F5F5]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    data-testid="mobile-menu-btn"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
                    <nav className="flex flex-col py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-6 py-3 text-sm uppercase tracking-widest text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="px-6 pt-4">
                            <a href="tel:+37258041520" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-xs uppercase tracking-widest">
                                    <Phone size={16} className="mr-2" />
                                    Helista Meile
                                </Button>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

// Hero Section
const HeroSection = () => {
    return (
        <section className="hero" data-testid="hero-section">
            <div className="hero-bg">
                <img src={IMAGES.hero} alt="KETE Kohvik väljast" loading="eager" />
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <p className="overline animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s" }}>
                    Aravete, Järvamaa
                </p>
                <h1 
                    className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mt-6 mb-6 animate-fade-in-up opacity-0"
                    style={{ animationDelay: "0.4s", color: "#F5F5F5" }}
                >
                    KETE<br />Kohvik
                </h1>
                <div className="decorative-line animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s" }}></div>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "0.55s" }}>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill={i < 5 ? "#D4AF37" : "transparent"} color="#D4AF37" />
                        ))}
                    </div>
                    <span className="text-sm" style={{ color: "#A3A3A3" }}>4.6 (270 arvustust)</span>
                </div>

                <p 
                    className="text-lg md:text-xl font-light leading-relaxed mb-10 animate-fade-in-up opacity-0 max-w-xl mx-auto"
                    style={{ animationDelay: "0.6s", color: "#A3A3A3" }}
                >
                    Hubane kohvik nostalgilise interjööriga vanas külapoes. 
                    Maitsvad kodused road ja hea kohv Pärnu–Rakvere maantee ääres.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: "0.8s" }}>
                    <a href="#kontakt">
                        <Button 
                            className="btn-primary rounded-none"
                            data-testid="hero-contact-btn"
                        >
                            <MapPin size={16} className="mr-2" />
                            Vaata Asukohta
                        </Button>
                    </a>
                    <a href="tel:+37258041520">
                        <Button 
                            className="btn-outline rounded-none"
                            variant="outline"
                            style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                            data-testid="hero-call-btn"
                        >
                            <Phone size={16} className="mr-2" />
                            +372 5804 1520
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
};

// About Section
const AboutSection = () => {
    return (
        <section id="meist" className="py-24 md:py-32" style={{ backgroundColor: "#0A0A0A" }} data-testid="about-section">
            <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="img-hover rounded-sm overflow-hidden">
                        <img 
                            src={IMAGES.about} 
                            alt="KETE Kohvik sisevaade" 
                            className="w-full h-[400px] md:h-[500px] object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="overline">Meie Lugu</p>
                        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4 mb-6" style={{ color: "#F5F5F5" }}>
                            Nostalgia ja Maitsed
                        </h2>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-6" style={{ color: "#A3A3A3" }}>
                            KETE kohvik asub Järvamaal, Pärnu–Rakvere maantee ääres, mitte kaugel 
                            Piibe maanteest. Meie hubane kohvik on loodud vanasse külapoodi, kus 
                            iga detail räägib oma lugu.
                        </p>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-6" style={{ color: "#A3A3A3" }}>
                            Sisekujundus on nostalgiline ja leidlik – seintel ilutsevad veneaegsed 
                            piktogrammid, laes ripuvad piimanõudest valmistatud valgustid ning 
                            vanast leivarestist on saanud nõude kogumiskoht. Isegi söögiriistad 
                            leiavad oma koha vana televiisori peal.
                        </p>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{ color: "#A3A3A3" }}>
                            Hea kohv ja kodused road teevad peatusest kohvikus mõnusa elamuse 
                            igale rändurile. Tule ja avasta KETE kohviku eriline atmosfäär!
                        </p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <Heart size={20} color="#D4AF37" />
                                <span className="text-sm" style={{ color: "#A3A3A3" }}>Kodune Atmosfäär</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={20} color="#D4AF37" />
                                <span className="text-sm" style={{ color: "#A3A3A3" }}>100-kohaline Peosaal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Coffee size={20} color="#D4AF37" />
                                <span className="text-sm" style={{ color: "#A3A3A3" }}>Hea Kohv</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Services Section
const ServicesSection = () => {
    return (
        <section id="teenused" className="py-24 md:py-32" style={{ backgroundColor: "#141414" }} data-testid="services-section">
            <div className="section-container">
                <div className="text-center mb-16">
                    <p className="overline">Mida Pakume</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Meie Teenused
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {SERVICES.map((service, index) => (
                        <div key={index} className="service-card" data-testid={`service-card-${index}`}>
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="font-serif text-xl md:text-2xl mb-4" style={{ color: "#F5F5F5" }}>
                                {service.title}
                            </h3>
                            <p className="text-base font-light leading-relaxed" style={{ color: "#A3A3A3" }}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Event Hall Info */}
                <div className="mt-16 p-8 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="font-serif text-2xl mb-4" style={{ color: "#D4AF37" }}>
                                Peosaal Üritusteks
                            </h3>
                            <p className="text-base font-light leading-relaxed mb-4" style={{ color: "#A3A3A3" }}>
                                Endises müügisaalis asub nüüd avar 100-kohaline peosaal, mida saab 
                                kaunistada erinevate ürituste tarbeks. See on suurepärane paik 
                                pulmadeks, sünnipäevadeks, kokkutulekuteks ja pidulikeks õhtusöökideks.
                            </p>
                            <a href="tel:+37258041520">
                                <Button 
                                    className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-xs uppercase tracking-widest"
                                    data-testid="event-hall-btn"
                                >
                                    Küsi Pakkumist
                                </Button>
                            </a>
                        </div>
                        <div className="img-hover rounded-sm overflow-hidden">
                            <img 
                                src={IMAGES.interior} 
                                alt="KETE kohviku sisevaade" 
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Menu Section
const MenuSection = () => {
    return (
        <section id="menuu" className="py-24 md:py-32" style={{ backgroundColor: "#0A0A0A" }} data-testid="menu-section">
            <div className="section-container">
                <div className="text-center mb-16">
                    <p className="overline">Kodused Maitsed</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Meie Menüü
                    </h2>
                    <div className="decorative-line"></div>
                    <p className="text-base mt-4" style={{ color: "#A3A3A3" }}>
                        Hinnad: 1–10 € • Kodused road värskest toorainest
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Soups */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8 pb-4 border-b border-white/10" style={{ color: "#D4AF37" }}>
                            Supid
                        </h3>
                        {MENU_SOUPS.map((item, index) => (
                            <div key={index} className="menu-item" data-testid={`menu-soup-${index}`}>
                                <div>
                                    <p className="menu-item-name">{item.name}</p>
                                    <p className="menu-item-description">{item.description}</p>
                                </div>
                                <span className="menu-item-price">{item.price}</span>
                            </div>
                        ))}
                    </div>

                    {/* Main Courses */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8 pb-4 border-b border-white/10" style={{ color: "#D4AF37" }}>
                            Pearoad
                        </h3>
                        {MENU_MAINS.map((item, index) => (
                            <div key={index} className="menu-item" data-testid={`menu-main-${index}`}>
                                <div>
                                    <p className="menu-item-name">{item.name}</p>
                                    <p className="menu-item-description">{item.description}</p>
                                </div>
                                <span className="menu-item-price">{item.price}</span>
                            </div>
                        ))}
                    </div>

                    {/* Drinks */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8 pb-4 border-b border-white/10" style={{ color: "#D4AF37" }}>
                            Joogid
                        </h3>
                        {MENU_DRINKS.map((item, index) => (
                            <div key={index} className="menu-item" data-testid={`menu-drink-${index}`}>
                                <div>
                                    <p className="menu-item-name">{item.name}</p>
                                    <p className="menu-item-description">{item.description}</p>
                                </div>
                                <span className="menu-item-price">{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <p className="text-sm mb-4" style={{ color: "#A3A3A3" }}>
                        Menüü võib muutuda vastavalt hooajale ja saadaval olevatele toodetele
                    </p>
                    <a href="https://www.facebook.com/profile.php?id=100063569081108" target="_blank" rel="noopener noreferrer">
                        <Button 
                            className="btn-outline rounded-none"
                            variant="outline"
                            data-testid="menu-facebook-btn"
                            style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                        >
                            <Facebook size={16} className="mr-2" />
                            Vaata Päevapakkumisi Facebookis
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
};

// Gallery Section
const GallerySection = () => {
    return (
        <section id="galerii" className="py-24 md:py-32" style={{ backgroundColor: "#141414" }} data-testid="gallery-section">
            <div className="section-container">
                <div className="text-center mb-16">
                    <p className="overline">Pilte Kohvikust</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Galerii
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="gallery-grid">
                    {IMAGES.gallery.map((img, index) => (
                        <div key={index} className="gallery-item" data-testid={`gallery-item-${index}`}>
                            <img src={img} alt={`KETE Kohvik ${index + 1}`} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Contact Section with Google Maps
const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        guests: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Teie sõnum on saadetud! Võtame teiega peagi ühendust.", {
            duration: 5000,
            style: {
                background: "#141414",
                color: "#F5F5F5",
                border: "1px solid rgba(212, 175, 55, 0.3)"
            }
        });
        setFormData({ name: "", email: "", phone: "", guests: "", message: "" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="kontakt" className="py-24 md:py-32" style={{ backgroundColor: "#0A0A0A" }} data-testid="contact-section">
            <div className="section-container">
                <div className="text-center mb-16">
                    <p className="overline">Tule Külla</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Kontakt
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8" style={{ color: "#F5F5F5" }}>
                            Leia Meid Üles
                        </h3>

                        <div className="contact-info-item">
                            <div className="contact-icon"><MapPin size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Aadress</p>
                                <p style={{ color: "#A3A3A3" }}>
                                    Maarjamõisa tee 11<br />
                                    Aravete alevik<br />
                                    73501 Järva maakond
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Phone size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Telefon</p>
                                <a href="tel:+37258041520" className="hover:text-[#D4AF37] transition-colors" style={{ color: "#A3A3A3" }}>
                                    +372 5804 1520
                                </a>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Facebook size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Facebook</p>
                                <a 
                                    href="https://www.facebook.com/profile.php?id=100063569081108" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-[#D4AF37] transition-colors"
                                    style={{ color: "#A3A3A3" }}
                                >
                                    KETE Kohvik
                                </a>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Clock size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Lahtiolekuajad</p>
                                <p style={{ color: "#A3A3A3" }}>
                                    E–N: 11:00 – 15:00<br />
                                    R: 10:00 – 15:00<br />
                                    L–P: Suletud
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-8 pt-8 border-t border-white/10">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />
                                ))}
                            </div>
                            <p className="text-sm ml-2" style={{ color: "#A3A3A3" }}>
                                4.6 / 5 • 270 arvustust Google'is
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8" style={{ color: "#F5F5F5" }}>
                            Saada Sõnum
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Teie nimi *"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-name-input"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        placeholder="Telefon *"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-phone-input"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="E-posti aadress"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-email-input"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="number"
                                        name="guests"
                                        placeholder="Külaliste arv (ürituse puhul)"
                                        min="1"
                                        max="100"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-guests-input"
                                    />
                                </div>
                            </div>

                            <div>
                                <Textarea
                                    name="message"
                                    placeholder="Teie sõnum või päring... *"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3] resize-none"
                                    data-testid="contact-message-input"
                                />
                            </div>

                            <Button 
                                type="submit"
                                className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-sm uppercase tracking-widest py-4"
                                data-testid="contact-submit-btn"
                            >
                                Saada Sõnum
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Google Maps */}
                <div className="mt-16" data-testid="google-maps-section">
                    <h3 className="font-serif text-2xl mb-8 text-center" style={{ color: "#F5F5F5" }}>
                        <Map size={24} className="inline mr-2" style={{ color: "#D4AF37" }} />
                        Asukoht Kaardil
                    </h3>
                    <div className="rounded-sm overflow-hidden border border-white/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2079.7654!2d25.9438!3d59.1567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692f43b5f0d3f0b%3A0x4e4e4e4e4e4e4e4e!2sMaarjam%C3%B5isa%20tee%2011%2C%20Aravete%2C%2073501%20J%C3%A4rva%20maakond!5e0!3m2!1set!2see!4v1699999999999!5m2!1set!2see"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="KETE Kohvik asukoht"
                            data-testid="google-map-iframe"
                        ></iframe>
                    </div>
                    <div className="text-center mt-6">
                        <a 
                            href="https://www.google.com/maps/dir//Maarjam%C3%B5isa+tee+11,+Aravete,+73501+J%C3%A4rva+maakond" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button 
                                className="btn-outline rounded-none"
                                variant="outline"
                                style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                                data-testid="directions-btn"
                            >
                                <Map size={16} className="mr-2" />
                                Ava Google Maps'is
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="footer py-12" data-testid="footer">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <a href="#" className="flex items-center">
                        <img 
                            src={LOGO_URL} 
                            alt="KETE Kohvik logo" 
                            className="h-10 w-auto object-contain"
                        />
                    </a>
                    <p className="text-sm text-center" style={{ color: "#A3A3A3" }}>
                        © 2024 KETE Kohvik. Maarjamõisa tee 11, Aravete, Järvamaa.
                    </p>
                    <div className="flex gap-6">
                        <a 
                            href="https://www.facebook.com/profile.php?id=100063569081108" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                            data-testid="footer-facebook"
                        >
                            <Facebook size={24} />
                        </a>
                        <a 
                            href="tel:+37258041520" 
                            className="text-[#A3A3A3] hover:text-[#D4AF37] transition-colors"
                            data-testid="footer-phone"
                        >
                            <Phone size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Main App Component
function App() {
    return (
        <div className="App" style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
            <Toaster position="top-center" />
            <Header />
            <main>
                <HeroSection />
                <AboutSection />
                <ServicesSection />
                <MenuSection />
                <GallerySection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
