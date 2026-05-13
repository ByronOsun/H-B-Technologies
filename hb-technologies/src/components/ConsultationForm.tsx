"use client";

import { useState } from "react";

import styles from "./ConsultationForm.module.css";
import marketing from "@/styles/marketing.module.css";
import { postConsultation } from "@/lib/api";

type FormState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export function ConsultationForm({
  source,
}: {
  source: "contact" | "book-consultation";
}) {
  const [status, setStatus] = useState<FormState>({ state: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      source,
    };

    try {
      const res = await postConsultation(payload);
      if (!res.ok) {
        setStatus({
          state: "error",
          message: res.error || "Submission failed. Please try again.",
        });
        return;
      }

      setStatus({
        state: "success",
        message: "Thanks — we’ll get back to you shortly.",
      });
      event.currentTarget.reset();
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <form className={marketing.form} onSubmit={onSubmit} noValidate>
      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-name`}>
          Full name
        </label>
        <input
          className={marketing.input}
          id={`${source}-name`}
          name="name"
          autoComplete="name"
          required
        />
      </div>

      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-email`}>
          Email
        </label>
        <input
          className={marketing.input}
          id={`${source}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-phone`}>
          Phone (optional)
        </label>
        <input
          className={marketing.input}
          id={`${source}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>

      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-company`}>
          Company / organization (optional)
        </label>
        <input
          className={marketing.input}
          id={`${source}-company`}
          name="company"
          autoComplete="organization"
        />
      </div>

      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-service`}>
          Service area
        </label>
        <select
          className={marketing.select}
          id={`${source}-service`}
          name="service"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Data Science">Data Science</option>
          <option value="Network Engineering">Network Engineering</option>
          <option value="Automation Systems">Automation Systems</option>
          <option value="IoT Solutions">IoT Solutions</option>
          <option value="Smart CCTV Installation">Smart CCTV Installation</option>
          <option value="IT Consultation">IT Consultation</option>
          <option value="Artificial Intelligence (AI)">
            Artificial Intelligence (AI)
          </option>
          <option value="Machine Learning (ML)">Machine Learning (ML)</option>
          <option value="Natural Language Processing (NLP)">
            Natural Language Processing (NLP)
          </option>
        </select>
        <div className={marketing.hint}>
          We’ll scope requirements, risks, and a delivery plan.
        </div>
      </div>

      <div className={marketing.field}>
        <label className={marketing.label} htmlFor={`${source}-message`}>
          Message
        </label>
        <textarea
          className={marketing.textarea}
          id={`${source}-message`}
          name="message"
          required
        />
      </div>

      <button className="btn btnPrimary" type="submit" disabled={status.state === "submitting"}>
        {status.state === "submitting" ? "Submitting…" : "Submit"}
      </button>

      {status.state === "success" ? (
        <div className={`${styles.status} ${styles.success}`}>{status.message}</div>
      ) : null}
      {status.state === "error" ? (
        <div className={`${styles.status} ${styles.error}`}>{status.message}</div>
      ) : null}
      {status.state === "idle" ? (
        <div className={styles.status}>
          We respond within 1–2 business days.
        </div>
      ) : null}
    </form>
  );
}
