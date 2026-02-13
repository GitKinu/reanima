const {
  HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField
} = foundry.data.fields;

export default class Character extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      name: new HTMLField(),
      attributes: new SchemaField({
        base: new NumberField({ required: true, nullable: false, integer: true, min: 4, initial: 5, label: "RA.Attributes"})
      }),
      lifePoints: new SchemaField({
        value: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 100, label: "RA.LifePoints" }),
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