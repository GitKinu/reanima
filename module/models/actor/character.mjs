const {
  HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField
} = foundry.data.fields;

export default class Character extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      name: new HTMLField(),
      health: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      proficiencies: new SchemaField({
        weapons: new ArrayField(new StringField()),
        skills: new ArrayField(new StringField())
      }),
      crest: new FilePathField({ required: false, categories: ["IMAGE"] }),
      xp: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
    };
  }
}