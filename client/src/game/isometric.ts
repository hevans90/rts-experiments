import { OutlineFilter } from '@pixi/filter-outline';
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
  orientationIndicatorFactory,
  rightArrowIndicatorFactory,
  selectedIndicator,
  tileIndicator,
  upArrowIndicatorFactory,
} from './indicators';
import { AssetCollection } from './models/assets';
import { IsometricGraphic } from './models/isometric-graphic';
import { IsometricLayer } from './models/isometric-layer';
import { IsometricStack } from './models/isometric-stack';
import { Tile } from './models/tile';
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
import { getTileGraphic } from './utils/get-tile-graphic';
import { indexToIso } from './utils/index-to-iso';
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

  let layers: IsometricLayer[];

  let myContainer: IsometricStack;
  let oldSelected: Tile;
  let tileClicked: Tile;
  let tileHovered: Tile;

  let zoomButtons: [PIXI.Sprite, PIXI.Sprite];
  let orientationIndicator: PIXI.Text;
  let dragIndicator: PIXI.Text;
  let draggedIndicator: PIXI.Text;
  let upArrowIndicator: PIXI.Text;
  let downArrowIndicator: PIXI.Text;
  let leftArrowIndicator: PIXI.Text;
  let rightArrowIndicator: PIXI.Text;

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
  );

  const buildIndicators = (canvasHeight: number, canvasWidth: number) => {
    orientationIndicator = orientationIndicatorFactory(canvasHeight);
    dragIndicator = dragIndicatorFactory(canvasHeight);
    draggedIndicator = draggedIndicatorFactory(canvasHeight);
    upArrowIndicator = upArrowIndicatorFactory(canvasHeight, canvasWidth);
    downArrowIndicator = downArrowIndicatorFactory(canvasHeight, canvasWidth);
    leftArrowIndicator = leftArrowIndicatorFactory(canvasHeight, canvasWidth);
    rightArrowIndicator = rightArrowIndicatorFactory(canvasHeight, canvasWidth);

    stage.addChild(
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
  };

  const buildZoomButtons = (canvasHeight: number, canvasWidth: number) => {
    if (assetCollection['zoom-in'] && assetCollection['zoom-out']) {
      zoomButtons = zoomButtonsFactory(
        {
          'zoom-in': assetCollection['zoom-in'],
          'zoom-out': assetCollection['zoom-out'],
        },
        canvasWidth,
        canvasHeight,
        config,
      );
      stage.addChild(...zoomButtons);
    }
  };

  buildIndicators(height, width);
  buildZoomButtons(height, width);

  const initScene = () => {
    layers = [
      {
        container: new PIXI.Container(),
        texture: undefined as any,
        sprite: undefined as any,
      },
      // {
      //   container: new PIXI.Container(),
      //   texture: undefined as any,
      //   sprite: undefined as any,
      // },
      // {
      //   container: new PIXI.Container(),
      //   texture: undefined as any,
      //   sprite: undefined as any,
      // },
    ];

    layers.forEach(({ container }, index) => {
      for (let i = -config.mapRadius; i <= config.mapRadius; i++) {
        for (let j = -config.mapRadius; j <= config.mapRadius; j++) {
          container.addChild(initTile(i, j, config));

          switch (index) {
            case 0:
              setTile(i, j, container);
              break;
            case 1:
              setTile(i, j, container, '0xFFFFFF', 0.3);
              break;
            case 2:
              setTile(i, j, container, '0x000000');
              break;

            default:
              setTile(i, j, container, '0xFFFFFF', 0.5);
          }
        }
      }
    });

    layers.forEach(
      layer =>
        // render the tilemap to a render texture
        (layer.texture = PIXI.RenderTexture.create({
          width: config.offsetX * 2,
          height:
            (config.offsetY + (config.tileWidth * config.scale) / config.ai) *
            2,
        })),
    );

    layers.forEach(({ container, texture }) =>
      renderer.render(container, { renderTexture: texture }),
    );

    layers.forEach((layer, index) => {
      if (index === 0) {
        if (myContainer && myContainer.selected) {
          oldSelected = myContainer.selected;
        }

        // create a single background sprite with the texture
        myContainer = new PIXI.Sprite(layers[0].texture) as IsometricStack;
        myContainer.selected = oldSelected || undefined;

        if (myContainer.selected) {
          selectedIndicator.text = `Selected: i: ${myContainer.selected.i}, j: ${myContainer.selected.j}`;
        }
        layer.sprite = myContainer;
        stage.addChild(myContainer);
        return;
      }

      // TODO: remove above
      layer.sprite = new PIXI.Sprite(layer.texture);
      layer.sprite.y -= index * config.tileWidth; // vertical separation of tile layers
      myContainer.addChild(layer.sprite);
    });

    myContainer.interactive = true;

    bindMouseEvents();
    bindKeyboardEvents();
  };

  const tearDownScene = () => {
    myContainer.destroy({ children: true, texture: true, baseTexture: true });
    myContainer.removeAllListeners();
    keyboardListeners.forEach(item => item.unsubscribe());
  };

  const setGraphicTileColor = (
    tileGraphic: IsometricGraphic,
    color: string,
    alpha = 1,
  ) => {
    tileGraphic.clear();

    tileGraphic.color = color;
    tileGraphic.beginFill(tileGraphic.color as any, alpha);

    tileGraphic.moveTo(tileGraphic.c1[0], tileGraphic.c1[1]);
    tileGraphic.lineTo(tileGraphic.c2[0], tileGraphic.c2[1]);
    tileGraphic.lineTo(tileGraphic.c3[0], tileGraphic.c3[1]);
    tileGraphic.lineTo(tileGraphic.c4[0], tileGraphic.c4[1]);

    tileGraphic.endFill();
  };

  const setTileOutline = (tileGraphic: IsometricGraphic, color: string) => {
    tileGraphic.filters = [new OutlineFilter(4, color as any) as any];
  };

  const removeTileOutline = (tileGraphic: IsometricGraphic) => {
    if (tileGraphic) {
      tileGraphic.filters = [];
    } else {
      console.warn('tried to remove outline of a tile that does not exist');
    }
  };

  const setTile = (
    i: number,
    j: number,
    layer: PIXI.Container,
    color = '0x009900',
    alpha = 1,
  ) => {
    let tileGraphic: IsometricGraphic;
    const { tileGap } = config;

    try {
      tileGraphic = getTileGraphic(i, j, layer, config);
      tileGraphic.c1 = indexToIso(i + 1 - tileGap, j + tileGap, config);
      tileGraphic.c2 = indexToIso(i + 1 - tileGap, j + 1 - tileGap, config);
      tileGraphic.c3 = indexToIso(i + tileGap, j + 1 - tileGap, config);
      tileGraphic.c4 = indexToIso(i + tileGap, j + tileGap, config);

      setGraphicTileColor(tileGraphic, color, alpha);
      if (myContainer && myContainer.selected) {
        if (myContainer.selected.i === i && myContainer.selected.j === j) {
          setGraphicTileColor(tileGraphic, '0xFF0000');
        }
      }
    } catch (e) {
      console.warn(e.message);
    }
  };

  const unSelectTile = ({ i, j }: Tile, layer: PIXI.Container) => {
    let tileGraphic: IsometricGraphic;

    try {
      tileGraphic = getTileGraphic(i, j, layer, config);
      setGraphicTileColor(tileGraphic, '0x009900');
      layers.forEach(({ container, texture }) =>
        renderer.render(container, { renderTexture: texture }),
      );
    } catch (error) {
      console.warn(error.message);
    }
  };

  const selectTile = ({ i, j }: Tile, layer: PIXI.Container) => {
    let tileGraphic: IsometricGraphic;
    myContainer.selected = tileClicked;

    try {
      tileGraphic = getTileGraphic(i, j, layer, config);
      setGraphicTileColor(tileGraphic, '0xFF0000');
      layers.forEach(({ container, texture }) =>
        renderer.render(container, { renderTexture: texture }),
      );
    } catch (error) {
      console.warn(error.message);
    }
  };

  const hoverTile = ({ i, j }: Tile, layer: PIXI.Container) => {
    if (myContainer.hovered) {
      const { i, j } = myContainer.hovered;

      const prevHoveredGraphic = getTileGraphic(i, j, layer, config);

      removeTileOutline(prevHoveredGraphic);
    }

    let tileGraphic: IsometricGraphic;

    if (myContainer.selected?.i === i && myContainer.selected?.j === j) {
      console.warn('not hovering already selected tile');
      return;
    }
    myContainer.hovered = tileHovered;

    try {
      tileGraphic = getTileGraphic(i, j, layer, config);
      setTileOutline(tileGraphic, '0xFF00FF');
      layers.forEach(({ container, texture }) =>
        renderer.render(container, { renderTexture: texture }),
      );
    } catch (error) {
      console.warn(`NOT hightlighting: ${error.message}`);
    }
  };

  const bindMouseEvents = () => {
    const mouseDownHandler = (event: PIXI.InteractionEvent) => {
      const handledEvent = mouseDownInteraction(event, myContainer, config);

      ({ dragging, draggedx, draggedy, delx, dely, velx, vely } = handledEvent);
      draggedIndicator.text = handledEvent.dragIndicatorText;

      tileClicked = handledEvent.tileClicked;
    };

    const mouseUpHandler = () => {
      const handledEvent = mouseUpInteraction(
        draggedx,
        draggedy,
        () => {
          if (myContainer.selected) {
            // TODO: layer context
            unSelectTile(myContainer.selected, layers[0].container);
          }
          // TODO: layer context
          selectTile(tileClicked, layers[0].container);
          selectedIndicator.text = `Selected: i: ${
            (myContainer.selected as Tile).i
          }, j: ${(myContainer.selected as Tile).j}`;
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

    const mouseMoveHandler = (event: PIXI.InteractionEvent) => {
      const handledEvent = mouseMoveInteraction(
        event,
        myContainer,
        config,
        dragging,
        draggedx,
        draggedy,
        tileClicked,
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

        if (handledEvent.tileHovered) {
          tileIndicator.text = handledEvent.tileIndicatorText;

          hoverTile(handledEvent.tileHovered, layers[0].container);

          tileHovered = handledEvent.tileHovered;
        }
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

  const resize = (newWidth: number, newHeight: number) => {
    renderer.resize(newWidth, newHeight);
    stage.removeChild(
      ...zoomButtons,
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

    buildIndicators(newHeight, newWidth);
    buildZoomButtons(newHeight, newWidth);
  };

  return { resize };
};
