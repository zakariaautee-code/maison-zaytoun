"use client";

import CartBar from "@/components/CartBar";
import CartDrawer from "@/components/CartDrawer";
import FloatingActions from "@/components/FloatingActions";
import ReservationModal from "@/components/ReservationModal";
import Toast from "@/components/Toast";
import { useUI } from "@/lib/store";

/** Route-independent overlays so cart and reservation work everywhere. */
export default function GlobalOverlays() {
  const cartOpen = useUI((s) => s.cartOpen);
  const reserveOpen = useUI((s) => s.reserveOpen);
  const closeCart = useUI((s) => s.closeCart);
  const closeReserve = useUI((s) => s.closeReserve);
  const openCart = useUI((s) => s.openCart);

  return (
    <>
      <CartBar onOpenCart={openCart} />
      <FloatingActions />
      <Toast />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <ReservationModal open={reserveOpen} onClose={closeReserve} />
    </>
  );
}
