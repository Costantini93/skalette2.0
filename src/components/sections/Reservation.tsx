'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCalendar, FiUsers, FiClock, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi'
import MagneticButton from '../ui/MagneticButton'

export default function Reservation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Qui andrà la logica per inviare la prenotazione
    alert('Grazie per la tua prenotazione! Ti contatteremo a breve per confermare.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="prenota" className="py-20 bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Prenota il Tuo Tavolo
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Compila il form e ti ricontatteremo per confermare la prenotazione
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white mb-2 font-semibold">
                  <FiUser className="inline mr-2" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                  placeholder="Il tuo nome"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">
                    <FiMail className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                    placeholder="tua@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">
                    <FiPhone className="inline mr-2" />
                    Telefono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                    placeholder="+39 000 000 0000"
                  />
                </div>
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">
                    <FiCalendar className="inline mr-2" />
                    Data
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">
                    <FiClock className="inline mr-2" />
                    Ora
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">
                    <FiUsers className="inline mr-2" />
                    Ospiti
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Persona' : 'Persone'}
                      </option>
                    ))}
                    <option value="8+">8+ Persone</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white mb-2 font-semibold">
                  <FiMessageSquare className="inline mr-2" />
                  Note Aggiuntive (opzionale)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-dark-950/50 border border-white/10 text-white focus:border-primary-400 focus:outline-none transition-colors resize-none"
                  placeholder="Occasioni speciali, allergie, preferenze..."
                />
              </div>

              {/* Submit Button */}
              <MagneticButton variant="primary" size="large" fullWidth>
                Conferma Prenotazione
              </MagneticButton>
            </form>
          </motion.div>

          {/* Right side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <div className="glass-effect rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gradient mb-6">
                Informazioni Utili
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-primary-400 mt-1">
                    <FiClock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Orari</h4>
                    <p className="text-white/60 text-sm">Lun-Gio: 18:00-00:00</p>
                    <p className="text-white/60 text-sm">Ven-Sab: 18:00-02:00</p>
                    <p className="text-white/60 text-sm">Dom: 12:00-23:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-primary-400 mt-1">
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Telefono</h4>
                    <a
                      href="tel:+39000000000"
                      className="text-white/60 hover:text-primary-400 transition-colors text-sm"
                    >
                      +39 000 000 0000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-primary-400 mt-1">
                    <FiMail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Email</h4>
                    <a
                      href="mailto:info@skalette.com"
                      className="text-white/60 hover:text-primary-400 transition-colors text-sm"
                    >
                      info@skalette.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="glass-effect rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gradient mb-4">
                Consigli per la Prenotazione
              </h3>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Prenota con almeno 24 ore di anticipo per garantire disponibilità</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Per gruppi oltre 8 persone, contattaci direttamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Dress code: Smart casual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Comunica in anticipo allergie o intolleranze</span>
                </li>
              </ul>
            </div>

            {/* Emergency Contact */}
            <div className="glass-effect rounded-3xl p-6 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-400/30">
              <p className="text-white/80 text-sm">
                <strong className="text-primary-400">Prenotazione urgente?</strong>
                <br />
                Chiamaci direttamente al{' '}
                <a href="tel:+39000000000" className="text-primary-400 font-bold hover:underline">
                  +39 000 000 0000
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
