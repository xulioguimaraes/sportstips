import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { AuthProvider } from '@/src/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'SportsTips - Palpites Profissionais',
  description: 'Palpites profissionais de esportes com alta taxa de acerto',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
