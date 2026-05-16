import styles from "./WhatsAppLink.module.css";
import { getWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  className?: string;
  label: string;
  message?: string;
  ariaLabel?: string;
  target?: "_blank" | "_self";
  variant?: "button" | "inline";
};

export function WhatsAppLink({
  className = "",
  label,
  message = WHATSAPP_DEFAULT_MESSAGE,
  ariaLabel = "Chat with H&B Technologies on WhatsApp",
  target = "_blank",
  variant = "button",
}: WhatsAppLinkProps) {
  const href = getWhatsAppUrl(message);

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={`${styles.base} ${styles[variant]} ${className}`.trim()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        focusable="false"
        className={styles.icon}
      >
        <path d="M20.5 3.5A10.3 10.3 0 0 0 12.1 0C6.4 0 1.8 4.6 1.8 10.3c0 2 0.5 3.8 1.5 5.4L1 24l8.5-2.2a10.2 10.2 0 0 0 4.9 1.2h.1c5.7 0 10.3-4.6 10.3-10.3 0-2.8-1.1-5.5-3.1-7.4Zm-8.4 18a8.3 8.3 0 0 1-4.2-1.1l-.3-.2-5 1.3 1.3-4.9-.2-.3a8.4 8.4 0 0 1-1.3-4.4c0-4.6 3.7-8.3 8.3-8.3 2.2 0 4.3.9 5.8 2.4a8.1 8.1 0 0 1 2.4 5.8c0 4.6-3.7 8.3-8.3 8.3Zm4.8-6.3c-.3-.1-1.8-.9-2-1s-.4-.1-.6.1-.7 1-.9 1.2c-.2.2-.3.2-.6.1a6.9 6.9 0 0 1-2.1-1.3 7.9 7.9 0 0 1-1.4-1.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5 0-.1 0-.3-.1-.4s-.6-1.4-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.1.9 2.2c.1.1 1.6 2.5 3.9 3.5 2.3 1 2.3.7 2.7.7s1.4-.6 1.6-1.1c.2-.5.2-.9.1-1 0-.1-.2-.2-.5-.3Z" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
