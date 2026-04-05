import * as applications from "./module/applications/_module.mjs";
import * as models from "./module/models/_module.mjs";
import * as documents from "./module/documents/_module.mjs";

import {SYSTEM} from "./module/const/system.mjs";
globalThis.SYSTEM = SYSTEM;

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  console.log("Iniciando Re:Anima");
  const reanima = globalThis.reanima = game.system;
  reanima.CONST = SYSTEM;

//Cosas de documentos y datamodels

  CONFIG.Actor.documentClass = documents.ReanimaActor;
  
  CONFIG.Actor.dataModels = {
    character: models.ReanimaActorDataModel
  };

//Desregistrar la ficha base y registrar la ficha del systema

  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, "reanima", applications.CharacterActorSheet, {
    types: ["character"],
    label: "RA.SheetClass.Character",
    makeDefault: true
  });

  /* -------------------------------------------- */
  /*  Localization Initialization                 */
  /* -------------------------------------------- */

  Hooks.once("i18nInit", function() {
  console.log("Localización inicializada");
  const toLocalize = [
    ["ABILITIES", ["abbreviation", "label"]]
  ];

  for ( const c of toLocalize ) {
    let key = c;
    let attrs = ["label"];
    if ( Array.isArray(c) ) [key, attrs] = c;
    const conf = foundry.utils.getProperty(SYSTEM, key);

    for ( const [k, v] of Object.entries(conf) ) {
      if ( typeof v === "object" ) {
        for ( const attr of attrs ) {
          if ( typeof v[attr] === "function" ) v[attr] = v[attr]();
          else if ( typeof v[attr] === "string" ) v[attr] = game.i18n.localize(v[attr]);
        }
      }
      else {
        if ( typeof v === "function" ) conf[k] = v();
        else if ( typeof v === "string" ) conf[k] = game.i18n.localize(v);
      }
    }

  }

  });

})