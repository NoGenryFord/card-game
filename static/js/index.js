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
const allTypesOfCards = [
  { name: "#cardWarrior", id: 1, weight: 1 },
  { name: "#cardArcher", id: 2, weight: 1 },
  { name: "#cardWizard", id: 3, weight: 1 },
];
const MAX_CARD = 6;
const cardsPlayer = [];
const spawnBtn = document.getElementById("spawnButton");

// 1 card have 1 point base weight. If in array 3 card => sunWeight = 3 , if in array 5 card => sunWeight = 5...
const totalWeightBase = allTypesOfCards.length;

const chooseRandomCard = () => {
  //Count weight random

  //   Watch all weights
  const weightActual = allTypesOfCards.map((card) => card.weight);
  console.log(weightActual);

  //Minimaze weight choosed card
  const randomIndex = Math.floor(Math.random() * allTypesOfCards.length);
  // Decreas weight of choosed card
  return allTypesOfCards[randomIndex];
};

const updateCardWeight = (selectedCard) => {
  const decreaseAmount = 1 / allTypesOfCards.length;

  const otherCardCount = allTypesOfCards - 1;
  const increaseAmount = decreaseAmount / otherCardCount;

  allTypesOfCards.forEach((card) => {
    if (card.id === selectedCard.id) {
      card.weight = Math.max(0, card.weight - decreaseAmount);
    } else {
      card.weight += +increaseAmount;
    }
  });
};

const spawnCard = () => {
  const selector = chooseRandomCard();
  const tmpl = tempatesContainer.querySelector(selector.name);
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
    const selectedCard = chooseRandomCard;
    spawnCard();
    cardsPlayer.push("Player card");
    if (cardsPlayer.length === MAX_CARD) isCardLimit = true;

    console.log("Flag status is: " + isCardLimit);
    console.log("Add new card!");
    console.log("Array: " + cardsPlayer + " | Lenght: " + cardsPlayer.length);

    updateCardWeight(selectedCard);
  }
});
