# URL Shortener API

## Tech Stack
- Bun.js runtime
- Elysia.js (web framework)
- SQLite (database)
- LRU-Inmemory  (caching)
- Docker (containerization)

## API Endpoints

### Main Endpoints
- `GET /` - Homepage with URL shortening form
- `POST /shorten` - Create shortened URL
- `GET /:id` - Redirect to original URL
- `DELETE /:id` - Deactivate a shortened URL

### Additional Endpoints
- `POST /:id/reactivate` - Reactivate a deactivated URL
- `GET /urls` - List all URLs (with pagination)

## REST API Examples

```
# Create a shortened URL
POST /shorten
Body: { "url": "https://example.com", "options": { "expiryDays": 30, "customId": "custom-id" } }

# Access a shortened URL
GET /abcd123 (redirects to original URL)
```

## Docker Deployment
```
docker-compose up -d
```