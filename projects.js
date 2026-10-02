/*
  ============================================================
  TES PROJETS : c'est le seul fichier à modifier pour ajouter
  ou retirer des visuels.

  1. Dépose tes images dans le dossier images/ (miniatures,
     carrousels, statiques, affiches, avant-apres).
  2. Renseigne le chemin dans "src" (ou "slides" pour un carrousel,
     "avant" / "apres" pour la section Avant / Après).
     Exemple : src: "images/miniatures/sport.jpg"
  3. Tant qu'un chemin est vide, un visuel vert amande provisoire s'affiche.
  ============================================================
*/
window.PROJECTS = {
  // Format 16:9 (1280x720 conseillé)
  miniatures: [
    { title: "J'ai testé 100 jours de sport", client: "Chaîne fitness", src: "" },
    { title: "Le setup gaming ultime", client: "Chaîne tech", src: "" },
    { title: "Paris en 24h", client: "Vlog voyage", src: "" },
    { title: "Je cuisine comme un chef étoilé", client: "Chaîne cuisine", src: "" },
    { title: "Le secret des millionnaires", client: "Chaîne finance", src: "" },
    { title: "Réaction au clip de l'année", client: "Chaîne musique", src: "" },
  ],

  // Format 4:5 (1080x1350 conseillé) : une liste d'images par carrousel
  carrousels: [
    { title: "5 erreurs en design", client: "Marque perso", slides: ["", "", "", "", ""] },
    { title: "Lancement produit", client: "Startup beauté", slides: ["", "", "", ""] },
    { title: "Guide nutrition", client: "Coach sportif", slides: ["", "", "", "", "", ""] },
  ],

  // Posts statiques Instagram, une seule image (4:5, 1080x1350 conseillé)
  statiques: [
    { title: "Annonce de lancement", client: "Marque beauté", src: "" },
    { title: "Citation inspirante", client: "Coach", src: "" },
    { title: "Promo -20 %", client: "Boutique", src: "" },
    { title: "Événement à venir", client: "Association", src: "" },
  ],

  // Format affiche (2:3 conseillé, ex. 1200x1800)
  affiches: [
    { title: "Festival Nuit Lilas", client: "Événement", src: "" },
    { title: "Concert, tournée 2026", client: "Musique", src: "" },
    { title: "Expo Formes Douces", client: "Galerie", src: "" },
    { title: "Soirée étudiante", client: "BDE", src: "" },
    { title: "Campagne Printemps", client: "Mode", src: "" },
    { title: "Affiche typographique", client: "Projet perso", src: "" },
  ],

  // AVANT / APRÈS : "avant" = photo brute, "apres" = visuel final.
  // Les deux images d'une paire doivent avoir le même format.
  avantApres: {
    miniatures: [ // 16:9
      { title: "J'ai testé 100 jours de sport", client: "Chaîne fitness", avant: "", apres: "" },
      { title: "Le setup gaming ultime", client: "Chaîne tech", avant: "", apres: "" },
      { title: "Paris en 24h", client: "Vlog voyage", avant: "", apres: "" },
    ],
    affiches: [ // format A4 (ex. 1414x2000)
      {
        title: "Flyer conseillère immobilière",
        client: "ERA Immobilier Lucciana",
        avant: "images/avant-apres/era-avant.png",
        apres: "images/avant-apres/era-apres.png",
      },
      { title: "Festival Nuit Lilas", client: "Événement", avant: "", apres: "" },
      { title: "Concert, tournée 2026", client: "Musique", avant: "", apres: "" },
      { title: "Campagne Printemps", client: "Mode", avant: "", apres: "" },
    ],
  },
};
