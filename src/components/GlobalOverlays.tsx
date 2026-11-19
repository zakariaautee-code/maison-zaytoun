"use client";

import CartDrawer from "@/components/CartDrawer";
import ReservationModal from "@/components/ReservationModal";
import Toast from "@/components/Toast";
import { useUI } from "@/lib/store";

/** Route-independent overlays: reservation and transient feedback only. */
export default function GlobalOverlays() {
  const reserveOpen = useUI((s) => s.reserveOpen);
  const closeReserve = useUI((s) => s.closeReserve);

  return (
    <>
      <Toast />
      <CartDrawer />
      <ReservationModal open={reserveOpen} onClose={closeReserve} />
    </>
  );
}
