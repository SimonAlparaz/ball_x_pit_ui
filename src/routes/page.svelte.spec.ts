import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
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
});
