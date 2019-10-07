import * as PIXI from 'pixi.js';

// load an image and run the `setup` function when it's done
export const catLoader = (app: PIXI.Application) => {
  const cat = require('../assets/cat.png');
  PIXI.Loader.shared.add(cat).load(() => {
    const sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[cat].texture);
    sprite.position.x = 150;
    sprite.position.y = 150;
    app.stage.addChild(sprite);
  });
};
