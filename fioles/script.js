// Boutons « Commander » : lien Stripe si renseigné, sinon e-mail de commande pré-rempli.
const mailto = (sujet, corps) =>
  `mailto:${BOUTIQUE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

document.querySelectorAll("[data-commander]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lien = BOUTIQUE.paiement[btn.dataset.commander];
    if (lien) {
      window.location.href = lien;
      return;
    }
    const corps = [
      "Bonjour,",
      "",
      `Je souhaite commander : ${btn.dataset.nom} (${btn.dataset.prix} €)`,
      "Quantité : 1",
      "",
      "Nom et prénom :",
      "Adresse de livraison :",
      "Téléphone :",
      "",
      "Merci !",
    ].join("\n");
    window.location.href = mailto(`Commande : ${btn.dataset.nom}`, corps);
  });
});

document.querySelectorAll("[data-email]").forEach((a) => {
  a.href = mailto("Question sur les fioles", "Bonjour,\n\n");
});

// Ombre de la barre de navigation au défilement
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
