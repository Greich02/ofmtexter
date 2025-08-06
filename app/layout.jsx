
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext.jsx";

export const metadata = {
  title: 'OfmPilot - Générateur de Textes et Scripts IA',
  description: 'Plateforme IA pour générer des textes, scripts et contenus optimisés pour WhatsApp, Telegram et réseaux sociaux. Automatisez vos tâches de création de contenu.',
  keywords: 'IA, générateur de texte, scripts, WhatsApp, Telegram, automatisation, contenu',
  authors: [{ name: 'OfmPilot Team' }],
  openGraph: {
    title: 'OfmPilot - Générateur de Textes et Scripts IA',
    description: 'Plateforme IA pour générer des textes, scripts et contenus optimisés',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
