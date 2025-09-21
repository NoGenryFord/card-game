let coins = 0;

const AddCoins = (addEventListener = true) => {
  //   let coins = 0;
  const btnAddCoins = document.getElementById("btnAddCoins");
  const coinValue = document.getElementById("coinsValue");

  if (btnAddCoins && coinValue) {
    btnAddCoins.addEventListener("click", () => {
      //   if (btnAddCoins.disabled) {
      //     return;
      //   }
      let addRandCoins = Math.round(Math.random() * 10);
      coins += addRandCoins;
      // coinValue.innerText = coins;
      ShowCoins(coins);
      return coins;

      //   TrackAction("Add Coins", 15);
    });
  } else {
    console.log("Element not found");
  }
};

const RemoveCoins = (addEventListener = true) => {
  //   let coins = 0;
  const btnRemoveCoins = document.getElementById("btnRemoveCoins");
  const coinValue = document.getElementById("coinsValue");

  if (btnRemoveCoins && coinValue) {
    btnRemoveCoins.addEventListener("click", () => {
      //   if (btnRemoveCoins.disabled) {
      //     return;
      //   }
      let removeRandCoins = Math.round(Math.random() * 10);
      coins -= removeRandCoins;
      if (coins < 0) {
        coins = 0;
      }
      // coinValue.innerText = coins;
      ShowCoins(coins);
      return coins;

      //   TrackAction("Remove Coins", 15);
    });
  } else {
    console.log("Element not found");
  }
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
export { AddCoins, RemoveCoins, TrackUserPurchaseCard, ShowCoins, coins };
