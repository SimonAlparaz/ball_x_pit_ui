<script lang="ts">
  import type { Snippet } from 'svelte';

  type TooltipPosition = {
    x: number;
    y: number;
    placement: 'top' | 'bottom';
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
  let tooltipPosition = $state<TooltipPosition>({ x: 0, y: 0, placement: 'top' });

  function handleMouseEnter(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    triggerElement = event.currentTarget;
    timeoutId = setTimeout(() => {
      if (triggerElement) {
        updateTooltipPosition();
        showTooltip = true;
      }
    }, delay);
  }

  function handleMouseLeave() {
    if (timeoutId) clearTimeout(timeoutId);
    showTooltip = false;
    triggerElement = null;
  }

  function updateTooltipPosition() {
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Tooltip dimensions (approximate)
    const tooltipWidth = 256; // w-64 = 16rem = 256px
    const tooltipHeight = 80; // approximate height

    let x = triggerRect.left + triggerRect.width / 2;
    let y = triggerRect.top;
    let placement: TooltipPosition['placement'] = 'top';

    // Check if tooltip would go off the right edge
    if (x + tooltipWidth / 2 > viewportWidth - 16) {
      x = viewportWidth - tooltipWidth / 2 - 16;
    }

    // Check if tooltip would go off the left edge
    if (x - tooltipWidth / 2 < 16) {
      x = tooltipWidth / 2 + 16;
    }

    // Check if tooltip would go off the top edge
    if (y - tooltipHeight < 16) {
      y = triggerRect.bottom;
      placement = 'bottom';
    }

    tooltipPosition = { x, y, placement };
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
      role="tooltip"
      class="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg w-64 break-words text-center pointer-events-none"
      style="left: {tooltipPosition.x - 128}px; {tooltipPosition.placement === 'top'
        ? `bottom: ${window.innerHeight - tooltipPosition.y + 8}px`
        : `top: ${tooltipPosition.y + 8}px`};"
    >
      {#if tooltip}
        {@render tooltip()}
      {:else}
        {text}
      {/if}
      <div
        class="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent {tooltipPosition.placement ===
        'top'
          ? 'top-full border-t-4 border-t-gray-900'
          : 'bottom-full border-b-4 border-b-gray-900'}"
      ></div>
    </div>
  {/if}
</div>
