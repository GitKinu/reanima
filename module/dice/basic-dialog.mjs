const {DialogV2} = foundry.applications.api;

export default class BasicDialog extends DialogV2 {


  static DEFAULT_OPTIONS = {
    classes: ["dialog", "dice-roll", "themed", "theme-dark"],
    window: {
      contentTag: "form",
      contentClasses: ["standard-check", "standard-form"]
    },
    actions: {
      TestDialog: BasicDialog.testDialog
    },
    position: {
      width: "auto",
      height: "auto"
    }
  };

  async testDialog(event) {
    ChatMessage.create({});
  }
}