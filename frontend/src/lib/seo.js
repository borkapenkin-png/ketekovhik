import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://ketekohvik.ee/";

const HOME_META = {
  title: "KETE Kohvik Aravete | Kohvik, kodune toit ja peosaal Järvamaal",
  description:
    "KETE Kohvik Aravetel pakub koduseid lõunaid, head kohvi ja 100-kohalist peosaali Järvamaal. Tule kohvikusse või küsi peo- ja cateringpakkumist.",
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  canonical: SITE_URL
};

const ADMIN_META = {
  title: "KETE Kohvik Admin",
  description: "KETE Kohviku haldusliides.",
  robots: "noindex, nofollow, noarchive",
  canonical: `${SITE_URL}admin`
};

function upsertTag(tagName, selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function applyMeta(meta) {
  document.title = meta.title;

  upsertTag("meta", 'meta[name="description"]', {
    name: "description",
    content: meta.description
  });
  upsertTag("meta", 'meta[name="robots"]', {
    name: "robots",
    content: meta.robots
  });
  upsertTag("meta", 'meta[property="og:title"]', {
    property: "og:title",
    content: meta.title
  });
  upsertTag("meta", 'meta[property="og:description"]', {
    property: "og:description",
    content: meta.description
  });
  upsertTag("meta", 'meta[property="og:url"]', {
    property: "og:url",
    content: meta.canonical
  });
  upsertTag("meta", 'meta[name="twitter:title"]', {
    name: "twitter:title",
    content: meta.title
  });
  upsertTag("meta", 'meta[name="twitter:description"]', {
    name: "twitter:description",
    content: meta.description
  });
  upsertTag("link", 'link[rel="canonical"]', {
    rel: "canonical",
    href: meta.canonical
  });
}

export function SEOHeadManager() {
  const location = useLocation();

  useEffect(() => {
    const meta = location.pathname.startsWith("/admin") ? ADMIN_META : HOME_META;
    applyMeta(meta);
  }, [location.pathname]);

  return null;
}
