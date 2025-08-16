
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext.jsx";

export const metadata = {
  title: 'OfmPilot - AI Text & Script Generator',
  description: 'AI platform to generate optimized texts, scripts, and content for WhatsApp, Telegram, and social networks. Automate your content creation tasks.',
  keywords: 'AI, text generator, scripts, WhatsApp, Telegram, automation, content',
  authors: [{ name: 'OfmPilot Team' }],
  openGraph: {
    title: 'OfmPilot - AI Text & Script Generator',
    description: 'AI platform to generate optimized texts, scripts, and content',
    type: 'website',
  },
};

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
