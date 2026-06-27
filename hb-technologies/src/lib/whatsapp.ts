export const WHATSAPP_BUSINESS_NUMBER = "254724121679";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello VIZIA Technologies,\n\nI would like to inquire about your services. I am interested in discussing a potential project and would appreciate more information.\n\nPlease let me know how we can proceed.\n\nThank you.";

export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}
