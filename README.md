# ORO Studio, portfolio

Portfolio d'Océane Riolacci Olmeta, graphiste en Corse. C'est un site statique (HTML/CSS/JS), sans installation.

## Ajouter tes visuels

1. Dépose tes images dans `images/` :
   - `images/miniatures/` : 16:9 (1280×720)
   - `images/carrousels/` : 4:5 (1080×1350)
   - `images/affiches/` : 2:3 ou A4
   - `images/avant-apres/` : paires avant / après de même format
2. Ouvre `projects.js` et renseigne les chemins (`src`, `slides`, `avant`, `apres`).
3. Tant qu'un chemin est vide ou que le fichier n'existe pas, un visuel vert amande provisoire s'affiche.

Déjà prévu : l'avant/après de l'affiche ERA, avec `images/avant-apres/era-avant.jpg` et `images/avant-apres/era-apres.jpg`.

## À personnaliser dans `index.html`

- Ton e-mail : remplace `ton.email@exemple.com`.
- Tes liens Instagram, Behance et LinkedIn (les `href="#"`).
- Tes photos : `images/oceane.png` (section Présentation) et `images/oceane-2.png` (FAQ).
- Les chiffres (`data-count`) et les témoignages.

## Voir le site

Double-clique sur `index.html`. Pour le mettre en ligne gratuitement : importe ce dépôt sur vercel.com ou active GitHub Pages.
