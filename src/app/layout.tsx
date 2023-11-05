import FontdueProvider from "fontdue-js/FontdueProvider";
import StoreModal from "fontdue-js/StoreModal";
import CartButton from "fontdue-js/CartButton";
import parse from "html-react-parser";
import { Metadata } from "next";
import "fontdue-js/fontdue.css";
import Image from "next/image";
import "../styles/main.scss";
import { RootLayoutQuery } from "@graphql";
import { fetchGraphql } from "@/lib/graphql";
import ActiveLink from "@/components/ActiveLink";
import PreloadWebfonts from "@/components/PreloadWebfonts";
import FontdueHTML from "@/components/FontdueHTML";

function styleFamilyName(
  style:
    | {
        cssFamily: string | null;
        name: string | null;
      }
    | null
    | undefined
) {
  if (!style) return null;
  return `"${style.cssFamily} ${style.name}"`;
}

async function getData() {
  return fetchGraphql<RootLayoutQuery>("RootLayout.graphql");
}

export async function generateMetadata(): Promise<Metadata> {
  const { viewer } = await getData();

  return {
    title: {
      template: `%s | ${viewer.settings?.title}`,
      default: viewer.settings?.title ?? "",
    },
  };
}

export default async function Shop({
  children,
}: {
  children: React.ReactNode;
}) {
  const { viewer } = await getData();

  const pages = viewer.pages?.edges?.map((edge) => edge!.node!);

  const moreThanOneCollection =
    (viewer.fontCollections?.edges?.length ?? 0) > 1;

  return (
    <html lang="en">
      <head>{parse(viewer.settings?.faviconMarkup ?? "")}</head>
      <body>
        {parse(viewer.settings?.htmlHead ?? "")}
        <PreloadWebfonts style={viewer.settings?.uiFontStyle} />
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `body { font-family: ${styleFamilyName(
              viewer.settings?.uiFontStyle
            )}, -apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif; }`,
          }}
        />

        <FontdueProvider
          config={{
            typeTester: { selectable: true, variableAxesPosition: "auto" },
          }}
        >
          {/*
          <nav className="nav" data-border="true">
            <div className="nav__links">
              <div className="nav__item" data-label="home">
                  <ActiveLink href="/" className="nav__link">
                    <h1>SHOP</h1>
                  </ActiveLink>
              </div>
              <div className="nav__item" data-label="trailpack">
                  <ActiveLink href="/" className="nav__link">
                    <h1>DOWNLOAD TRAIL PACK</h1>
                  </ActiveLink>
              </div>
              <div className="nav__item" data-label="contact">
                 <div className="nav__double">
                   <ActiveLink href="mailto:" className="nav__link">
                    <h1>Enquire</h1>
                   </ActiveLink>
                   <ActiveLink href="mailto:" className="nav__link">
                    <h1>Customize</h1>
                   </ActiveLink>
                 </div>
              </div>
              <div className="nav__item" data-label="year">
                <h1>©2023</h1>
              </div>
            </div> 
            
            <div className="nav__item" data-label="login">
              <ActiveLink className="nav__link" href="/customer-login">
                Log in
              </ActiveLink>
            </div>
            <div className="nav__item" data-label="cart">
              <CartButton buttonStyle="icon" />
            </div>
            
          </nav>
*/}
          <main className="main">{children}</main>

          <footer className="footer">
            <div className="footer__copyright">
              <FontdueHTML html={viewer.settings?.footerText} />
            </div>
          </footer>

          <StoreModal />
        </FontdueProvider>
      </body>
    </html>
  );
}
