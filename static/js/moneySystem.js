let coins = 0;

const AddCoins = (addEventListener = true) => {
  const btnAddCoins = document.getElementById("btnAddCoins");
  const coinValue = document.getElementById("coinsValue");

  if (btnAddCoins && coinValue) {
    btnAddCoins.addEventListener("click", () => {
      let addRandCoins = Math.round(Math.random() * 10);
      coins += addRandCoins;
      ShowCoins(coins);
      console.log(`Add ${addRandCoins} coins`);

      return coins;
    });
  } else {
    console.log("Element not found");
  }
};

const RemoveCoins = (addEventListener = true) => {
  const btnRemoveCoins = document.getElementById("btnRemoveCoins");
  const coinValue = document.getElementById("coinsValue");

  if (btnRemoveCoins && coinValue) {
    btnRemoveCoins.addEventListener("click", () => {
      let removeRandCoins = Math.round(Math.random() * 10);
      coins -= removeRandCoins;
      if (coins < 0) {
        coins = 0;
      }
      ShowCoins(coins);
      console.log(`Remove ${removeRandCoins} coins`);
      return coins;
    });
  } else {
    console.log("Element not found");
  }
};

const addCoinsForTurn = () => {
  const coinsPerTurn = 10;
  coins += coinsPerTurn;
  ShowCoins();
  console.log(`Add ${coinsPerTurn} on new turn`);
  return coins;
};

const TrackUserPurchaseCard = function (userPurchase, cost) {
  if (coins <= 0) {
    console.log("No more money for purchase, try next turn");
    return coins;
  }
  coins = Math.max(0, coins - cost);
  console.log(
    `${userPurchase} performed, ${cost} coins deducted, ${coins} remaining`
  );
  ShowCoins();
  return coins;
};

const ShowCoins = (actualcoins = coins) => {
  const scoreElement = document.getElementById("coinsValue");
  scoreElement.innerText = actualcoins;
};

// AddCoins();
// RemoveCoins();
export {
  AddCoins,
  RemoveCoins,
  addCoinsForTurn,
  TrackUserPurchaseCard,
  ShowCoins,
  coins,
};
