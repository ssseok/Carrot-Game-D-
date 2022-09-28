"use strict";
import PopUp from "./popup.js";
import Game from "./game.js";

const gameFinishBanner = new PopUp();

const game = new Game(2, 2, 2);
game.setGameStopListener((res) => {
  console.log(res);
  let messge;
  switch (res) {
    case "cancel":
      messge = "REPLAY?";
      break;
    case "win":
      messge = "YOU WON";
      break;
    case "lose":
      messge = "YOU LOSE";
      break;
    default:
      throw new Error("NO");
  }
  gameFinishBanner.showWithText(messge);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
