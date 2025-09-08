// Loading tamplates
const templatesStorage = "/templates/cards-template.html";
const tempatesContainer = document.createElement("div");
fetch(templatesStorage)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network connection problems" + response.statusText);
    }
    return response.text();
  })
  .then((htmlContent) => {
    tempatesContainer.innerHTML = htmlContent;
  })
  .catch((error) => {
    console.error("Error on coppy tempates", error);
  });
// End Loading templates
const allCards = ["#cardWarrior", "#cardArcher", "#cardWizard"];
const MAX_CARD = 3;
const cardsPlayer = [];
const spawnBtn = document.getElementById("spawnButton");

// Flags

const changeCard = () => {
  for (let index = 0; index < allCards.length; index++) {
    const element = allCards[index];
    return element;
  }
};

const spawnCard = () => {
  const tmpl = tempatesContainer.querySelector("#cardWarrior");
  if (tmpl) {
    const clone = tmpl.cloneNode(true);
    const gameField = document.getElementById("gameField");
    if (gameField) {
      gameField.appendChild(clone);
    } else {
      console.error("Not fount game field");
    }
  } else console.error("Not found card");
};

const addCardsPlayer = () => {};

let isCardLimit = false;
console.log("Flag status is: " + isCardLimit);

spawnBtn.addEventListener("click", () => {
  if (isCardLimit) {
    console.log("Max cards amount!");
    console.log("Flag status is: " + isCardLimit);
  } else if (!isCardLimit) {
    spawnCard();
    cardsPlayer.push("Player card");
    if (cardsPlayer.length === 3) isCardLimit = true;

    console.log("Flag status is: " + isCardLimit);
    console.log("Add new card!");
    console.log("Array: " + cardsPlayer + " | Lenght: " + cardsPlayer.length);
  }
});
