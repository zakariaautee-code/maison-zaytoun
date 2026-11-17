import type { Metadata } from "next";
import AdminPanel from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Owner Demo — Maison Zaytoun",
  description: "Live owner demo panel for the Maison Zaytoun digital menu pitch.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
