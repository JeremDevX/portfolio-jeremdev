# GithubData module

Composants et helpers liés à l'affichage des repositories et contributions GitHub.

## Architecture (server/client)

- `GitHubProjectsFetcher.tsx` (Server Component): récupère les repositories et la traduction serveur.
- `GitHubProjectsList.tsx` (Client Component): carousel, interactions clavier/souris et modal.
- `GithubContributions.tsx` (Server Component): récupère les contributions agrégées.
- `ContributionDay.tsx` (Client Component): rendu des cases et tooltip d'une journée.

## Source de données

- Service unique: `src/lib/github.ts`.
- API utilisée: GitHub GraphQL (`https://api.github.com/graphql`).
- Token requis: `GITHUB_TOKEN_USER_DATA`.

## Contrat metadata repository

Le modal projet lit `metadata.json` depuis chaque repo (`HEAD:metadata.json`), avec un format attendu:

```json
{
  "description": {
    "fr": "Description FR",
    "en": "Description EN"
  }
}
```

Si le JSON est absent ou invalide, un texte de fallback i18n est utilisé.

## Sécurité contenu HTML

- Le contenu injecté dans le modal est nettoyé via `DOMPurify` avant `dangerouslySetInnerHTML`.
- Les liens du contenu sont transformés avec `target="_blank"` et `rel="noopener noreferrer"`.

## Résilience

- En cas d'erreur API ou de données manquantes, les composants affichent un état vide/localisé au lieu de casser le rendu.
