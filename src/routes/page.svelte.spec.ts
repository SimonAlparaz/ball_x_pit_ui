import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../app.css';
import { starterBalls } from '../constants/starterBalls.ts';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
  it('renders the page title', async () => {
    await render(Page);

    const heading = page.getByRole('heading', {
      level: 1,
      name: 'BALL x PIT Evolution Chart',
    });
    await expect.element(heading).toBeInTheDocument();
  });

  it('renders the basic grid and evolution sections', async () => {
    await render(Page);

    const grid = page.getByRole('region', { name: 'Basic Evolution Grid' });
    await expect
      .poll(() => grid.getByRole('gridcell').all().length)
      .toBe((starterBalls.length + 1) ** 2);

    await expect
      .element(page.getByRole('heading', { level: 2, name: 'Advanced Ball Evolutions' }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole('heading', { level: 2, name: 'Passive Evolutions' }))
      .toBeInTheDocument();
  });

  it('shows a ball tooltip on hover and dismisses it on mouse leave', async () => {
    await render(Page);

    const icon = page
      .getByRole('region', { name: 'Basic Evolution Grid' })
      .getByRole('img', { name: 'Bleed ball', exact: true })
      .first();
    const tooltip = page.getByRole('tooltip');

    await expect.element(tooltip).not.toBeInTheDocument();

    await icon.hover();
    await expect.element(tooltip).toBeVisible();
    await expect.element(tooltip).toMatchTextContent(/Inflict two stacks of bleed/);

    await icon.unhover();
    await expect.element(tooltip).not.toBeInTheDocument();
  });

  it.each([390, 1024, 1280, 1440, 1920])(
    'keeps both ends of the grid reachable at a %ipx viewport',
    async (width) => {
      const previousViewport = { width: window.innerWidth, height: window.innerHeight };

      try {
        await page.viewport(width, 900);
        await render(Page);

        const grid = page.getByRole('region', { name: 'Basic Evolution Grid' });
        const advanced = page.getByRole('region', { name: 'Advanced Evolutions' });
        const viewport = grid.element().querySelector<HTMLDivElement>('.evolution-grid-viewport');

        if (!viewport) throw new Error('Evolution grid viewport is missing');

        await expect.poll(() => viewport.getBoundingClientRect().width).toBeGreaterThan(0);

        for (const element of [grid.element(), advanced.element(), viewport]) {
          const bounds = element.getBoundingClientRect();
          expect(bounds.left).toBeGreaterThanOrEqual(0);
          expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
        }

        expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
        expect(viewport.scrollLeft).toBe(0);

        const firstCell = grid.getByRole('gridcell').first().element();
        expect(firstCell.getBoundingClientRect().left).toBeGreaterThanOrEqual(
          viewport.getBoundingClientRect().left
        );

        if (width === 1920) {
          expect(viewport.scrollWidth).toBe(viewport.clientWidth);
        } else {
          expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
        }

        viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'instant' });
        await expect
          .poll(() => Math.abs(viewport.scrollLeft - (viewport.scrollWidth - viewport.clientWidth)))
          .toBeLessThanOrEqual(1);

        const lastCell = grid.getByRole('gridcell').last().element();
        const lastCellBounds = lastCell.getBoundingClientRect();
        const viewportBounds = viewport.getBoundingClientRect();
        expect(lastCellBounds.left).toBeGreaterThanOrEqual(viewportBounds.left);
        expect(lastCellBounds.right).toBeLessThanOrEqual(viewportBounds.right);
      } finally {
        await page.viewport(previousViewport.width, previousViewport.height);
      }
    }
  );
});
