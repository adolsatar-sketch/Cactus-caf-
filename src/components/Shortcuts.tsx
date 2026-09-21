import { memo } from "react";
import { GLYPHS, CLetterGlyph, CactusGlyph } from "./BrandIcons";
import type { Category, Lang } from "../data/types";
import { UI, itemCountLabel } from "../data/ui";
import { buildPath } from "../lib/route";

interface Props {
  cats: Category[];
  counts: Record<string, number>;
  lang: Lang;
  onGo: (id: string) => void;
}

/** The brand checkerboard, used as the category index. */
export const Shortcuts = memo(function Shortcuts({ cats, counts, lang, onGo }: Props) {
  return (
    <section className="explore wrap" aria-labelledby="explore-t" data-spy-null>
      <h2 id="explore-t" className="explore__title">
        {UI.exploreMenu[lang]}
      </h2>
      <div className="tiles">
        {cats.map((c) => {
          const G = GLYPHS[c.glyph];
          return (
            <a
              key={c.id}
              className="tile"
              href={buildPath(lang, c.id)}
              onClick={(e) => {
                e.preventDefault();
                onGo(c.id);
              }}
            >
              <span className="tile__glyph" aria-hidden="true">
                <G />
              </span>
              <span className="tile__name">{c.name[lang]}</span>
              <span className="tile__count">{itemCountLabel(lang, counts[c.id] ?? 0)}</span>
            </a>
          );
        })}
        <div className="tile tile--filler" aria-hidden="true">
          <span className="tile__glyph">
            <CactusGlyph />
          </span>
        </div>
        <div className="tile tile--filler" aria-hidden="true">
          <span className="tile__glyph">
            <CLetterGlyph />
          </span>
        </div>
      </div>
    </section>
  );
});
