import {SYSTEM} from "../const/system.mjs";
import BasicDialog from "../dice/basic-dialog.mjs";
import BasicRoll from "../dice/basic-roll.mjs";
import CharacterActorSheet from "../applications/sheets/character-sheet.mjs";
const {DialogV2} = foundry.applications.api;

export default class ReanimaActor extends Actor {
  constructor(...args) {
  super(...args);

  }

  /* Data:
   * {
   * modifier: @number
   * label: @string
   * }
  */

  getAbilities(abilityId) {
    return {
      modifier: this.system.abilities[abilityId].modifier,
      label: SYSTEM.ABILITIES[abilityId].label
    }
  }

  getSkills(skillId) {
    return {
      modifier: this.system.skills[skillId].modifier,
      label: SYSTEM.SKILLS[skillId].label
    }
  }

  skillRoll(target) {
    const skill = this.getSkills(target);    
    
    BasicRoll.rollD100([skill], this);
  }

  abilityRoll(target) {
    const ability = this.getAbilities(target);

    BasicRoll.rollD10([ability], this);
  }
}