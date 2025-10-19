export const dynamic = "force-dynamic";
export const revalidate = 0;

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(
    guests.map((g: { id: string; name: string; message: string | null; createdAt: Date }) => ({
      id: g.id,
      nombre: g.name,
      mensaje: g.message,
      fechaHora: new Date(g.createdAt).toLocaleString("es-ES"),
    }))
  );
}

export async function POST(req: Request) {
  const { nombre, mensaje } = await req.json();
  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }
  const created = await prisma.guest.create({
    data: { name: nombre.trim(), message: (mensaje ?? "").trim() },
  });
  return NextResponse.json({
    id: created.id,
    nombre: created.name,
    mensaje: created.message,
    fechaHora: new Date(created.createdAt).toLocaleString("es-ES"),
  });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el id" }, { status: 400 });
    }

    await prisma.guest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/guests error:", e);
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}
