import { addCoinsForTurn, ShowCoins } from "./moneySystem.js";

//  Initialize function turn system
const NextTurn = function (addEventListener = true) {
  let turn = 1;
  const btnNextTurn = document.getElementById("btnNextTurn");
  const counterTurnValue = document.getElementById("counterTurnValue");
  if (!btnNextTurn && counterTurnValue) {
    console.log("Element not found");
  } else {
    btnNextTurn.addEventListener("click", () => {
      turn++;
      counterTurnValue.innerText = turn;
      console.log(`New turn. Tern ${turn}`);

      // Add coins per turn
      addCoinsForTurn();

      return turn;
    });
  }
};
// End Initialize function turn system

// Export functions to main index.js
export { NextTurn };
