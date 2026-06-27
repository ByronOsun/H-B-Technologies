"use client";

/**
 * Lightweight inline-editing primitives used only inside the visual admin.
 */

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import s from "./editor.module.css";

/* ── EditableText ──────────────────────────────────────────────────
   Renders its children as plain text in edit mode.
   onBlur / Enter commits the change. Click to activate.
*/
interface ETextProps {
  value: string;
  onChange: (v: string) => void;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onChange,
  tag: Tag = "span",
  className = "",
  multiline = false,
  placeholder = "Click to edit…",
}: ETextProps) {
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);

  /* Sync external value into the DOM when not editing */
  useEffect(() => {
    if (!editing && ref.current) {
      ref.current.textContent = value;
    }
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const text = ref.current?.textContent ?? "";
    if (text !== value) onChange(text);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!multiline && e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { if (ref.current) ref.current.textContent = value; setEditing(false); }
  };

  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={editing}
      className={`${s.editableText} ${editing ? s.editing : ""} ${className}`}
      data-placeholder={placeholder}
      onClick={() => { if (!editing) { setEditing(true); setTimeout(() => ref.current?.focus(), 0); } }}
      onBlur={commit}
      onKeyDown={onKeyDown}
    >
      {value || <span className={s.placeholder}>{placeholder}</span>}
    </Tag>
  );
}

/* ── EditableImage ─────────────────────────────────────────────────
   Shows the image with a "Change" overlay on hover.
   Clicking opens an inline URL input.
*/
interface EImgProps {
  src: string;
  alt?: string;
  onChange: (url: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableImage({ src, alt = "", onChange, className = "", style }: EImgProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(src);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(src); }, [src]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const apply = () => { onChange(draft); setOpen(false); };

  return (
    <div className={`${s.editableImgWrap} ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || "https://placehold.co/1920x1080/111/333?text=No+image"} alt={alt} className={s.editableImg} />
      <div className={s.imgOverlay} onClick={() => setOpen(true)}>
        <span className={s.imgOverlayBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 2.5a1.5 1.5 0 010 2.12L5.83 11.8 2 12.5l.7-3.83L10.88 1A1.5 1.5 0 0113 2.5z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
          </svg>
          Change {src ? "image" : "→ add image"}
        </span>
      </div>
      {open && (
        <div className={s.imgDialog}>
          <p className={s.imgDialogLabel}>Image or video URL</p>
          <input
            ref={inputRef}
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") apply(); if (e.key === "Escape") setOpen(false); }}
            className={s.imgDialogInput}
            placeholder="https://..."
          />
          {draft && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft} alt="preview" className={s.imgDialogPreview} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <div className={s.imgDialogActions}>
            <button className={s.applyBtn} onClick={apply}>Apply</button>
            <button className={s.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── EditableList ──────────────────────────────────────────────────
   For arrays of strings (e.g., stack items, phone numbers).
*/
interface EListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function EditableList({ items, onChange, placeholder = "Add item…", className = "" }: EListProps) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <ul className={`${s.editableList} ${className}`}>
      {items.map((item, i) => (
        <li key={i} className={s.editableListItem}>
          <EditableText
            value={item}
            onChange={(v) => update(i, v)}
            placeholder={placeholder}
            className={s.editableListText}
          />
          <button className={s.removeItemBtn} onClick={() => remove(i)} title="Remove">×</button>
        </li>
      ))}
      <li>
        <button className={s.addItemBtn} onClick={add}>+ Add</button>
      </li>
    </ul>
  );
}

/* ── SectionShell ──────────────────────────────────────────────────
   Wraps a section with a labeled outline and add/remove controls.
*/
interface ShellProps {
  label: string;
  children: ReactNode;
  className?: string;
  onAdd?: () => void;
  addLabel?: string;
  onRemove?: () => void;
}

export function SectionShell({ label, children, className = "", onAdd, addLabel = "Add item", onRemove }: ShellProps) {
  return (
    <div className={`${s.sectionShell} ${className}`}>
      <div className={s.sectionShellLabel}>
        {label}
        {onRemove && (
          <button className={s.sectionRemoveBtn} onClick={onRemove} title="Remove">×</button>
        )}
      </div>
      {children}
      {onAdd && (
        <button className={s.sectionAddBtn} onClick={onAdd}>+ {addLabel}</button>
      )}
    </div>
  );
}
