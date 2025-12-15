'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi'

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-dark-900 to-dark-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/cocktail MNT.PNG')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-8 glass-effect rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary-400">
                    <FiHeart size={32} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-white/60 text-sm">Clienti Soddisfatti</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary-400 font-serif text-xl mb-4 block">
              La Nostra Storia
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
              Passione e Tradizione dal 2010
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                SKALETTE BISTRO nasce dalla passione per la cucina italiana autentica, 
                unita alla voglia di innovare e sorprendere. Il nostro chef, con oltre 
                15 anni di esperienza nelle cucine più prestigiose d&apos;Europa, ha creato 
                un menu che celebra i sapori tradizionali con un tocco contemporaneo.
              </p>
              <p>
                Ogni piatto racconta una storia, ogni ingrediente è selezionato con cura 
                dai migliori produttori locali. La nostra missione è trasformare ogni cena 
                in un&apos;esperienza memorabile, dove il gusto incontra l&apos;arte.
              </p>
              <p>
              L&apos;ambiente raffinato e l&apos;atmosfera accogliente fanno di SKALETTE BISTRO il 
                luogo perfetto per celebrare momenti speciali o semplicemente godersi 
                un&apos;ottima cena in compagnia.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="text-primary-400 mt-1">
                  <FiUsers size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Team Esperto</h4>
                  <p className="text-white/60 text-sm">
                    Chef e personale con anni di esperienza
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary-400 mt-1">
                  <FiTrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Qualità Premium</h4>
                  <p className="text-white/60 text-sm">
                    Solo ingredienti freschi e selezionati
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
