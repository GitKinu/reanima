import * as ATTRIBUTES from "./attributes.mjs";
import * as SKILL from "./skills.mjs";

export const SYSTEM = {
  ABILITIES: ATTRIBUTES.ABILITIES,
  SKILL: {...SKILL},
  SKILLS: SKILL.SKILLS
};