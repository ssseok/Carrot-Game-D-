"use strict";
import PopUp from "./popup.js";
import GameBulder, { Reason } from "./game.js";
import * as sound from "./sound.js";

const gameFinishBanner = new PopUp();

const game = new GameBulder()
  .withGameDuration(60)
  .withCarrotCount(15)
  .withBugCount(10)
  .build();

game.setGameStopListener((res) => {
  console.log(res);
  let messge;
  switch (res) {
    case Reason.cancel:
      messge = "REPLAY?";
      sound.playAlert();

      break;
    case Reason.win:
      messge = "YOU WON";
      sound.playWin();

      break;
    case Reason.lose:
      messge = "YOU LOSE";
      sound.playBug();

      break;
    default:
      throw new Error("NO");
  }
  gameFinishBanner.showWithText(messge);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
