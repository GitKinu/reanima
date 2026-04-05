import {SYSTEM} from "../const/system.mjs";
const {DialogV2} = foundry.applications.api;

export default class ReanimaActor extends Actor {
  constructor(...args) {
  super(...args);

  }

  get abilities() {
    return this.system.abilities;
  }

  getAbilityBonus() {
    
  }
}