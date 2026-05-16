import styles from "./FloatingWhatsAppButton.module.css";
import { WhatsAppLink } from "./WhatsAppLink";

export function FloatingWhatsAppButton() {
  return (
    <div className={styles.floatingWrap} aria-hidden="false">
      <WhatsAppLink
        label="WhatsApp"
        ariaLabel="Chat with H&B Technologies on WhatsApp"
        className={styles.floatingButton}
      />
    </div>
  );
}
