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
  },
  {
    name: "#cardArcher",
    id: 2,
    weightBase: 1,
    weight: 1,
    hp: 80,
    damage: 35,
  },
  {
    name: "#cardWizard",
    id: 3,
    weightBase: 1,
    weight: 1,
    hp: 65,
    damage: 45,
  },
];
const MAX_CARD = 6;
const cardsPlayer = [];
const spawnBtn = document.getElementById("spawnButton");
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

const spawnCard = (selector) => {
  const tmpl = tempatesContainer.querySelector(selector);
  if (tmpl) {
    const clone = tmpl.cloneNode(true);
    const cardField = document.getElementById("playerField");
    if (cardField) {
      const selectedCard = allTypesOfCards.find(
        (card) => card.name === selector
      );
      if (selectedCard) {
        const hpElement = clone.querySelector(".stats__health__value");
        if (hpElement) hpElement.textContent = selectedCard.hp;

        const damageElement = clone.querySelector(".stats__attack__value");
        if (damageElement) damageElement.textContent = selectedCard.damage;
      }
      cardField.appendChild(clone);
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
  const cardField = document.getElementById("enemyField");
  if (cardField) {
    cardField.innerHTML = "";
    cardsPlayer.length = 0;
  }
};

const addCardsPlayer = () => {};

let isCardLimit = false;
console.log("Flag status is: " + isCardLimit);

spawnBtn.addEventListener("click", () => {
  if (cardsPlayer.length < MAX_CARD) {
    const selectedCard = chooseRandomCard();
    spawnCard(selectedCard.name);
    updateCardWeight(selectedCard);

    cardsPlayer.push(`${selectedCard.name}`);
    console.log("Added new card");
    console.log(
      "Array player card: " + cardsPlayer + " | Leght: " + cardsPlayer.length
    );
  } else {
    console.log("Max card on field!");
  }
});

clearPlayerButton.addEventListener("click", () => {
  clearPlayerField();
  console.log(
    "Array player card: " + cardsPlayer + " | Leght: " + cardsPlayer.length
  );
});
