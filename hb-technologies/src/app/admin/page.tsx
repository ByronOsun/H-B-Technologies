"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  SiteContent,
  DeliverCard,
  WhyItem,
  IndustryItem,
  StackCategory,
  TestimonialItem,
} from "@/lib/content";
import type { HeroSlide } from "@/components/HeroSection";
import { EditableText, EditableImage, SectionShell } from "./EditorComponents";
import pageStyles from "../page.module.css";
import heroStyles from "@/components/HeroSection.module.css";
import s from "./admin.module.css";

/* ─── Defaults ──────────────────────────────────────────────────── */

const EMPTY_SLIDE = (): HeroSlide => ({
  id: `slide-${Date.now()}`,
  type: "image",
  mediaUrl: "",
  poster: "",
  overlayOpacity: 0.82,
  badge: "",
  heading: "New Headline",
  subheading: "Supporting subheadline text goes here.",
  ctaPrimary: { label: "Request Consultation", href: "/book-consultation" },
  ctaSecondary: { label: "View Services", href: "/services" },
});

/* ─── Component ─────────────────────────────────────────────────── */

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  /* Hide site chrome while in visual editor */
  useEffect(() => {
    if (!authed) return;
    const style = document.createElement("style");
    style.id = "vizia-admin-overrides";
    style.textContent = `
      header { display: none !important; }
      footer { display: none !important; }
      [class*="floatingBtn"] { display: none !important; }
      [class*="scrollProgress"] { display: none !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById("vizia-admin-overrides")?.remove();
    };
  }, [authed]);

  /* Auto-clear status messages */
  useEffect(() => {
    if (saveState === "ok" || saveState === "error") {
      const t = setTimeout(() => {
        setSaveState("idle");
        setSaveMsg("");
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [saveState]);

  /* ── Core updater ── */
  const mutate = useCallback((fn: (c: SiteContent) => SiteContent) => {
    setContent(prev => (prev ? fn(prev) : prev));
    setDirty(true);
  }, []);

  /* Patch any top-level object section */
  const ps = (k: keyof SiteContent, patch: object) =>
    mutate(c => ({ ...c, [k]: { ...(c[k] as object), ...patch } }));

  /* ── Slide helpers ── */
  const patchSlide = (i: number, patch: Partial<HeroSlide>) =>
    mutate(c => {
      const slides = [...c.hero.slides];
      slides[i] = { ...slides[i], ...patch };
      return { ...c, hero: { ...c.hero, slides } };
    });

  const addSlide = () => {
    const newIdx = content?.hero.slides.length ?? 0;
    mutate(c => ({
      ...c,
      hero: { ...c.hero, slides: [...c.hero.slides, EMPTY_SLIDE()] },
    }));
    setActiveSlide(newIdx);
  };

  const removeSlide = (i: number) => {
    const newLen = (content?.hero.slides.length ?? 1) - 1;
    mutate(c => ({
      ...c,
      hero: { ...c.hero, slides: c.hero.slides.filter((_, idx) => idx !== i) },
    }));
    setActiveSlide(prev => Math.min(prev, Math.max(0, newLen - 1)));
  };

  /* ── Section array patch helpers ── */
  const patchDeliverCard = (i: number, patch: Partial<DeliverCard>) =>
    mutate(c => {
      const cards = [...c.deliver.cards];
      cards[i] = { ...cards[i], ...patch };
      return { ...c, deliver: { ...c.deliver, cards } };
    });

  const patchWhyItem = (i: number, patch: Partial<WhyItem>) =>
    mutate(c => {
      const items = [...c.why.items];
      items[i] = { ...items[i], ...patch };
      return { ...c, why: { ...c.why, items } };
    });

  const patchIndustryItem = (i: number, patch: Partial<IndustryItem>) =>
    mutate(c => {
      const items = [...c.industries.items];
      items[i] = { ...items[i], ...patch };
      return { ...c, industries: { ...c.industries, items } };
    });

  const patchStackCat = (i: number, patch: Partial<StackCategory>) =>
    mutate(c => {
      const items = [...c.stack.items];
      items[i] = { ...items[i], ...patch };
      return { ...c, stack: { ...c.stack, items } };
    });

  const patchTestimonial = (i: number, patch: Partial<TestimonialItem>) =>
    mutate(c => {
      const items = [...c.testimonials.items];
      items[i] = { ...items[i], ...patch };
      return { ...c, testimonials: { ...c.testimonials, items } };
    });

  /* ── Login ── */
  const login = async () => {
    setSaveState("saving");
    setSaveMsg("");
    try {
      const res = await fetch("/api/site-content", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) {
        setSaveState("error");
        setSaveMsg("Incorrect password. Try again.");
        return;
      }
      const data: SiteContent = await res.json();
      setContent(data);
      setAuthed(true);
      setSaveState("idle");
    } catch {
      setSaveState("error");
      setSaveMsg("Network error — is the dev server running?");
    }
  };

  /* ── Save ── */
  const save = async () => {
    if (!content) return;
    setSaveState("saving");
    setSaveMsg("");
    try {
      const res = await fetch("/api/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pw,
        },
        body: JSON.stringify(content, null, 2),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveState("error");
        setSaveMsg(data.error ?? "Save failed.");
      } else {
        setSaveState("ok");
        setSaveMsg("✓ Saved! Changes will appear on the live site within 30 seconds.");
        setDirty(false);
      }
    } catch {
      setSaveState("error");
      setSaveMsg("Network error during save.");
    }
  };

  /* ══ Login screen ══════════════════════════════════════════════ */
  if (!authed) {
    return (
      <div className={s.loginWrap}>
        <div className={s.loginCard}>
          <div className={s.loginLogo}>
            <span className={s.logoV}>V</span>IZIA
          </div>
          <h1 className={s.loginTitle}>Visual Editor</h1>
          <p className={s.loginSub}>
            Sign in to edit your site content directly — no coding required.
          </p>
          <div className={s.loginField}>
            <label htmlFor="pw" className={s.loginLabel}>Admin password</label>
            <input
              id="pw"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              className={s.loginInput}
              placeholder="Enter password"
              autoFocus
            />
          </div>
          <button
            className={s.loginBtn}
            onClick={login}
            disabled={saveState === "saving"}
          >
            {saveState === "saving" ? "Signing in…" : "Sign In →"}
          </button>
          {saveState === "error" && <p className={s.error}>{saveMsg}</p>}
          <p className={s.loginHint}>
            Default: <code>vizia-admin</code> · Set <code>ADMIN_PASSWORD</code> env var to change.
          </p>
        </div>
      </div>
    );
  }

  /* ── Convenience aliases ── */
  const c = content!;
  const slide = c.hero.slides[activeSlide] ?? c.hero.slides[0];

  /* ══ Visual editor ═════════════════════════════════════════════ */
  return (
    <div className={s.adminWrap}>

      {/* ── Admin bar ── */}
      <div className={s.adminBar}>
        <div className={s.adminBarInner}>
          <span className={s.adminLogo}>
            <span className={s.logoV}>V</span>IZIA Admin
          </span>
          {dirty && <span className={s.unsaved}>● Unsaved changes</span>}
          <div className={s.adminBarActions}>
            <a href="/" target="_blank" rel="noreferrer" className={s.previewBtn}>
              Preview site ↗
            </a>
            <button onClick={save} disabled={saveState === "saving"} className={s.saveBtn}>
              {saveState === "saving" ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
        {saveMsg && (
          <div className={`${s.statusBar} ${saveState === "error" ? s.statusError : s.statusOk}`}>
            {saveMsg}
          </div>
        )}
      </div>

      {/* ── Site canvas ── */}
      <div className={s.adminCanvas}>

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section
          className={heroStyles.hero}
          style={{ "--overlay-opacity": slide?.overlayOpacity ?? 0.82 } as React.CSSProperties}
        >
          {/* Background image / video */}
          {slide && (
            <EditableImage
              src={slide.mediaUrl}
              alt="Hero background"
              onChange={url => patchSlide(activeSlide, { mediaUrl: url })}
              style={{ position: "absolute", inset: 0, borderRadius: 0 }}
            />
          )}
          <div className={heroStyles.overlay} />
          <div className={heroStyles.blob1} />
          <div className={heroStyles.blob2} />

          {/* Content */}
          {slide && (
            <div className={`container ${heroStyles.content}`}>
              <div className={heroStyles.textWrap}>
                <div className={heroStyles.badge}>
                  <span className={heroStyles.badgeDot} />
                  <EditableText
                    value={slide.badge ?? ""}
                    onChange={v => patchSlide(activeSlide, { badge: v })}
                    placeholder="Badge text"
                  />
                </div>
                <EditableText
                  value={slide.heading}
                  onChange={v => patchSlide(activeSlide, { heading: v })}
                  tag="h1"
                  className={heroStyles.heading}
                  multiline
                  placeholder="Hero heading"
                />
                <EditableText
                  value={slide.subheading}
                  onChange={v => patchSlide(activeSlide, { subheading: v })}
                  tag="p"
                  className={heroStyles.sub}
                  multiline
                  placeholder="Subheading"
                />
                <div className={heroStyles.ctas}>
                  <EditableText
                    value={slide.ctaPrimary.label}
                    onChange={v =>
                      patchSlide(activeSlide, {
                        ctaPrimary: { ...slide.ctaPrimary, label: v },
                      })
                    }
                    className={`btn btnPrimary ${heroStyles.ctaPrimary}`}
                    placeholder="Primary button"
                  />
                  <EditableText
                    value={slide.ctaSecondary.label}
                    onChange={v =>
                      patchSlide(activeSlide, {
                        ctaSecondary: { ...slide.ctaSecondary, label: v },
                      })
                    }
                    className={`btn ${heroStyles.ctaSecondary}`}
                    placeholder="Secondary button"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Slide dots */}
          <div className={heroStyles.dots}>
            {c.hero.slides.map((_, i) => (
              <button
                key={i}
                className={`${heroStyles.dot} ${i === activeSlide ? heroStyles.dotActive : ""}`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          {activeSlide > 0 && (
            <button
              className={`${heroStyles.arrow} ${heroStyles.arrowPrev}`}
              onClick={() => setActiveSlide(p => p - 1)}
            >
              ‹
            </button>
          )}
          {activeSlide < c.hero.slides.length - 1 && (
            <button
              className={`${heroStyles.arrow} ${heroStyles.arrowNext}`}
              onClick={() => setActiveSlide(p => p + 1)}
            >
              ›
            </button>
          )}

          {/* Admin slide controls */}
          <div className={s.slideToolbar}>
            <span className={s.slideLabel}>
              Slide {activeSlide + 1} / {c.hero.slides.length}
            </span>
            <label className={s.slideControl}>
              Type
              <select
                value={slide?.type ?? "image"}
                onChange={e =>
                  patchSlide(activeSlide, { type: e.target.value as "image" | "video" })
                }
                className={s.slideSelect}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label className={s.slideControl}>
              Overlay {Math.round((slide?.overlayOpacity ?? 0.82) * 100)}%
              <input
                type="range"
                min={0.3}
                max={0.95}
                step={0.01}
                value={slide?.overlayOpacity ?? 0.82}
                onChange={e =>
                  patchSlide(activeSlide, { overlayOpacity: Number(e.target.value) })
                }
                className={s.slideRange}
              />
            </label>
            <label className={s.slideControl}>
              Auto-play
              <input
                type="checkbox"
                checked={c.hero.autoPlay}
                onChange={e => ps("hero", { autoPlay: e.target.checked })}
              />
            </label>
            <button className={s.addSlideBtn} onClick={addSlide}>
              + Add slide
            </button>
            {c.hero.slides.length > 1 && (
              <button className={s.removeSlideBtn} onClick={() => removeSlide(activeSlide)}>
                × Remove slide
              </button>
            )}
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════════ */}
        <section className={pageStyles.statsBar} aria-label="Key statistics">
          <div className={`container ${pageStyles.statsGrid}`}>
            {c.stats.map((stat, i) => (
              <SectionShell key={i} label={`Stat ${i + 1}`}>
                <div className={pageStyles.statItem}>
                  <div className={pageStyles.statValue}>
                    <EditableText
                      value={String(stat.value)}
                      onChange={v =>
                        mutate(c => {
                          const stats = [...c.stats];
                          stats[i] = { ...stats[i], value: Number(v) || 0 };
                          return { ...c, stats };
                        })
                      }
                    />
                    <EditableText
                      value={stat.suffix}
                      onChange={v =>
                        mutate(c => {
                          const stats = [...c.stats];
                          stats[i] = { ...stats[i], suffix: v };
                          return { ...c, stats };
                        })
                      }
                    />
                  </div>
                  <EditableText
                    value={stat.label}
                    onChange={v =>
                      mutate(c => {
                        const stats = [...c.stats];
                        stats[i] = { ...stats[i], label: v };
                        return { ...c, stats };
                      })
                    }
                    className={pageStyles.statLabel}
                  />
                </div>
              </SectionShell>
            ))}
          </div>
        </section>

        {/* ══ DELIVER ═══════════════════════════════════════════ */}
        <section className="section sectionAlt">
          <div className="container">
            <span className="pill">
              <EditableText
                value={c.deliver.badge}
                onChange={v => ps("deliver", { badge: v })}
              />
            </span>
            <EditableText
              value={c.deliver.heading}
              onChange={v => ps("deliver", { heading: v })}
              tag="h2"
              className={pageStyles.sectionHeading}
              multiline
            />
            <EditableText
              value={c.deliver.intro}
              onChange={v => ps("deliver", { intro: v })}
              tag="p"
              className={`muted ${pageStyles.sectionIntro}`}
              multiline
            />
            <SectionShell
              label="Service Cards"
              onAdd={() =>
                mutate(c => ({
                  ...c,
                  deliver: {
                    ...c.deliver,
                    cards: [
                      ...c.deliver.cards,
                      { icon: "⚡", title: "New Service", desc: "Describe this service.", href: "/services" },
                    ],
                  },
                }))
              }
              addLabel="Add card"
            >
              <div className={pageStyles.grid3}>
                {c.deliver.cards.map((card, i) => (
                  <SectionShell
                    key={i}
                    label={`Card ${i + 1}`}
                    onRemove={() =>
                      mutate(c => ({
                        ...c,
                        deliver: {
                          ...c.deliver,
                          cards: c.deliver.cards.filter((_, idx) => idx !== i),
                        },
                      }))
                    }
                  >
                    <div className={`card ${pageStyles.deliverCard}`}>
                      <EditableText
                        value={card.icon}
                        onChange={v => patchDeliverCard(i, { icon: v })}
                        className={pageStyles.deliverIcon}
                        placeholder="Emoji icon"
                      />
                      <EditableText
                        value={card.title}
                        onChange={v => patchDeliverCard(i, { title: v })}
                        tag="h3"
                        className={pageStyles.cardTitle}
                      />
                      <EditableText
                        value={card.desc}
                        onChange={v => patchDeliverCard(i, { desc: v })}
                        tag="p"
                        className={`muted ${pageStyles.cardDesc}`}
                        multiline
                      />
                      <span className={pageStyles.cardArrow}>Learn more →</span>
                    </div>
                  </SectionShell>
                ))}
              </div>
            </SectionShell>
          </div>
        </section>

        {/* ══ WHY VIZIA ═════════════════════════════════════════ */}
        <section className="section">
          <div className="container">
            <span className="pill">
              <EditableText
                value={c.why.badge}
                onChange={v => ps("why", { badge: v })}
              />
            </span>
            <EditableText
              value={c.why.heading}
              onChange={v => ps("why", { heading: v })}
              tag="h2"
              className={pageStyles.sectionHeading}
              multiline
            />
            <EditableText
              value={c.why.intro}
              onChange={v => ps("why", { intro: v })}
              tag="p"
              className={`muted ${pageStyles.sectionIntro}`}
              multiline
            />
            <SectionShell
              label="Differentiators"
              onAdd={() =>
                mutate(c => ({
                  ...c,
                  why: {
                    ...c.why,
                    items: [...c.why.items, { icon: "✦", title: "New Point", copy: "Why this matters." }],
                  },
                }))
              }
              addLabel="Add item"
            >
              <div className={pageStyles.grid5}>
                {c.why.items.map((item, i) => (
                  <SectionShell
                    key={i}
                    label={`Item ${i + 1}`}
                    onRemove={() =>
                      mutate(c => ({
                        ...c,
                        why: { ...c.why, items: c.why.items.filter((_, idx) => idx !== i) },
                      }))
                    }
                  >
                    <article className={`card ${pageStyles.diffCard}`}>
                      <EditableText
                        value={item.icon}
                        onChange={v => patchWhyItem(i, { icon: v })}
                        className={pageStyles.diffIcon}
                        placeholder="Icon"
                      />
                      <EditableText
                        value={item.title}
                        onChange={v => patchWhyItem(i, { title: v })}
                        tag="h3"
                        className={pageStyles.cardTitle}
                      />
                      <EditableText
                        value={item.copy}
                        onChange={v => patchWhyItem(i, { copy: v })}
                        tag="p"
                        className={`muted ${pageStyles.cardDesc}`}
                        multiline
                      />
                    </article>
                  </SectionShell>
                ))}
              </div>
            </SectionShell>
          </div>
        </section>

        {/* ══ INDUSTRIES ════════════════════════════════════════ */}
        <section className="section sectionAlt">
          <div className="container">
            <span className="pill">
              <EditableText
                value={c.industries.badge}
                onChange={v => ps("industries", { badge: v })}
              />
            </span>
            <EditableText
              value={c.industries.heading}
              onChange={v => ps("industries", { heading: v })}
              tag="h2"
              className={pageStyles.sectionHeading}
              multiline
            />
            <EditableText
              value={c.industries.intro}
              onChange={v => ps("industries", { intro: v })}
              tag="p"
              className={`muted ${pageStyles.sectionIntro}`}
              multiline
            />
            <SectionShell
              label="Industry Cards"
              onAdd={() =>
                mutate(c => ({
                  ...c,
                  industries: {
                    ...c.industries,
                    items: [
                      ...c.industries.items,
                      { name: "New Industry", icon: "🏢", desc: "Description." },
                    ],
                  },
                }))
              }
              addLabel="Add industry"
            >
              <div className={pageStyles.grid3}>
                {c.industries.items.map((ind, i) => (
                  <SectionShell
                    key={i}
                    label={`Industry ${i + 1}`}
                    onRemove={() =>
                      mutate(c => ({
                        ...c,
                        industries: {
                          ...c.industries,
                          items: c.industries.items.filter((_, idx) => idx !== i),
                        },
                      }))
                    }
                  >
                    <article className={`card ${pageStyles.industryCard}`}>
                      <EditableText
                        value={ind.icon}
                        onChange={v => patchIndustryItem(i, { icon: v })}
                        className={pageStyles.industryIcon}
                        placeholder="Icon"
                      />
                      <EditableText
                        value={ind.name}
                        onChange={v => patchIndustryItem(i, { name: v })}
                        tag="h3"
                        className={pageStyles.cardTitle}
                      />
                      <EditableText
                        value={ind.desc}
                        onChange={v => patchIndustryItem(i, { desc: v })}
                        tag="p"
                        className={`muted ${pageStyles.cardDesc}`}
                        multiline
                      />
                    </article>
                  </SectionShell>
                ))}
              </div>
            </SectionShell>
          </div>
        </section>

        {/* ══ TECH STACK ════════════════════════════════════════ */}
        <section className="section">
          <div className="container">
            <span className="pill">
              <EditableText
                value={c.stack.badge}
                onChange={v => ps("stack", { badge: v })}
              />
            </span>
            <EditableText
              value={c.stack.heading}
              onChange={v => ps("stack", { heading: v })}
              tag="h2"
              className={pageStyles.sectionHeading}
              multiline
            />
            <EditableText
              value={c.stack.intro}
              onChange={v => ps("stack", { intro: v })}
              tag="p"
              className={`muted ${pageStyles.sectionIntro}`}
              multiline
            />
            <SectionShell
              label="Stack Categories"
              onAdd={() =>
                mutate(c => ({
                  ...c,
                  stack: {
                    ...c.stack,
                    items: [...c.stack.items, { title: "New Category", items: ["Technology"] }],
                  },
                }))
              }
              addLabel="Add category"
            >
              <div className={pageStyles.stackGrid}>
                {c.stack.items.map((cat, i) => (
                  <SectionShell
                    key={i}
                    label={`Category ${i + 1}`}
                    onRemove={() =>
                      mutate(c => ({
                        ...c,
                        stack: {
                          ...c.stack,
                          items: c.stack.items.filter((_, idx) => idx !== i),
                        },
                      }))
                    }
                  >
                    <article className={`card ${pageStyles.stackCard}`}>
                      <EditableText
                        value={cat.title}
                        onChange={v => patchStackCat(i, { title: v })}
                        tag="h3"
                        className={pageStyles.stackTitle}
                      />
                      <ul className={pageStyles.stackList}>
                        {cat.items.map((it, j) => (
                          <li key={j} className={pageStyles.stackItem}>
                            <span className={pageStyles.stackDot} />
                            <EditableText
                              value={it}
                              onChange={v => {
                                const items = [...cat.items];
                                items[j] = v;
                                patchStackCat(i, { items });
                              }}
                            />
                            <button
                              className={s.inlineRemoveBtn}
                              onClick={() => {
                                const items = cat.items.filter((_, idx) => idx !== j);
                                patchStackCat(i, { items });
                              }}
                              title="Remove"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={s.inlineAddBtn}
                        onClick={() => patchStackCat(i, { items: [...cat.items, "New item"] })}
                      >
                        + Add item
                      </button>
                    </article>
                  </SectionShell>
                ))}
              </div>
            </SectionShell>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
        <section className="section sectionAlt">
          <div className="container">
            <span className="pill">
              <EditableText
                value={c.testimonials.badge}
                onChange={v => ps("testimonials", { badge: v })}
              />
            </span>
            <EditableText
              value={c.testimonials.heading}
              onChange={v => ps("testimonials", { heading: v })}
              tag="h2"
              className={pageStyles.sectionHeading}
              multiline
            />
            <EditableText
              value={c.testimonials.intro}
              onChange={v => ps("testimonials", { intro: v })}
              tag="p"
              className={`muted ${pageStyles.sectionIntro}`}
              multiline
            />
            <SectionShell
              label="Testimonials"
              onAdd={() =>
                mutate(c => ({
                  ...c,
                  testimonials: {
                    ...c.testimonials,
                    items: [
                      ...c.testimonials.items,
                      { quote: "Excellent work!", name: "Client Name", org: "Company", initials: "CN" },
                    ],
                  },
                }))
              }
              addLabel="Add testimonial"
            >
              <div className={pageStyles.grid3}>
                {c.testimonials.items.map((t, i) => (
                  <SectionShell
                    key={i}
                    label={`Testimonial ${i + 1}`}
                    onRemove={() =>
                      mutate(c => ({
                        ...c,
                        testimonials: {
                          ...c.testimonials,
                          items: c.testimonials.items.filter((_, idx) => idx !== i),
                        },
                      }))
                    }
                  >
                    <figure className={`card ${pageStyles.testimonialCard}`}>
                      <div className={pageStyles.quoteIcon}>"</div>
                      <blockquote>
                        <EditableText
                          value={t.quote}
                          onChange={v => patchTestimonial(i, { quote: v })}
                          tag="p"
                          className={`muted ${pageStyles.quoteText}`}
                          multiline
                        />
                      </blockquote>
                      <figcaption className={pageStyles.testimonialMeta}>
                        <div className={pageStyles.avatar}>
                          <EditableText
                            value={t.initials}
                            onChange={v => patchTestimonial(i, { initials: v })}
                            placeholder="AB"
                          />
                        </div>
                        <div>
                          <EditableText
                            value={t.name}
                            onChange={v => patchTestimonial(i, { name: v })}
                            tag="strong"
                            className={pageStyles.testimonialName}
                          />
                          <EditableText
                            value={t.org}
                            onChange={v => patchTestimonial(i, { org: v })}
                            tag="span"
                            className={`muted ${pageStyles.testimonialOrg}`}
                          />
                        </div>
                      </figcaption>
                    </figure>
                  </SectionShell>
                ))}
              </div>
            </SectionShell>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════ */}
        <section className="section">
          <div className="container">
            <div className={pageStyles.ctaCard}>
              <div className={pageStyles.ctaGlow} aria-hidden="true" />
              <span className="pill">
                <EditableText
                  value={c.cta.badge}
                  onChange={v => ps("cta", { badge: v })}
                />
              </span>
              <EditableText
                value={c.cta.heading}
                onChange={v => ps("cta", { heading: v })}
                tag="h2"
                className={pageStyles.ctaHeading}
                multiline
              />
              <EditableText
                value={c.cta.copy}
                onChange={v => ps("cta", { copy: v })}
                tag="p"
                className={`muted ${pageStyles.ctaCopy}`}
                multiline
              />
              <div className={pageStyles.ctaActions}>
                <span className="btn btnPrimary">Book Consultation</span>
                <span className="btn">View All Services</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CONTACT ═══════════════════════════════════════════ */}
        <section className="section sectionAlt">
          <div className="container">
            <span className="pill">Contact Info</span>
            <h2 className={pageStyles.sectionHeading}>Contact Details</h2>
            <p className={`muted ${pageStyles.sectionIntro}`}>
              Update your contact information — changes appear site-wide.
            </p>
            <div className={s.contactGrid}>
              <div className={s.contactField}>
                <span className={s.contactLabel}>Email address</span>
                <EditableText
                  value={c.contact.email}
                  onChange={v => ps("contact", { email: v })}
                  className={s.contactValue}
                  placeholder="your@email.com"
                />
              </div>
              <div className={s.contactField}>
                <span className={s.contactLabel}>Phone numbers</span>
                <div className={s.phoneList}>
                  {c.contact.phones.map((ph, i) => (
                    <div key={i} className={s.phoneRow}>
                      <EditableText
                        value={ph}
                        onChange={v =>
                          mutate(c => {
                            const phones = [...c.contact.phones];
                            phones[i] = v;
                            return { ...c, contact: { ...c.contact, phones } };
                          })
                        }
                        className={s.contactValue}
                        placeholder="+1 555 000 0000"
                      />
                      <button
                        className={s.inlineRemoveBtn}
                        onClick={() =>
                          mutate(c => ({
                            ...c,
                            contact: {
                              ...c.contact,
                              phones: c.contact.phones.filter((_, idx) => idx !== i),
                            },
                          }))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className={s.inlineAddBtn}
                    onClick={() =>
                      mutate(c => ({
                        ...c,
                        contact: { ...c.contact, phones: [...c.contact.phones, ""] },
                      }))
                    }
                  >
                    + Add phone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacer */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
