"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Music, Users, Heart, DollarSign, Shirt, ExternalLink } from "lucide-react"
import { PhotoCarousel } from "@/components/photo-carousel"
import Image from "next/image"
import img1 from "@/public/image1.jpg"
import img2 from "@/public/image2.jpg"
import img3 from "@/public/image3.jpg"
import img4 from "@/public/image4.jpg"
import img5 from "@/public/image5.jpg"
import img6 from "@/public/image6.jpg"



interface Invitado {
  id: string
  nombre: string
  mensaje: string
  fechaHora: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Home() {
  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [nombre, setNombre] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState<Invitado | null>(null)
  const [error, setError] = useState("")
  const [pantallaActual, setPantallaActual] = useState<"hero" | "formulario">("hero")
  const [transicionando, setTransicionando] = useState(false)

  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; delay: number }>>([])

  useEffect(() => {
    const cargarInvitados = async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" })
        const data: Invitado[] = await res.json()
        setInvitados(data)
      } catch (e) {
        console.error("Error cargando invitados:", e)
      }
    }
    cargarInvitados()
  }, [])

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)

    const generatedStars = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
    }))
    setStars(generatedStars)
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date("2025-12-07T15:00:00").getTime()
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleConfirm = () => {
    setIsClicked(true)
    setTransicionando(true)
    setTimeout(() => {
      setPantallaActual("formulario")
      setTransicionando(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 600)
    setTimeout(() => setIsClicked(false), 1200)
  }

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nombre.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), mensaje: mensaje.trim() }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error desconocido" }))
        setError(err?.error || "No se pudo guardar")
        return
      }

      const nuevoInvitado: Invitado = await res.json()
      setInvitados((prev) => [nuevoInvitado, ...prev])
      setNombre("")
      setMensaje("")

      setTransicionando(true)
      setTimeout(() => {
        setPantallaActual("hero")
        setTransicionando(false)
        setTimeout(() => {
          const invitadosSection = document.getElementById("seccion-invitados")
          if (invitadosSection) {
            invitadosSection.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 100)
      }, 300)
    } catch {
      setError("Error de red")
    }
  }

  const volverAlHero = () => {
    setTransicionando(true)
    setTimeout(() => {
      setPantallaActual("hero")
      setTransicionando(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 300)
  }

  const abrirModal = (invitado: Invitado) => setInvitadoSeleccionado(invitado)
  const cerrarModal = () => setInvitadoSeleccionado(null)

  if (!mounted) return null

  const eventDetails = [
    {
      icon: Calendar,
      label: "Fecha",
      value: "7 de Diciembre, 2025",
      subtext: "3:00 PM",
      link: "", // Deja vacío si no quieres link
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: "Eventos mágicos",
      subtext: "Bo San Valentín, San José, San Rafael, 11901",
      link: "https://maps.google.com/?q=Eventos+Magicos+San+Rafael", // Ejemplo
    },
    {
      icon: DollarSign,
      label: "Lo importante es que estés a mi lado en mi celebración, pero si deseas darme una muestra de cariño, te agradeceré un regalo en efectivo, que me ayude a seguir soñando en grande",
      value: "",
      subtext: "",
      link: "",
    },
  ]

  const galleryImages = [
    {
      id: 1,
      title: "",
      url: img1.src
    },
    {
      id: 2,
      title: "",
      url: img2.src
    },
    {
      id: 3,
      title: "",
      url: img3.src
    },
    {
      id: 4,
      title: "",
      url: img4.src
    },
    {
      id: 5,
      title: "",
      url: img5.src
    },
    {
      id: 6,
      title: "",
      url: img6.src
    }
  ]

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl" />
        <div className="relative bg-card border-2 border-accent/30 rounded-2xl p-6 md:p-8 min-w-20 md:min-w-24 elegant-shadow">
          <span className="font-serif text-4xl md:text-5xl font-bold text-accent">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  )

  return (
    <main className="min-h-screen bg-background stars-pattern overflow-hidden relative">
      {/* Estrellas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-accent rounded-full animate-sparkle opacity-60"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-accent/20 opacity-30 animate-float blur-sm" />
        <div className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-accent/30 opacity-40 animate-float blur-md" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-accent/25 opacity-25 animate-float blur-sm" style={{ animationDelay: "2s" }} />
      </div>

      {/* HERO */}
      {pantallaActual === "hero" && (
        <>
          <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Te invito a compartir conmigo la alegría de</p>
              </div>

              <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground leading-tight">
                  <span className="relative inline-block">
                    Mis quince
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent">
                    Años
                  </span>
                </h1>
              </div>

              <div className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent" />
              </div>

              <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  Mis padres y yo hemos preparado con mucho cariño una noche inolvidable y tu presencia la haría aún más especial.
                </p>
              </div>
            </div>
          </section>

          {/* Cuenta regresiva */}
          <section className="relative px-4 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">¿Cuánto falta?</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <TimeUnit value={timeLeft.days} label="Días" />
                <TimeUnit value={timeLeft.hours} label="Horas" />
                <TimeUnit value={timeLeft.minutes} label="Minutos" />
                <TimeUnit value={timeLeft.seconds} label="Segundos" />
              </div>
            </div>
          </section>

          {/* Detalles - CENTRADO AUTOMÁTICO */}
          <section className="relative py-20 px-4 bg-gradient-to-b from-background via-background to-accent/5">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Detalles de mi gran noche</h2>
              </div>

              {/* Grid que se centra automáticamente según la cantidad de elementos */}
              <div className="flex flex-wrap justify-center gap-6">
                {eventDetails.map((detail, index) => {
                  const Icon = detail.icon
                  const hasLink = detail.link && detail.link.trim() !== ""

                  const CardContent = (
                    <div className="relative bg-card border border-accent/20 rounded-2xl p-8 text-center elegant-shadow group-hover:elegant-shadow-lg transition-all duration-300 group-hover:border-accent/40 h-full">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 mb-4 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">{detail.label}</p>
                      {detail.value && <h3 className="font-serif text-2xl font-bold text-foreground mb-1">{detail.value}</h3>}
                      {detail.subtext && <p className="text-sm text-muted-foreground">{detail.subtext}</p>}
                      {hasLink && (
                        <div className="mt-4 inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:underline">
                          <span>Ver ubicación</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  )

                  return (
                    <div
                      key={index}
                      className="group relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                      {hasLink ? (
                        <a
                          href={detail.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          {CardContent}
                        </a>
                      ) : (
                        CardContent
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Galería */}
          <section className="relative py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Cada imagen guarda un pedacito de su historia.</h2>
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground/70 mt-4">Celebramos no solo sus 15 años, sino el hermoso camino que ha recorrido hasta aquí.</h3>
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground/70 mt-4"></h3>
              </div>

              <section className="overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                  <PhotoCarousel images={galleryImages} />
                </div>
              </section>


            </div>
          </section>

          {/* CTA */}
          <section className="relative py-24 px-4 bg-gradient-to-t from-accent/10 via-background to-background">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div>
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">¿Listo para la Fiesta?</h2>
                <p className="text-lg text-muted-foreground">Confirma tu asistencia antes del <div className="mt-4 inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:underline">15 de noviembre</div> y prepárate para una noche inolvidable</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                  onClick={handleConfirm}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`relative px-8 py-4 rounded-full font-semibold text-lg text-accent-foreground transition-all duration-300 transform ${isClicked ? "scale-95" : isHovered ? "scale-105 shadow-2xl" : "scale-100"}`}
                  style={{
                    background: "linear-gradient(135deg, var(--french-violet) 0%, var(--heliotrope) 100%)",
                    boxShadow: isHovered ? "0 20px 40px rgba(123, 44, 191, 0.4)" : "0 10px 20px rgba(123, 44, 191, 0.2)",
                  }}
                >
                  <span className="relative flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${isClicked ? "fill-current" : ""}`} />
                    {isClicked ? "¡Confirmado!" : "Confirmar Asistencia"}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* QUIENES NOS ACOMPAÑAN */}
          <section id="seccion-invitados" className="relative py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Quienes nos acompañan</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitados.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                      <Users className="w-10 h-10 text-accent" />
                    </div>
                    <p className="text-muted-foreground text-lg">Aún no hay confirmaciones</p>
                    <p className="text-muted-foreground text-sm mt-2">¡Sé el primero en confirmar tu asistencia!</p>
                  </div>
                ) : (
                  invitados.map((invitado) => (
                    <div
                      key={invitado.id}
                      className="bg-card rounded-2xl p-6 elegant-shadow hover:elegant-shadow-lg transition-all duration-300 cursor-pointer border border-accent/10 hover:border-accent/30 group"
                      onClick={() => abrirModal(invitado)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                          <span className="text-accent font-bold text-lg">{invitado.nombre.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-1 truncate">{invitado.nombre}</h3>
                          <p className="text-xs text-muted-foreground">{invitado.fechaHora}</p>
                        </div>
                      </div>
                      {invitado.mensaje && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {invitado.mensaje}
                        </p>
                      )}
                      {invitado.mensaje && invitado.mensaje.length > 100 && (
                        <button className="text-accent text-sm font-semibold mt-2 hover:underline">
                          Ver más
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FORMULARIO */}
      {pantallaActual === "formulario" && (
        <div className={`min-h-screen flex items-center justify-center px-4 py-20 ${transicionando ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
          <div className="max-w-2xl w-full bg-card rounded-3xl shadow-2xl p-8 md:p-12 border border-accent/20">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-center mb-4">Confirma tu Asistencia</h1>
            <p className="text-muted-foreground text-center mb-8">Recuerda confirmar tu asistencia antes del 15 de noviembre</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-foreground mb-2">Nombre *</label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-accent focus:outline-none transition-colors bg-background text-foreground"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                />
                {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-foreground mb-2">Mensaje para la quinceañera</label>
                <textarea
                  id="mensaje"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-accent focus:outline-none transition-colors resize-none bg-background text-foreground"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe un mensaje especial (opcional)"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => { e.preventDefault(); manejarEnvio(e); }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold text-accent-foreground transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--french-violet) 0%, var(--heliotrope) 100%)",
                    boxShadow: "0 10px 20px rgba(123, 44, 191, 0.2)",
                  }}
                >
                  Voy a asistir
                </button>
                <button
                  onClick={volverAlHero}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-border text-foreground hover:bg-muted transition-all duration-300"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {invitadoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={cerrarModal}>
          <div className="bg-card rounded-2xl p-8 max-w-2xl w-full elegant-shadow-lg relative animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-all duration-200"
              onClick={cerrarModal}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-2xl">{invitadoSeleccionado.nombre.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">{invitadoSeleccionado.nombre}</h2>
                <p className="text-sm text-muted-foreground mt-1">{invitadoSeleccionado.fechaHora}</p>
              </div>
            </div>

            {invitadoSeleccionado.mensaje && (
              <div className="bg-accent/5 rounded-xl p-6 border border-accent/10">
                <p className="text-foreground text-lg leading-relaxed">{invitadoSeleccionado.mensaje}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}