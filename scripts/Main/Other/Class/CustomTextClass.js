import * as utilities from "../../Configs/Config.js";
import { COLORS, COLORSYMBOLLIST, GRADIENTS } from "../Colors/ColorsConstant.js";

export default class CustomText {
  
  setRainbow(randomRainbow = false) {
    let newText = [];
    let number;

    number = randomRainbow ? utilities.getRandomInt(0, COLORSYMBOLLIST.length - 2) : 0;

    for (let i = 0; i < this.text.length; i++) {
      if (number > COLORSYMBOLLIST.length - 2) number = 0;

      const letter = this.text[i];
      const color = COLORSYMBOLLIST[number];

      if (letter === ' ') {
        newText.push(letter);
      } else {
        newText.push(color + letter);
      }

      number++;
    }

    newText.push('§r');

    return newText.join('');
  }

  setGradient(gradientColor, randomRainbow = false) {
    let newText = [];
    let number;

    number = randomRainbow ? utilities.getRandomInt(0, GRADIENTS[gradientColor].length - 2) : 0;

    for (let i = 0; i < this.text.length; i++) {
      if (number > GRADIENTS[gradientColor].length - 2) {
        number = 0;
      }

      const letter = this.text[i];
      const color = GRADIENTS[gradientColor][number];

      if (letter === ' ') {
        newText.push(letter);
      } else {
        newText.push(color + letter);
      }

      number++;
    }

    newText.push('§r');

    return newText.join('');
  }

  constructor(text) {
    this.text = text;
  }
}
