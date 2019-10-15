import * as PIXI from 'pixi.js';

import { IsometricSprite } from './models/isometric-sprite';
import { IsometricGraphic } from './models/isometric-graphic';
import {
  dragIndicator,
  cameraIndicator,
  cartesianIndicator,
  tileIndicator,
  orientationIndicatorFactory,
} from './indicators';
import { isoToIndex } from './utils/iso-to-index';

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
  const rotation = 1;

  /**
   * 2 gives you isometric view
   */
  const ai = 2;

  const scale = 2.0;
  const offsetX = (mapRadius * 2 + 1) * tileWidth * scale;
  const offsetY = (((mapRadius * 2 + 1) * tileWidth - tileWidth) * scale) / ai; // ox/ai // (h - at) / 2;

  const borderL = -offsetX * 2 + width;
  const borderR = 0;
  const borderD = -(offsetY + (tileWidth * scale) / ai) * 2 + height;
  const borderU = 0;

  let velx = 0;
  let vely = 0;

  let delx = 0;
  let dely = 0;

  let dragging = false;

  let count2 = 0;

  const background = new PIXI.Container();

  let myContainer: IsometricSprite;

  const orientationIndicator = orientationIndicatorFactory(height);

  stage.sortableChildren = true;

  stage.addChild(
    dragIndicator,
    cameraIndicator,
    cartesianIndicator,
    tileIndicator,
    orientationIndicator,
  );

  function initScene() {
    for (let i = -mapRadius; i <= mapRadius; i++) {
      for (let j = -mapRadius; j <= mapRadius; j++) {
        background.addChild(initTile(i, j));

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

        setTile(i, j, c);
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
      dragging = true;
      dragIndicator.text = 'yay';
      myContainer.sx =
        data.getLocalPosition(myContainer).x * myContainer.scale.x;
      myContainer.sy =
        data.getLocalPosition(myContainer).y * myContainer.scale.y;
      delx = dely = 0;
      velx = vely = 0;
    }

    function mouseUpInteraction({ data }: PIXI.interaction.InteractionEvent) {
      dragging = false;
      dragIndicator.text = 'not dragging';

      cameraIndicator.text = `deltaX: ${delx}, deltaY: ${dely}`;

      if (delx === 0) {
        console.log('click');
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
        velx = Math.floor(myContainer.position.x - delx);
        vely = Math.floor(myContainer.position.y - dely);
        delx = dely = 0;
        console.log(
          'drag -->',
          myContainer.position.x,
          myContainer.position.y,
          delx,
          dely,
          velx,
          vely,
        );
      }
    }

    function mouseMoveInteraction({ data }: PIXI.interaction.InteractionEvent) {
      let newPosition = data.getLocalPosition(myContainer);
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
        newPosition = data.getLocalPosition(myContainer.parent);
        delx = myContainer.position.x;
        dely = myContainer.position.y;

        myContainer.position.x = newPosition.x - myContainer.sx;
        myContainer.position.y = newPosition.y - myContainer.sy;
      } else {
        cartesianIndicator.text = newPosition.x + ', ' + newPosition.y;

        tileIndicator.text = c.toString();
      }
    }
    myContainer.addListener('mousedown', mouseDownInteraction);
    myContainer.addListener('touchstart', mouseDownInteraction);

    myContainer.addListener('mouseup', mouseUpInteraction);
    myContainer.addListener('touchend', mouseUpInteraction);

    myContainer.addListener('mousemove', mouseMoveInteraction);
    myContainer.addListener('touchmove', mouseMoveInteraction);
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

    gr.c1 = indexToIso(i + 1 - tileGap, j + tileGap);
    gr.c2 = indexToIso(i + 1 - tileGap, j + 1 - tileGap);
    gr.c3 = indexToIso(i + tileGap, j + 1 - tileGap);
    gr.c4 = indexToIso(i + tileGap, j + tileGap);

    gr.hitArea = new PIXI.Polygon([
      new PIXI.Point(gr.c1[0], gr.c1[1]),
      new PIXI.Point(gr.c2[0], gr.c2[1]),
      new PIXI.Point(gr.c3[0], gr.c3[1]),
      new PIXI.Point(gr.c4[0], gr.c4[1]),
    ]);

    return gr;
  }

  function setTile(i: number, j: number, c: string) {
    const num = (i + mapRadius) * (2 * mapRadius + 1) + j + mapRadius;
    const gr = background.getChildAt(num) as any;

    gr.c1 = indexToIso(i + 1 - tileGap, j + tileGap);
    gr.c2 = indexToIso(i + 1 - tileGap, j + 1 - tileGap);
    gr.c3 = indexToIso(i + tileGap, j + 1 - tileGap);
    gr.c4 = indexToIso(i + tileGap, j + tileGap);

    if (c) {
      setGraphicTileColor([i, j], '0x' + c);
    }
  }

  const indexToIso = (i: number, j: number) => {
    const x = offsetX + (i - j * rotation) * scale * tileWidth;
    const y = offsetY + ((j + i * rotation) * scale * tileWidth) / ai;
    return [x, y];
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
      // console.log(velx)
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
