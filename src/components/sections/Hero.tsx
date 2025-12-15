'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowDown, FiPlay } from 'react-icons/fi'
import MagneticButton from '../ui/MagneticButton'
import { useMemo } from 'react'

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Generate particles once with stable positions
  const particles = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      left: (i * 5.3 + 7) % 100,
      top: (i * 7.1 + 3) % 100,
      x: (i % 3 - 1) * 25,
      duration: 7 + (i % 3) * 2,
      delay: i * 0.3,
    }))
  , [])

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background (placeholder - sostituisci con video reale) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/50 to-dark-950 z-10" />
        <div className="absolute inset-0 bg-[url('/locale.png')] bg-cover bg-center animate-zoom-slow" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, particle.x, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div ref={ref} className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-block text-primary-400 font-serif text-xl md:text-2xl mb-4"
          >
            Benvenuti a
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-4"
          >
            <span className="text-gradient">SKALETTE BISTRO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/80 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
          >
            Un&apos;esperienza gastronomica unica dove tradizione e innovazione 
            si fondono per creare momenti indimenticabili
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#prenota">
              <MagneticButton variant="primary" size="large">
                Prenota Ora
              </MagneticButton>
            </a>
            <a href="#menu">
              <MagneticButton variant="outline" size="large">
                Scopri il Menu
              </MagneticButton>
            </a>
            <a href="#virtual-tour">
              <MagneticButton variant="glass" size="large" icon={<FiPlay />}>
                Virtual Tour
              </MagneticButton>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-12 sm:mt-20 px-4"
          >
            {[
              { value: '15+', label: 'Anni di Esperienza' },
              { value: '200+', label: 'Piatti Signature' },
              { value: '50K+', label: 'Clienti Soddisfatti' },
            ].map((stat, index) => (
              <div key={index} className="glass-effect rounded-lg p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60 cursor-pointer"
        >
          <span className="text-sm mb-2">Scorri per esplorare</span>
          <FiArrowDown size={24} />
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes zoom-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-zoom-slow {
          animation: zoom-slow 30s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
