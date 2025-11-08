import { Helmet } from "react-helmet";

const SeoData = ({ title, description, keywords, image, url }) => (
  <Helmet>
    {/* Basic SEO */}
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta
      name="keywords"
      content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
    />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Bright Rose" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {/* Open Graph / Social Media */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="Bright Rose" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
);

SeoData.defaultProps = {
  title: "Bright Rose – Reviving Indian Handloom with Modern Elegance",
  description:
    "Bright Rose is an endeavour to bring back Indian handloom to the world through timeless fashion. Explore our handcrafted coats, blazers, and woven pieces made with love and natural beauty.",
  keywords: [
    "Bright Rose",
    "Indian handloom fashion",
    "blazers",
    "handcrafted coats",
    "sustainable clothing",
    "natural fabric",
    "ethical fashion",
    "traditional weaves",
  ],
  image: "www.thebrightrose.com", // 🔸 Add your image link here (e.g. https://yourdomain.com/og-image.jpg)
  url: "www.thebrightrose.com", // 🔸 Add your page URL here (e.g. https://yourdomain.com)
};

export default SeoData;
