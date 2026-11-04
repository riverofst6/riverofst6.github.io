# Hades Portfolio

Personal portfolio built with React and Vite. The page styling and responsive
layout are in `style.css`, and the interactive page is implemented in
`src/App.jsx`.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production site is generated in `dist/`.

GitHub Pages is deployed from the `main` branch by the workflow in
`.github/workflows/deploy.yml`. In the repository settings, set Pages' build
and deployment source to **GitHub Actions**.
