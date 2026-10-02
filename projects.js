/*
  ============================================================
  TES PROJETS : c'est le seul fichier à modifier pour ajouter
  ou retirer des visuels.

  1. Dépose tes images dans le dossier images/ (miniatures,
     carrousels, statiques, affiches, avant-apres).
     Le format .webp est conseillé (plus léger), mais .jpg et .png marchent aussi.
  2. Renseigne le chemin dans "src" (ou "slides" pour un carrousel,
     "avant" / "apres" pour la section Avant / Après).
  3. Si une image est introuvable, un visuel vert amande provisoire s'affiche.
  ============================================================
*/
window.PROJECTS = {
  // Miniatures YouTube, format 16:9 (1280x720)
  miniatures: [
    { title: "Hamilton chez Ferrari", client: "Formule 1", src: "images/miniatures/f1-hamilton.webp" },
    { title: "One Piece, tous les détails cachés", client: "Pop culture", src: "images/miniatures/one-piece.webp" },
    { title: "007 First Light", client: "Jeu vidéo", src: "images/miniatures/007-first-light.webp" },
    { title: "Dans l'enfer des goulags", client: "Histoire", src: "images/miniatures/goulags.webp" },
    { title: "Kraken", client: "Documentaire", src: "images/miniatures/kraken.webp" },
    { title: "Pau Gasol", client: "Basket", src: "images/miniatures/pau-gasol.webp" },
    { title: "Morad", client: "Musique", src: "images/miniatures/morad.webp" },
    { title: "Le Petit Prince", client: "Littérature", src: "images/miniatures/petit-prince.webp" },
    { title: "Pokémon Geographic", client: "Pop culture", src: "images/miniatures/pokemon-geographic.webp" },
    { title: "Milei", client: "Politique", src: "images/miniatures/milei.webp" },
    { title: "Qui vous ment ?", client: "Interview", src: "images/miniatures/qui-vous-ment.webp" },
    { title: "La Roja 2010", client: "Football", src: "images/miniatures/la-roja-2010.webp" },
    { title: "MotoGP, l'Espagne", client: "Moto", src: "images/miniatures/moto-gp.webp" },
    { title: "6 astuces pour apprendre l'espagnol", client: "Éducation", src: "images/miniatures/espagnol-astuces.webp" },
  ],

  // Carrousels Instagram, format 4:5 (1080x1350) : une liste d'images par carrousel
  carrousels: [
    {
      title: "3 erreurs dans ta com'",
      client: "Conseils réseaux sociaux",
      slides: [1, 2, 3, 4, 5].map((n) => `images/carrousels/erreurs-com/${n}.webp`),
    },
    {
      title: "Partir, c'est vivre",
      client: "Lifestyle nomade",
      slides: [1, 2, 3, 4].map((n) => `images/carrousels/partir-cest-vivre/${n}.webp`),
    },
    {
      title: "Journée mondiale du bonheur",
      client: "Bien-être",
      slides: [1, 2, 3, 4, 5].map((n) => `images/carrousels/journee-bonheur/${n}.webp`),
    },
    {
      title: "Une journée avec moi",
      client: "Lifestyle",
      slides: [1, 2, 3, 4].map((n) => `images/carrousels/journee-avec-moi/${n}.webp`),
    },
    {
      title: "Série personal branding",
      client: "Coach marketing",
      slides: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `images/carrousels/personal-branding/${n}.webp`),
    },
  ],

  // Posts statiques Instagram, une seule image (4:5, 1080x1350)
  statiques: [2, 3, 4, 5, 7, 8].map((n) => ({
    title: "Panda Tea",
    client: "Morning Boost",
    src: `images/statiques/panda-tea-${n}.webp`,
  })),

  // Affiches et visuels produit, format vertical 9:16 (1080x1920)
  affiches: [
    { title: "Jack Daniel's Honey", client: "Visuel produit", src: "images/affiches/jack-daniels-honey.webp" },
    { title: "Monster Energy", client: "Visuel produit", src: "images/affiches/monster.webp" },
    { title: "Absolut Vodka", client: "Visuel produit", src: "images/affiches/absolut.webp" },
    { title: "Ballantine's", client: "Visuel produit", src: "images/affiches/ballantines.webp" },
    { title: "Red Bull", client: "Visuel produit", src: "images/affiches/red-bull.webp" },
    { title: "Grey Goose", client: "Visuel produit", src: "images/affiches/grey-goose.webp" },
    { title: "Jack Daniel's Apple", client: "Visuel produit", src: "images/affiches/jack-daniels-apple.webp" },
  ],

  // AVANT / APRÈS : "avant" = support d'origine, "apres" = visuel final.
  // Un onglet sans paire complète est masqué automatiquement.
  avantApres: {
    miniatures: [ // 16:9
      {
        title: "Milei",
        client: "Du croquis à la miniature",
        avant: "images/avant-apres/milei-avant.webp",
        apres: "images/avant-apres/milei-apres.webp",
      },
      {
        title: "MotoGP, l'Espagne",
        client: "Du croquis à la miniature",
        avant: "images/avant-apres/moto-gp-avant.webp",
        apres: "images/avant-apres/moto-gp-apres.webp",
      },
    ],
    affiches: [
      {
        title: "Flyer conseillère immobilière",
        client: "ERA Immobilier Lucciana",
        avant: "images/avant-apres/era-avant.webp",
        apres: "images/avant-apres/era-apres.webp",
      },
    ],
  },
};
