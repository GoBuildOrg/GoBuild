import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = "GoBuild";
const DEFAULT_TITLE = "GoBuild | Hire Construction labour in Jammu & Delhi";
const DEFAULT_DESC =
  "GoBuild helps you hire verified construction labour, masons, carpenters, electricians and helpers in Jammu and Delhi. Fast booking, trusted professionals.";
const DEFAULT_KEYWORDS =
  "GoBuild, construction labour, hire masons, hire carpenters, workers for hire, construction workers Jammu, construction workers Delhi, verified professionals";

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url }) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const keys = keywords || DEFAULT_KEYWORDS;
  const img = image || "/GoBuild.png";
  const canonical = url || "https://www.gobuild.in/";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keys} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default SEO;
