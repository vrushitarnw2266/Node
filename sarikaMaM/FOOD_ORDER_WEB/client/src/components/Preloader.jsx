import { useEffect, useRef, useState } from "react";
import "./Preloader.css";

export function Preloader({ onFinish, durationMs = 3800 }) {
  const [phase, setPhase] = useState("enter"); // enter | open | exit | done
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const exitTimer = setTimeout(() => setPhase("exit"), durationMs - 600);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onFinishRef.current?.();
    }, durationMs);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [durationMs]);

  if (phase === "done") return null;

  return (
    <div className={`kk-preloader kk-preloader--${phase}`} aria-live="polite" aria-busy="true">
      <div className="kk-preloader__content">
        <div className="kk-logo-pulse">🍲</div>
        <h1 className="kk-brand-text">Veggie Toing</h1>
        <p className="kk-tagline-text">Fastest Delivery Ever</p>
        
        <div className="kk-loading-bar-wrap">
          <div className="kk-loading-bar" />
        </div>
      </div>

      <div className="kk-scooter-track" />
      <div className="kk-scooter-wrap">🛵</div>
    </div>
  );
}
