import Head from "next/head";

// Absolute base URL for share cards (og:image must be absolute). Falls back to
// the production domain if the env var isn't set.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://treyrader.dev"
).replace(/\/$/, "");

const toAbsolute = (src: string) =>
  /^https?:\/\//.test(src)
    ? src
    : `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;

interface Props {
  /** Card + browser title. */
  title: string;
  /** Card description. */
  description: string;
  /** Image shown in the card — relative ("/…") or absolute URL. Defaults to the
   *  profile photo for the site-wide card. */
  image?: string;
  /** Alt text for the card image. */
  imageAlt?: string;
  /** Page path (e.g. "/portfolio/foo") for canonical + og:url. */
  path?: string;
  /** `summary` = small square thumbnail (profile), `summary_large_image` = big
   *  banner (project poster). */
  card?: "summary" | "summary_large_image";
  /** og:type — "website" for general pages, "article" for a project. */
  type?: string;
}

// Every tag is keyed so a page-level <SocialMeta> deduplicates and overrides the
// site-wide default rendered in _app.
export default function SocialMeta({
  title,
  description,
  image = "/images/portraits/headshot.png",
  imageAlt = "Trey Rader",
  path = "",
  card = "summary",
  type = "website",
}: Props) {
  const url = `${BASE_URL}${path}`;
  const ogImage = toAbsolute(image);

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={url} />

      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:site_name" property="og:site_name" content="Trey Rader" />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:image" property="og:image" content={ogImage} />
      <meta key="og:image:alt" property="og:image:alt" content={imageAlt} />

      <meta key="twitter:card" name="twitter:card" content={card} />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={ogImage} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={imageAlt} />
    </Head>
  );
}
