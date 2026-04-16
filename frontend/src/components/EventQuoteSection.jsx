import { useState } from "react";
import axios from "axios";
import { CalendarDays, Clock3, PartyPopper, Soup, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const EVENT_TYPE_OPTIONS = [
    "Sünnipäev",
    "Pulm või juubel",
    "Firmaüritus",
    "Kokkutulek",
    "Mälestuslaud",
    "Muu üritus"
];

const PACKAGE_OPTIONS = [
    "Soovin peosaali",
    "Soovin peosaali koos toitlustusega",
    "Soovin peosaali koos kohvilaua või suupistetega",
    "Vajan abi sobiva lahenduse valimisel"
];

const HIGHLIGHTS = [
    {
        icon: <Users size={18} />,
        title: "Kuni 100 külalist",
        description: "Sobib nii perepidudeks kui suuremateks koosviibimisteks."
    },
    {
        icon: <Soup size={18} />,
        title: "Kodune toitlustus",
        description: "Saame arutada peolaua, kohvilaua või lihtsama serveerimise võimalusi."
    },
    {
        icon: <CalendarDays size={18} />,
        title: "Paindlik korraldus",
        description: "Kirjuta oma kuupäev, kellaaeg ja soovid, et saaksime kiiremini pakkuda."
    }
];

const INITIAL_FORM = {
    name: "",
    phone: "",
    email: "",
    event_type: "",
    event_date: "",
    guest_count: "",
    package_type: "",
    timing: "",
    details: ""
};

export default function EventQuoteSection({ imageUrl }) {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`${API}/quote-request`, {
                ...formData,
                guest_count: Number(formData.guest_count)
            });

            toast.success("Päring on saadetud. Võtame sinuga peagi ühendust.", {
                duration: 5000,
                style: {
                    background: "#141414",
                    color: "#F5F5F5",
                    border: "1px solid rgba(212, 175, 55, 0.3)"
                }
            });

            setFormData(INITIAL_FORM);
        } catch (error) {
            const detail = error.response?.data?.detail;
            toast.error(detail || "Päringu saatmine ebaõnnestus. Proovi uuesti või helista meile.", {
                duration: 5000,
                style: {
                    background: "#141414",
                    color: "#F5F5F5",
                    border: "1px solid rgba(255, 255, 255, 0.15)"
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="peosaali-paring"
            className="py-24 md:py-32"
            style={{ backgroundColor: "#0A0A0A" }}
            data-testid="event-quote-section"
        >
            <div className="section-container">
                <div className="quote-card-shell">
                    <div className="quote-hero-grid">
                        <div className="quote-copy-panel">
                            <p className="overline">Päring Peosaalile</p>
                            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4 mb-6" style={{ color: "#D4AF37" }}>
                                Peosaal üritusteks Järvamaal
                            </h2>
                            <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{ color: "#A3A3A3" }}>
                                Anna meile mõne põhiandmega märku ja teeme sulle sobiva pakkumise.
                                Mida täpsemalt kirjeldad külaliste arvu, kuupäeva ja soovitud lahendust,
                                seda kiiremini saame vastata.
                            </p>

                            <div className="quote-highlight-list">
                                {HIGHLIGHTS.map((item) => (
                                    <div key={item.title} className="quote-highlight-item">
                                        <div className="quote-highlight-icon">{item.icon}</div>
                                        <div>
                                            <p className="quote-highlight-title">{item.title}</p>
                                            <p className="quote-highlight-description">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="quote-note">
                                <Clock3 size={18} />
                                <p>
                                    Kui kuupäev pole veel lukus, kirjuta ligikaudne aeg või hooeg.
                                    Võime aidata sobiva lahenduse läbi mõelda.
                                </p>
                            </div>
                        </div>

                        <div className="quote-image-panel">
                            <img src={imageUrl} alt="KETE Kohviku peosaal" className="quote-image" />
                        </div>
                    </div>

                    <div className="quote-form-panel">
                        <div className="quote-form-intro">
                            <p className="overline">Küsi Pakkumist</p>
                            <h3 className="font-serif text-2xl md:text-3xl mt-4 mb-4" style={{ color: "#F5F5F5" }}>
                                Saadame sulle personaalse vastuse
                            </h3>
                            <p style={{ color: "#A3A3A3" }}>
                                Täida vorm ja saadame sulle peosaali või toitlustuse pakkumise vastavalt sinu soovile.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="quote-form-grid">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Nimi *"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="quote-input"
                                    data-testid="quote-name-input"
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Telefon *"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="quote-input"
                                    data-testid="quote-phone-input"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="E-post *"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="quote-input"
                                    data-testid="quote-email-input"
                                />
                                <select
                                    name="event_type"
                                    value={formData.event_type}
                                    onChange={handleChange}
                                    required
                                    className="quote-select"
                                    data-testid="quote-event-type-select"
                                >
                                    <option value="">Mis üritus toimub? *</option>
                                    {EVENT_TYPE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <Input
                                    type="date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                    className="quote-input quote-date-input"
                                    data-testid="quote-date-input"
                                />
                                <Input
                                    type="number"
                                    name="guest_count"
                                    placeholder="Külalisi *"
                                    min="1"
                                    max="100"
                                    value={formData.guest_count}
                                    onChange={handleChange}
                                    required
                                    className="quote-input"
                                    data-testid="quote-guests-input"
                                />
                                <Input
                                    type="text"
                                    name="timing"
                                    placeholder="Kellaaeg või ajavahemik"
                                    value={formData.timing}
                                    onChange={handleChange}
                                    className="quote-input"
                                    data-testid="quote-timing-input"
                                />
                            </div>

                            <select
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleChange}
                                required
                                className="quote-select"
                                data-testid="quote-package-select"
                            >
                                <option value="">Millist lahendust soovid? *</option>
                                {PACKAGE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <Textarea
                                name="details"
                                placeholder="Kirjelda lühidalt oma soove: laudade paigutus, peolaua mõte, erisoovid või muu oluline info."
                                rows={5}
                                value={formData.details}
                                onChange={handleChange}
                                className="quote-textarea"
                                data-testid="quote-details-input"
                            />

                            <div className="quote-form-footer">
                                <div className="quote-form-hint">
                                    <PartyPopper size={18} />
                                    <span>Vastame päringule esimesel võimalusel.</span>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A0A0A] rounded-none text-sm uppercase tracking-widest px-8 py-4"
                                    data-testid="quote-submit-btn"
                                >
                                    {isSubmitting ? "Saadan..." : "Küsi pakkumist"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
