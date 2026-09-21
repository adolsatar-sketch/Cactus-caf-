import { useEffect, useState } from "react";

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let timer = 0;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(null), 2000);
    };
    window.addEventListener("cactus:toast", on);
    return () => {
      window.removeEventListener("cactus:toast", on);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div className={`toast${msg ? " is-on" : ""}`} role="status" aria-live="polite">
      <span>{msg ?? ""}</span>
    </div>
  );
}
