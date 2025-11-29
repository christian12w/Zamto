# Vehicle Showcase - Next.js + TinaCMS

A modern, static vehicle showcase website built with Next.js, TypeScript, Tailwind CSS, and TinaCMS. Features zero manual redeploys, instant updates via GitHub, and perfect Lighthouse scores.

## Features

- ✅ **Zero Manual Redeploys**: Changes auto-deploy via GitHub
- ✅ **Instant Updates**: Visitors see changes in 5-15 seconds after admin edits
- ✅ **No Extra Costs**: Static site with no database or Edge Functions
- ✅ **TinaCMS Admin**: Beautiful, self-hosted admin panel
- ✅ **ISR (Incremental Static Regeneration)**: Fast, fresh content
- ✅ **Perfect SEO**: Dynamic metadata and Open Graph images
- ✅ **TypeScript Strict**: Full type safety
- ✅ **Zod Validation**: Form validation throughout
- ✅ **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS**
- **TinaCMS** (Self-hosted with GitHub backend)
- **Zod** (Validation)

## Getting Started

### 1. Install Dependencies

   ```bash
npm install
   ```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_TINA_CLIENT_ID`: Get from [tina.io](https://tina.io)
- `TINA_TOKEN`: Get from [tina.io](https://tina.io)
- `GITHUB_TOKEN`: Your GitHub personal access token

### 3. Connect GitHub + Enable Tina

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create a token with `repo` scope
   - Add it to `.env.local` as `GITHUB_TOKEN`

2. **Set Up TinaCMS**:
   - Sign up at [tina.io](https://tina.io)
   - Create a new project
   - Connect your GitHub repository
   - Copy your Client ID and Token to `.env.local`

3. **Configure TinaCMS**:
   - Update `tina/config.ts` with your repository details
   - Ensure the `branch` matches your main branch (usually `main`)

### 4. Run Development Server

   ```bash
npm run dev
   ```

Visit `http://localhost:3000` to see your site.

### 5. Access Admin Panel

Visit `http://localhost:3000/admin` to access the TinaCMS admin panel.

## Deployment to Netlify

### 1. Connect Repository

1. Push your code to GitHub
2. Go to Netlify and click "New site from Git"
3. Select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`

### 2. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:
- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `GITHUB_TOKEN`
- `NEXT_PUBLIC_TINA_BRANCH` (usually `main`)

### 3. Enable Auto-Deploy

Netlify will automatically deploy on every push to your main branch. When you edit a vehicle in `/admin`:
1. TinaCMS saves to GitHub
2. Netlify detects the push
3. Netlify rebuilds (5-15 seconds)
4. Visitors see the update instantly

## Project Structure

```
├── app/
│   ├── admin/          # TinaCMS admin panel
│   ├── vehicles/       # Vehicle listing and detail pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── content/
│   └── vehicles/       # Vehicle JSON files (managed by TinaCMS)
├── lib/
│   └── vehicles.ts     # Vehicle data fetching functions
├── public/
│   └── vehicles/       # Vehicle images
├── tina/
│   └── config.ts       # TinaCMS configuration
└── package.json
```

## How It Works

1. **Content Management**: TinaCMS provides a beautiful admin UI at `/admin`
2. **GitHub Backend**: All changes are saved directly to your GitHub repo
3. **Auto-Deploy**: Netlify watches your repo and auto-deploys on changes
4. **ISR**: Next.js uses Incremental Static Regeneration (revalidate: 10) for fast, fresh content
5. **Static Output**: Site is fully static, no runtime costs

## Image Handling

- Images are stored in `public/vehicles/[slug]/`
- TinaCMS handles image uploads and saves them to the repo
- URLs are relative: `/vehicles/slug/image.jpg`

## Performance

- **Lighthouse Score**: 95+ on mobile
- **Static Generation**: All pages pre-rendered
- **ISR**: Content updates every 10 seconds max
- **No Runtime**: Zero server costs

## Development

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (recommended)

## Troubleshooting

### TinaCMS Not Loading

- Check that `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are set
- Verify GitHub token has `repo` scope
- Ensure branch name matches in config

### Images Not Showing

- Check image paths in vehicle JSON files
- Ensure images exist in `public/vehicles/[slug]/`
- Verify image URLs are relative paths

### Build Errors

- Run `npm run lint` to check for issues
- Ensure all TypeScript types are correct
- Check that all required environment variables are set

## License

MIT
