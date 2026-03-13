import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
  jsonLd?: object | object[];
  ogImage?: string;
}

const SITE_URL = "https://devin-policastro.lovable.app";

const SEOHead = ({ title, description, canonicalPath, type = "website", jsonLd, ogImage }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", `${SITE_URL}${canonicalPath}`);
    setMeta("property", "og:site_name", "Devin Policastro");

    const imageUrl = ogImage
      ? ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`
      : `${SITE_URL}/images/og-image.png`;
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${canonicalPath}`);

    // JSON-LD — support single or array
    const scriptId = "seo-jsonld";
    let script = document.getElementById(scriptId);
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      script.textContent = JSON.stringify(data.length === 1 ? data[0] : data);
    } else if (script) {
      script.remove();
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, canonicalPath, type, jsonLd, ogImage]);

  return null;
};

export default SEOHead;
