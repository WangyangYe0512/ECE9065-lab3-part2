/* In this module, create three classes: Play, Act, and Scene. */
export class Play {
  constructor(title, short, persona, acts) {
      this.title = title;
      this.short = short;
      this.persona = persona;
      this.acts = acts;
  }
}

export class Act {
  constructor(name, scenes) {
      this.name = name;
      this.scenes = scenes;
  }
}

export class Scene {
  constructor(name, title, stageDirection, speeches) {
      this.name = name;
      this.title = title;
      this.stageDirection = stageDirection;
      this.speeches = speeches;
  }
}