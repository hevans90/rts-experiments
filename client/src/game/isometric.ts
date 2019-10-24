import * as PIXI from 'pixi.js';
import { bindKeyboardListeners } from './bind-keyboard-listeners';
import { gameConfigFactory } from './factories/game-config.factory';
import {
  cartesianIndicator,
  downArrowIndicatorFactory,
  draggedIndicatorFactory,
  dragIndicatorFactory,
  leftArrowIndicatorFactory,
  mapVelocityIndicator,
  myContainerIndicator,
  myContainerParentIndicator,
  oldSelectedIndicator,
  orientationIndicatorFactory,
  rightArrowIndicatorFactory,
  selectedIndicator,
  tileIndicator,
  upArrowIndicatorFactory,
} from './indicators';
import { AssetCollection } from './models/assets';
import { IsometricGraphic } from './models/isometric-graphic';
import { IsometricStack, Tile } from './models/isometric-sprite';
import { mouseDownInteraction } from './mouse/mouse-down';
import {
  isCoordsUpdate,
  isPositionalUpdate,
  mouseMoveInteraction,
} from './mouse/mouse-move';
import { mouseUpInteraction } from './mouse/mouse-up';
import { initTile } from './tiles/init-tile';
import { performanceStatsFactory } from './ui/performance-stats';
import { zoomButtonsFactory } from './ui/zoom-buttons';
import { indexToIso } from './utils/index-to-iso';
import { isoToIndex } from './utils/iso-to-index';
import { KeyboardItem } from './utils/keyboard';

export const isoMetricGame = (
  { stage, renderer, view: { width, height } }: PIXI.Application,
  assetCollection: Partial<AssetCollection>,
) => {
  requestAnimationFrame(animate);

  const config = gameConfigFactory(width, height, () => {
    tearDownScene();
    initScene();
  });

  const stats = performanceStatsFactory();

  let velx = 0;
  let vely = 0;

  let delx = 0;
  let dely = 0;

  let draggedx = 0;
  let draggedy = 0;

  let dragging = false;

  let count2 = 0;

  let background: PIXI.Container;

  let myContainer: IsometricStack;
  let oldSelected: Tile;
  let texture: PIXI.RenderTexture;

  const orientationIndicator = orientationIndicatorFactory(height);
  const dragIndicator = dragIndicatorFactory(height);
  const draggedIndicator = draggedIndicatorFactory(height);

  const upArrowIndicator = upArrowIndicatorFactory(height, width);
  const downArrowIndicator = downArrowIndicatorFactory(height, width);
  const leftArrowIndicator = leftArrowIndicatorFactory(height, width);
  const rightArrowIndicator = rightArrowIndicatorFactory(height, width);

  let keyboardListeners: KeyboardItem[];

  stage.sortableChildren = true;

  stage.addChild(
    // top left indicators
    cartesianIndicator,
    tileIndicator,
    myContainerIndicator,
    myContainerParentIndicator,
    mapVelocityIndicator,
    selectedIndicator,
    oldSelectedIndicator,

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

  if (assetCollection['zoom-in'] && assetCollection['zoom-out']) {
    stage.addChild(
      ...zoomButtonsFactory(
        {
          'zoom-in': assetCollection['zoom-in'],
          'zoom-out': assetCollection['zoom-out'],
        },
        width,
        height,
        config,
      ),
    );
  }

  const initScene = () => {
    background = new PIXI.Container();
    for (let i = -config.mapRadius; i <= config.mapRadius; i++) {
      for (let j = -config.mapRadius; j <= config.mapRadius; j++) {
        background.addChild(initTile(i, j, config));
        setTile(i, j);
      }
    }

    // render the tilemap to a render texture
    texture = PIXI.RenderTexture.create({
      width: config.offsetX * 2,
      height:
        (config.offsetY + (config.tileWidth * config.scale) / config.ai) * 2,
    });

    renderer.render(background, texture);

    if (myContainer && myContainer.selected) {
      oldSelected = myContainer.selected;
      oldSelectedIndicator.text = `Prev. Selected: i: ${oldSelected.i}, j: ${oldSelected.j}`;
    }

    // create a single background sprite with the texture
    myContainer = new PIXI.Sprite(texture) as IsometricStack;
    myContainer.selected = oldSelected || undefined;

    if (myContainer.selected) {
      selectedIndicator.text = `Selected: i: ${myContainer.selected.i}, j: ${myContainer.selected.j}`;
    }

    stage.addChild(myContainer);
    myContainer.x = -400;
    myContainer.y = -400;

    myContainer.interactive = true;

    bindMouseEvents();
    bindKeyboardEvents();
  };

  const tearDownScene = () => {
    background.destroy({ children: true, texture: true, baseTexture: true });
    myContainer.destroy({ children: true, texture: true, baseTexture: true });
    myContainer.removeAllListeners();
    keyboardListeners.forEach(item => item.unsubscribe());
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

    setGraphicTileColor([i, j], '0x009900');

    if (myContainer && myContainer.selected) {
      // retain selected tile somehow
    }
  };

  const unSelectTile = ({ i, j }: Tile) => {
    setGraphicTileColor([i, j], '0x009900');
    renderer.render(background, texture);
  };

  const selectTile = ({ i, j }: Tile) => {
    setGraphicTileColor([i, j], '0xFF0000');
    renderer.render(background, texture);
  };

  const bindMouseEvents = () => {
    const mouseDownHandler = (event: PIXI.interaction.InteractionEvent) => {
      if (myContainer.selected) {
        oldSelected = myContainer.selected;
        oldSelectedIndicator.text = `Prev. Selected: i: ${oldSelected.i}, j: ${oldSelected.j}`;
      }
      const handledEvent = mouseDownInteraction(event, myContainer);

      ({ dragging, draggedx, draggedy, delx, dely, velx, vely } = handledEvent);
      draggedIndicator.text = handledEvent.dragIndicatorText;

      const [i, j] = isoToIndex(
        handledEvent.selected.x,
        handledEvent.selected.y,
        config,
      );
      myContainer.selected = { ...handledEvent.selected, i, j };
      selectedIndicator.text = `Selected: i: ${myContainer.selected.i}, j: ${myContainer.selected.j}`;
    };

    const mouseUpHandler = () => {
      const handledEvent = mouseUpInteraction(
        draggedx,
        draggedy,
        () => {
          if (oldSelected) {
            unSelectTile(oldSelected);
          }
          selectTile(myContainer.selected as Tile);
        },
        myContainer,
        delx,
        dely,
      );
      dragIndicator.text = handledEvent.dragIndicatorText;
      draggedIndicator.text = handledEvent.draggedIndicatorText;
      dragging = false;

      if (handledEvent.dragged) {
        ({ velx, vely, delx, dely } = handledEvent.dragged);
      }
    };

    const mouseMoveHandler = (event: PIXI.interaction.InteractionEvent) => {
      const handledEvent = mouseMoveInteraction(
        event,
        myContainer,
        config,
        dragging,
        draggedx,
        draggedy,
      );

      if (isPositionalUpdate(handledEvent)) {
        ({ delx, dely, draggedx, draggedy } = handledEvent);
        myContainer.position.x = handledEvent.newContainerPositionX;
        myContainer.position.y = handledEvent.newContainerPositionY;
        draggedIndicator.text = handledEvent.draggedIndicatorText;
        myContainerIndicator.text = handledEvent.containerIndicatorText;
        myContainerParentIndicator.text =
          handledEvent.containerParentIndicatorText;
      } else if (isCoordsUpdate(handledEvent)) {
        cartesianIndicator.text = handledEvent.cartesianIndicatorText;
        tileIndicator.text = handledEvent.tileIndicatorText;
      }
    };

    myContainer.addListener('mousedown', event => mouseDownHandler(event));
    myContainer.addListener('touchstart', event => mouseDownHandler(event));

    myContainer.addListener('mouseup', mouseUpHandler);
    myContainer.addListener('touchend', mouseUpHandler);

    myContainer.addListener('mousemove', event => mouseMoveHandler(event));
    myContainer.addListener('touchmove', event => mouseMoveHandler(event));
  };

  const bindKeyboardEvents = () => {
    keyboardListeners = bindKeyboardListeners(
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
