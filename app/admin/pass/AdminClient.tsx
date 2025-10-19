"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setInvitados(data);
      } catch (e: any) {
        console.error("Error fetching guests:", e);
        setError("No se pudo cargar la lista de invitados");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
                    className="bg-card rounded-2xl p-6 elegant-shadow hover:elegant-shadow-lg transition-all duration-300 border border-accent/10 hover:border-accent/30 group"
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
                    </div>

                    {invitado.mensaje ? (
                      <p className="text-muted-foreground text-sm leading-relaxed">
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
    </main>
  );
}
