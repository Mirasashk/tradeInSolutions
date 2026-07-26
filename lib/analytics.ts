type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function sendEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, params);
  } else if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

export function trackPhoneClick(location: string) {
  sendEvent("click_phone", { location });
}

export function trackAddressClick(location: string) {
  sendEvent("click_address", { location });
}

export function trackFormStart(formName: string) {
  sendEvent("form_start", { form_name: formName });
}

export function trackFormSubmit(formName: string) {
  sendEvent("form_submit", { form_name: formName });
}

export function trackAppointmentBooked() {
  sendEvent("appointment_booked", { form_name: "appointment" });
}

export function trackCtaClick(label: string) {
  sendEvent("cta_click", { cta_label: label });
}

export function trackOutboundClick(destination: string) {
  sendEvent("outbound_click", { link_destination: destination });
}

export function trackScrollDepth(depth: 50 | 90) {
  sendEvent(`scroll_${depth}`, { scroll_depth: depth });
}

export function initScrollTracking() {
  if (typeof window === "undefined") return;

  const fired = { 50: false, 90: false };

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const pct = (scrollTop / docHeight) * 100;
    if (pct >= 50 && !fired[50]) {
      fired[50] = true;
      trackScrollDepth(50);
    }
    if (pct >= 90 && !fired[90]) {
      fired[90] = true;
      trackScrollDepth(90);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
