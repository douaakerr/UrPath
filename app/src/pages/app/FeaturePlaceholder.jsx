import { Link } from "react-router";

function FeaturePlaceholder({ title, description }) {
  return (
    <section style={{ minHeight: "100%", padding: "48px 32px", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(620px, 100%)", textAlign: "center" }}>
        <p style={{ margin: "0 0 10px", color: "var(--color-primary)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em" }}>
          UrPath
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-.04em" }}>{title}</h1>
        <p style={{ margin: "0 auto 24px", maxWidth: 500, color: "var(--text-secondary)", lineHeight: 1.7 }}>{description}</p>
        <Link to="/dashboard" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
          Back to overview
        </Link>
      </div>
    </section>
  );
}

export default FeaturePlaceholder;
