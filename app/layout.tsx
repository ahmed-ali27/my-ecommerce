import Footer from "./_components/footer/page";
import Navbar from "./_components/navbar/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ToasterProvider from "./_components/tosterProvider/page";
import { Providers } from "./providers/providers";

config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html>
        <body cz-shortcut-listen="true" className="min-h-screen flex flex-col">
          <Providers>
            <Navbar />
            <main className=" flex-1 pt-16">{children}</main>
            <ToasterProvider />
          </Providers>
          <Footer />
        </body>
      </html>
    </>
  );
}
