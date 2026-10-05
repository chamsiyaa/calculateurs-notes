// Part du code rédigée personnellement : 70 % 
// Assistance de ChatGPT et Claude pour certaines parties du code.

const formulaire = document.querySelector("#formulaire");
const liste = document.querySelector("#evaluations");
const resultat = document.querySelector("#resultat");
const erreur = document.querySelector("#erreur");

const evaluations = [];

formulaire.addEventListener("submit", function (event) {
  event.preventDefault();

  const nom = document.querySelector("#nom").value.trim();
  const note = document.querySelector("#note").valueAsNumber;
  const poids = document.querySelector("#poids").valueAsNumber;

  erreur.textContent = "";

  if (
    !nom ||
    !Number.isFinite(note) ||
    !Number.isFinite(poids) ||
    note < 0 || note > 100 ||
    poids <= 0 || poids > 100
  ) {
    erreur.textContent = "Vérifie le nom, la note et le poids.";
    return;
  }

  const totalPoids = evaluations.reduce(
    (total, evaluation) => total + evaluation.poids, 0
  );

  if (totalPoids + poids > 100 + 0.000001) {
    erreur.textContent = "Le total des poids ne peut pas dépasser 100 %.";
    return;
  }

  evaluations.push({ nom, note, poids });
  formulaire.reset();
  afficher();
});

function afficher() {
  liste.replaceChildren();

  evaluations.forEach(function (evaluation, index) {
    const element = document.createElement("li");
    element.textContent =
      `${evaluation.nom} : ${evaluation.note}/100 ` +
      `(poids : ${evaluation.poids} %) `;

    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = "Supprimer";

    bouton.addEventListener("click", function () {
      evaluations.splice(index, 1);
      erreur.textContent = "";
      afficher();
    });

    element.appendChild(bouton);
    liste.appendChild(element);
  });

  const totalPoids = evaluations.reduce(
    (total, evaluation) => total + evaluation.poids, 0
  );

  const totalPoints = evaluations.reduce(
    (total, evaluation) => total + evaluation.note * evaluation.poids, 0
  );

  if (totalPoids === 0) {
    resultat.textContent = "Ajoute une évaluation pour voir ta moyenne.";
    return;
  }

  const moyenne = (totalPoints / totalPoids).toFixed(2);
  const coursComplet = Math.abs(totalPoids - 100) < 0.000001;

  resultat.textContent =
    `Moyenne actuelle : ${moyenne} %\n` +
    `Part du cours évaluée : ${Number(totalPoids.toFixed(2))} %\n` +
    (coursComplet
      ? `Note finale : ${moyenne} %`
      : "Note finale : pas encore disponible.");
}