'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiX } from 'react-icons/fi'

export default function Gallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = [
    '/images/cocktail MNT.PNG',
    '/images/Salmone.PNG',
    '/images/moscardini.PNG',
    '/images/Veggie.PNG',
    '/images/bollinger.PNG',
    '/images/Caffe.PNG',
    '/images/garnish.PNG',
    '/images/cin.PNG',
  ]

  return (
    <section id="gallery" className="py-20 bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Gallery
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Un assaggio visivo della nostra esperienza culinaria
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(image)}
              className="relative h-48 sm:h-64 lg:h-72 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">Visualizza</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-dark-950/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white hover:text-primary-400 transition-colors"
            >
              <FiX size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-full rounded-2xl"
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
