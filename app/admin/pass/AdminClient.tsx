"use client";

import React, { useEffect, useState } from "react";
import { Users, Trash2, X } from "lucide-react";

interface Invitado {
  id: string;
  nombre: string;
  mensaje: string | null;
  fechaHora: string;
}

export default function AdminClient() {
  const [invitados, setInvitados] = useState<Invitado[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [modalInvitado, setModalInvitado] = useState<Invitado | null>(null);

  // borrar
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Invitado[] = await res.json();
        setInvitados(data);
      } catch (e: any) {
        console.error("Error fetching guests:", e);
        setError("No se pudo cargar la lista de invitados");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openView = (inv: Invitado) => {
    setModalInvitado(inv);
    setOpenModal(true);
  };

  const closeView = () => {
    setOpenModal(false);
    setModalInvitado(null);
  };

  const borrarInvitado = async (id: string) => {
    setActionError(null);
    const confirmar = window.confirm("¿Eliminar este mensaje/confirmación? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Error HTTP ${res.status}`);
      }
      setInvitados((prev) => (prev ? prev.filter((x) => x.id !== id) : prev));
    } catch (e: any) {
      console.error(e);
      setActionError(e?.message || "No se pudo eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
              Panel privado — Invitados
            </h1>
            <p className="text-sm text-muted-foreground">
              Solo tú puedes ver esta página.
            </p>
          </div>

          {loading && (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="col-span-full max-w-2xl mx-auto bg-card border border-destructive/30 text-destructive rounded-2xl p-4 text-center">
              {error}
            </div>
          )}

          {actionError && (
            <div className="col-span-full max-w-2xl mx-auto bg-card border border-destructive/30 text-destructive rounded-2xl p-4 text-center mb-6">
              {actionError}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(!invitados || invitados.length === 0) ? (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                    <Users className="w-10 h-10 text-accent" />
                  </div>
                  <p className="text-muted-foreground text-lg">Aún no hay confirmaciones</p>
                  <p className="text-muted-foreground text-sm mt-2">¡Cuando confirmen aparecerán aquí!</p>
                </div>
              ) : (
                invitados.map((invitado) => (
                  <article
                    key={invitado.id}
                    onClick={() => openView(invitado)}
                    className="bg-card rounded-2xl p-6 elegant-shadow hover:elegant-shadow-lg transition-all duration-300 cursor-pointer border border-accent/10 hover:border-accent/30 group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                        <span className="text-accent font-bold text-lg">
                          {invitado.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-1 truncate">
                          {invitado.nombre}
                        </h3>
                        <time className="text-xs text-muted-foreground">{invitado.fechaHora}</time>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          borrarInvitado(invitado.id);
                        }}
                        className="btn-outline px-3 py-1 rounded-full flex items-center gap-2 text-[0.85rem]"
                        aria-label="Eliminar"
                        title="Eliminar"
                        disabled={deletingId === invitado.id}
                      >
                        <Trash2 className="w-4 h-4 chart-1" />
                        {deletingId === invitado.id ? "Eliminando..." : ""}
                      </button>
                    </div>

                    {invitado.mensaje ? (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {invitado.mensaje}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Sin mensaje.
                      </p>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* MODAL VER COMPLETO (se abre al clickear la tarjeta) */}
      {openModal && modalInvitado && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeView}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-2xl w-full relative border border-accent/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeView}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-lg">
                  {modalInvitado.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-2xl font-bold text-foreground truncate">
                  {modalInvitado.nombre}
                </h2>
                <time className="text-xs text-muted-foreground">{modalInvitado.fechaHora}</time>
              </div>
            </div>

            <div className="bg-accent/5 rounded-xl p-5 border border-accent/10">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {modalInvitado.mensaje || "Sin mensaje."}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
