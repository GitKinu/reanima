import { SYSTEM } from "../../const/system.mjs";

const {
  HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField
} = foundry.data.fields;
const abilityMin = 0;
const abilityMax = 0;

export default class ReanimaActorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = {required: true, nullable: false, integer: true};
    const schema = {};
    
    schema.abilities = new fields.SchemaField(Object.values(SYSTEM.ABILITIES).reduce((obj, ability) => {
      obj[ability.id] = new fields.SchemaField({
        base: new fields.NumberField({...requiredInteger, initial: 5, min: 4, max: 10}),
        increases: new fields.NumberField({...requiredInteger, initial: 0, min: 0, max: 10}),
        bonus: new fields.NumberField({...requiredInteger, initial: 0, min: 0, max: 10})
      }, {label: ability.label});
      return obj;
    }, {}));

    schema.skills = new fields.SchemaField(Object.values(SYSTEM.SKILLS).reduce((obj, skill) => {
      obj[skill.id] = new fields.SchemaField({
        price: new fields.NumberField({...requiredInteger, initial: 2, min: 1, max: 3}),
        base: new fields.NumberField({...requiredInteger, initial: 0, min: 0}),
        ability: new fields.NumberField({...requiredInteger, initial: 0, min: 0}),
        natural: new fields.NumberField({...requiredInteger, initial: 0, min: 0}),
        category: new fields.NumberField({...requiredInteger, initial: 0, min: 0, max: 100}),
        specialty: new fields.StringField({}),
        attribute: new fields.StringField({ initial: skill.attribute })
      }, {label: skill.label});
      return obj;
    }, {}));

    return schema;
  }

  //Preparar habilidades y sus funciones requeridas
  _configureProgression() {
/*     return {
      abilityMin: 0,
      abilityMax: 20
    }; */
  }

    prepareDerivedData() {
    // Ability Scores
    this.#prepareFinalAbilities();
    this.#prepareFinalSkills();
  }

  /* -------------------------------------------- */
  /*  Ability Preparation                         */
  /* -------------------------------------------- */

  /**
   * Declaración de Value, es decir, el "Bono" de la habilidad
   */
  
  #prepareFinalAbilities() {
    const abilityModifiers = new Map([
        [1, -30], [2, -20], [3, -10], [4, -5],  [5, 0],
        [6, 5],   [7, 5],   [8, 10],  [9, 10],  [10, 15],
        [11, 20], [12, 20], [13, 25], [14, 25], [15, 30],
        [16, 35], [17, 35], [18, 40], [19, 40], [20, 45],
    ]);

    for (const ability of Object.values(this.abilities) ) {
      const total = ability.base + ability.increases + ability.bonus;
      ability.modifier = Math.clamp(abilityModifiers.get(total), 1, 20);
    }
  }

  #prepareFinalSkills() {
   for (const skill of Object.values(this.skills)) {
    const base = Math.floor(skill.base/skill.price);
    const ability = skill.ability * 10;
    const natural = this.abilities[skill.attribute].modifier * (skill.natural + 1);
    const bonus = Math.clamp(ability + natural, 0, 100);
    const total = base + bonus + skill.category;

    skill.modifier = total;
   }
  }
}