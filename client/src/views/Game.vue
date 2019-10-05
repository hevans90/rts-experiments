<template>
  <canvas class="game" ref="renderCanvas"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from 'pixi.js';

export default Vue.extend({
  name: 'game',

  mounted() {
    // Determine the width and height of the renderer wrapper element.
    const renderCanvas = this.$refs.renderCanvas as HTMLCanvasElement;
    const width = renderCanvas.offsetWidth;
    const height = renderCanvas.offsetHeight;

    let game = new PIXI.Application({
      width,
      height,
      view: renderCanvas,
      backgroundColor: 0x1099bb,
    });

    game.renderer.view.style.position = 'absolute';
    game.renderer.view.style.display = 'block';
    game.renderer.autoResize = true;
    game.renderer.resize(window.innerWidth, window.innerHeight);
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>