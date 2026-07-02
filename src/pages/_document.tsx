import { Html, Head, Main, NextScript } from "next/document";

export default function Document(): React.ReactElement {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta property="og:locale" content="en_US" />
        <meta name="author" content="Trey Rader" />
        {/* og:title / og:description / og:image / twitter:card are set per page
            via <SocialMeta> (site-wide default in _app, project override on the
            project page), so they're intentionally not hard-coded here. */}
        <meta
          name="keywords"
          content="JavaScript developer, TypeScript developer, Web developer, New Orleans developer, New Orleans web developer, Web design"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
        <div
          id="fab-portal"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 2147483647,
            pointerEvents: "none",
          }}
        />
      </body>
    </Html>
  );
}
