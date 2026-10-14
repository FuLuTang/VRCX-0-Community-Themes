# R7 source identification status

Confirmed exact targets on the Fandom `Needy Emoji Pack` page (page 608), `Other` gallery:

| Target caption | Exact file | Fandom description | Native dimensions | File size | Description / original URL |
|---|---|---|---:|---:|---|
| Ame-chan's Tweeter profile | `Icon_poketter_ame_.png` | The image used for Ame's Poketter account. | 25×25 | 1,042 B | https://needy-streamer-overload.fandom.com/wiki/File:Icon_poketter_ame_.png ; https://static.wikia.nocookie.net/needy-streamer-overload/images/c/cc/Icon_poketter_ame_.png/revision/latest?cb=20220227115939 |
| Icon for the game. | `Icon_game.png` | The KAngel icon that is used in the game (such as on the warning screen). | 32×32 | 1,156 B | https://needy-streamer-overload.fandom.com/wiki/File:Icon_game.png ; https://static.wikia.nocookie.net/needy-streamer-overload/images/7/7b/Icon_game.png/revision/latest?cb=20220227120215 |

Gallery captions and filenames were confirmed with MediaWiki `action=parse&page=Needy_Emoji_Pack&prop=wikitext|images`. The page describes this pack as in-game emojis and links its official download: https://needy-streamer-overload.fandom.com/wiki/Needy_Emoji_Pack .

## Access / processing status

- RESOLVED: the CDN 403 applies to a plain request. With a normal browser User-Agent plus a Fandom Referer the URL also serves a WebP transcode, and appending `&format=original` returns the **unmodified original PNG**. Both originals were fetched that way and their SHA1 now matches the MediaWiki `imageinfo` values exactly:
  - `Icon_game.png` — 32×32, 1,156 B, sha1 `e5cc16d4ca72e7ac3dcfdb35980c2fd65c47aab1`
  - `Icon_poketter_ame_.png` — 25×25, 1,042 B, sha1 `7dadb9a4734f2a7c783b812e8653b73cbe6fdb9d`
- Neither original has a transparency channel (`8-bit colormap`, no `tRNS`), so the square background is real pixel data, not a lost alpha channel.
- Background removal follows the user's own rule: **big icon keys from its bottom-LEFT corner pixel, small icon from its bottom-RIGHT corner pixel** (`Icon_game` → `#f4b7d9`, `Icon_poketter_ame_` → `#d8c6c3`). A border-connected flood at tolerance 12 removes only that colour's outer region — 16.0% and 11.5% respectively, with zero keyed pixels surviving on the outer ring, so no interior artwork is punched out. Reproduce with `node generate-r7-backgrounds.mjs`.
- The user also asked for these to read as background material rather than clear pictures, so a flat **30%** global alpha is applied after keying. Both are pre-scaled to a **matching 160 px** with `nearest` neighbour so the pixel art stays crisp and CSS can draw them 1:1 instead of letting the browser interpolate.
- The official free BOOTH download page is https://needy.booth.pm/items/3612057 ; its download endpoint redirects to BOOTH sign-in. Do not request or store user credentials.
- The BOOTH description says the pack is limited to private use on SNS and messenger apps. These files are used here for the author's own local machine preview; that private-use scope has not been cleared for public redistribution, so do not publish `assets-r7.css` or the keyed PNGs as a standalone asset pack without checking the licence first.

Copyright belongs to the game authors/rightsholders (WSS playground / xemono); the wiki is only a host/index. These are sourced assets, not original artwork.
