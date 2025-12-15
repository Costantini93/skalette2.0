# SKALETTE 2.0 - Website

Sito web moderno e innovativo per SKALETTE 2.0, ristorante e bar d'eccellenza.

## 🚀 Tecnologie Utilizzate

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animazioni fluide e performanti
- **React Icons** - Icone moderne

## 🎨 Caratteristiche

- ✨ Design moderno con effetti "wow"
- 🎭 Animazioni cinematografiche
- 📱 Completamente responsive
- ⚡ Performance ottimizzate
- 🎯 UX/UI avanzata con elementi magnetici
- 🖼️ Gallery interattiva
- 📋 Sistema prenotazioni integrato
- 🍽️ Menu interattivo con filtri

## 📦 Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Avvia in produzione
npm start
```

## 🌐 Avvio del Progetto

1. Installa Node.js (versione 18 o superiore)
2. Clona il repository
3. Esegui `npm install`
4. Esegui `npm run dev`
5. Apri [http://localhost:3000](http://localhost:3000)

## 📁 Struttura del Progetto

```
src/
├── app/                    # App Router di Next.js
│   ├── layout.tsx         # Layout principale
│   ├── page.tsx           # Homepage
│   └── globals.css        # Stili globali
├── components/
│   ├── layout/            # Componenti layout (Header, Footer)
│   ├── sections/          # Sezioni della homepage
│   └── ui/                # Componenti UI riutilizzabili
```

## 🎨 Customizzazione

### Colori
Modifica i colori in `tailwind.config.js` nella sezione `theme.extend.colors`

### Font
I font sono configurati in `src/app/layout.tsx`

### Contenuti
Aggiorna i contenuti direttamente nei componenti delle sezioni

## 🚀 Deploy

### Vercel (Consigliato)
```bash
npm install -g vercel
vercel
```

### Altre Piattaforme
Il sito può essere deployato su qualsiasi piattaforma che supporta Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- etc.

## 📝 TODO

- [ ] Aggiungere backend API per prenotazioni
- [ ] Integrare CMS (Sanity/Contentful)
- [ ] Aggiungere sistema di pagamento
- [ ] Implementare virtual tour 360°
- [ ] Aggiungere multi-lingua (IT/EN)
- [ ] Integrare Google Analytics
- [ ] Ottimizzare SEO
- [ ] Aggiungere sitemap.xml

## 📄 License

Proprietario - SKALETTE 2.0

## 👨‍💻 Sviluppato con ❤️ per SKALETTE 2.0
