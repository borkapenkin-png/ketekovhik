# KETE Kohvik - Koduleht + Admin CMS PRD

## Algne Probleem
Kliendile on vaja teha premium designiga koduleht KETE Kohvikule Aravetel, koos admin paneeliga sisu haldamiseks.

## Tehniline Lahendus
- **Frontend:** React 19 + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB (kliendi soov oli PHP/MySQL, aga kiitis FastAPI lahenduse heaks)
- **Autentimine:** JWT tokens (httpOnly cookies)

## Admin Andmed
- **URL:** /admin
- **Kasutaja:** admin
- **Parool:** KeteKohvik2024!

## Teostatud Funktsioonid ✅
*Kuupäev: 2024-12*

### Avalik Koduleht
- [x] Hero sektsioon logo ja reitinguga (4.6★)
- [x] Meist sektsioon
- [x] Teenused (kohvik, peosaal, kodused road)
- [x] Menüü (laeb API-st, dünaamiline)
- [x] Galerii (laeb API-st)
- [x] Kontakt + Google Maps
- [x] SEO optimeeritud (Schema.org, meta tagid)

### Admin Paneel (/admin)
- [x] Sisselogimine/väljalogimine
- [x] **Menüü haldamine** - Lisa/muuda/kustuta roogi (supid, pearoad, joogid + hinnad)
- [x] **Lahtiolekuajad** - Muuda iga päeva kellaaegu
- [x] **Kontaktandmed** - Muuda aadress, telefon, email, Facebook
- [x] **Galerii** - Lisa/kustuta pilte

### Backend API
- [x] /api/menu - Avalik menüü
- [x] /api/hours - Avalik lahtiolekuajad  
- [x] /api/contact - Avalik kontaktinfo
- [x] /api/gallery - Avalik galerii
- [x] /api/auth/* - Autentimine
- [x] /api/admin/* - Kaitstud admin endpointid

## SEO
- [x] Schema.org Restaurant structured data
- [x] Open Graph meta tagid
- [x] Võtmesõnad: kohvik Järvamaa, söögikoht Aravete
- [x] robots.txt + sitemap.xml

## Järgmised Tegevused
- [ ] Domeeni registreerimine (ketekohvik.ee)
- [ ] Google My Business profiili loomine
- [ ] Google Search Console seadistamine
