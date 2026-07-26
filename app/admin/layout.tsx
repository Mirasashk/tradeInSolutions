"use client";

import { AuthProvider } from "@/components/admin/AuthProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminToaster } from "@/components/admin/AdminToaster";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>
        {children}
        <AdminToaster />
      </AdminLayout>
    </AuthProvider>
  );
}
