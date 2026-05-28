# Deschain Frontend

React + Vite frontend for the Deschain collective procurement platform.

## Quick Start

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Visit: http://localhost:5173

## Project Structure

- `src/` - Source code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `api/` - API client and endpoints
  - `stores/` - Zustand state management
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `styles/` - Global styles

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Development

Make sure the backend API is running on http://localhost:8000

## Building

```bash
npm run build
```

Output will be in the `dist/` folder.

## Docker

```bash
docker build -t deschain-frontend:latest .
docker run -p 5173:5173 deschain-frontend:latest
```
