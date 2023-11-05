import Link from "next/link";
import { fetchGraphql } from "@/lib/graphql";
import { IndexQuery } from "@graphql";
import FontStyle from "@/components/FontStyle";
import PreloadWebfonts from "@/components/PreloadWebfonts";
import { notEmpty } from "@/lib/utils";
import FontDetail from "@/components/FontDetail";
import ActiveLink from "@/components/ActiveLink";


export default async function Shop() {
  const data = await fetchGraphql<IndexQuery>("Index.graphql");

  const collections = data.viewer.fontCollections?.edges
    ?.map((edge) => edge?.node)
    .filter(notEmpty);

  if (collections?.length === 1) {
    const firstCollection = data.viewer.firstCollection?.edges?.[0]?.node;
    if (firstCollection) return <FontDetail collection={firstCollection} />;
  }

  return (
    <div>
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
            {/*
            <div className="nav__item" data-label="login">
              <ActiveLink className="nav__link" href="/customer-login">
                Log in
              </ActiveLink>
            </div>
            <div className="nav__item" data-label="cart">
              <CartButton buttonStyle="icon" />
            </div>
            */}
          </nav>

    <section className="home">
      {collections?.map((node) => {
        if (!node.slug) return;
        
        return (
          <div>
            <div className="home_collection_details">
              <div className="col">{node.tags}</div>
              <div className="col">{node.fontStyles.length} Weights</div>
              <div className="col">{node.isVariableFont ? 'Variable' : null}</div>
            </div>
          <h2 key={node.id} className="home__collection">
            <PreloadWebfonts style={node.featureStyle} />
            <FontStyle
              familyName={node.featureStyle?.cssFamily}
              styleName={node.featureStyle?.name}
              className="home__collection__name"
            >
              <Link
                href={`/fonts/${node.slug.name}`}
                className="home__collection__link"
                style={
                  {
                    "--optical-adjustment": node.opticalAdjustment,
                  } as React.CSSProperties
                }
              >
                {node.name}
              </Link>
            </FontStyle>
            {node.isNew && (
              <span className="home__collection__new">&nbsp;New</span>
            )}
          </h2>
          </div>
        );
      })}
    </section>
    </div>
  );
}
