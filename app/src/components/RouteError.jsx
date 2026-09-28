import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useNavigate, useRouteError } from "react-router";
import "../style/route-error.css";

export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const status = error?.status || 500;
  const isNotFound = status === 404;

  return (
    <main className="route-error">
      <section className="route-error__card">
        <div className="route-error__icon">
          <AlertTriangle size={24} />
        </div>

        <span className="route-error__code">{status}</span>
        <h1>{isNotFound ? "This path is not on the map." : "Something went wrong."}</h1>
        <p>
          {isNotFound
            ? "The page you requested does not exist or the route has changed."
            : "UrPath hit an unexpected error. You can return to your dashboard and continue learning."}
        </p>

        <div className="route-error__actions">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go back
          </button>
          <button type="button" className="route-error__primary" onClick={() => navigate("/dashboard")}>
            <Home size={16} />
            Dashboard
          </button>
          <button type="button" onClick={() => window.location.reload()}>
            <RotateCcw size={16} />
            Reload
          </button>
        </div>
      </section>
    </main>
  );
}
