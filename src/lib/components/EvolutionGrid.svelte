<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { evolutions } from '../../constants/ballEvolutions.ts';
  import { ballInformation } from '../../constants/ballInformation.ts';
  import { starterBalls } from '../../constants/starterBalls.ts';
  import assetMap from '../assetMap.ts';
  import GridIcon from './GridIcon.svelte';
  import GridItem from './GridItem.svelte';

  const { gridSize } = $props();
  const baseCellSize = 52;
  const minScale = 0.45;
  const maxScale = 2.5;

  type PinchState = {
    contentX: number;
    contentY: number;
    distance: number;
    scale: number;
  };

  let viewport: HTMLDivElement | undefined = $state();
  let scale = $state(1);
  let pinch: PinchState | null = null;

  const grid = $derived(
    Array.from({ length: gridSize }, (_, y) =>
      Array.from({ length: gridSize }, (_, x) => ({ x, y }))
    )
  );

  const cellSize = $derived(`${baseCellSize * scale}px`);

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function getPinchGeometry(touches: TouchList) {
    const firstTouch = touches.item(0);
    const secondTouch = touches.item(1);

    if (!firstTouch || !secondTouch) {
      return null;
    }

    const deltaX = secondTouch.clientX - firstTouch.clientX;
    const deltaY = secondTouch.clientY - firstTouch.clientY;

    return {
      distance: Math.hypot(deltaX, deltaY),
      midpointX: (firstTouch.clientX + secondTouch.clientX) / 2,
      midpointY: (firstTouch.clientY + secondTouch.clientY) / 2,
    };
  }

  function beginPinch(event: TouchEvent) {
    if (!viewport) {
      return;
    }

    const geometry = getPinchGeometry(event.touches);

    if (!geometry || geometry.distance === 0) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const viewportRect = viewport.getBoundingClientRect();

    pinch = {
      contentX: (geometry.midpointX - viewportRect.left + viewport.scrollLeft) / scale,
      contentY: (geometry.midpointY - viewportRect.top + viewport.scrollTop) / scale,
      distance: geometry.distance,
      scale,
    };
  }

  async function applyPinchZoom(
    activePinch: PinchState,
    nextScale: number,
    midpointX: number,
    midpointY: number
  ) {
    scale = nextScale;
    await tick();

    if (!viewport || pinch !== activePinch) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();

    viewport.scrollLeft = activePinch.contentX * nextScale - (midpointX - viewportRect.left);
    viewport.scrollTop = activePinch.contentY * nextScale - (midpointY - viewportRect.top);
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length < 2) {
      return;
    }

    if (!pinch) {
      beginPinch(event);
    }

    if (!pinch) {
      return;
    }

    const geometry = getPinchGeometry(event.touches);

    if (!geometry || geometry.distance === 0) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const nextScale = clamp(pinch.scale * (geometry.distance / pinch.distance), minScale, maxScale);

    void applyPinchZoom(pinch, nextScale, geometry.midpointX, geometry.midpointY);
  }

  function handleTouchEnd(event: TouchEvent) {
    if (event.touches.length === 2) {
      beginPinch(event);
      return;
    }

    pinch = null;
  }

  onMount(() => {
    if (!viewport) {
      return;
    }

    viewport.addEventListener('touchstart', beginPinch, { passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    viewport.addEventListener('touchend', handleTouchEnd, { passive: false });
    viewport.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      viewport?.removeEventListener('touchstart', beginPinch);
      viewport?.removeEventListener('touchmove', handleTouchMove);
      viewport?.removeEventListener('touchend', handleTouchEnd);
      viewport?.removeEventListener('touchcancel', handleTouchEnd);
    };
  });
</script>

<div
  bind:this={viewport}
  class="evolution-grid-viewport w-full"
  aria-label="Pinch to zoom the evolution grid"
>
  <div
    class="evolution-grid-content grid gap-0 p-4 relative mx-auto"
    style="--grid-cell-size: {cellSize}; grid-template-columns: repeat({gridSize}, var(--grid-cell-size)); width: max-content; overflow: visible;"
  >
    {#each grid as row}
      {#each row as cell}
        {@const xBall = starterBalls[cell.x - 1]}
        {@const yBall = starterBalls[cell.y - 1]}
        {@const evolution = evolutions[xBall]?.[yBall]?.evolution}
        {@const currentBall = cell.x === 0 ? yBall : cell.y === 0 ? xBall : evolution}
        <GridItem x={cell.x} y={cell.y} ballKey={currentBall}>
          {#if cell.x === cell.y}
            <span style="color: var(--yellow); font-size: 2em;">X</span>
          {:else if cell.x === 0}
            <GridIcon
              src={assetMap.ballIcons[yBall]}
              alt={ballInformation[yBall]?.name + ' ball'}
            />
          {:else if cell.y === 0}
            <GridIcon
              src={assetMap.ballIcons[xBall]}
              alt={ballInformation[xBall]?.name + ' ball'}
            />
          {:else if evolution}
            <GridIcon
              src={assetMap.ballIcons[evolution]}
              alt={ballInformation[evolution]?.name + ' ball'}
            />
          {/if}
        </GridItem>
      {/each}
    {/each}
  </div>
</div>

<style>
  .evolution-grid-viewport {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    overscroll-behavior-x: contain;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    touch-action: pan-x pan-y;
  }

  .evolution-grid-viewport::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  .evolution-grid-viewport::-webkit-scrollbar-track {
    background: transparent;
  }

  .evolution-grid-viewport::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  .evolution-grid-viewport::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    .evolution-grid-viewport {
      max-height: 75svh;
    }

    .evolution-grid-viewport::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }
  }
</style>
