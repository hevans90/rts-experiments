<template>
  <div class="game__container">
    <div class="game__nav">
      <router-link to="/">Back</router-link>
    </div>
    <canvas class="game__canvas" ref="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from 'pixi.js';
import { isoMetricGame } from '../game/isometric';
import { assetLoader } from '../game/asset-loader';

export default Vue.extend({
  name: 'isometric',

  async mounted() {
    PIXI.Loader.shared.reset();

    const loadedAssets = await assetLoader();

    // Determine the width and height of the renderer wrapper element.
    const view = this.$refs.renderCanvas as HTMLCanvasElement;
    const width = view.offsetWidth;
    const height = view.offsetHeight;

    const game = isoMetricGame(
      new PIXI.Application({
        width,
        height,
        view,
        backgroundColor: 0x36454f,
      }),
      loadedAssets,
    );

    window.onresize = () => {
      game.resize(view.offsetWidth, view.offsetHeight);
    };
  },
});
</script>

<style scoped lang="scss">
.game__container {
  width: 100vw;
  height: 100vh;

  background: grey;
}

.game__nav {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 12px;

  * {
    visibility: hidden;
  }

  &:hover {
    background: white;
    border-bottom-right-radius: 8px;
    border-right: 1px solid grey;
    border-bottom: 1px solid grey;
    * {
      visibility: visible;
    }
  }
}

.game__canvas {
  position: absolute;
  border: 0;
  /*
  for aspect ratios wider than 16/9 set full height and add gutters to left
  to preserve 16/9 for game iframe 
  */
  @media (min-aspect-ratio: 16/9) {
    left: calc((100vw - (100vh * (16 / 9))) / 2);
    width: calc(100vh * (16 / 9));
    height: 100vh;
  }

  /*
  And the opposite for aspect ratios taller than 16/9
  */
  @media (max-aspect-ratio: 16/9) {
    left: 0;
    top: calc((100vh - (100vw * (9 / 16))) / 2);
    width: 100vw;
    height: calc(100vw * (9 / 16));
  }
}
</style>
