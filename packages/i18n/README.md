# @boong/i18n

Type-safe translations via [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n).

## Usage

1. Edit base strings in `src/i18n/en/index.ts`
2. Regenerate types and adapters:

```bash
bun run generate
```

3. In React apps:

```tsx
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { useI18nContext } from "@boong/i18n"
```
