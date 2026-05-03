# Streamline Dashboard — Frontend

> React 19 · TypeScript · TanStack Router · TanStack Query · Tailwind CSS · Vite

A live streaming platform dashboard built with file-based routing via TanStack Router,
real-time SignalR connections, and a clean service-layer architecture.

---

## Quick Start

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Backend API running on `http://localhost:5126`

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5126
VITE_WS_URL=ws://localhost:5126
```

### 3. Start development server
```bash
npm run dev
```

App runs at: `http://localhost:5173`

### 4. Generate route tree (run after adding new routes)
```bash
npm run routes:gen
# or it runs automatically via Vite plugin
```

---

## Project Structure

```
frontend/
├── src/
│   ├── components/              
│   │   ├── ui/                  
│   │   ├── auth/              
│   │   ├── cards/                
│   │   ├── Categories/             
│   │   ├── Common/              
│   │   └── layout/              
|   |   └── Home/ 
|   |    └── Hero/                          
|   |   
│   │
│   ├── hooks/                   
│   │   ├── useAuth.ts           
│   │   ├── useSearch.ts         
│   │   ├── useProfile.ts        
│   │   ├── useLiveStreams.ts     
│   │   └── useSignalR.ts      
│   │
│   ├── services/                # API call layer (talks to .NET backend)
│   │   ├── auth.service.ts      # login(), register(), logout()
│   │   ├── content.service.ts   # getLive(), getFeatured(), getStream()
│   │   ├── search.service.ts    # search(), searchUsers()
│   │   └── api.client.ts        # Base fetch wrapper with auth headers
│   │
│   ├── lib/                     
│   │   ├── format.ts           
│   │   ├── demoContent.ts       
│   │   └── utils.ts             
│   │
│   ├── types/                   # TypeScript interfaces and types
│   │   ├── api.ts        # LoginRequest, AuthResponse, User,contentResponse
│   │
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx           # Root layout (Navbar + Sidebar shell)
│   │   ├── index.tsx            # / → Home feed (featured + live streams)
│   │   ├── browse.tsx           # /browse → All streams by category
│   │   ├── watch.$streamId.tsx  # /watch/$streamId → Stream player + chat
│   │   ├── login.tsx            # /login → Login form
│   │   ├── signup.tsx           # /signup → Register form
│   │   ├── create.tsx           # /create → Start a stream
│   │  
│   │
│   ├── router.tsx               # TanStack Router instance + route config
│   └── routeTree.gen.ts         # Auto-generated route tree (do not edit)
│
├── public/
│   └── images/
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## Routing

This app uses **TanStack Router** with file-based routing. Routes are defined as files
inside `src/routes/` and the route tree is auto-generated into `routeTree.gen.ts`.

### Route Map

| File | Path | Description | Auth |
|------|------|-------------|------|
| `__root.tsx` | — | Root shell: Navbar, Sidebar, outlet | — |
| `index.tsx` | `/` | Home feed: featured + live streams | ❌ |
| `browse.tsx` | `/browse` | Browse all streams, filter by category | ❌ |
| `watch.$streamId.tsx` | `/watch/$streamId` | Stream player, live chat, stream info | ❌ |
| `login.tsx` | `/login` | Login form → redirects to `/` on success | ❌ |
| `signup.tsx` | `/signup` | Register form → redirects to `/` on success | ❌ |
| `create.tsx` | `/create` | Create / start a new stream | ✅ |
| `profile.tsx` | `/profile` | View and edit your profile | ✅ |

### Adding a new route
```bash
# Create the file
touch src/routes/settings.tsx

# The route tree auto-regenerates via Vite plugin
# Or run manually:
npm run routes:gen
```

---

## Service Layer

All backend API calls go through `src/services/`. Never call `fetch` directly in components.

### `api.client.ts` — base client
```typescript
// Automatically attaches JWT, handles 401s, base URL from env
import { apiClient } from '@/services/api.client';

const data = await apiClient.get('/api/content/live');
const result = await apiClient.post('/api/auth/login', { email, password });
```

### `auth.service.ts`
```typescript
import { authService } from '@/services/auth.service';

await authService.login({ email, password });    // stores token
await authService.register({ name, email, password });
authService.logout();                            // clears token
```

### `content.service.ts`
```typescript
import { contentService } from '@/services/content.service';

const streams  = await contentService.getLive();
const featured = await contentService.getFeatured();
const stream   = await contentService.getStream(id);
```

### `profile.service.ts`
```typescript
import { profileService } from '@/services/profile.service';

const profile = await profileService.getMyProfile();
const updated = await profileService.update({ displayName, bio, avatarUrl });
```

### `search.service.ts`
```typescript
import { searchService } from '@/services/search.service';

const results = await searchService.search({
  query: "sports",
  category: "Sports",
  liveOnly: true,
  page: 1,
  pageSize: 20
});
```

---

## Real-time (SignalR)

SignalR connects to the .NET backend hub at `/hubs/dashboard`.

```typescript
// src/lib/signalr.ts
import { createConnection } from '@/lib/signalr';

const connection = createConnection(token);
await connection.start();

// Join a stream room for live viewer updates
await connection.invoke('JoinStream', streamId);

// Listen for viewer count changes
connection.on('ViewerUpdate', (contentId: string, count: string) => {
  setViewerCount(count);
});

// Clean up on unmount
await connection.stop();
```

---

## State Management

| Concern | Solution |
|---------|----------|
| Server state (API data) | TanStack Query |
| Auth state | React Context + localStorage |
| Route state | TanStack Router search params |
| Local UI state | `useState` / `useReducer` |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5126` |
| `VITE_WS_URL` | WebSocket base URL for SignalR | `ws://localhost:5126` |

---

## Available Scripts

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
npm run routes:gen   # Manually regenerate TanStack Router route tree
```

---

## Running with Docker

Add `output: standalone` is **not** needed — this is React/Vite, not Next.js.

The Vite build produces a static `dist/` folder served by nginx:


```bash
# Full stack
docker compose up --build
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Styling | Tailwind CSS |
| Real-time | SignalR (`@microsoft/signalr`) |
| Auth | JWT (localStorage / httpOnly cookie) |
| Containerisation | Docker + nginx |
