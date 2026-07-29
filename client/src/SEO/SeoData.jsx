import { Helmet } from "react-helmet";

const SeoData = ({ title, description, keywords, image, url, schema }) => {
  const fullImage = image?.startsWith("http")
    ? image
    : `https://www.thebrightrose.com${image || ""}`;

  const fullUrl = url?.startsWith("http")
    ? url
    : `https://www.thebrightrose.com${url || ""}`;

  return (
    <Helmet>
      {/* ======================= */}
      {/* BASIC SEO */}
      {/* ======================= */}
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Bright Rose" />
      <meta name="language" content="English" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href={fullUrl} />

      {/* ======================= */}
      {/* OPEN GRAPH */}
      {/* ======================= */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Bright Rose" />
      <meta property="og:locale" content="en_IN" />

      {/* ======================= */}
      {/* TWITTER PREVIEW */}
      {/* ======================= */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@brightrose" />

      {/* ======================= */}
      {/* FAVICON SUPPORT */}
      {/* ======================= */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* ======================= */}
      {/* OPTIONAL JSON-LD STRUCTURED DATA */}
      {/* ======================= */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

SeoData.defaultProps = {
  title: "Bright Rose – Reviving Indian Handloom with Modern Elegance",
  description:
    "Bright Rose brings you luxury handloom couture crafted by master artisans of India. Explore Kanchipuram silk jackets, handcrafted capes, designer blazers, and modern woven pieces.",
  keywords: [
    "Bright Rose",
    "Indian handloom fashion",
    "Kanchipuram silk",
    "handwoven jackets",
    "luxury couture",
    "sustainable fashion",
    "heritage craft",
    "designer womenswear",
  ],
  image: "/og-image.jpg", // Put your hero OG image in /public
  url: "/", // Homepage default
  schema: null,
};

export default SeoData;
