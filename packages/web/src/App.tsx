import { useEffect, useState, useCallback } from "react";
import { fetchScore, postClick } from "./api.js";

export default function App() {
  const [score, setScore] = useState<number | null>(null);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    fetchScore().then(setScore).catch(console.error);
  }, []);

  const handleClick = useCallback(async () => {
    setClicking(true);
    try {
      const newScore = await postClick();
      setScore(newScore);
    } catch (err) {
      console.error(err);
    } finally {
      setClicking(false);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cookie Clicker</h1>
      <p style={styles.score}>
        {score === null ? "Loading..." : `${score} cookies`}
      </p>
      <button
        style={styles.cookie}
        onClick={handleClick}
        disabled={clicking}
        aria-label="Click to earn a cookie"
      >
        🍪
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "sans-serif",
    background: "#1a1a2e",
    color: "#eee",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2.5rem",
    margin: 0,
  },
  score: {
    fontSize: "1.75rem",
    margin: 0,
    fontVariantNumeric: "tabular-nums",
  },
  cookie: {
    fontSize: "6rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.08s ease",
    userSelect: "none",
    lineHeight: 1,
  },
};
