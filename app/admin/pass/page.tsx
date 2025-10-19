// app/admin/pass/page.tsx
import { notFound } from "next/navigation";
import AdminClient from "@/app/admin/pass/AdminClient";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function AdminPage({ searchParams }: Props) {
  const provided = Array.isArray(searchParams?.p) ? searchParams?.p[0] : searchParams?.p;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    console.error("ADMIN_SECRET no está configurado en variables de entorno");
    return notFound();
  }

  if (!provided || provided !== secret) {
    return notFound();
  }

  return <AdminClient />;
}
