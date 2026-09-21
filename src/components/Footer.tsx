import { useRef } from "react";
import { InstagramIcon, PhoneIcon } from "./Icons";
import { useI18n } from "../i18n";
import { useMagnetic } from "../hooks/useMagnetic";
import site from "../data/site.config.json";
import script from "../assets/brand/tagline-script-white.svg";
import mark from "../assets/brand/mark-cactus-white.svg";

/** Optional details are shown only when the café has filled them in (src/data/site.config.json). */
export function Footer() {
  const { lang, t } = useI18n();
  const ig = useRef<HTMLAnchorElement>(null);
  useMagnetic(ig, 0.2);
  const address = site.address[lang];
  const hours = site.openingHours[lang];
  const wa = site.whatsapp.replace(/\D/g, "");
  const hasInfo = Boolean(site.phone || wa || site.email || address || hours || site.mapUrl);
  return (
    <footer className="footer">
      <div className="band" aria-hidden="true">
        <div className="band__track" />
      </div>
      <div className="wrap footer__in">
        <img className="footer__mark" src={mark} alt="" width={57} height={96} loading="lazy" />
        <img className="footer__script" src={script} alt={site.tagline} width={247} height={48} loading="lazy" />
        <p className="footer__thanks">{t("thanks")}</p>
        {site.instagram.url && (
          <a ref={ig} className="footer__ig" href={site.instagram.url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            <span>{site.instagram.handle || t("instagram")}</span>
          </a>
        )}
        {hasInfo && (
          <div className="footer__info">
            {address && <p><strong>{t("address")}:</strong> {address}</p>}
            {hours && <p><strong>{t("hours")}:</strong> {hours}</p>}
            {site.phone && (
              <p>
                <a href={`tel:${site.phone}`} dir="ltr"><PhoneIcon width={16} height={16} style={{ display: "inline", verticalAlign: "-3px", marginInlineEnd: 6 }} />{site.phone}</a>
              </p>
            )}
            {wa && <p><a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>}
            {site.email && <p><a href={`mailto:${site.email}`} dir="ltr">{site.email}</a></p>}
            {site.mapUrl && <p><a href={site.mapUrl} target="_blank" rel="noopener noreferrer">{t("showOnMap")}</a></p>}
          </div>
        )}
        <p className="footer__small">{site.name.en.toUpperCase()}</p>
      </div>
    </footer>
  );
}
