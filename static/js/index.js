// *************************************************************************************
// START Import module side JS files
import { NextTurn } from "./turnSystem.js";
import {
  AddCoins,
  RemoveCoins,
  addCoinsForTurn,
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

    if (cardsPlayer.length >= MAX_CARD) {
      console.warn(
        "Max card on field! Current:",
        cardsPlayer.length,
        "Max:",
        MAX_CARD
      );
      return;
    }

    if (coins < selectedCard.buyingCost) {
      console.warn(
        "Not enough coins to buy card. Need:",
        selectedCard.buyingCost,
        "Have:",
        coins
      );
      return;
    }

    spawnCardTo(selectedCard.name, "playerField");
    updateCardWeight(selectedCard);

    cardsPlayer.push(`${selectedCard.name}`);
    console.log("Added new card");
    console.log(
      "Array player card: " +
        cardsPlayer +
        " | Length: " +
        cardsPlayer.length +
        "/" +
        MAX_CARD
    );
    TrackUserPurchaseCard(`Buy: ${selectedCard.name}`, selectedCard.buyingCost);
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
const sellBtn = document.getElementById("sellCardButton");

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

  if (sellBtn) {
    sellBtn.addEventListener("click", handleSellCard);
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
      hideSellButton();
    }
    return;
  }
  // If the click is on the already selected card, remove selection
  if (selectedCardElement === clickedCard) {
    clickedCard.classList.remove("selected");
    selectedCardElement = null;
    hideSellButton();
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

  // Show sell button only for player cards
  const playerField = document.getElementById("playerField");
  if (playerField && playerField.contains(selectedCardElement)) {
    showSellButton();
  } else {
    hideSellButton();
  }

  console.log("Card selected:", selectedCardElement);
}

function showSellButton() {
  if (sellBtn) {
    sellBtn.style.display = "block";
    sellBtn.style.position = "absolute";
    sellBtn.style.zIndex = "1000";

    // Position the button near the selected card
    const cardRect = selectedCardElement.getBoundingClientRect();
    const containerRect =
      selectedCardElement.offsetParent.getBoundingClientRect();

    sellBtn.style.left = `${cardRect.left - containerRect.left}px`;
    sellBtn.style.top = `${cardRect.bottom - containerRect.top - 25}px`;
  }
}

function hideSellButton() {
  if (sellBtn) {
    sellBtn.style.display = "none";
  }
}

function handleSellCard() {
  if (!selectedCardElement) return;

  // Determine card type and get its selling cost
  const cardType = getCardTypeFromElement(selectedCardElement);
  if (!cardType) {
    console.log("Unknown card type, cannot sell");
    return;
  }

  // Find card data
  const cardData = allTypesOfCards.find((card) => {
    const cardName = card.name.replace("#card", "").toLowerCase();
    return cardName === cardType;
  });

  if (!cardData) {
    console.log("Card data not found");
    return;
  }

  // Get Sell price
  const sellPrice = Math.abs(cardData.sellingCost);

  TrackUserPurchaseCard(`Sold ${cardData.name}`, -sellPrice);

  // Delete card from player field
  const playerField = document.getElementById("playerField");
  if (playerField && playerField.contains(selectedCardElement)) {
    // Find index in array cardsPlayer
    const cardIndex = Array.from(playerField.children).indexOf(
      selectedCardElement
    );
    if (cardIndex !== -1 && cardIndex < cardsPlayer.length) {
      cardsPlayer.splice(cardIndex, 1);
    }

    // Delete DOM element
    selectedCardElement.remove();

    console.log(`Card ${cardData.name} sold for ${sellPrice} coins`);
    console.log("Remaining player cards:", cardsPlayer.length);
  }
}

function getCardTypeFromElement(cardElement) {
  if (cardElement.classList.contains("card_warrior")) return "warrior";
  if (cardElement.classList.contains("card_archer")) return "archer";
  if (cardElement.classList.contains("card_wizard")) return "wizard";
  return "";
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

  hideSellButton();
}
// END System select active card
// *************************************************************************************

//Initilization after loading DOM
document.addEventListener("DOMContentLoaded", () => {
  initCardSelection();
});

// *************************************************************************************
// START Call imported function
let turn = NextTurn();
AddCoins();
RemoveCoins();
addCoinsForTurn();
ShowCoins();
// END Call imported function
// *************************************************************************************
