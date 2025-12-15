'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiPhone, FiCalendar } from 'react-icons/fi'
import MagneticButton from '../ui/MagneticButton'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#menu', label: 'Menu' },
    { href: '#about', label: 'Chi Siamo' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#eventi', label: 'Eventi' },
    { href: '#contatti', label: 'Contatti' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img 
                src="/logo.png" 
                alt="SKALETTE BISTRO" 
                className="h-10 md:h-12 w-auto"
                style={{ mixBlendMode: 'multiply', filter: 'brightness(1.2) contrast(1.1)' }}
              />
              <span className="text-xl md:text-2xl font-display font-bold text-gradient hidden sm:block">
                SKALETTE BISTRO
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-white/80 hover:text-primary-400 transition-colors cursor-pointer font-medium"
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:+39000000000">
              <MagneticButton
                variant="outline"
                icon={<FiPhone />}
              >
                Chiama Ora
              </MagneticButton>
            </a>
            <a href="#prenota">
              <MagneticButton
                variant="primary"
                icon={<FiCalendar />}
              >
                Prenota Tavolo
              </MagneticButton>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-effect mt-4"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/80 hover:text-primary-400 transition-colors text-lg font-medium block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 space-y-3">
                <a href="tel:+39000000000" className="block">
                  <MagneticButton variant="outline" icon={<FiPhone />} fullWidth>
                    Chiama Ora
                  </MagneticButton>
                </a>
                <a href="#prenota" className="block">
                  <MagneticButton variant="primary" icon={<FiCalendar />} fullWidth>
                    Prenota Tavolo
                  </MagneticButton>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
