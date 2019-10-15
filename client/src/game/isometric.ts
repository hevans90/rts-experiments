import * as PIXI from 'pixi.js';

import { IsometricSprite } from './models/isometric-sprite';
import { IsometricGraphic } from './models/isometric-graphic';

export const isoMetricGame = ({ stage, renderer }: PIXI.Application) => {
  const w = 600;
  const h = 380;

  requestAnimationFrame(animate);

  const n = 12; // CHANGE THIS

  const tileWidth = 64; // tile width

  /**
   * gap between tiles
   */
  const tileGap = 0.01; // gap between tiles

  /**
   * rotation of 1 gives you 45 Degrees
   */
  const ar = 1;

  /**
   * 2 gives you isometric view
   */
  const ai = 2;

  const scale = 1.0;
  const offsetX = (n * 2 + 1) * tileWidth * scale;
  const offsetY = (((n * 2 + 1) * tileWidth - tileWidth) * scale) / ai; // ox/ai // (h - at) / 2;

  const borderL = -offsetX * 2 + w;
  const borderR = 0;
  const borderD = -(offsetY + (tileWidth * scale) / ai) * 2 + h;
  const borderU = 0;

  let velx = 0;
  let vely = 0;

  let delx = 0;
  let dely = 0;

  let dragging = false;

  let count2 = 0;

  const background = new PIXI.Container();
  let myContainer: IsometricSprite;

  const mt1 = new PIXI.Text(' ', {
    font: '12px Arial',
  });
  mt1.position.x = 10;
  mt1.position.y = 20;

  const mt2 = new PIXI.Text(' ', {
    font: '12px Arial',
  });
  mt2.position.x = 10;
  mt2.position.y = 40;

  const mt3 = new PIXI.Text(' ', {
    font: '12px Arial',
  });
  mt3.position.x = 10;
  mt3.position.y = 60;

  stage.addChild(mt1, mt2, mt3);

  function initScene() {
    for (let i = -n; i <= n; i++) {
      for (let j = -n; j <= n; j++) {
        initTile(i, j);

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

    console.log(background.getBounds());

    // render the tilemap to a render texture
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
      mt1.text = 'yay';
      myContainer.sx =
        data.getLocalPosition(myContainer).x * myContainer.scale.x;
      myContainer.sy =
        data.getLocalPosition(myContainer).y * myContainer.scale.y;
      delx = dely = 0;
      velx = vely = 0;
    }

    function mouseUpInteraction({ data }: PIXI.interaction.InteractionEvent) {
      dragging = false;
      mt1.text = 'no dragging yet. ';

      if (delx === 0) {
        console.log('click');
        setGraphicTileColor(
          isoToIndex(myContainer.sx, myContainer.sy),
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
      const c = isoToIndex(newPosition.x, newPosition.y);

      if (dragging) {
        newPosition = data.getLocalPosition(myContainer.parent);
        delx = myContainer.position.x;
        dely = myContainer.position.y;

        myContainer.position.x = newPosition.x - myContainer.sx;
        myContainer.position.y = newPosition.y - myContainer.sy;
      } else {
        mt2.text =
          delx -
          myContainer.position.x +
          'xy/ij: ' +
          newPosition.x +
          ', ' +
          newPosition.y +
          ' / ' +
          c;
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
    const num = (i + n) * (2 * n + 1) + j + n;
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

    background.addChild(gr);
  }

  function setTile(i: number, j: number, c: string) {
    const num = (i + n) * (2 * n + 1) + j + n;
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
    const x = offsetX + (i - j * ar) * scale * tileWidth;
    const y = offsetY + ((j + i * ar) * scale * tileWidth) / ai;
    return [x, y];
  };

  const isoToIndex = (x: number, y: number) => {
    const b = scale * tileWidth;

    const s = x - offsetX;
    const t = y - offsetY;

    let j = (((t - (s * ar) / ai) / (1 + ar * ar)) * ai) / b;
    let i = (s + j * b * ar) / b;

    i = Math.floor(i);
    j = Math.floor(j);

    // console.log( 'isoToIndex: ' + x,y,i,j)
    return [i, j];
  };

  initScene();

  let winmode = '';
  setInterval(() => {
    if (window.innerHeight > window.innerWidth) {
      winmode = 'portrait';
    } else {
      winmode = 'landscape';
    }
    mt3.text = winmode;
  }, 500);

  function animate() {
    requestAnimationFrame(animate);

    if (dragging) {
      count2 += 1;
      mt1.text = count2.toString();
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
