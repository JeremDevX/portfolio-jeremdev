# i18n module

Ce dossier centralise toute la logique de localisation.

## Fichiers

- `locales.ts`: source de vérité pure des locales et du garde-fou `isLocaleValue`.
- `routing.ts`: source de vérité des locales (`locales`, `defaultLocale`) + helpers de navigation typés.
- `request.ts`: chargement des messages selon la locale de la requête.

## Invariants

- Seules les locales déclarées dans `routing.locales` sont valides.
- Toute locale invalide retombe sur `routing.defaultLocale`.
- Les messages doivent exister dans `content/<locale>/<locale>.json`.

## Ajouter une locale

1. Ajouter la locale dans `routing.locales`.
2. Ajouter les fichiers de messages dans `content/<locale>/<locale>.json`.
3. Vérifier que `generateStaticParams` continue de mapper `routing.locales`.
4. Mettre à jour les tests qui valident la structure des contenus traduits.
