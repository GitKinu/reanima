
const foundryTerm = foundry.dice.terms;

export default class BasicRoll extends Roll {
  //Aun no usas default data 
  //console.log("DiceResult: "+roll.dice[0].results[0].result);
  static rollData = {
    terms: [],
    canOpen: "",
    openThreshold: 90,
    fumbleThreshold: 3,
  };
  
  static operator = new foundryTerm.OperatorTerm({ operator: "+" });

  static async #checkOpenRoll(dice, terms){
    if (dice.total >= 90) {
      dice.options = {flavor: "¡Abierta!"};
      const openDice = await new foundryTerm.Die({ faces: 100, number: 1 }).evaluate();
      terms.push(this.operator);
      terms.push(openDice);
      await this.#checkOpenRoll(openDice, terms);
      await this.#checkDoubles(openDice, terms);
    }
  }

  static async #checkDoubles(dice, terms) {
    const doubles = [11, 22, 33, 44, 55, 66, 77, 88];
    const firstDigit = Math.floor(dice.total / 10);
    
    if (dice.total == doubles[firstDigit-1]) {
      const doublesD10 = await new Roll("1d10").roll();
      dice.options = {flavor: "d10: " + doublesD10.total};
      if (doublesD10.total == firstDigit) {
        const openDice = await new foundryTerm.Die({ faces: 100, number: 1 }).evaluate();
        console.log(openDice);
        terms.push(this.operator);
        terms.push(openDice);
        await this.#checkOpenRoll(openDice, terms);
        await this.#checkDoubles(openDice, terms);
      }
    }
  }

  static #checkChallenges(roll) {
    const challenges = new Map([
      [0 , "CHALLENGES.Blank"],
      [20, "CHALLENGES.Routine"],
      [40, "CHALLENGES.Easy"],
      [80, "CHALLENGES.Medium"],
      [120, "CHALLENGES.Hard"],
      [140, "CHALLENGES.VeryHard"],
      [240, "CHALLENGES.AlmostImpossible"],
      [280, "CHALLENGES.Impossible"],
      [320, "CHALLENGES.Inhuman"],
      [440, "CHALLENGES.Zen"]
    ]);

    let challenge = 0;
    for (const key of challenges.keys()) {
      if (key <= roll.total) {
        challenge = key;
      }
      else { break; }
    }
    
    ChatMessage.create({ content: game.i18n.localize( challenges.get(challenge)) }); 
  }
  
  //The rolls
  /*
   * Formula[X]: X[{ modifier: number, label: string }]
   * Actor: actor
   */

  static async rollD100(formula, actor) {
    const roll = await new Roll("1d100").roll();
    const terms = [...roll.terms];

    let label = "Roll";
    for (const factor of formula) {
      label += " + " + factor.label;
      const factorTerm = new foundryTerm.NumericTerm({ number: factor.modifier }).evaluate();
      terms.push(this.operator);
      terms.push(factorTerm);
    }

    if (roll.dice[0].total <= 3) {
      roll.dice[0].options = {flavor: "¡Pifia!"};
      new Roll("1d100").toMessage({ flavor: "Valor de la pifia", speaker: ChatMessage.getSpeaker({ actor }) });
    }

    await this.#checkOpenRoll(roll.dice[0], terms);

    await this.#checkDoubles(roll.dice[0], terms);

    const finalRoll = await Roll.fromTerms(terms);
    finalRoll.toMessage({ flavor: label, speaker: ChatMessage.getSpeaker({ actor }) }, {});

    this.#checkChallenges(finalRoll);
  }

  static async rollD10(formula, actor) {
    const roll = await new Roll("1d10").roll();
    const terms = [...roll.terms];

    const rule10 = new foundryTerm.NumericTerm({ number: 2 }).evaluate();
    
    let label = "Roll";
    for (const factor of formula) {
      label += " + " + factor.label;
      const factorTerm = new foundryTerm.NumericTerm({ number: factor.modifier }).evaluate();
      terms.push(this.operator);
      terms.push(factorTerm);
    }

    if(roll.dice[0].total == 10){
      terms.push(this.operator);
      terms.push(rule10);
    }

    const finalRoll = await Roll.fromTerms(terms);
    finalRoll.toMessage({ flavor: label, speaker: ChatMessage.getSpeaker({ actor }) }, {});
  }

}