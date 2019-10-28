import * as PIXI from 'pixi.js';

import { IsometricSprite } from './models/isometric-sprite';
import { IsometricGraphic } from './models/isometric-graphic';
import {
  dragIndicator,
  cartesianIndicator,
  tileIndicator,
  orientationIndicatorFactory,
  cameraIndicator1,
  cameraIndicator2,
  cameraIndicator3,
  cameraIndicator4,
} from './indicators';
import { isoToIndex, indexToIso } from './utils/transforms';
import { keyboard } from './keyboard';

export const isoMetricGame = ({
  stage,
  renderer,
  view: { width, height },
}: PIXI.Application) => {
  requestAnimationFrame(animate);

  const mapRadius = 14;

  const tileWidth = 16;

  const tileGap = 0.02; // gap between tiles

  /**
   * **radians**
   *
   * rotation of 1 gives you 45 Degrees
   */
  let rotation = 1;

  /**
   * 2 gives you isometric view
   */
  let ai = 2;

  /**
   * default is 2.0
   */
  const scale = 2.0;

  let offsetX: number;
  let offsetY: number;

  let borderL: number;
  let borderR: number;
  let borderD: number;
  let borderU: number;

  let velx = 0;
  let vely = 0;

  let delx = 0;
  let dely = 0;

  let startAi = ai;
  let startRotation = rotation;
  let startDragx = 0;
  let startDragy = 0;

  let draggedx = 0;
  let draggedy = 0;

  let sumDraggedx = 0;
  let sumDraggedy = 0;

  let dragging = false;
  let controlHeld = false;

  let count2 = 0;

  const background = new PIXI.Container();

  let myContainer: IsometricSprite;

  const orientationIndicator = orientationIndicatorFactory(height);

  stage.sortableChildren = true;

  stage.addChild(
    dragIndicator,
    cartesianIndicator,
    tileIndicator,
    orientationIndicator,
    cameraIndicator1,
    cameraIndicator2,
    cameraIndicator3,
    cameraIndicator4,
  );

  function initView() {
    offsetX = (mapRadius * 2 + 1) * tileWidth * scale;
    offsetY = (((mapRadius * 2 + 1) * tileWidth - tileWidth) * scale) / ai; // ox/ai // (h - at) / 2;

    borderL = -offsetX * 2 + width;
    borderR = 0;
    borderD = -(offsetY + (tileWidth * scale) / ai) * 2 + height;
    borderU = 0;
  }

  function initScene() {
    for (let i = -mapRadius; i <= mapRadius; i++) {
      for (let j = -mapRadius; j <= mapRadius; j++) {
        background.addChild(initTile(i, j));
        setTile(i, j);
      }
    }

    // render the tilemap to a render texture
    const texture = PIXI.RenderTexture.create({
      width: offsetX * 2,
      height: (offsetY + (tileWidth * scale) / ai) * 2,
    });

    renderer.render(background, texture);

    // create a single background sprite with the texture
    // const myContainer = new PIXI.Sprite(texture);
    myContainer = new PIXI.Sprite(texture) as IsometricSprite;

    stage.addChild(myContainer);
    myContainer.x = -400;
    myContainer.y = -400;

    myContainer.interactive = true;

    function mouseDownInteraction({ data }: PIXI.interaction.InteractionEvent) {
      console.log('MOUSE DOWN');
      dragging = true;
      myContainer.sx =
        data.getLocalPosition(myContainer).x * myContainer.scale.x;
      myContainer.sy =
        data.getLocalPosition(myContainer).y * myContainer.scale.y;
      delx = dely = 0;
      velx = vely = 0;
      const parentPosition = data.getLocalPosition(myContainer.parent);
      startDragx = parentPosition.x;
      startDragy = parentPosition.y;
      startAi = ai;
      startRotation = rotation;
      draggedx = draggedy = 0;
      sumDraggedx = sumDraggedy = 0;
    }

    function mouseUpInteraction({ data }: PIXI.interaction.InteractionEvent) {
      dragging = false;
      dragIndicator.text = 'not dragging';

      if (Math.abs(sumDraggedx) < 1 && Math.abs(sumDraggedy) < 1) {
        console.log('MOUSE UP - NO DRAG');

        setGraphicTileColor(
          isoToIndex(
            myContainer.sx,
            myContainer.sy,
            scale,
            tileWidth,
            offsetX,
            offsetY,
            rotation,
            ai,
          ),
          '0xFF0000',
        );
        renderer.render(background, texture);
      } else {
        console.log('MOUSE UP - DRAG');

        velx = Math.floor(myContainer.position.x - delx);
        vely = Math.floor(myContainer.position.y - dely);
        delx = dely = 0;
      }
    }

    function mouseMoveInteraction({ data }: PIXI.interaction.InteractionEvent) {
      const newPosition = data.getLocalPosition(myContainer);
      const c = isoToIndex(
        newPosition.x,
        newPosition.y,
        scale,
        tileWidth,
        offsetX,
        offsetY,
        rotation,
        ai,
      );

      if (dragging) {
        const parentPosition = data.getLocalPosition(myContainer.parent);
        cameraIndicator1.text = `startDragx: ${startDragx}, startDragy: ${startDragy}`;
        cameraIndicator2.text = `draggedx: ${draggedx /
          100}, draggedy: ${draggedy / 100}`;
        cameraIndicator3.text = `sumDraggedx: ${sumDraggedx}, sumDraggedy: ${sumDraggedy}`;
        cameraIndicator4.text = `ai: ${ai}, rotation: ${rotation}`;

        draggedx = startDragx - parentPosition.x;
        draggedy = startDragy - parentPosition.y;

        sumDraggedx += myContainer.position.x / 1000;
        sumDraggedy += myContainer.position.y / 1000;

        if (controlHeld) {
          rotation = startRotation + draggedx / 100;
          ai = startAi + draggedy / 100;

          changeScene();
          renderer.render(background, texture);
        } else {
          delx = myContainer.position.x;
          dely = myContainer.position.y;

          myContainer.position.x = parentPosition.x - myContainer.sx;
          myContainer.position.y = parentPosition.y - myContainer.sy;
        }
      } else if (!isNaN(newPosition.x) && !isNaN(newPosition.y)) {
        cartesianIndicator.text = `${newPosition.x}, ${newPosition.y}`;
        tileIndicator.text = c.toString();
      }
    }

    const keyObject = keyboard('Control');

    keyObject.press = () => {
      controlHeld = true;
      console.log(`Control Held: ${controlHeld}`);
    };

    keyObject.release = () => {
      controlHeld = false;
      console.log(`Control Held: ${controlHeld}`);
    };

    myContainer.addListener('mousedown', mouseDownInteraction);
    myContainer.addListener('touchstart', mouseDownInteraction);

    myContainer.addListener('mouseup', mouseUpInteraction);
    myContainer.addListener('touchend', mouseUpInteraction);

    myContainer.addListener('mousemove', mouseMoveInteraction);
    myContainer.addListener('touchmove', mouseMoveInteraction);
  }

  function changeScene() {
    console.log(`change scene`);
    initView();
    for (let i = -mapRadius; i <= mapRadius; i++) {
      for (let j = -mapRadius; j <= mapRadius; j++) {
        setTile(i, j);
      }
    }
  }

  function setGraphicTileColor(ij: any[] | number[], color: string) {
    const i = ij[0];
    const j = ij[1];
    const num = (i + mapRadius) * (2 * mapRadius + 1) + j + mapRadius;
    const gr = background.getChildAt(num) as IsometricGraphic;

    gr.clear();

    gr.color = color;
    gr.beginFill(gr.color as any);

    gr.moveTo(gr.c1[0], gr.c1[1]);
    gr.lineTo(gr.c2[0], gr.c2[1]);
    gr.lineTo(gr.c3[0], gr.c3[1]);
    gr.lineTo(gr.c4[0], gr.c4[1]);

    gr.endFill();
  }

  function initTile(i: number, j: number) {
    const gr = new PIXI.Graphics() as any;
    gr.i = i;
    gr.j = j;
    gr.c = 0;

    gr.c1 = indexToIso(
      i + 1 - tileGap,
      j + tileGap,
      offsetX,
      offsetY,
      scale,
      rotation,
      ai,
      tileWidth,
    );
    gr.c2 = indexToIso(
      i + 1 - tileGap,
      j + 1 - tileGap,
      offsetX,
      offsetY,
      scale,
      rotation,
      ai,
      tileWidth,
    );
    gr.c3 = indexToIso(
      i + tileGap,
      j + 1 - tileGap,
      offsetX,
      offsetY,
      scale,
      rotation,
      ai,
      tileWidth,
    );
    gr.c4 = indexToIso(
      i + tileGap,
      j + tileGap,
      offsetX,
      offsetY,
      scale,
      rotation,
      ai,
      tileWidth,
    );

    gr.hitArea = new PIXI.Polygon([
      new PIXI.Point(gr.c1[0], gr.c1[1]),
      new PIXI.Point(gr.c2[0], gr.c2[1]),
      new PIXI.Point(gr.c3[0], gr.c3[1]),
      new PIXI.Point(gr.c4[0], gr.c4[1]),
    ]);

    return gr;
  }

  function setTile(i: number, j: number) {
    const num = (i + mapRadius) * (2 * mapRadius + 1) + j + mapRadius;
    const gr = background.getChildAt(num) as any;

    gr.c1 = indexToIso(i + 1 - tileGap, j + tileGap, offsetX, offsetY, scale, rotation, ai, tileWidth);
    gr.c2 = indexToIso(i + 1 - tileGap, j + 1 - tileGap, offsetX, offsetY, scale, rotation, ai, tileWidth);
    gr.c3 = indexToIso(i + tileGap, j + 1 - tileGap, offsetX, offsetY, scale, rotation, ai, tileWidth);
    gr.c4 = indexToIso(i + tileGap, j + tileGap, offsetX, offsetY, scale, rotation, ai, tileWidth);

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
  }

  initView();
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
    requestAnimationFrame(animate);

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

    if (myContainer.position.x < borderL) {
      myContainer.position.x = borderL;
    }
    if (myContainer.position.x > borderR) {
      myContainer.position.x = borderR;
    }
    if (myContainer.position.y < borderD) {
      myContainer.position.y = borderD;
    }
    if (myContainer.position.y > borderU) {
      myContainer.position.y = borderU;
    }

    renderer.render(stage);
  }
};
