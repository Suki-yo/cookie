import { useEffect, useState, useCallback } from "react";
import { fetchScore, postClick } from "./api.js";
import { login, logout, handleCallback, getUser } from "./auth.js";
import type { User } from "oidc-client-ts";

export default function App() {
  const [score, setScore] = useState<number | null>(null);
  const [clicking, setClicking] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const isCallback = window.location.pathname === "/callback";
    if (isCallback) {
      handleCallback()
        .then(() => { window.location.replace("/"); })
        .catch(console.error);
      return;
    }
    getUser().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      fetchScore().then(setScore).catch(console.error);
    }
  }, [user]);

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

  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Cookie Clicker</h1>
        <button style={styles.button} onClick={() => login().catch(console.error)}>
          Login
        </button>
      </div>
    );
  }

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
      <button style={styles.button} onClick={() => logout().catch(console.error)}>
        Logout ({user.profile.email})
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
  button: {
    padding: "0.5rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "0.5rem",
    border: "none",
    background: "#e94560",
    color: "#fff",
  },
};
