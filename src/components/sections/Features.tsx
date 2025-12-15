'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiStar, FiCoffee, FiAward, FiHeart } from 'react-icons/fi'

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <FiStar size={32} />,
      title: 'Cucina Stellata',
      description: 'Piatti gourmet preparati dal nostro chef pluripremiato con ingredienti selezionati',
    },
    {
      icon: <FiCoffee size={32} />,
      title: 'Atmosfera Unica',
      description: 'Un ambiente raffinato che trasforma ogni pasto in un\'esperienza indimenticabile',
    },
    {
      icon: <FiAward size={32} />,
      title: 'Premi Internazionali',
      description: 'Riconosciuti tra i migliori ristoranti d\'Italia per qualità e innovazione',
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Passione Autentica',
      description: 'Amore per la tradizione italiana unito alla creatività della cucina moderna',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-dark-950 to-dark-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Perché Scegliere SKALETTE BISTRO
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Un&apos;esperienza culinaria che va oltre il semplice pasto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-2xl p-6 sm:p-8 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="text-primary-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
