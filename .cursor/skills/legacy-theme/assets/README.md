# Legacy theme assets

**Do not duplicate the full legacy theme CSS here.** The single source of truth for Procore Legacy styling is:

- [`app/legacy-theme.css`](../../../../app/legacy-theme.css) — imported from [`app/globals.css`](../../../../app/globals.css) into the `legacy-theme` cascade layer.

Canonical token **values** are authored in [`Design-System/styles/ngx-canonical-tokens.css`](../../../../Design-System/styles/ngx-canonical-tokens.css) as `--ds-*`; `legacy-theme.css` maps `--color-*` and Tailwind semantic variables under `[data-theme="legacy"]`.

See also [`docs/token-contract.md`](../../../../docs/token-contract.md).
