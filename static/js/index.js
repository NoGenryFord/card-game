// *************************************************************************************
// START Import module side JS files
import { NextTurn } from "./turnSystem.js";
import {
  AddCoins,
  RemoveCoins,
  TrackUserPurchaseCard,
  ShowCoins,
  coins,
} from "./moneySystem.js";
import bgMusic from "./musicPlayer.js";
// END Import module side JS files
// *************************************************************************************

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
  {
    name: "#cardWarrior",
    id: 1,
    weightBase: 1,
    weight: 1,
    hp: 100,
    damage: 25,
    isActive: false,
    buyingCost: 3,
    sellingCost: -2,
  },
  {
    name: "#cardArcher",
    id: 2,
    weightBase: 1,
    weight: 1,
    hp: 80,
    damage: 35,
    isActive: false,
    buyingCost: 3,
    sellingCost: -2,
  },
  {
    name: "#cardWizard",
    id: 3,
    weightBase: 1,
    weight: 1,
    hp: 65,
    damage: 45,
    isActive: false,
    buyingCost: 3,
    sellingCost: -2,
  },
];
const MAX_CARD = 6;
const cardsPlayer = [];
const cardsEnemy = [];
const spawnBtn = document.getElementById("spawnButton");
const spawnEnemyButton = document.getElementById("spawnEnemyButton");
const clearPlayerButton = document.getElementById("clearPlayerButton");
const clearEnemyButton = document.getElementById("clearEnemyButton");

let currentTurn = "";

// 1 card have 1 point base weight. If in array 3 card => sunWeight = 3 , if in array 5 card => sunWeight = 5...
const totalWeightBase = allTypesOfCards.length;

const chooseRandomCard = () => {
  const totalWeight = allTypesOfCards.reduce(
    (sum, card) => sum + card.weight,
    0
  );
  let randomNumber = Math.random() * totalWeight;

  for (const card of allTypesOfCards) {
    randomNumber -= card.weight;
    if (randomNumber <= 0) {
      return card;
    }
  }
  return allTypesOfCards[allTypesOfCards.length - 1];
};

const updateCardWeight = (selectedCard) => {
  if (allTypesOfCards.length > 1) {
    const decreaseAmount = 1 / allTypesOfCards.length;
    const otherCardCount = allTypesOfCards.length - 1;

    const increaseAmount =
      otherCardCount > 0 ? decreaseAmount / otherCardCount : 0;

    allTypesOfCards.forEach((card) => {
      if (card.id === selectedCard.id) {
        card.weight = Math.max(0, card.weight - decreaseAmount);
      } else {
        card.weight += increaseAmount;
      }
    });
  }
  console.log(
    "New weights: ",
    allTypesOfCards.map((c) => `${c.name}: ${c.weight.toFixed(2)}`)
  );
};

const spawnCardTo = (selector, targetId = "playerField") => {
  const tmpl = tempatesContainer.querySelector(selector);
  if (tmpl) {
    const fragment = tmpl.content
      ? tmpl.content.cloneNode(true)
      : tmpl.cloneNode(true);
    const cardField = document.getElementById(targetId);
    if (cardField) {
      const selectedCard = allTypesOfCards.find(
        (card) => card.name === selector
      );
      if (selectedCard) {
        const hpElement = fragment.querySelector(".stats__health__value");
        if (hpElement) hpElement.textContent = selectedCard.hp;

        const damageElement = fragment.querySelector(".stats__attack__value");
        if (damageElement) damageElement.textContent = selectedCard.damage;
      }
      cardField.appendChild(fragment);
      return cardField.lastElementChild;
    } else {
      console.error("Don't finded game field");
    }
  } else {
    console.error("Don't finded card template for selector: " + selector);
  }
};

const clearPlayerField = () => {
  const cardField = document.getElementById("playerField");
  if (cardField) {
    cardField.innerHTML = "";
    cardsPlayer.length = 0;
  }
};

const clearEnemyField = () => {
  const enemyField = document.getElementById("enemyField");
  if (enemyField) {
    enemyField.innerHTML = "";
    cardsEnemy.length = 0;
  }
};

let isCardLimit = false;
console.log("Flag status is: " + isCardLimit);

if (spawnBtn) {
  spawnBtn.addEventListener("click", () => {
    const selectedCard = chooseRandomCard();
    if (cardsPlayer.length < MAX_CARD && coins >= selectedCard.buyingCost) {
      spawnCardTo(selectedCard.name, "playerField");
      updateCardWeight(selectedCard);

      cardsPlayer.push(`${selectedCard.name}`);
      console.log("Added new card");
      console.log(
        "Array player card: " + cardsPlayer + " | Leght: " + cardsPlayer.length
      );
      TrackUserPurchaseCard(
        `Buy: ${selectedCard.name}`,
        selectedCard.buyingCost
      );
    } else if (coins < selectedCard.buyingCost) {
      console.warn("Not enough coins to buy card");
    } else if (cardsPlayer.length >= MAX_CARD) {
      console.warn("Max card on field!");
    }
  });
} else {
  console.warn("spawnBtn not found in DOM");
}

if (spawnEnemyButton) {
  spawnEnemyButton.addEventListener("click", () => {
    if (cardsEnemy.length < MAX_CARD) {
      const selectedCard = chooseRandomCard();
      spawnCardTo(selectedCard.name, "enemyField");
      updateCardWeight(selectedCard);

      cardsEnemy.push(`${selectedCard.name}`);
      console.log("Added new enemy card");
      console.log(
        "Array enemy card: " + cardsEnemy + " | Leght: " + cardsEnemy.length
      );
    } else {
      console.log("Max enemy card on field!");
    }
  });
} else {
  console.warn("spawnEnemyButton not found in DOM");
}

if (clearPlayerButton) {
  clearPlayerButton.addEventListener("click", () => {
    clearPlayerField();
    console.log(
      "Array player card: " + cardsPlayer + " | Leght: " + cardsPlayer.length
    );
  });
} else {
  console.warn("clearPlayerButton not found in DOM");
}

if (clearEnemyButton) {
  clearEnemyButton.addEventListener("click", () => {
    clearEnemyField();
    console.log(
      "Array enemy card: " + cardsEnemy + " | Leght: " + cardsEnemy.length
    );
  });
} else {
  console.warn("clearEnemyButton not found in DOM");
}
// *************************************************************************************
// START System select active card
let selectedCardElement = null;

function initCardSelection() {
  const playerField = document.getElementById("playerField");
  const enemyField = document.getElementById("enemyField");

  // Handler for player field
  if (playerField) {
    playerField.addEventListener("click", handleCardClick);
  }

  // Handler for enemy field (optional)
  if (enemyField) {
    enemyField.addEventListener("click", handleCardClick);
  }
}

function handleCardClick(event) {
  // Find the closest card
  const clickedCard = event.target.closest(
    ".card_warrior, .card_archer, .card_wizard"
  );

  if (!clickedCard) {
    // Click outside the card — remove selection
    if (selectedCardElement) {
      selectedCardElement.classList.remove("selected");
      selectedCardElement = null;
    }
    return;
  }
  // If the click is on the already selected card, remove selection
  if (selectedCardElement === clickedCard) {
    clickedCard.classList.remove("selected");
    selectedCardElement = null;
    console.log("Card deselected");
    return;
  }

  // Remove old selection
  if (selectedCardElement) {
    selectedCardElement.classList.remove("selected");
  }

  // Set new selection
  selectedCardElement = clickedCard;
  selectedCardElement.classList.add("selected");
  console.log("Card selected:", selectedCardElement);
}

// Function to get the currently selected card
function getSelectedCard() {
  return selectedCardElement;
}

// Function to clear the selection
function clearSelection() {
  if (selectedCardElement) {
    selectedCardElement.classList.remove("selected");
    selectedCardElement = null;
  }
}

//Initilization after loading DOM
document.addEventListener("DOMContentLoaded", () => {
  initCardSelection();
});

// END System select active card\
// *************************************************************************************

// *************************************************************************************
// START Call imported function
NextTurn();
AddCoins();
RemoveCoins();
ShowCoins();
// END Call imported function
// *************************************************************************************
