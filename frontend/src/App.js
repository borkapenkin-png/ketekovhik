import { useState, useEffect } from "react";
import "@/App.css";
import { 
    Utensils, 
    Wine, 
    Clock, 
    Phone, 
    MapPin, 
    Mail,
    ChefHat,
    Star,
    Calendar,
    Menu,
    X
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Design images from guidelines
const IMAGES = {
    hero: "https://images.unsplash.com/photo-1766832255363-c9f060ade8b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGRhcmslMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzU4ODk5Mjh8MA&ixlib=rb-4.1.0&q=85",
    about: "https://images.unsplash.com/photo-1760662435569-84a4fb1fa407?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGRhcmslMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzU4ODk5Mjh8MA&ixlib=rb-4.1.0&q=85",
    chef: "https://images.unsplash.com/photo-1759521296047-89338c8e083d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w8NjA1NTJ8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWwlMjBraXRjaGVufGVufDB8fHx8MTc3NTg4OTkyOHww&ixlib=rb-4.1.0&q=85",
    gallery: [
        "https://images.pexels.com/photos/1639559/pexels-photo-1639559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.unsplash.com/photo-1750943082012-efe6d2fd9e45?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmd8ZW58MHx8fHwxNzc1ODg5OTI4fDA&ixlib=rb-4.1.0&q=85",
        "https://images.pexels.com/photos/4870431/pexels-photo-4870431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.unsplash.com/photo-1750943081248-833d71a2ab8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmd8ZW58MHx8fHwxNzc1ODg5OTI4fDA&ixlib=rb-4.1.0&q=85"
    ]
};

// Menu data
const MENU_STARTERS = [
    { name: "Tartar Eesti Veiselihast", description: "Maheveiseliha tartar meresoola, kapriste ja vutimunaga", price: "€24" },
    { name: "Kammkarpide Carpaccio", description: "Värskelt viilutatud kammkarbid yuzu-tsitrusekastmega", price: "€28" },
    { name: "Foie Gras Teriin", description: "Prantsuse pardimaks briošši ja viigikompotiga", price: "€32" },
    { name: "Tomatite Burrata", description: "Kreemjas Itaalia burrata päikeses valminud tomatitega", price: "€22" }
];

const MENU_MAINS = [
    { name: "Wagyu Veise Filée", description: "A5 Jaapani wagyu, trühvlikartulipüree, punaveini reduktsioon", price: "€89" },
    { name: "Homaar Thermidor", description: "Maine'i homaar gratineeritud sibulakastmega", price: "€76" },
    { name: "Lambakare", description: "Uus-Meremaa lambakare rosmariini ja küüslauguga", price: "€58" },
    { name: "Tursk Musta Trühvliga", description: "Põhjamere tursk musta trühvli ja šampanjakastmega", price: "€52" }
];

// Services data
const SERVICES = [
    {
        icon: <Utensils size={32} />,
        title: "Fine Dining",
        description: "Eksklusiivne gurmeekogemus parimate hooajaliste koostisosadega, mida valmistab meie rahvusvaheliselt tunnustatud köögitiim."
    },
    {
        icon: <Wine size={32} />,
        title: "Veinikelder",
        description: "Üle 500 sildi sisaldav veinikelder maailma parimatest veiniregioonidest, kureeritud meie sommeljeede poolt."
    },
    {
        icon: <Calendar size={32} />,
        title: "Privaatüritused",
        description: "Elegantne privaatne söögisaal kuni 20 külalisele – ideaalne äriõhtusöökideks ja eriliste tähtpäevade tähistamiseks."
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
                <a href="#" className="font-serif text-2xl md:text-3xl tracking-wider" style={{ color: "#D4AF37" }} data-testid="logo">
                    L'ÉTOILE
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
                <a href="#kontakt" className="hidden md:block">
                    <Button 
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-xs uppercase tracking-widest px-6"
                        data-testid="header-reserve-btn"
                    >
                        Broneeri Laud
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
                            <a href="#kontakt" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-xs uppercase tracking-widest">
                                    Broneeri Laud
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
                <img src={IMAGES.hero} alt="L'Étoile restoran interjöör" loading="eager" />
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <p className="overline animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s" }}>
                    Kulinaarne Teekond
                </p>
                <h1 
                    className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mt-6 mb-6 animate-fade-in-up opacity-0"
                    style={{ animationDelay: "0.4s", color: "#F5F5F5" }}
                >
                    Maitsete<br />Sümfoonia
                </h1>
                <div className="decorative-line animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s" }}></div>
                <p 
                    className="text-lg md:text-xl font-light leading-relaxed mb-10 animate-fade-in-up opacity-0 max-w-xl mx-auto"
                    style={{ animationDelay: "0.6s", color: "#A3A3A3" }}
                >
                    Avastage eksklusiivne fine dining kogemus, kus iga roog on meistriteos 
                    ja iga hetk jääb meelde igaveseks.
                </p>
                <a href="#kontakt">
                    <Button 
                        className="btn-primary animate-fade-in-up opacity-0 rounded-none"
                        style={{ animationDelay: "0.8s" }}
                        data-testid="hero-reserve-btn"
                    >
                        Reserveeri Laud
                    </Button>
                </a>
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
                            alt="L'Étoile restorani sisevaade" 
                            className="w-full h-[400px] md:h-[500px] object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="overline">Meie Lugu</p>
                        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4 mb-6" style={{ color: "#F5F5F5" }}>
                            Kirg Täiuslikkuse Vastu
                        </h2>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-6" style={{ color: "#A3A3A3" }}>
                            L'Étoile sündis 2015. aastal visioonist luua Tallinna südalinnas koht, 
                            kus gurmeetoidukunst kohtub sooja külalislahkusega. Meie restoran on 
                            pühendunud pakkuma ainult parimat – värskeid mahekoostisosi otse 
                            Eesti talunikelt, hooajalisi delikatesse ja rahvusvaheliselt 
                            tunnustatud tehnilisi võtteid.
                        </p>
                        <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{ color: "#A3A3A3" }}>
                            Iga õhtusöök meie juures on teekond läbi maitsete, tekstuuride ja 
                            aromide maailma. Meie elegantne interjöör ja tähelepanelik teenindus 
                            loovad atmosfääri, mis muudab tavalise söögikorra eriliseks sündmuseks.
                        </p>
                        
                        {/* Chef info */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <img 
                                src={IMAGES.chef} 
                                alt="Peakokk" 
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <p className="signature">Jean-Pierre Dubois</p>
                                <p className="text-sm" style={{ color: "#A3A3A3" }}>Peakokk & Asutaja</p>
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
                    <p className="overline">Meie Teenused</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Erakordne Kogemus
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
                    <p className="overline">Gurmee Valik</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Meie Menüü
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Starters */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8 pb-4 border-b border-white/10" style={{ color: "#D4AF37" }}>
                            Eelroad
                        </h3>
                        {MENU_STARTERS.map((item, index) => (
                            <div key={index} className="menu-item" data-testid={`menu-starter-${index}`}>
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
                </div>

                <div className="text-center mt-16">
                    <a href="#kontakt">
                        <Button 
                            className="btn-outline rounded-none"
                            variant="outline"
                            data-testid="menu-reserve-btn"
                            style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                        >
                            Broneeri Degustatsioonõhtusöök
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
                    <p className="overline">Visuaalne Nauding</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Galerii
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="gallery-grid">
                    {IMAGES.gallery.map((img, index) => (
                        <div key={index} className="gallery-item" data-testid={`gallery-item-${index}`}>
                            <img src={img} alt={`Gurmeeroog ${index + 1}`} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Contact Section
const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
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
        setFormData({ name: "", email: "", phone: "", date: "", guests: "", message: "" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="kontakt" className="py-24 md:py-32" style={{ backgroundColor: "#0A0A0A" }} data-testid="contact-section">
            <div className="section-container">
                <div className="text-center mb-16">
                    <p className="overline">Võtke Ühendust</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4" style={{ color: "#F5F5F5" }}>
                        Reserveerimine
                    </h2>
                    <div className="decorative-line"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8" style={{ color: "#F5F5F5" }}>
                            Kontaktandmed
                        </h3>

                        <div className="contact-info-item">
                            <div className="contact-icon"><MapPin size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Aadress</p>
                                <p style={{ color: "#A3A3A3" }}>Viru väljak 4<br />10111 Tallinn, Eesti</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Phone size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Telefon</p>
                                <p style={{ color: "#A3A3A3" }}>+372 5123 4567</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Mail size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>E-post</p>
                                <p style={{ color: "#A3A3A3" }}>info@letoile.ee</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon"><Clock size={24} /></div>
                            <div>
                                <p className="font-medium mb-1" style={{ color: "#F5F5F5" }}>Lahtiolekuajad</p>
                                <p style={{ color: "#A3A3A3" }}>
                                    T-N: 18:00 – 23:00<br />
                                    R-L: 18:00 – 00:00<br />
                                    P: Suletud
                                </p>
                            </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-2 mt-8 pt-8 border-t border-white/10">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />
                                ))}
                            </div>
                            <p className="text-sm ml-2" style={{ color: "#A3A3A3" }}>
                                Michelin Guide 2024
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h3 className="font-serif text-2xl mb-8" style={{ color: "#F5F5F5" }}>
                            Broneeri Laud
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
                                        type="email"
                                        name="email"
                                        placeholder="E-posti aadress *"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-email-input"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        placeholder="Telefon"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                        data-testid="contact-phone-input"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5]"
                                        data-testid="contact-date-input"
                                    />
                                </div>
                            </div>

                            <div>
                                <Input
                                    type="number"
                                    name="guests"
                                    placeholder="Külaliste arv"
                                    min="1"
                                    max="20"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3]"
                                    data-testid="contact-guests-input"
                                />
                            </div>

                            <div>
                                <Textarea
                                    name="message"
                                    placeholder="Lisasoovid või eripalved..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="bg-transparent border-0 border-b border-white/10 rounded-none focus:border-[#D4AF37] text-[#F5F5F5] placeholder:text-[#A3A3A3] resize-none"
                                    data-testid="contact-message-input"
                                />
                            </div>

                            <Button 
                                type="submit"
                                className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-sm uppercase tracking-widest py-4"
                                data-testid="contact-submit-btn"
                            >
                                Saada Päring
                            </Button>
                        </form>
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
                    <a href="#" className="font-serif text-2xl tracking-wider" style={{ color: "#D4AF37" }}>
                        L'ÉTOILE
                    </a>
                    <p className="text-sm" style={{ color: "#A3A3A3" }}>
                        © 2024 L'Étoile. Kõik õigused kaitstud.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm hover:text-[#D4AF37] transition-colors" style={{ color: "#A3A3A3" }}>
                            Privaatsuspoliitika
                        </a>
                        <a href="#" className="text-sm hover:text-[#D4AF37] transition-colors" style={{ color: "#A3A3A3" }}>
                            Kasutustingimused
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
