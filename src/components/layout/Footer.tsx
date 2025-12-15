import Link from 'next/link'
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-950 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="SKALETTE BISTRO" 
                className="h-8 w-auto"
                style={{ mixBlendMode: 'multiply', filter: 'brightness(1.2) contrast(1.1)' }}
              />
              <h3 className="text-xl font-display font-bold text-gradient">
                SKALETTE BISTRO
              </h3>
            </div>
            <p className="text-white/60 mb-4">
              Un&apos;esperienza gastronomica unica nel cuore di Verona. 
              Sapori autentici, atmosfera raffinata.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/skalette_bistro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary-400 transition-colors"
              >
                <FiInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Link Veloci</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#menu" className="text-white/60 hover:text-primary-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-white/60 hover:text-primary-400 transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="#eventi" className="text-white/60 hover:text-primary-400 transition-colors">
                  Eventi
                </Link>
              </li>
              <li>
                <Link href="#prenota" className="text-white/60 hover:text-primary-400 transition-colors">
                  Prenota
                </Link>
              </li>
            </ul>
          </div>

          {/* Orari */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Orari di Apertura</h4>
            <ul className="space-y-2 text-white/60">
              <li className="flex justify-between">
                <span>Lun - Gio</span>
                <span>10:00 - 01:00</span>
              </li>
              <li className="flex justify-between">
                <span>Ven - Sab</span>
                <span>10:00 - 02:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domenica</span>
                <span>10:00 - 00:00</span>
              </li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-white/60">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>Via Pellicciai 12, 37121 Verona</span>
              </li>
              <li className="flex items-center space-x-3 text-white/60">
                <FiPhone className="flex-shrink-0" />
                <a href="tel:+393428691832" className="hover:text-primary-400 transition-colors">
                  +39 342 869 1832 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center space-x-3 text-white/60">
                <FiPhone className="flex-shrink-0" />
                <a href="tel:+390458030500" className="hover:text-primary-400 transition-colors">
                  045 803 0500 (Locale)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {currentYear} SKALETTE BISTRO. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/termini" className="text-white/60 hover:text-primary-400 transition-colors">
                Termini e Condizioni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
