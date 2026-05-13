import Link from "next/link";
import marketing from "@/styles/marketing.module.css";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h1>Page not found</h1>
        <p className="muted">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className={marketing.mt3}>
          <Link className="btn" href="/">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
