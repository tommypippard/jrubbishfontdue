import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { FontDetailFragment, FontDetailCollectionFragment } from "@graphql";
import TypeTesters from "fontdue-js/TypeTesters";
import CharacterViewer from "fontdue-js/CharacterViewer";
import BuyButton from "fontdue-js/BuyButton";
import FontStyle from "./FontStyle";
import { notEmpty, pluralize } from "@/lib/utils";
import FontdueHTML from "./FontdueHTML";
import ActiveLink from "./ActiveLink";


type Coordinate = {
  axis: string;
  value: number;
};

type VariableInstance = {
  name: string;
  coordinates: Coordinate[];
};

function instanceCSS(instance: VariableInstance): React.CSSProperties {
  const settings = instance.coordinates.map(
    (coordinate: Coordinate) => `'${coordinate.axis}' ${coordinate.value}`
  );

  return {
    fontVariationSettings: settings.join(", "),
  };
}

function showBuyButton(
  collection: FontDetailFragment | FontDetailCollectionFragment
): boolean {
  if (collection.sku) return true;

  const hasFontStylesSKU = collection.fontStyles?.some(
    (style) => style.sku !== null
  );
  if (hasFontStylesSKU) return true;

  const hasBundlesSKU = collection.bundles?.some(
    (bundle) => bundle.sku !== null
  );
  if (hasBundlesSKU) return true;

  if ("children" in collection) {
    const hasChildrenSKU = collection.children?.some((child) =>
      showBuyButton(child)
    );
    if (hasChildrenSKU) return true;
  }

  return false;
}

interface CollectionStyles_props {
  collection: FontDetailCollectionFragment;
  isSubfamily: boolean;
}

function groupVariableInstances(
  fontInstances: VariableInstance[] | undefined | null
): VariableInstance[][] | undefined {
  if (!fontInstances) return;
  const groupedFontInstances: { [key: string]: VariableInstance[] } = {};

  if (fontInstances.length < 2) {
    return Object.values(groupedFontInstances);
  }

  // Determine the varying axis by comparing first two instances
  const varyingAxis = fontInstances[0].coordinates.find((coordinate, index) => {
    return coordinate.value !== fontInstances[1].coordinates[index].value;
  })?.axis;

  for (const fontInstance of fontInstances) {
    // Exclude varying axis from grouping
    const sortedCoordinates = fontInstance.coordinates
      .filter((coord) => coord.axis !== varyingAxis)
      .sort((a, b) => a.axis.localeCompare(b.axis));

    // Create a string key by concatenating axis and value pairs
    const key = sortedCoordinates
      .map((coord) => `${coord.axis}:${coord.value}`)
      .join(",");

    // If the key is not in the dictionary, create a new array
    if (!(key in groupedFontInstances)) {
      groupedFontInstances[key] = [];
    }

    // Add the font instance to the group
    groupedFontInstances[key].push(fontInstance);
  }

  return Object.values(groupedFontInstances);
}

function familyStylesGrouped<
  T extends { cssFamily: string | null; cssWeight: string | null }
>(fontStyles: (T | null)[] | null): T[][] | null {
  if (!fontStyles) return null;
  const groups = fontStyles.filter(notEmpty).reduce((groups, style) => {
    const key = `${style.cssFamily}-${style.cssWeight}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(style);

    return groups;
  }, {} as Record<string, T[]>);
  return Object.values(groups);
}

function CollectionStyles({ collection, isSubfamily }: CollectionStyles_props) {
  return (
    <div className="collection-styles">
      {isSubfamily && (
        <h3 className="collection-styles__label">{collection.name}</h3>
      )}

      {collection.isVariableFont
        ? collection.fontStyles?.map((style, i) => {
            const groups = groupVariableInstances(style.variableInstances);
            return (
              <FontStyle
                key={i}
                familyName={collection.name}
                styleName={style.name}
              >
                {groups?.map((group, i) => (
                  <span key={i} className="collection-styles__group">
                    {group?.map((instance, j) => (
                      <span
                        key={j}
                        style={instanceCSS(instance)}
                        className="collection-styles__style"
                      >
                        {"Aa "}
                      </span>
                    ))}
                  </span>
                ))}
              </FontStyle>
            );
          })
        : familyStylesGrouped(collection.fontStyles)?.map((chunk, i) => (
            <span key={i} className="collection-styles__group">
              {chunk.map((style, j) => (
                <FontStyle
                  key={j}
                  familyName={collection.name}
                  styleName={style.name}
                  className="collection-styles__style"
                >
                  {style.name}{" "}
                </FontStyle>
              ))}
            </span>
          ))}
    </div>
  );
}

interface FontDetailProps {
  collection: FontDetailFragment;
}

function FontDetail({ collection }: FontDetailProps) {

  return (
    <>
      <div className={`collection-info ${collection.collectionType}`}>
        {collection.fontStyles?.length === 1 ? (
          <FontStyle
            familyName={collection.featureStyle?.cssFamily}
            styleName={collection.featureStyle?.name}
          >
            <h1 className="collection-info__single-style-name">
              {collection.name}
            </h1>
          </FontStyle>
        ) : (
          <div className="collection-info__name">
            <h1>
              {collection.name}
              {collection.collectionType === "superfamily" && " Collection"}
            </h1>
            <div className="collection-pdf-area">
        {collection.pdfs?.length ? (
          <div className="collection-more-info__specimens">
            <div className="collection-more-info__specimens__images">
              {collection.pdfs.map((pdf, i) => (
                <Link
                  key={i}
                  href={pdf!.url!}
                  target="_blank"
                  className="collection-more-info__specimens__link"
                >
                  {pdf?.name && pdf.name.replace(/\.pdf$/, '')}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
          </div>
        )}
        <div className="collection-download">
            <ActiveLink href="/" data-label="Trail Pack">
              <h1>DOWNLOAD TRAIL PACK</h1>
            </ActiveLink>
        </div>
        <div className="collection-buy">
        {showBuyButton(collection) && (
            <BuyButton
              collectionId={collection.id}
            />
          )}
          {collection.minisiteLink && (
            <a
              href={collection.minisiteLink}
              className="collection-info__minisite-link"
              target="_blank"
              rel="noopener"
            >
              {`${collection.name} Minisite`}
            </a>
          )}
        </div>
        <div className="close">
          <ActiveLink href="/shop" data-label="Back">
            X
          </ActiveLink>
        </div>
      </div>

      <FontStyle
            familyName={collection.featureStyle?.cssFamily}
            styleName={collection.featureStyle?.name}
          >
            <h2 className="collection-main-title">{collection.name}</h2>
          </FontStyle>
      
          <div className="collection-description">
          <div className="col">
            <div className="collection-description-head">
              SPECS
            </div>
            <div className="collection-description-family">
              <ul>
                <li>Name:  {collection.name}</li>
                <li>Year:  {collection.designYear}</li>
                <li>Glyphs:</li>
                <li>Support:</li>
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="collection-description-head">
              FAMILY
            </div>
            <div className="collection-description-family">
            {collection.fontStyles?.map((style, i) => (
    <div key={i}>
      <h3>{style.name}</h3>
      <h3>{collection.isVariableFont ? 'Variable' : null}</h3>
    </div>
  ))}
            </div>
          </div>
          <div className="col">
            <div className="collection-description-head">
              CREDITS
            </div>
            <div className="collection-description-family" dangerouslySetInnerHTML={{ __html: collection.description || '' }} />
          </div>
        </div>

      
      <TypeTesters collectionId={collection.id} defaultMode="local" />

      {collection.images?.length ? (
          <div className="collection-info__images">
              {collection.images.map((image, i) => (
                <div key={i} className="collection-info__image">
                  {image.meta && image.meta.mimeType === "video/mp4" ? (
                    <video src={image.url!} playsInline muted autoPlay loop />
                  ) : (
                    <Image
                      src={image.url!}
                      width={image.meta?.width ?? 1000}
                      height={image.meta?.height ?? 768}
                      alt={image.description ?? ""}
                      priority={i === 0}
                    />
                  )}
                </div>
              ))}
          </div>
        ) : null}
      
      <CharacterViewer collectionId={collection.id} />   

      <div className="collection-description">
          <div className="col">
            <div className="collection-description-head">
              SPECS
            </div>
            <div className="collection-description-family">
              <ul>
                <li>Name:  {collection.name}</li>
                <li>Year:  {collection.designYear}</li>
                <li>Glyphs:</li>
                <li>Support:</li>
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="collection-description-head">
              FAMILY
            </div>
            <div className="collection-description-family">
            {collection.fontStyles?.map((style, i) => (
    <div key={i}>
      <h3>{style.name}</h3>
      <h3>{collection.isVariableFont ? 'Variable' : null}</h3>
    </div>
  ))}
            </div>
          </div>
          <div className="col">
            <div className="collection-description-head">
              CREDITS
            </div>
            <div className="collection-description-family" dangerouslySetInnerHTML={{ __html: collection.description || '' }} />
          </div>
        </div>

        <div className="collection-description">
          <div className="col">
          <div className="collection-description-head">
              SUPPORT
            </div>
            <div className="collection-description-family">
              {collection.languages}
            </div>
          </div>
        </div>
    </>
  );
}

export default FontDetail;
