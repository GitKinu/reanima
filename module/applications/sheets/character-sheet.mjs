const {api, sheets} = foundry.applications;
import BasicDialog from "../../dice/basic-dialog.mjs";

export default class CharacterActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["themed", "themed-dark"],
    tag: "form",
    position: {
      width: 900,
      height: 760
    },
    actions: {
      abilityRoll: CharacterActorSheet.#onAbilityRoll,
      skillRoll: CharacterActorSheet.#onSkillRoll
      
    },
    form: {
      submitOnChange: true
    }
  };

  static PARTS = {
    main: {
      id: "main",
      template: "systems/reanima/templates/actors/actor-sheet.hbs",
      root: true
    }
  };

  /*static TABS = [
    { tab: "principal", label: "RE.Principal", icon: "" }
  ];*/

  /*
   * Tiradas automaticas
   */

  static async #onAbilityRoll(_event, target) {
    
    return this.actor.abilityRoll(target.closest(".ability").dataset.ability);
  }
  
  static async #onSkillRoll(_event, target) {
    
    return this.actor.skillRoll(target.closest(".skill").dataset.skill);
  }

  /*
   * Enviar datos a la ficha
   */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.document;
    context.abilities = this.#prepareAbilities();
    context.skills = this.#prepareSkills();

    return context;
  }

  /*
   * Crear los objetos duplicados en base al datamodel,
   */

  #prepareAbilities() {
    const a = this.actor.system.abilities;
    const abilities = Object.values(SYSTEM.ABILITIES).map(cfg => {
      const ability = foundry.utils.deepClone(cfg);     
      ability.base = a[ability.id].base;
      ability.increases = a[ability.id].increases;
      ability.bonus = a[ability.id].bonus;
      ability.modifier = a[ability.id].modifier;

      ability.label = game.i18n.localize(ability.label);
      ability.abbreviation = game.i18n.localize(ability.abbreviation);
      return ability;
    });
    abilities.sort((a, b) => a.sheetOrder - b.sheetOrder);
    return abilities;
  }

  #prepareSkills() {
    const a = this.actor.system.skills;
    const skills = Object.values(SYSTEM.SKILLS).map(cfg => {
      const skill = foundry.utils.deepClone(cfg);
      skill.price = a[skill.id].price;
      skill.base = a[skill.id].base;
      skill.ability = a[skill.id].ability;
      skill.natural = a[skill.id].natural;
      skill.category = a[skill.id].category;   
      skill.modifier = a[skill.id].modifier;

      skill.label = game.i18n.localize(skill.label);
      return skill;
    })
    return skills;
  }

}