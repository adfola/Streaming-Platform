# StreamFlow — Backend API

> ASP.NET Core 10 · PostgreSQL 16 · Redis 7 · SignalR · JWT Auth

---

## Quick Start

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [PostgreSQL 16](https://www.postgresql.org/) (or use Docker)

### 1. Clone and navigate
```bash
git clone https://github.com/your-username/streamline-dashboard.git
cd streamline-dashboard/backend
```

### 2. Set up environment
```bash
# Copy the example env file
cp .env.example .env

# Edit with your values
notepad .env        # Windows
nano .env           # Mac/Linux
```

### 3. Start database and Redis with Docker
```bash
docker compose up db redis -d
```

### 4. Run migrations
```bash
cd src/StreamingPlatform.Api

dotnet ef migrations add InitialCreate \
  --project ../StreamingPlatform.Infrastructure \
  --startup-project . \
  --output-dir Migrations

dotnet ef database update \
  --project ../StreamingPlatform.Infrastructure \
  --startup-project .
```

### 5. Start the API
```bash
dotnet run
```

API is live at: `http://localhost:5126`  
API Explorer: `http://localhost:5126/scalar/v1`

---

## Project Structure

```
backend/
├── src/
│   ├── StreamingPlatform.Api/           # Entry point, controllers, middleware
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── ContentController.cs
│   │   │   ├── ProfileController.cs
│   │   │   └── SearchController.cs
│   │   ├── Hubs/
│   │   │   └── DashboardHub.cs          # SignalR real-time hub
│   │   ├── Middleware/
│   │   │   ├── ExceptionMiddleware.cs
│   │   │   └── RequestLoggingMiddleware.cs
│   │   └── Program.cs
│   │
│   ├── StreamingPlatform.Application/   # Business logic, interfaces, services
│   │   ├── Interfaces/
│   │   │   ├── IAuthService.cs
│   │   │   ├── IContentService.cs
│   │   │   ├── IProfileService.cs
│   │   │   └── ISearchService.cs
│   │   ├── Services/
│   │   │   ├── AuthService.cs
│   │   │   ├── ContentService.cs
│   │   │   ├── ProfileService.cs
│   │   │   └── SearchService.cs
│   │   ├── Mapping/
│   │   │   └── MappingProfile.cs
│   │   └── Validators/
│   │
│   ├── StreamingPlatform.Domain/        # Entities, no dependencies
│   │   └── Entities/
│   │       ├── User.cs
│   │       ├── UserProfile.cs
│   │       ├── ServiceContent.cs
│   │       └── Category.cs
│   │
│   ├── StreamingPlatform.Infrastructure/ # DB, repositories, external services
│   │   ├── Persistence/
│   │   │   └── AppDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── UserRepository.cs
│   │   │   ├── ContentRepository.cs
│   │   │   ├── ProfileRepository.cs
│   │   │   └── SearchRepository.cs
│   │   └── Services/
│   │       └── JwtTokenService.cs
│   │
│   └── StreamingPlatform.Contracts/     # DTOs shared across layers
│       ├── Auth/
│       ├── Content/
│       ├── Profile/
│       └── Search/
│
├── Dockerfile
├── .dockerignore
├── .gitignore
└── docker-compose.yml
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login, get JWT | ❌ |

### Content
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/content/live` | All live streams | ❌ |
| GET | `/api/content/featured` | Featured content | ❌ |
| GET | `/api/content/{id}` | Single stream | ❌ |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile/me` | My profile | ✅ |
| GET | `/api/profile/{displayName}` | Public profile | ❌ |
| POST | `/api/profile` | Create profile | ✅ |
| PUT | `/api/profile` | Update profile | ✅ |
| DELETE | `/api/profile` | Delete profile | ✅ |

### Search
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/search?q=term` | Search everything | ❌ |
| GET | `/api/search?q=term&category=Sports` | Filter by category | ❌ |
| GET | `/api/search?q=term&liveOnly=true` | Live streams only | ❌ |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection | localhost |
| `ConnectionStrings__Redis` | Redis connection | localhost:6379 |
| `Jwt__Key` | JWT signing secret (min 32 chars) | — |
| `Jwt__Issuer` | JWT issuer | StreamingPlatform |
| `Jwt__Audience` | JWT audience | StreamingPlatformUsers |
| `Jwt__ExpiryMinutes` | Token expiry | 60 |

---

## Running with Docker

```bash
# Full stack
docker compose up --build

# Backend + DB only
docker compose up api db redis --build

# View logs
docker compose logs api -f

# Stop everything
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v
```

---

## Common Commands

```bash
# Add a new migration
dotnet ef migrations add MigrationName \
  --project ../StreamingPlatform.Infrastructure \
  --startup-project .

# Apply migrations
dotnet ef database update \
  --project ../StreamingPlatform.Infrastructure \
  --startup-project .

# Rollback last migration
dotnet ef migrations remove \
  --project ../StreamingPlatform.Infrastructure \
  --startup-project .

# Clean build
dotnet clean && dotnet build

# Watch mode (auto-restart on file change)
dotnet watch run
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | ASP.NET Core 10 |
| ORM | Entity Framework Core 10 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT Bearer |
| Real-time | SignalR |
| Validation | FluentValidation |
| Logging | Serilog |
| API Docs | Scalar / OpenAPI |
| Containerisation | Docker |

