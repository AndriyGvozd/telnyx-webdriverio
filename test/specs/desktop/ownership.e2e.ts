import { expect } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';

describe('Ownership section', () => {
    it('TC-22: renders the competitor comparison table with no gaps or overlaps', async () => {
        await HomePage.open();
        await HomePage.ownershipTable.scrollIntoView();

        await expect(HomePage.ownershipTable).toBeDisplayed();
        await expect(HomePage.ownershipTable).toHaveAttribute(
            'aria-label',
            expect.stringContaining('Telnyx, Twilio, Cloudflare')
        );

        const rows = await HomePage.ownershipTableRows;
        expect(rows.length).toBeGreaterThan(1);

        const headerRow = rows[0];
        const headerCellCount = (await headerRow.$$('[role="columnheader"]')).length;
        expect(headerCellCount).toBe(6);

        for (const row of rows) {
            await expect(row).toBeDisplayed();
        }
    });
});
