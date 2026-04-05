const {api, sheets} = foundry.applications;

export default class CharacterActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["themed", "themed-dark"],
    tag: "form",
    position: {
      width: 900,
      height: 760
    },
    actions: {

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

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    //context.system = this.document.system;
    context.actor = this.document;
    context.abilities = this.#prepareAbilities();
    context.skills = this.#prepareSkills();

    return context;
  }

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
      skill.value = a[skill.id].value;

      skill.label = game.i18n.localize(skill.label);
      return skill;
    })
    return skills;
  }
  
}