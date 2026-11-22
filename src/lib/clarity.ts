/** Typed wrapper around the global function installed by the Clarity script. */

export type ClarityEventName =
  | "whatsapp_click"
  | "phone_call_click"
  | "reserve_click"
  | "order_click"
  | "book_now_click";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function clarityEvent(name: ClarityEventName): void {
  if (typeof window === "undefined") return;
  window.clarity?.("event", name);
}
