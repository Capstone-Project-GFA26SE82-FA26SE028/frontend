# Ingredients & Food Cost

Manager workspace for ingredient management and per-portion recipes. UI text is
English and uses the same panels, forms, tables, and responsive shell as Admin.

## Organization

```text
ingredient-management/
  api/          Inventory and recipe API reads
  components/  Ingredient, conversion, and recipe forms; recipe details
  hooks/       Queries and mutations with cache invalidation
  pages/       Ingredients, Units, Recipes, and Food Cost pages
  schemas/     Zod response validation
  types/       Shared ingredient and recipe types
  utils/       Recipe effectiveness helpers
```

## Routes and behavior

- `/manager/ingredients`: search/filter/page ingredients, create and edit name and
  threshold, activate/deactivate. Base unit is immutable. No direct stock editing
  or physical ingredient deletion.
- `/manager/units`: create measurement units, inspect and set ingredient-specific
  conversion factors. Deep link: `?ingredientId=...`.
- `/manager/recipes`: select a menu item, view version history, inspect ingredient
  quantity and conversion snapshots, create a new version using a selected version
  as a template. Preparation instructions and image/video resource links are
  preserved or edited. Deep link: `?itemId=...`.
- `/manager/food-cost`: inspect the single active recipe's ingredient requirements
  and identify missing average unit costs. Deep link: `?itemId=...`.

Recipe quantities use one portion. Only units resolved by Inventory are selectable.
Duplicate ingredients and nonpositive quantities are rejected; server validations
remain authoritative. Recipe effective times are shown in UTC+7 and sent as UTC.
New versions must start after the latest version; old recipe snapshots remain
unchanged.

## Food-cost limitation

The existing Inventory model has no purchase unit cost or weighted average unit
cost. Catalog has no COGS calculation endpoint. The UI therefore shows food cost
as **Not available**, never zero, and does not invent a calculation from selling
prices. Actual UC_MGR_06 calculation still requires backend cost data and a cost
API. No database or backend changes are included in this frontend work.

## Validation

Run `npm run build` and `npm run lint` from `frontend`. These verify compilation and
linting; interactive validation against a live authenticated backend is separate.
