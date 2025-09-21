//  Initialize function turn system
const NextTurn = function (addEventListener = true) {
  let turn = 1;
  const btnNextTurn = document.getElementById("btnNextTurn");
  const counterTurnValue = document.getElementById("counterTurnValue");
  if (btnNextTurn && counterTurnValue) {
    btnNextTurn.addEventListener("click", () => {
      turn++;
      counterTurnValue.innerText = turn;
      //   turnScore = 100;
      //   ShowTurnScore(turnScore);
      //   updateBtnState(turnScore);
      //   console.log(`Turn: ${turn}, Score reset to ${turnScore}`);
    });
  } else {
    console.log("Element not found");
  }
};
// End Initialize function turn system

// Call function turn system
// NextTurn();
// End Call function turn system

// Export functions to main index.js
export { NextTurn };
