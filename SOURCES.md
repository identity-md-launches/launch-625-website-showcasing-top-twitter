# Content and media provenance

The seven URLs were supplied with the assignment. Public post metadata and article previews were retrieved on **2026-10-02 UTC** through `https://api.fxtwitter.com/status/{post-id}`; the first post was also cross-checked against X’s public syndication endpoint. These are a fixed editorial snapshot, not an API-backed live feed. The website links to the original X post, not the metadata provider.

| Author | Original source | Content treatment |
| --- | --- | --- |
| washed, @notwashed | https://x.com/notwashed/status/2106085777407164654 | Original article title, “A Better Factory”; a quotation from the article body |
| Bankless, @Bankless | https://x.com/Bankless/status/2104546260195713113 | Original article title, “Inside IMD, Ethereum's New AI Swarm Experiment”; opening sentence of the post |
| nftimm, @nftimm | https://x.com/nftimm/status/2102344092659134834 | Original article title, “$IMD: The Bull Case for a Billion-Dollar Meme Company”; post quotation |
| pegzeus, @pegzeus | https://x.com/pegzeus/status/2105396759342059873 | Editorial card title “A company without a company”; quotation from the post, preserving its lowercase style |
| AdamOnFinance, @AdamOnFinance | https://x.com/AdamOnFinance/status/2103142412000600159 | Editorial title “The AI oracle thesis”; quoted excerpt, with the source list’s leading hyphen omitted |
| Joseph Chalom, @joechalom | https://x.com/joechalom/status/2102729939543863754 | Original article title and opening sentence; marked “Wider context” because its scope is AI finance |
| nairolf, @0xNairolf | https://x.com/0xNairolf/status/2103456907730276751 | Opening phrase used as the title; source post excerpt; labeled a thread |

Article covers and account avatars are local copies of media from the respective sources’ `pbs.twimg.com` URLs. Bankless’s cover and some other assets use the provider’s smaller image variants. Asset filenames map to author handles in `public/media/`. These are attributed source illustrations, not proof of endorsement. All opinions, token valuations, predictions and investment theses in source quotations belong to their respective authors; the site does not independently validate them or present them as current market data. Engagement counts were deliberately omitted.

The article excerpt for washed is: “I think the reality is we need better factories that can produce better things, not more ways to repackage the same thing. IMD feels like it can be that better factory.” This is an exact sentence pair from the article body retrieved with the post. Other excerpts are retained in `src/posts.json`.

The project destination `https://imd.fun` appears in the supplied AdamOnFinance and nairolf posts. It is an outbound reference, not a runtime dependency.

The background video is an **original vector animation** created for this site. `scripts/render-video.mjs` constructs the Pepe-inspired scene, animates agent movement and shared AI activity, then renders a six-second silent loop. It does not reuse pegzeus’s attached video. The original render script, poster and final MP4 are included; no remote video generation service is required.

Space Grotesk Latin variable WOFF2 was obtained from `@fontsource-variable/space-grotesk@5.2.10` via jsDelivr and is bundled locally. Copyright and SIL OFL are in `licenses/space-grotesk.txt`.

Design methodology attribution: [Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), Jakub Krehel, MIT; documentation methodology: [Impeccable](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Paul Bakaus, Apache-2.0. The pinned local inputs were read; licenses are preserved in `licenses/design-guidance.txt`.
