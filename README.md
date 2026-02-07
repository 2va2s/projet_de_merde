# TimeTravel Agency - Webapp Interactive (Version Minimaliste)

Webapp pedagogique rapide pour une agence de voyage temporel fictive.
Objectif: livrer une version solide en peu de temps, avec les features les plus utiles.

## Groupe:

Groupe de la flemme (M2 Ingénierie en machine learning)

## Stack technique

- HTML5
- CSS3 (responsive mobile-first)
- JavaScript vanilla
- Aucune dependance externe JS

## Features implementees

- Landing page avec hero immersif (animation CSS legere)
- Galerie de 3 destinations:
  - Paris 1889
  - Cretace -65M
  - Florence 1504
- Details interactifs par destination
- Chatbot local (widget flottant):
  - Questions destinations
  - Prix fictifs coherents
  - Conseils de choix
  - FAQ agence
- Mini recommandation personnalisee (2 questions)
- Formulaire de reservation avec validation front

## Features volontairement omises (gain de temps)

- Backend/API reelle pour reservation
- Connexion a un vrai LLM (chatbot local rule-based uniquement)
- Animations avancees (Framer Motion / GSAP)
- Authentification et espace client

## Transparence IA

- Assistance IA utilisee pour:
  - Structuration rapide du projet
  - Generation de snippets HTML/CSS/JS
  - Redaction de documentation
- Pas d API IA appelee en runtime dans cette version.

## Installation locale

1. Ouvrir le dossier du projet.
2. Lancer un serveur statique, par exemple:
   - `npx serve .`
   - ou extension VS Code Live Server
3. Ouvrir `index.html` dans le navigateur.

## Deploiement (rapide)

### Vercel

1. Importer le dossier/repo dans Vercel.
2. Framework preset: `Other`.
3. Deploy.

### Netlify

1. Drag & drop du dossier dans Netlify.
2. URL publique disponible immediatement.

## Credits

- Images: Unsplash (liens externes dans `index.html`)
- Contexte pedagogique: TimeTravel Agency (brief de cours)

## Licence

Projet pedagogique - usage academique.
