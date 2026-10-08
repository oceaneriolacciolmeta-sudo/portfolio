# Fioles de Corse, boutique

Site statique (HTML/CSS/JS), sans installation. Ouvre `index.html` pour le voir.

## Avant la mise en ligne

1. **Paiement** : crée un compte Stripe, puis un « lien de paiement » par fiole (active « quantité ajustable » et la collecte de l'adresse de livraison). Colle les liens dans `boutique.js`. Sans lien, le bouton « Commander » ouvre un e-mail de commande pré-rempli.
2. **E-mail** : remplace `ton.email@exemple.com` dans `boutique.js`.
3. **Prix, tailles, livraison** : dans `index.html` (cartes produits et FAQ).
4. **Mentions légales** : complète tout ce qui est surligné dans `mentions-legales.html` (SIRET, adresse, hébergeur, médiateur).

## Ajouter une fiole

Copie un bloc `<article class="product">` dans `index.html`, change l'image (`images/`, format 4:5 ou vertical), le nom, le prix et `data-commander="nouvel-id"`, puis ajoute `"nouvel-id": ""` dans `boutique.js`.
