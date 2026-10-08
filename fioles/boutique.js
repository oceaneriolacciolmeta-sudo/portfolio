/* ============================================================
   Réglages de la boutique : c'est le seul fichier à modifier.
   ============================================================ */
const BOUTIQUE = {
  // Adresse qui reçoit les commandes quand aucun lien de paiement n'est renseigné.
  email: "ton.email@exemple.com",

  // Liens de paiement Stripe (Stripe > Liens de paiement > Créer).
  // Laisse "" tant que tu n'en as pas : le bouton ouvrira un e-mail de commande pré-rempli.
  paiement: {
    "rose-sel": "",
    "croix-marie": "",
  },
};
