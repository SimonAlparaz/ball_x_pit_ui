<script lang="ts">
  import { tick } from 'svelte';
  import type { Snippet } from 'svelte';

  type TooltipPosition = {
    arrowX: number;
    left: number;
    placement: 'top' | 'bottom';
    top: number;
  };

  type Props = {
    children: Snippet;
    tooltip?: Snippet;
    text?: string;
    delay?: number;
  };

  const { children, tooltip, text, delay = 300 }: Props = $props();

  let showTooltip = $state(false);
  let timeoutId = $state<ReturnType<typeof setTimeout> | null>(null);
  let triggerElement = $state<HTMLDivElement | null>(null);
  let tooltipElement = $state<HTMLDivElement | null>(null);
  let tooltipPosition = $state<TooltipPosition>({
    arrowX: 128,
    left: 16,
    placement: 'top',
    top: 16,
  });

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function portal(node: HTMLDivElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      },
    };
  }

  async function showAndPositionTooltip() {
    if (!triggerElement) return;

    showTooltip = true;
    await tick();
    updateTooltipPosition();
  }

  function handleMouseEnter(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    if (timeoutId) clearTimeout(timeoutId);
    triggerElement = event.currentTarget;
    timeoutId = setTimeout(() => {
      void showAndPositionTooltip();
    }, delay);
  }

  function handleMouseLeave() {
    if (timeoutId) clearTimeout(timeoutId);
    showTooltip = false;
    triggerElement = null;
  }

  function updateTooltipPosition() {
    if (!triggerElement || !tooltipElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    const gap = 8;

    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;

    let left = triggerCenterX - tooltipWidth / 2;
    const maxLeft = viewportWidth - tooltipWidth - margin;
    left = maxLeft < margin ? margin : clamp(left, margin, maxLeft);

    const roomAbove = triggerRect.top - margin - gap;
    const roomBelow = viewportHeight - triggerRect.bottom - margin - gap;
    const hasRoomAbove = roomAbove >= tooltipHeight;
    const hasRoomBelow = roomBelow >= tooltipHeight;

    let top: number;
    let placement: TooltipPosition['placement'];

    if (hasRoomAbove) {
      placement = 'top';
      top = triggerRect.top - tooltipHeight - gap;
    } else if (hasRoomBelow || roomBelow >= roomAbove) {
      placement = 'bottom';
      top = triggerRect.bottom + gap;
    } else {
      placement = 'top';
      top = triggerRect.top - tooltipHeight - gap;
    }

    const maxTop = viewportHeight - tooltipHeight - margin;
    top = maxTop < margin ? margin : clamp(top, margin, maxTop);

    const arrowX = clamp(triggerCenterX - left, 12, tooltipWidth - 12);

    tooltipPosition = { arrowX, left, placement, top };
  }
</script>

<div class="relative inline-block">
  <div
    role="button"
    tabindex="0"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    bind:this={triggerElement}
  >
    {@render children()}
  </div>

  {#if showTooltip && (text || tooltip)}
    <div
      bind:this={tooltipElement}
      use:portal
      role="tooltip"
      class="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg w-64 max-w-[calc(100vw-2rem)] break-words text-center pointer-events-none"
      style="left: {tooltipPosition.left}px; top: {tooltipPosition.top}px;"
    >
      {#if tooltip}
        {@render tooltip()}
      {:else}
        {text}
      {/if}
      <div
        class="absolute transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent {tooltipPosition.placement ===
        'top'
          ? 'top-full border-t-4 border-t-gray-900'
          : 'bottom-full border-b-4 border-b-gray-900'}"
        style="left: {tooltipPosition.arrowX}px;"
      ></div>
    </div>
  {/if}
</div>
