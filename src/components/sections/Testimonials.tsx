'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiStar } from 'react-icons/fi'

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      name: 'Marco Rossi',
      role: 'Food Critic',
      comment: 'Un\'esperienza gastronomica straordinaria. Ogni piatto è un\'opera d\'arte che celebra i sapori italiani con un tocco innovativo.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Laura Bianchi',
      role: 'Travel Blogger',
      comment: 'SKALETTE è diventato il mio ristorante preferito. L\'atmosfera è perfetta e il cibo è semplicemente divino. Tornerò sicuramente!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Local Guide',
      comment: 'La qualità degli ingredienti e la maestria dello chef sono evidenti in ogni boccone. Un must per chi visita la città.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Cosa Dicono di Noi
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Le recensioni dei nostri clienti soddisfatti
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-2xl p-8 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-white/80 mb-6 leading-relaxed italic">
                &quot;{testimonial.comment}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${testimonial.image})` }}
                />
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
