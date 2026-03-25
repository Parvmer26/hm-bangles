export const BUSINESS = {
  name: "HM Bangles",
  location: "Rajkot, Gujarat",
  whatsappNumber: "919427271597",
  returnWindowDays: 3,
}

export const BANGLE_SIZES = ["2.2", "2.4", "2.6", "2.8", "2.10", "2.12"]

export const SHIPPING = {
  chargePaise: 9900,
  chargeDisplay: "₹99",
  estimatedDays: "3–6 business days",
}

export function buildWhatsAppOrderLink(orderNumber: string) {
  const message = encodeURIComponent(
    `Hi HM Bangles! 👋\n\nI just placed an order.\nOrder: ${orderNumber}\n\nPlease confirm.`
  )
  return `https://wa.me/919427271597?text=${message}`
}

export function buildWhatsAppSupportLink(orderNumber?: string) {
  const message = encodeURIComponent(
    orderNumber
      ? `Hi HM Bangles! I need help with order #${orderNumber}.`
      : `Hi HM Bangles! I have a question.`
  )
  return `https://wa.me/919427271597?text=${message}`
}

export function generateOrderNumber(): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `HMB-${d}-${rand}`
}