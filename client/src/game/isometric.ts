import * as PIXI from 'pixi.js';
import { bindKeyboardListeners } from './bind-keyboard-listeners';
import { gameConfigFactory } from './factories/game-config.factory';
import {
  cartesianIndicator,
  downArrowIndicatorFactory,
  draggedIndicatorFactory,
  dragIndicatorFactory,
  leftArrowIndicatorFactory,
  mapVelocityIndicatorFactory,
  myContainerIndicator,
  myContainerParentIndicator,
  orientationIndicatorFactory,
  rightArrowIndicatorFactory,
  tileIndicator,
  upArrowIndicatorFactory,
} from './indicators';
import { AssetCollection } from './models/assets';
import { IsometricGraphic } from './models/isometric-graphic';
import { IsometricSprite } from './models/isometric-sprite';
import { indexToIso } from './utils/index-to-iso';
import { isoToIndex } from './utils/iso-to-index';

export const isoMetricGame = (
  { stage, renderer, view: { width, height } }: PIXI.Application,
  assetCollection: Partial<AssetCollection>,
) => {
  requestAnimationFrame(animate);

  const config = gameConfigFactory(width, height, () => {
    tearDownScene();
    initScene();
  });

  const Stats = require('stats.js');
  const stats = new Stats();
  stats.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = 'unset';
  stats.domElement.style.right = '8px';
  stats.domElement.style.top = '8px';
  document.body.appendChild(stats.dom);

  let velx = 0;
  let vely = 0;

  let delx = 0;
  let dely = 0;

  let draggedx = 0;
  let draggedy = 0;

  let dragging = false;

  let count2 = 0;

  const background = new PIXI.Container();

  let myContainer: IsometricSprite;

  const orientationIndicator = orientationIndicatorFactory(height);
  const dragIndicator = dragIndicatorFactory(height);
  const draggedIndicator = draggedIndicatorFactory(height);

  const upArrowIndicator = upArrowIndicatorFactory(height, width);
  const downArrowIndicator = downArrowIndicatorFactory(height, width);
  const leftArrowIndicator = leftArrowIndicatorFactory(height, width);
  const rightArrowIndicator = rightArrowIndicatorFactory(height, width);

  const mapVelocityIndicator = mapVelocityIndicatorFactory(width);

  stage.sortableChildren = true;

  stage.addChild(
    // top left indicators
    cartesianIndicator,
    tileIndicator,
    myContainerIndicator,
    myContainerParentIndicator,
    mapVelocityIndicator,

    // bottom left indicators
    draggedIndicator,
    dragIndicator,
    orientationIndicator,

    // bottom right indicators
    upArrowIndicator,
    downArrowIndicator,
    leftArrowIndicator,
    rightArrowIndicator,
  );

  const initScene = () => {
    for (let i = -config.mapRadius; i <= config.mapRadius; i++) {
      for (let j = -config.mapRadius; j <= config.mapRadius; j++) {
        background.addChild(initTile(i, j));
        setTile(i, j);
      }
    }

    // render the tilemap to a render texture
    const texture = PIXI.RenderTexture.create({
      width: config.offsetX * 2,
      height:
        (config.offsetY + (config.tileWidth * config.scale) / config.ai) * 2,
    });

    renderer.render(background, texture);

    // create a single background sprite with the texture
    myContainer = new PIXI.Sprite(texture) as IsometricSprite;

    stage.addChild(myContainer);
    myContainer.x = -400;
    myContainer.y = -400;

    myContainer.interactive = true;

    const mouseDownInteraction = ({
      data,
    }: PIXI.interaction.InteractionEvent) => {
      dragging = true;
      dragIndicator.text = 'yay';
      myContainer.sx =
        data.getLocalPosition(myContainer).x * myContainer.scale.x;
      myContainer.sy =
        data.getLocalPosition(myContainer).y * myContainer.scale.y;
      delx = dely = 0;
      velx = vely = 0;
      draggedx = 0;
      draggedy = 0;
    };

    const mouseUpInteraction = () => {
      dragging = false;
      dragIndicator.text = 'not dragging';

      draggedIndicator.text = '';

      if (Math.abs(draggedx) < 1 && Math.abs(draggedy) < 1) {
        setGraphicTileColor(
          isoToIndex(myContainer.sx, myContainer.sy, config),
          '0xFF0000',
        );
        renderer.render(background, texture);
      } else {
        velx = Math.floor(myContainer.position.x - delx);
        vely = Math.floor(myContainer.position.y - dely);
        delx = dely = 0;
      }
    };

    const mouseMoveInteraction = ({
      data,
    }: PIXI.interaction.InteractionEvent) => {
      const newPosition = data.getLocalPosition(myContainer);
      const c = isoToIndex(newPosition.x, newPosition.y, config);

      if (dragging) {
        const parentPosition = data.getLocalPosition(myContainer.parent);

        draggedIndicator.text = `dragged: { x: ${draggedx.toFixed(
          2,
        )}, y: ${draggedy.toFixed(2)}}`;

        myContainerIndicator.text = `myContainer = { x: ${(
          newPosition.x - myContainer.sx
        ).toFixed(2)}, y: ${(newPosition.y - myContainer.sy).toFixed(2)}}`;

        myContainerParentIndicator.text = `myContainer.parent = { x: ${data
          .getLocalPosition(myContainer.parent)
          .x.toFixed(2)}, y: ${data
          .getLocalPosition(myContainer.parent)
          .y.toFixed(2)} }`;

        draggedx += myContainer.position.x / 1000;
        draggedy += myContainer.position.y / 1000;

        delx = myContainer.position.x;
        dely = myContainer.position.y;

        myContainer.position.x = parentPosition.x - myContainer.sx;
        myContainer.position.y = parentPosition.y - myContainer.sy;
      } else if (!isNaN(newPosition.x) && !isNaN(newPosition.y)) {
        cartesianIndicator.text = `${newPosition.x.toFixed(
          2,
        )}, ${newPosition.y.toFixed(2)}`;
        tileIndicator.text = c.toString();
      }
    };

    myContainer.addListener('mousedown', mouseDownInteraction);
    myContainer.addListener('touchstart', mouseDownInteraction);

    myContainer.addListener('mouseup', mouseUpInteraction);
    myContainer.addListener('touchend', mouseUpInteraction);

    myContainer.addListener('mousemove', mouseMoveInteraction);
    myContainer.addListener('touchmove', mouseMoveInteraction);

    bindKeyboardListeners(
      upArrowIndicator,
      downArrowIndicator,
      rightArrowIndicator,
      leftArrowIndicator,
      ({ dvelx, dvely, hardSetX, hardSetY }) => {
        if (hardSetX !== undefined) {
          velx = hardSetX;
        }

        if (dvelx) {
          velx += dvelx;
        }

        if (hardSetY !== undefined) {
          vely = hardSetY;
        }

        if (dvely) {
          vely += dvely;
        }
      },
    );

    if (assetCollection['zoom-in'] && assetCollection['zoom-out']) {
      const zoomInButtonSprite = new PIXI.Sprite(
        assetCollection['zoom-in'].texture,
      );
      const zoomOutButtonSprite = new PIXI.Sprite(
        assetCollection['zoom-out'].texture,
      );

      zoomInButtonSprite.buttonMode = true;
      zoomOutButtonSprite.buttonMode = true;
      zoomInButtonSprite.interactive = true;
      zoomOutButtonSprite.interactive = true;

      zoomInButtonSprite.anchor.set(0.5);
      zoomOutButtonSprite.anchor.set(0.5);

      zoomInButtonSprite.position.x = width - 275;
      zoomInButtonSprite.position.y = height - 40;

      zoomOutButtonSprite.position.x = width - 200;
      zoomOutButtonSprite.position.y = height - 40;

      zoomInButtonSprite.on('click', () => config.increaseScale());
      zoomInButtonSprite.on('touch', () => config.increaseScale());

      zoomOutButtonSprite.on('click', () => config.decreaseScale());
      zoomOutButtonSprite.on('touch', () => config.decreaseScale());

      stage.addChild(zoomInButtonSprite, zoomOutButtonSprite);
    }
  };

  const tearDownScene = () => {
    myContainer.destroy({ children: true, texture: true, baseTexture: true });
  };

  const setGraphicTileColor = (ij: any[] | number[], color: string) => {
    const i = ij[0];
    const j = ij[1];
    const num =
      (i + config.mapRadius) * (2 * config.mapRadius + 1) +
      j +
      config.mapRadius;
    const gr = background.getChildAt(num) as IsometricGraphic;

    gr.clear();

    gr.color = color;
    gr.beginFill(gr.color as any);

    gr.moveTo(gr.c1[0], gr.c1[1]);
    gr.lineTo(gr.c2[0], gr.c2[1]);
    gr.lineTo(gr.c3[0], gr.c3[1]);
    gr.lineTo(gr.c4[0], gr.c4[1]);

    gr.endFill();
  };

  const initTile = (i: number, j: number) => {
    const gr = new PIXI.Graphics() as IsometricGraphic;

    gr.c1 = indexToIso(i + 1 - config.tileGap, j + config.tileGap, config);
    gr.c2 = indexToIso(i + 1 - config.tileGap, j + 1 - config.tileGap, config);
    gr.c3 = indexToIso(i + config.tileGap, j + 1 - config.tileGap, config);
    gr.c4 = indexToIso(i + config.tileGap, j + config.tileGap, config);

    gr.hitArea = new PIXI.Polygon([
      new PIXI.Point(gr.c1[0], gr.c1[1]),
      new PIXI.Point(gr.c2[0], gr.c2[1]),
      new PIXI.Point(gr.c3[0], gr.c3[1]),
      new PIXI.Point(gr.c4[0], gr.c4[1]),
    ]);

    return gr;
  };

  const setTile = (i: number, j: number) => {
    const num =
      (i + config.mapRadius) * (2 * config.mapRadius + 1) +
      j +
      config.mapRadius;
    const gr = background.getChildAt(num) as IsometricGraphic;

    gr.c1 = indexToIso(i + 1 - config.tileGap, j + config.tileGap, config);
    gr.c2 = indexToIso(i + 1 - config.tileGap, j + 1 - config.tileGap, config);
    gr.c3 = indexToIso(i + config.tileGap, j + 1 - config.tileGap, config);
    gr.c4 = indexToIso(i + config.tileGap, j + config.tileGap, config);

    let c = '009900';
    if (j < -7) {
      c = '990000';
    }
    if (i < -7) {
      c = '990000';
    }
    if (j > 7) {
      c = '990000';
    }
    if (i > 7) {
      c = '990000';
    }

    if (i === -5) {
      c = '000099';
    }
    setGraphicTileColor([i, j], '0x' + c);
  };

  initScene();

  let winmode = '';
  setInterval(() => {
    if (window.innerHeight > window.innerWidth) {
      winmode = 'portrait';
    } else {
      winmode = 'landscape';
    }
    orientationIndicator.text = winmode;
  }, 500);

  function animate() {
    stats.begin();

    mapVelocityIndicator.text = `Velocity: { x: ${velx}, y: ${vely} }`;

    if (dragging) {
      count2 += 1;
      dragIndicator.text = `dragging for ${count2} animation frames`;
    } else {
      count2 = 0;
    }

    if (velx > 0) {
      myContainer.position.x += velx;
      velx -= 1;
    }

    if (velx < 0) {
      myContainer.position.x += velx;
      velx += 1;
    }

    if (vely > 0) {
      myContainer.position.y += vely;
      vely -= 1;
    }

    if (vely < 0) {
      myContainer.position.y += vely;
      vely += 1;
    }

    if (myContainer.position.x < config.borderL) {
      myContainer.position.x = config.borderL;
    }
    if (myContainer.position.x > config.borderR) {
      myContainer.position.x = config.borderR;
    }
    if (myContainer.position.y < config.borderD) {
      myContainer.position.y = config.borderD;
    }
    if (myContainer.position.y > config.borderU) {
      myContainer.position.y = config.borderU;
    }

    renderer.render(stage);
    stats.end();
    requestAnimationFrame(animate);
  }
};
