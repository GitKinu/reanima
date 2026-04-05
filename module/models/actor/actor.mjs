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
        bonus: new fields.NumberField({...requiredInteger, initial: 0, min: 0})
      }, {label: ability.label});
      return obj;
    }, {}));

    schema.skills = new fields.SchemaField(Object.values(SYSTEM.SKILLS).reduce((obj, skill) => {
      obj[skill.id] = new fields.SchemaField({
        base: new fields.NumberField({...requiredInteger, initial: 5, min: 4, max: 10}),
        bonus: new fields.NumberField({...requiredInteger, initial: 0, min: 0}),
        category: new fields.NumberField({...requiredInteger, initial: 0, min: 0})
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

    prepareBaseData() {
    this._prepareBaseAbilities();
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
   * Prepare ability scores for all Actor subtypes.
   */
  _prepareBaseAbilities() {}

  /* -------------------------------------------- */

  /**
   * Declaración de Value, es decir, el "Bono" de la habilidad
   */
  #prepareFinalAbilities() {
    for ( const ability of Object.values(this.abilities) ) {
      const total = ability.base + ability.increases + ability.bonus;
      ability.value = Math.clamp(total, abilityMin, abilityMax);
    }
  }

  #prepareFinalSkills() {
   for (const skill of Object.values(this.skills)) {
    const total = skill.base + skill.bonus + skill.category;
    skill.value = total;
   } 
  }
}