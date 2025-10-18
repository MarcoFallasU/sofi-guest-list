import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Quince Años de Sofía",
  description: "Te invito a compartir conmigo la alegría de mis quince años. Mis padres y yo hemos preparado con mucho cariño una noche inolvidable.",
  generator: 'v0.app',
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Quince Años de Sofía',
    description: 'Te invito a compartir conmigo la alegría de mis quince años',
    url: 'https://sofi-guest-list-edzu.vercel.app/',
    siteName: 'Quince Años de Sofía',
    images: [
      {
        url: '/og-image.jpg', // Coloca tu imagen en public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'Invitación Quince Años de Sofía',
      }
    ],
    locale: 'es_ES',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Quince Años de Sofía',
    description: 'Te invito a compartir conmigo la alegría de mis quince años',
    images: ['/og-image.jpg'],
  },
  
  // Otros metadatos útiles
  robots: {
    index: true,
    follow: true,
  },
  
  // Para cuando la agreguen a la pantalla de inicio del móvil
  applicationName: 'Quince Años de Sofía',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Quince Años de Sofía',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}