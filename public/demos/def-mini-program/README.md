# DEF mini-program case preview

Exported from the DEF portfolio runtimes. Eight read-only screens, local assets and fixtures; no business API. screen.html?screen=home|catalog|product|cart|signin|account|bind|order. The shell fixes status/header/navigation; content scrolls in its own iframe. Home support stays fixed inside the content viewport.

These portfolio previews are light-only. Exported CSS must not include
`prefers-color-scheme: dark` rules; each HTML entry declares a light colour
scheme so native controls also stay light. Preserve this when refreshing exports.
