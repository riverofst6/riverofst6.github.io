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

## Contact form (EmailJS)

Create an EmailJS email service and email template. Configure the template to
send to your inbox and use these variables in its content:

```text
{{name}}
{{email}}
{{message}}
```

For local development, create a `.env.local` file in the project root:

```text
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

For GitHub Pages, add the same three values as repository Actions variables in
**Settings → Secrets and variables → Actions → Variables**. They are passed to
the production build by the deploy workflow. EmailJS public keys and IDs are
used by the browser; do not put a private key in the site.
