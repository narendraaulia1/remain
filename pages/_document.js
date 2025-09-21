// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Tailwind Play CDN - cepat untuk prototipe */}
          <script src="https://cdn.tailwindcss.com"></script>
          {/* opsional: konfigurasi singkat */}
          <script
            dangerouslySetInnerHTML={{
              __html: `tailwind.config = { theme: { extend: {} } }`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
