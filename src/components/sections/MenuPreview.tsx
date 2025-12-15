'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiFilter } from 'react-icons/fi'
import MagneticButton from '../ui/MagneticButton'

export default function MenuPreview() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeCategory, setActiveCategory] = useState('Cucina')

  const categories = ['Cucina', 'Gastronomia', 'Colazione', 'Caffetteria', 'Vini', 'Bollicine', 'Birre', 'Dolci']

  const menuItems = {
    Cucina: [
      { name: 'Tagliere di Salumi e Formaggi', description: 'Con giardiniera della casa e mostarda', price: '25€', rating: 4.9, image: '/images/Salmone.PNG' },
      { name: 'Pata Negra de Bellota 100%', description: 'Con pan y tomate', price: '20€', rating: 5.0, image: '/images/garnish.PNG' },
      { name: 'Vellutata di Verdure', description: 'Con crostini e pecorino. Con bacon (+3€) o gamberi (+3€)', price: '12€', rating: 4.7, image: '/images/Veggie.PNG' },
      { name: 'Battuta di Manzo alla Francese', description: 'Tagliata al coltello, con senape, scalogno, capperi e tuorlo d\'uovo. Con tartufo nero (+5€)', price: '15€', rating: 4.9, image: '/images/moscardini.PNG' },
      { name: 'Insalata Mista di Pollo', description: 'Con bacon croccante, avocado, salsa yogurt e ravanelli', price: '15€', rating: 4.6, image: '/images/Salmone.PNG' },
      { name: 'Acciuga del Cantabrico', description: 'Con pane tostato e burro', price: '15€', rating: 4.8, image: '/images/garnish.PNG' },
      { name: 'Ovetto Poché', description: 'Su fonduta di formaggio, con lamelle di tartufo nero della Lessinia', price: '16€', rating: 4.8, image: '/images/Veggie.PNG' },
      { name: 'Tagliatelle al Ragù di Quaglia', description: 'Pasta fresca con ragù di quaglia, il suo uovo e lamelle di tartufo nero', price: '18€', rating: 5.0, image: '/images/moscardini.PNG' },
      { name: 'Pad Thai', description: 'Spaghetti di riso saltati con verdure croccanti, pollo, gamberi e salsa tamarindo', price: '16€', rating: 4.8, image: '/images/Salmone.PNG' },
      { name: 'Gyoza (6pz)', description: 'Ravioli giapponesi croccanti ripieni di maiale, con salsa teriyaki', price: '12€', rating: 4.7, image: '/images/garnish.PNG' },
      { name: 'Gnocchi alla Zucca', description: 'Gnocchi di patate con crema di zucca, gorgonzola e speck croccante', price: '16€', rating: 4.9, image: '/images/Veggie.PNG' },
      { name: 'Ravioli Artigianali alla Gricia', description: 'Ravioli ripieni di cacio e pepe, serviti con guanciale croccante', price: '16€', rating: 4.9, image: '/images/moscardini.PNG' },
      { name: 'Tagliata di Manzo', description: 'Controfiletto scottato, con porcini e scaglie di Monte Veronese. Con tartufo nero (+5€)', price: '22€', rating: 5.0, image: '/images/Salmone.PNG' },
      { name: 'Yakitori', description: 'Spiedini di pollo glassati alla teriyaki, con riso basmati, edamame e semi di sesamo', price: '16€', rating: 4.7, image: '/images/garnish.PNG' },
      { name: 'Guancetta di Maiale', description: 'Brasata all\'Amarone, con purè di patate', price: '20€', rating: 4.9, image: '/images/guancetta.PNG' },
      { name: 'Moscardini in Umido', description: 'Con crema di polenta', price: '14€', rating: 4.9, image: '/images/moscardini.PNG' },
      { name: 'Trancio di Salmone', description: 'Salmone scottato con salsa al tamarindo e pak choi saltato', price: '18€', rating: 4.8, image: '/images/Salmone.PNG' },
      { name: 'Burrito', description: 'Farcito con manzo e maiale, fagioli neri, guacamole e riso. Con nachos', price: '16€', rating: 4.8, image: '/images/garnish.PNG' },
      { name: 'Bacon Cheeseburger', description: 'Hamburger di manzo, cheddar, bacon croccante e salsa BBQ. Con patate', price: '16€', rating: 4.9, image: '/images/Veggie.PNG' },
      { name: 'Club Sandwich', description: 'Pollo, bacon croccante, uovo, pomodoro e insalata', price: '15€', rating: 4.8, image: '/images/clubsandwich.PNG' },
      { name: 'Avocado Toast', description: 'Pane tostato con avocado, pomodorini e uovo poché', price: '12€', rating: 4.7, image: '/images/Salmone.PNG' },
      { name: 'Veggie Burger', description: 'Burger vegetale, brie, spinacino, cipolla caramellata e patate', price: '16€', rating: 4.7, image: '/images/Veggie.PNG' },
    ],
    Gastronomia: [
      { name: 'Polpetta di Carne', description: 'Polpetta di carne mista', price: '2€', rating: 4.8 },
      { name: 'Polpetta Vegetariana', description: 'Polpetta a base di verdure e ricotta', price: '2€', rating: 4.7 },
      { name: 'Arancino al Tastasal', description: 'Ripieno di riso e tastasal (impasto di salsiccia)', price: '2€', rating: 4.8 },
      { name: 'Pizza Margherita', description: 'Impasto fresco, pomodoro, mozzarella e basilico', price: '6€', rating: 4.9 },
      { name: 'Pizza Farcita', description: 'Impasto fresco con ripieno del giorno', price: '7€', rating: 4.8 },
      { name: 'Toast', description: 'Con prosciutto e formaggio', price: '5€', rating: 4.6 },
      { name: 'Focaccia', description: 'Chiedere per i gusti disponibili', price: '5€', rating: 4.7 },
      { name: 'Pizzetta', description: 'Piccola porzione ideale per un assaggio veloce', price: '3.50€', rating: 4.6, image: '/images/pizzetta.PNG' },
    ],
    Colazione: [
      { name: 'Avocado Toast', description: 'Pane tostato, crema alla robiola, avocado, uovo in camicia. Con bacon (+3€) o salmone (+3€)', price: '12€', rating: 4.8 },
      { name: 'Club Sandwich', description: 'Pollo, bacon croccante, uovo, pomodoro, insalata e maionese', price: '15€', rating: 4.8 },
      { name: 'English Breakfast', description: 'Uovo, bacon, salsiccia, funghi, pomodoro, fagioli e pane tostato', price: '16€', rating: 4.9 },
      { name: 'Croque Monsieur', description: 'Pane, prosciutto cotto, formaggio e besciamella', price: '10€', rating: 4.7 },
      { name: 'Croque Madame', description: 'Pane, prosciutto cotto, formaggio, besciamella e uovo all\'occhio di bue', price: '12€', rating: 4.8 },
      { name: 'Croissant', description: 'Sfoglia fresca, semplice o farcito', price: '2€', rating: 4.6 },
      { name: 'Spremuta d\'Arancia', description: 'Arancia fresca appena spremuta', price: '4€', rating: 4.8 },
    ],
    Caffetteria: [
      { name: 'Espresso', description: 'L\'autentico caffè italiano', price: '2€', rating: 4.9 },
      { name: 'Macchiatone', description: 'Simile al cappuccino ma con meno latte', price: '2.50€', rating: 4.7 },
      { name: 'Cappuccino', description: 'Caffè e latte montato con schiuma cremosa', price: '3€', rating: 4.8 },
      { name: 'Caffè Americano', description: 'Caffè lungo con aggiunta di acqua calda', price: '2.50€', rating: 4.6 },
      { name: 'Latte Macchiato', description: 'Latte caldo macchiato con un tocco di caffè', price: '3€', rating: 4.7 },
      { name: 'Caffè Corretto', description: 'Espresso con l\'aggiunta di un liquore a scelta', price: '3€', rating: 4.8 },
      { name: 'Caffè Doppio', description: 'Doppio espresso in tazza grande', price: '3.50€', rating: 4.8 },
      { name: 'Ginseng/Orzo', description: 'Bevanda calda alternativa al caffè', price: '2.50€', rating: 4.5 },
      { name: 'Caffè Skalette', description: 'Doppio espresso versato su ghiaccio', price: '3.50€', rating: 4.9 },
      { name: 'Infuso', description: 'Selezione di erbe e frutta', price: '3€', rating: 4.6 },
    ],
    Vini: [
      { name: 'Lugana Tenuta Roveglia', description: 'Bianco fresco e sapido, con sentori di mandorla e fiori bianchi', price: '5€ / 30€', rating: 4.8 },
      { name: 'Soave Coffele', description: 'Bianco elegante e minerale del Veneto, profumo di biancospino e camomilla', price: '5€ / 32€', rating: 4.9 },
      { name: 'Pinot Grigio Roeno', description: 'Bianco fresco, equilibrato e piacevolmente fruttato', price: '5€ / 28€', rating: 4.7 },
      { name: 'Chardonnay Dolfo', description: 'Bianco dal gusto morbido con sentori di mela matura e vaniglia', price: '5€ / 30€', rating: 4.7 },
      { name: 'Ribolla Gialla Dolfo', description: 'Bianco con acidità vibrante, note floreali e minerali', price: '5€ / 32€', rating: 4.8 },
      { name: 'Rosé San Salvatore Vetere', description: 'Rosato delicato e profumato con sentori di frutti rossi estivi', price: '6€ / 35€', rating: 4.8 },
      { name: 'Falanghina San Salvatore', description: 'Bianco fresco della Campania, con note di agrumi e fiori bianchi', price: '5€ / 32€', rating: 4.8 },
      { name: 'Valpolicella Classico Speri', description: 'Rosso giovane e vivace, note di ciliegia e pepe nero', price: '5€ / 30€', rating: 4.7 },
      { name: 'Valpolicella Superiore Speri', description: 'Rosso più strutturato, con note di frutta matura e spezie', price: '6€ / 36€', rating: 4.8 },
      { name: 'Pinot Nero Ploner', description: 'Rosso elegante e vellutato, con sentori di sottobosco e lampone', price: '7€ / 42€', rating: 4.9 },
      { name: 'Cabernet Sauvignon Dolfo', description: 'Rosso corposo e robusto, con note di ribes nero e peperone verde', price: '6€ / 35€', rating: 4.7 },
      { name: 'Jungano San Salvatore', description: 'Rosso decisivo dalla Campania, con note di ciliegia scura, prugna e spezie', price: '7€ / 45€', rating: 4.9 },
    ],
    Bollicine: [
      { name: 'Prosecco Follador', description: 'Frizzante e aromatico, con sentori di mela e pera', price: '5€ / 32€', rating: 4.8, image: '/images/bollinger.PNG' },
      { name: 'Franciacorta Satèn Berlucchi', description: 'Bollicina cremosa e setosa, con note di pane tostato', price: '7€ / 45€', rating: 4.9, image: '/images/cin.PNG' },
      { name: 'Trento DOC Altemasi', description: 'Metodo classico trentino con eleganza e finezza', price: '7€ / 45€', rating: 4.8, image: '/images/bollinger.PNG' },
      { name: 'Rosé Terra dei Re', description: 'Rosato delicato con note di frutti rossi', price: '7€ / 45€', rating: 4.8, image: '/images/cin.PNG' },
      { name: 'Champagne Louis Constant', description: 'Elegante e complesso, con note di lievito e agrumi canditi', price: '10€ / 65€', rating: 5.0, image: '/images/bollinger.PNG' },
    ],
    Birre: [
      { name: 'Birra Pils Maes 0,25L', description: 'Lager belga leggera e rinfrescante con un tocco luppolato', price: '4€', rating: 4.6 },
      { name: 'Birra Pils Maes 0,5L', description: 'Lager belga leggera e rinfrescante con un tocco luppolato', price: '6€', rating: 4.6 },
      { name: 'Session IPA Beavertown 0,4L', description: 'IPA a bassa gradazione, aromatica e facile da bere con note agrumate', price: '6€', rating: 4.8 },
      { name: 'Spritz', description: 'Scegli tra: Aperol, Campari, Hugo, Select, Cynar, Rabarbaro, Rosa', price: '7€', rating: 4.8 },
      { name: 'Negroni', description: 'Gin, Campari, Blend di Vermouth Rossi. Classico potente', price: '8€', rating: 4.9 },
      { name: 'Americano', description: 'Campari, Blend di Vermouth Rossi, Soda', price: '7€', rating: 4.7 },
      { name: 'Cocktail', description: 'Richiedi il tuo cocktail preferito ai nostri barman', price: '9€', rating: 4.8 },
      { name: 'Cocktail Premium', description: 'Preparati con distillati e ingredienti di alta gamma', price: '12€', rating: 5.0 },
    ],
    Dolci: [
      { name: 'Tiramisù della Casa', description: 'Il classico tiramisù fatto in casa', price: '6€', rating: 5.0 },
      { name: 'Panna Cotta', description: 'Gusto a scelta: cioccolato o caramello', price: '6€', rating: 4.8 },
      { name: 'Crema Catalana', description: 'Il classico dessert spagnolo caramellato', price: '6€', rating: 4.9 },
      { name: 'Sbrisolona e Grappa', description: 'Torta mantovana con mandorle e grappa veneta', price: '7€', rating: 4.8 },
    ],
  }

  return (
    <section id="menu" className="py-20 bg-dark-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Il Nostro Menu
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Sapori autentici e creatività in ogni piatto
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-glow'
                    : 'glass-effect text-white/60 hover:text-white'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300 group"
            >
              {item.image && (
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <span className="text-primary-400 font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <MagneticButton 
            variant="primary" 
            size="large"
            onClick={() => {
              const menuSection = document.getElementById('menu');
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Vedi Menu Completo
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
