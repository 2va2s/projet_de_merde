# TimeTravel Agency - Webapp Interactive

Webapp pedagogique pour une agence de voyage temporel fictive.
Objectif: livrer une experience immersive, un assistant conversationnel IA et une personnalisation simple, avec une stack legere.

## Equipe

Groupe de la flemme (M2 Ingénierie en machine learning)

## URL publique

- Production: https://timetraveldelaflemme.vercel.app/

## Stack technique

- Frontend: HTML5, CSS3, JavaScript vanilla
- Backend IA: Vercel Serverless Function (`api/chat.js`)
- Provider IA: OpenRouter (mode IA)
- Fallback securise: chatbot local rule-based (si API indisponible)

## Features implementees

### 1. Landing page interactive
- Hero immersif anime
- Navigation ancree (Destinations / Assistant IA / Quiz / Reservation)
- Responsive mobile-first

### 2. Galerie de destinations (3 epoques)
- Paris 1889
- Cretace -65M
- Florence 1504
- Cards interactives avec details + prix
- Lazy loading images

### 3. Agent conversationnel
- Widget chat flottant (bas droite)
- Reponses sur destinations, prix, FAQ, securite
- Mode IA via API (OpenRouter) quand configure
- Mode local automatique en fallback (degradation gracieuse)

### 4. Personnalisation
- Quiz 4 questions
- Algorithme de scoring
- Recommandation destination + auto-remplissage du formulaire

### 5. Reservation
- Formulaire (destination, date, voyageurs, email)
- Validation client (champs + date)
- Confirmation instantanee avec identifiant

### 6. UX/UI
- Theme visuel coherent (premium sombre + accents dores)
- Animations subtiles au scroll (IntersectionObserver)
- Hover effects sur cards et CTA

## Transparence IA

- IA utilisee pour: ideation, generation de structure, snippets frontend/backend, iteration du design.
- IA runtime: OpenRouter via API serverless.
- Sans cle API: fonctionnement maintenu en mode local.

## Prompt engineering (trace)

### Prompt systeme chatbot
"Tu es l assistant virtuel de TimeTravel Agency. Sois professionnel, chaleureux, passionne d histoire, et reponds avec des conseils concrets sur Paris 1889, Cretace -65M, Florence 1504, les prix et la FAQ."

### Prompts techniques utilises
- "Creer un widget de chat flottant bas droite, coherent avec le theme, ouverture/fermeture et historique court."
- "Ajouter un quiz 4 questions qui recommande une destination selon un scoring simple et transparent."
- "Implementer un fallback local si l API IA est indisponible pour garantir une demo stable."

## Structure du projet

- `index.html` : structure des sections
- `styles.css` : design, responsive, animations
- `script.js` : interactions UI, chat, quiz, reservation
- `api/chat.js` : endpoint serverless pour appel IA
- `.env.example` : variables d environnement
- `assets/README.txt` : consignes d integration des visuels Session 1

## Installation locale

1. Ouvrir le dossier `projet_de_merde`.
2. Lancer un serveur statique:
   - `py -m http.server 8000`
3. Ouvrir `http://localhost:8000`.

Note: l endpoint `/api/chat` fonctionne en environnement Vercel. En local statique, le chat bascule en mode local.

## Deploiement (Vercel recommande)

1. Push le repo sur GitHub.
2. Import du repo dans Vercel.
3. Ajouter les variables d environnement:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
4. Redeployer.

## Integration assets Session 1 (obligatoire pour maximiser la note)

Placer vos visuels dans `assets/` avec ces noms:
- `paris-1889.jpg`
- `cretace-65m.jpg`
- `florence-1504.jpg`

Si absent: fallback automatique sur Unsplash.

## Scenarios de test recommandes

1. Navigation desktop/mobile: sections accessibles, UI lisible.
2. Chat:
   - "Quel est le prix de Paris 1889 ?"
   - "Je veux aventure nature"
   - "FAQ annulation"
3. Quiz: tester 3 profils differents et verifier la coherence de recommandation.
4. Reservation:
   - date passee => erreur
   - champs valides => confirmation OK

## Credits

- Brief et cadre pedagogique: projet supervise IA M1/M2
- Assets d origine: votre Session 1 (a ajouter)
- Fallback images temporaires: Unsplash

## Limites et ameliorations futures

- Ajouter un vrai backend reservations (BDD + emails)
- Enregistrer historique chat par utilisateur
- Ajouter analytics et suivi conversion
- Ajouter tests automatiques UI

## Licence

Projet pedagogique (usage academique).
