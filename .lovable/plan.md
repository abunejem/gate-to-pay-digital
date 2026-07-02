## What
On the homepage "Every building block" bento, replace the "Card Issuing" tile with "Embedded Finance".

## Changes
1. **In `src/routes/index.tsx`:**
   - Remove `{ title: "Card Issuing", body: "Programmatic issuing on your own BIN." }` from the `PRODUCTS` array.
   - Change the "Cards" tile body to: `"Issue physical, virtual & tokenized cards via one API."`
   - Add `{ title: "Embedded Finance", body: "Embed cards, wallets and payments inside your own product." }` as the final tile.
   - Final six-tile order: Cards → Wallets → Acceptance → Payouts → Collections → Embedded Finance.

## Out of scope (per user choice)
- No link / route behavior added to the bento tiles.
- No other UI changes.