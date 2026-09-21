import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon } from "./Icons";
import { useI18n } from "../i18n";
import { useMagnetic } from "../hooks/useMagnetic";

export function BackToTop() {
  const { t } = useI18n();
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useMagnetic(ref, 0.3);
  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button ref={ref} type="button" className={`to-top${on ? " is-on" : ""}`} aria-label={t("backToTop")} tabIndex={on ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ArrowUpIcon />
    </button>
  );
}
