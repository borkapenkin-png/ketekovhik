import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { 
    LogOut, 
    Menu as MenuIcon, 
    Clock, 
    Phone, 
    Image, 
    Settings,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Coffee,
    Utensils,
    Wine,
    Home
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Toaster } from "../components/ui/sonner";
import { API } from "../lib/api";
import { toast } from "sonner";

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await axios.get(`${API}/auth/me`, { withCredentials: true });
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await axios.post(`${API}/auth/login`, { username, password }, { withCredentials: true });
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Login Page
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(username, password);
            toast.success("Sisse logitud!");
        } catch (err) {
            setError(err.response?.data?.detail || "Sisselogimine ebaõnnestus");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
            <div className="w-full max-w-md p-8 border border-white/10 rounded-sm" style={{ backgroundColor: "#141414" }}>
                <h1 className="font-serif text-3xl text-center mb-2" style={{ color: "#D4AF37" }}>KETE</h1>
                <p className="text-center mb-8 text-sm" style={{ color: "#A3A3A3" }}>Admin Paneel</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>Kasutajanimi</label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent border border-white/10 text-white"
                            data-testid="login-username"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>Parool</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border border-white/10 text-white"
                            data-testid="login-password"
                            required
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none"
                        data-testid="login-submit"
                    >
                        {isLoading ? "Laadin..." : "Logi sisse"}
                    </Button>
                </form>
                
                <div className="mt-6 text-center">
                    <a href="/" className="text-sm hover:text-[#D4AF37] transition-colors" style={{ color: "#A3A3A3" }}>
                        ← Tagasi kodulehele
                    </a>
                </div>
            </div>
        </div>
    );
};

// Menu Management
const MenuManager = () => {
    const [items, setItems] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "soups" });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const res = await axios.get(`${API}/menu`);
        setItems(res.data);
    };

    const handleAdd = async () => {
        try {
            await axios.post(`${API}/admin/menu`, newItem, { withCredentials: true });
            toast.success("Menüüelement lisatud!");
            setNewItem({ name: "", description: "", price: "", category: "soups" });
            setShowAdd(false);
            fetchMenu();
        } catch (err) {
            toast.error("Lisamine ebaõnnestus");
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API}/admin/menu/${editItem.id}`, editItem, { withCredentials: true });
            toast.success("Menüüelement uuendatud!");
            setEditItem(null);
            fetchMenu();
        } catch (err) {
            toast.error("Uuendamine ebaõnnestus");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Kas oled kindel, et soovid kustutada?")) return;
        try {
            await axios.delete(`${API}/admin/menu/${id}`, { withCredentials: true });
            toast.success("Kustutatud!");
            fetchMenu();
        } catch (err) {
            toast.error("Kustutamine ebaõnnestus");
        }
    };

    const categories = [
        { key: "soups", label: "Supid", icon: <Coffee size={18} /> },
        { key: "mains", label: "Pearoad", icon: <Utensils size={18} /> },
        { key: "drinks", label: "Joogid", icon: <Wine size={18} /> }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#F5F5F5" }}>Menüü Haldamine</h2>
                <Button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none"
                    data-testid="add-menu-item-btn"
                >
                    <Plus size={16} className="mr-2" /> Lisa uus
                </Button>
            </div>

            {/* Add Form */}
            {showAdd && (
                <div className="p-4 mb-6 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                    <h3 className="text-lg mb-4" style={{ color: "#D4AF37" }}>Lisa uus menüüelement</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Input
                            placeholder="Nimi"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                        <Input
                            placeholder="Hind (nt €5)"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                    </div>
                    <Textarea
                        placeholder="Kirjeldus"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="bg-transparent border border-white/10 text-white mb-4"
                    />
                    <div className="flex gap-4 items-center">
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="bg-transparent border border-white/10 text-white p-2 rounded"
                        >
                            <option value="soups">Supid</option>
                            <option value="mains">Pearoad</option>
                            <option value="drinks">Joogid</option>
                        </select>
                        <Button onClick={handleAdd} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                            <Save size={16} className="mr-2" /> Salvesta
                        </Button>
                        <Button onClick={() => setShowAdd(false)} variant="outline" className="border-white/10 text-white rounded-none">
                            <X size={16} className="mr-2" /> Tühista
                        </Button>
                    </div>
                </div>
            )}

            {/* Menu Items by Category */}
            {categories.map((cat) => (
                <div key={cat.key} className="mb-8">
                    <h3 className="flex items-center gap-2 text-lg mb-4 pb-2 border-b border-white/10" style={{ color: "#D4AF37" }}>
                        {cat.icon} {cat.label}
                    </h3>
                    <div className="space-y-2">
                        {items.filter((i) => i.category === cat.key).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                                {editItem?.id === item.id ? (
                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                        <Input
                                            value={editItem.name}
                                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                            className="bg-transparent border border-white/10 text-white"
                                        />
                                        <Input
                                            value={editItem.description}
                                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                            className="bg-transparent border border-white/10 text-white"
                                        />
                                        <Input
                                            value={editItem.price}
                                            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                            className="bg-transparent border border-white/10 text-white"
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={handleUpdate} size="sm" className="bg-[#D4AF37] text-[#0A0A0A]">
                                                <Save size={14} />
                                            </Button>
                                            <Button onClick={() => setEditItem(null)} size="sm" variant="outline" className="border-white/10">
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="font-medium" style={{ color: "#F5F5F5" }}>{item.name}</p>
                                            <p className="text-sm" style={{ color: "#A3A3A3" }}>{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span style={{ color: "#D4AF37" }}>{item.price}</span>
                                            <Button onClick={() => setEditItem(item)} size="sm" variant="ghost" className="text-white hover:text-[#D4AF37]">
                                                <Edit size={16} />
                                            </Button>
                                            <Button onClick={() => handleDelete(item.id)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Opening Hours Manager
const HoursManager = () => {
    const [hours, setHours] = useState([]);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchHours();
    }, []);

    const fetchHours = async () => {
        const res = await axios.get(`${API}/hours`);
        setHours(res.data);
    };

    const handleUpdate = async (day, data) => {
        try {
            await axios.put(`${API}/admin/hours/${day}`, data, { withCredentials: true });
            toast.success("Lahtiolekuaeg uuendatud!");
            setEditing(null);
            fetchHours();
        } catch (err) {
            toast.error("Uuendamine ebaõnnestus");
        }
    };

    return (
        <div>
            <h2 className="font-serif text-2xl mb-6" style={{ color: "#F5F5F5" }}>Lahtiolekuajad</h2>
            <div className="space-y-2">
                {hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between p-4 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                        <span className="w-32 font-medium" style={{ color: "#F5F5F5" }}>{h.day}</span>
                        {editing === h.day ? (
                            <div className="flex items-center gap-4">
                                <Input
                                    defaultValue={h.hours}
                                    id={`hours-${h.day}`}
                                    placeholder="11:00 – 15:00"
                                    className="w-40 bg-transparent border border-white/10 text-white"
                                />
                                <label className="flex items-center gap-2 text-sm" style={{ color: "#A3A3A3" }}>
                                    <input
                                        type="checkbox"
                                        defaultChecked={h.is_closed}
                                        id={`closed-${h.day}`}
                                    />
                                    Suletud
                                </label>
                                <Button
                                    onClick={() => {
                                        const hoursInput = document.getElementById(`hours-${h.day}`);
                                        const closedInput = document.getElementById(`closed-${h.day}`);
                                        handleUpdate(h.day, {
                                            day: h.day,
                                            hours: hoursInput.value,
                                            is_closed: closedInput.checked
                                        });
                                    }}
                                    size="sm"
                                    className="bg-[#D4AF37] text-[#0A0A0A]"
                                >
                                    <Save size={14} />
                                </Button>
                                <Button onClick={() => setEditing(null)} size="sm" variant="outline" className="border-white/10">
                                    <X size={14} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span style={{ color: h.is_closed ? "#ef4444" : "#A3A3A3" }}>
                                    {h.is_closed ? "Suletud" : h.hours}
                                </span>
                                <Button onClick={() => setEditing(h.day)} size="sm" variant="ghost" className="text-white hover:text-[#D4AF37]">
                                    <Edit size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Contact Manager
const ContactManager = () => {
    const [contact, setContact] = useState({ address: "", phone: "", facebook: "", email: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        const res = await axios.get(`${API}/contact`);
        setContact(res.data);
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API}/admin/contact`, contact, { withCredentials: true });
            toast.success("Kontaktandmed uuendatud!");
            setIsEditing(false);
        } catch (err) {
            toast.error("Uuendamine ebaõnnestus");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#F5F5F5" }}>Kontaktandmed</h2>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                        <Edit size={16} className="mr-2" /> Muuda
                    </Button>
                )}
            </div>

            <div className="p-6 border border-white/10 rounded-sm space-y-4" style={{ backgroundColor: "#1A1A1A" }}>
                <div>
                    <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>Aadress</label>
                    {isEditing ? (
                        <Textarea
                            value={contact.address}
                            onChange={(e) => setContact({ ...contact, address: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                    ) : (
                        <p style={{ color: "#F5F5F5" }}>{contact.address}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>Telefon</label>
                    {isEditing ? (
                        <Input
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                    ) : (
                        <p style={{ color: "#F5F5F5" }}>{contact.phone}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>E-post</label>
                    {isEditing ? (
                        <Input
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                    ) : (
                        <p style={{ color: "#F5F5F5" }}>{contact.email}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>Facebook</label>
                    {isEditing ? (
                        <Input
                            value={contact.facebook}
                            onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                    ) : (
                        <p style={{ color: "#F5F5F5" }}>{contact.facebook}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="flex gap-4 pt-4">
                        <Button onClick={handleSave} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                            <Save size={16} className="mr-2" /> Salvesta
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="border-white/10 text-white rounded-none">
                            <X size={16} className="mr-2" /> Tühista
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Gallery Manager
const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [newImage, setNewImage] = useState({ url: "", alt: "", order: 0 });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const res = await axios.get(`${API}/gallery`);
        setImages(res.data);
    };

    const handleAdd = async () => {
        try {
            await axios.post(`${API}/admin/gallery`, newImage, { withCredentials: true });
            toast.success("Pilt lisatud!");
            setNewImage({ url: "", alt: "", order: images.length + 1 });
            setShowAdd(false);
            fetchGallery();
        } catch (err) {
            toast.error("Lisamine ebaõnnestus");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Kas oled kindel?")) return;
        try {
            await axios.delete(`${API}/admin/gallery/${id}`, { withCredentials: true });
            toast.success("Pilt kustutatud!");
            fetchGallery();
        } catch (err) {
            toast.error("Kustutamine ebaõnnestus");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#F5F5F5" }}>Galerii</h2>
                <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                    <Plus size={16} className="mr-2" /> Lisa pilt
                </Button>
            </div>

            {showAdd && (
                <div className="p-4 mb-6 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                    <h3 className="text-lg mb-4" style={{ color: "#D4AF37" }}>Lisa uus pilt</h3>
                    <div className="space-y-4">
                        <Input
                            placeholder="Pildi URL"
                            value={newImage.url}
                            onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                        <Input
                            placeholder="Alt tekst (kirjeldus)"
                            value={newImage.alt}
                            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                            className="bg-transparent border border-white/10 text-white"
                        />
                        <div className="flex gap-4">
                            <Button onClick={handleAdd} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                                <Save size={16} className="mr-2" /> Salvesta
                            </Button>
                            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-white/10 text-white rounded-none">
                                <X size={16} className="mr-2" /> Tühista
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group">
                        <img src={img.url} alt={img.alt} className="w-full h-40 object-cover rounded-sm" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button onClick={() => handleDelete(img.id)} size="sm" variant="destructive">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        <p className="text-xs mt-1 truncate" style={{ color: "#A3A3A3" }}>{img.alt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuoteContentManager = () => {
    const [settings, setSettings] = useState({
        quote_eyebrow: "",
        quote_title: "",
        quote_description: "",
        quote_form_eyebrow: "",
        quote_form_title: "",
        quote_form_description: "",
        quote_panel_badge: "",
        quote_panel_kicker: "",
        quote_fact_1_value: "",
        quote_fact_1_label: "",
        quote_fact_1_detail: "",
        quote_fact_2_value: "",
        quote_fact_2_label: "",
        quote_fact_2_detail: "",
        quote_fact_3_value: "",
        quote_fact_3_label: "",
        quote_fact_3_detail: "",
        quote_steps_title: "",
        quote_step_1: "",
        quote_step_2: "",
        quote_step_3: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await axios.get(`${API}/settings`);
            setSettings({
                quote_eyebrow: res.data.quote_eyebrow || "",
                quote_title: res.data.quote_title || "",
                quote_description: res.data.quote_description || "",
                quote_form_eyebrow: res.data.quote_form_eyebrow || "",
                quote_form_title: res.data.quote_form_title || "",
                quote_form_description: res.data.quote_form_description || "",
                quote_panel_badge: res.data.quote_panel_badge || "",
                quote_panel_kicker: res.data.quote_panel_kicker || "",
                quote_fact_1_value: res.data.quote_fact_1_value || "",
                quote_fact_1_label: res.data.quote_fact_1_label || "",
                quote_fact_1_detail: res.data.quote_fact_1_detail || "",
                quote_fact_2_value: res.data.quote_fact_2_value || "",
                quote_fact_2_label: res.data.quote_fact_2_label || "",
                quote_fact_2_detail: res.data.quote_fact_2_detail || "",
                quote_fact_3_value: res.data.quote_fact_3_value || "",
                quote_fact_3_label: res.data.quote_fact_3_label || "",
                quote_fact_3_detail: res.data.quote_fact_3_detail || "",
                quote_steps_title: res.data.quote_steps_title || "",
                quote_step_1: res.data.quote_step_1 || "",
                quote_step_2: res.data.quote_step_2 || "",
                quote_step_3: res.data.quote_step_3 || ""
            });
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            const current = await axios.get(`${API}/settings`);
            await axios.put(`${API}/admin/settings`, { ...current.data, ...settings }, { withCredentials: true });
            toast.success("Pakkumise ploki tekstid uuendatud!");
            setIsEditing(false);
        } catch (err) {
            toast.error("Uuendamine ebaõnnestus");
        }
    };

    const fields = [
        { key: "quote_eyebrow", label: "Väike pealkiri" },
        { key: "quote_title", label: "Pealkiri" },
        { key: "quote_description", label: "Sissejuhatav tekst", multiline: true },
        { key: "quote_form_eyebrow", label: "Vormi väike pealkiri" },
        { key: "quote_form_title", label: "Vormi pealkiri" },
        { key: "quote_form_description", label: "Vormi kirjeldus", multiline: true },
        { key: "quote_panel_badge", label: "Parema paneeli badge" },
        { key: "quote_panel_kicker", label: "Parema paneeli pealkiri", multiline: true },
        { key: "quote_fact_1_value", label: "Fakt 1 number" },
        { key: "quote_fact_1_label", label: "Fakt 1 silt" },
        { key: "quote_fact_1_detail", label: "Fakt 1 kirjeldus", multiline: true },
        { key: "quote_fact_2_value", label: "Fakt 2 number" },
        { key: "quote_fact_2_label", label: "Fakt 2 silt" },
        { key: "quote_fact_2_detail", label: "Fakt 2 kirjeldus", multiline: true },
        { key: "quote_fact_3_value", label: "Fakt 3 number" },
        { key: "quote_fact_3_label", label: "Fakt 3 silt" },
        { key: "quote_fact_3_detail", label: "Fakt 3 kirjeldus", multiline: true },
        { key: "quote_steps_title", label: "Sammude ploki pealkiri" },
        { key: "quote_step_1", label: "Samm 1", multiline: true },
        { key: "quote_step_2", label: "Samm 2", multiline: true },
        { key: "quote_step_3", label: "Samm 3", multiline: true }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#F5F5F5" }}>Pakkumise Plokk</h2>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                        <Edit size={16} className="mr-2" /> Muuda
                    </Button>
                )}
            </div>

            <div className="p-6 border border-white/10 rounded-sm space-y-4" style={{ backgroundColor: "#1A1A1A" }}>
                {fields.map((field) => (
                    <div key={field.key}>
                        <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>{field.label}</label>
                        {isEditing ? (
                            field.multiline ? (
                                <Textarea
                                    value={settings[field.key]}
                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                    className="bg-transparent border border-white/10 text-white"
                                    rows={4}
                                />
                            ) : (
                                <Input
                                    value={settings[field.key]}
                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                    className="bg-transparent border border-white/10 text-white"
                                />
                            )
                        ) : (
                            <p style={{ color: "#F5F5F5", whiteSpace: "pre-wrap" }}>{settings[field.key] || "—"}</p>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <div className="flex gap-4 pt-4">
                        <Button onClick={handleSave} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                            <Save size={16} className="mr-2" /> Salvesta
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="border-white/10 text-white rounded-none">
                            <X size={16} className="mr-2" /> Tühista
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuoteContentManagerV2 = () => {
    const [settings, setSettings] = useState({
        quote_eyebrow: "",
        quote_title: "",
        quote_description: "",
        quote_form_eyebrow: "",
        quote_form_title: "",
        quote_form_description: "",
        quote_panel_badge: "",
        quote_panel_kicker: "",
        quote_fact_1_value: "",
        quote_fact_1_label: "",
        quote_fact_1_detail: "",
        quote_fact_2_value: "",
        quote_fact_2_label: "",
        quote_fact_2_detail: "",
        quote_fact_3_value: "",
        quote_fact_3_label: "",
        quote_fact_3_detail: "",
        quote_steps_title: "",
        quote_step_1: "",
        quote_step_2: "",
        quote_step_3: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await axios.get(`${API}/settings`);
            setSettings({
                quote_eyebrow: res.data.quote_eyebrow || "",
                quote_title: res.data.quote_title || "",
                quote_description: res.data.quote_description || "",
                quote_form_eyebrow: res.data.quote_form_eyebrow || "",
                quote_form_title: res.data.quote_form_title || "",
                quote_form_description: res.data.quote_form_description || "",
                quote_panel_badge: res.data.quote_panel_badge || "",
                quote_panel_kicker: res.data.quote_panel_kicker || "",
                quote_fact_1_value: res.data.quote_fact_1_value || "",
                quote_fact_1_label: res.data.quote_fact_1_label || "",
                quote_fact_1_detail: res.data.quote_fact_1_detail || "",
                quote_fact_2_value: res.data.quote_fact_2_value || "",
                quote_fact_2_label: res.data.quote_fact_2_label || "",
                quote_fact_2_detail: res.data.quote_fact_2_detail || "",
                quote_fact_3_value: res.data.quote_fact_3_value || "",
                quote_fact_3_label: res.data.quote_fact_3_label || "",
                quote_fact_3_detail: res.data.quote_fact_3_detail || "",
                quote_steps_title: res.data.quote_steps_title || "",
                quote_step_1: res.data.quote_step_1 || "",
                quote_step_2: res.data.quote_step_2 || "",
                quote_step_3: res.data.quote_step_3 || ""
            });
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            const current = await axios.get(`${API}/settings`);
            await axios.put(`${API}/admin/settings`, { ...current.data, ...settings }, { withCredentials: true });
            toast.success("Pakkumise ploki tekstid uuendatud!");
            setIsEditing(false);
        } catch (err) {
            toast.error("Uuendamine ebaõnnestus");
        }
    };

    const sections = [
        {
            title: "Vasak Sisuplokk",
            hint: "See osa muudab vasakut tekstiplokki enne vormi.",
            fields: [
                { key: "quote_eyebrow", label: "Väike pealkiri" },
                { key: "quote_title", label: "Pealkiri" },
                { key: "quote_description", label: "Sissejuhatav tekst", multiline: true }
            ]
        },
        {
            title: "Vormi Ülaosa",
            hint: "Need tekstid kuvatakse vormi kohal.",
            fields: [
                { key: "quote_form_eyebrow", label: "Vormi väike pealkiri" },
                { key: "quote_form_title", label: "Vormi pealkiri" },
                { key: "quote_form_description", label: "Vormi kirjeldus", multiline: true }
            ]
        },
        {
            title: "Parem Paneel",
            hint: "See osa muudab parempoolset infoplokki ja kolme faktikaarti.",
            fields: [
                { key: "quote_panel_badge", label: "Badge" },
                { key: "quote_panel_kicker", label: "Paneeli pealkiri", multiline: true },
                { key: "quote_fact_1_value", label: "Fakt 1 number" },
                { key: "quote_fact_1_label", label: "Fakt 1 silt" },
                { key: "quote_fact_1_detail", label: "Fakt 1 kirjeldus", multiline: true },
                { key: "quote_fact_2_value", label: "Fakt 2 number" },
                { key: "quote_fact_2_label", label: "Fakt 2 silt" },
                { key: "quote_fact_2_detail", label: "Fakt 2 kirjeldus", multiline: true },
                { key: "quote_fact_3_value", label: "Fakt 3 number" },
                { key: "quote_fact_3_label", label: "Fakt 3 silt" },
                { key: "quote_fact_3_detail", label: "Fakt 3 kirjeldus", multiline: true }
            ]
        },
        {
            title: "Sammude Plokk",
            hint: "See osa muudab paremal all olevat \"kuidas see käib\" sisu.",
            fields: [
                { key: "quote_steps_title", label: "Sammude pealkiri" },
                { key: "quote_step_1", label: "Samm 1", multiline: true },
                { key: "quote_step_2", label: "Samm 2", multiline: true },
                { key: "quote_step_3", label: "Samm 3", multiline: true }
            ]
        }
    ];

    const renderField = (field) => (
        <div key={field.key} className="p-4 border border-white/10 rounded-sm" style={{ backgroundColor: "#141414" }}>
            <label className="block text-sm mb-2" style={{ color: "#A3A3A3" }}>{field.label}</label>
            {isEditing ? (
                field.multiline ? (
                    <Textarea
                        value={settings[field.key]}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="bg-transparent border border-white/10 text-white"
                        rows={4}
                    />
                ) : (
                    <Input
                        value={settings[field.key]}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="bg-transparent border border-white/10 text-white"
                    />
                )
            ) : (
                <p style={{ color: "#F5F5F5", whiteSpace: "pre-wrap" }}>{settings[field.key] || "—"}</p>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#F5F5F5" }}>Pakkumise Plokk</h2>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                        <Edit size={16} className="mr-2" /> Muuda
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.title} className="p-6 border border-white/10 rounded-sm" style={{ backgroundColor: "#1A1A1A" }}>
                        <div className="mb-5">
                            <p className="overline">{section.title}</p>
                            <p className="mt-3 text-sm" style={{ color: "#A3A3A3" }}>{section.hint}</p>
                        </div>
                        <div className="grid gap-4">
                            {section.fields.map(renderField)}
                        </div>
                    </div>
                ))}

                {isEditing && (
                    <div className="flex gap-4 pt-2">
                        <Button onClick={handleSave} className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none">
                            <Save size={16} className="mr-2" /> Salvesta
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" className="border-white/10 text-white rounded-none">
                            <X size={16} className="mr-2" /> Tühista
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Admin Dashboard
const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("menu");

    const tabs = [
        { key: "menu", label: "Menüü", icon: <MenuIcon size={18} /> },
        { key: "hours", label: "Lahtiolekuajad", icon: <Clock size={18} /> },
        { key: "contact", label: "Kontakt", icon: <Phone size={18} /> },
        { key: "gallery", label: "Galerii", icon: <Image size={18} /> },
        { key: "quote", label: "Pakkumine", icon: <Settings size={18} /> },
    ];

    const handleLogout = async () => {
        await logout();
        toast.success("Välja logitud!");
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
            {/* Header */}
            <header className="border-b border-white/10" style={{ backgroundColor: "#141414" }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-serif text-2xl" style={{ color: "#D4AF37" }}>KETE</span>
                        <span className="text-sm" style={{ color: "#A3A3A3" }}>Admin Paneel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm hover:text-[#D4AF37] transition-colors" style={{ color: "#A3A3A3" }}>
                            <Home size={18} className="inline mr-1" /> Koduleht
                        </a>
                        <span className="text-sm" style={{ color: "#A3A3A3" }}>{user?.username}</span>
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <nav className="w-48 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-sm transition-colors ${
                                    activeTab === tab.key
                                        ? "bg-[#D4AF37] text-[#0A0A0A]"
                                        : "text-[#A3A3A3] hover:text-white hover:bg-white/5"
                                }`}
                                data-testid={`tab-${tab.key}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content */}
                    <main className="flex-1">
                        {activeTab === "menu" && <MenuManager />}
                        {activeTab === "hours" && <HoursManager />}
                        {activeTab === "contact" && <ContactManager />}
                        {activeTab === "gallery" && <GalleryManager />}
                        {activeTab === "quote" && <QuoteContentManagerV2 />}
                    </main>
                </div>
            </div>
        </div>
    );
};

// Main Admin Component
const AdminPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
                <div className="text-center">
                    <div className="font-serif text-3xl mb-4" style={{ color: "#D4AF37" }}>KETE</div>
                    <p style={{ color: "#A3A3A3" }}>Laadin...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" />
            {user ? <AdminDashboard /> : <LoginPage />}
        </>
    );
};

export default AdminPage;
