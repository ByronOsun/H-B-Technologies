# H&B Technologies API Documentation

## Base URL

```
Production: https://api.hb-technologies.com
Development: http://localhost:3000
```

## Authentication

The API currently uses CORS-based access control. Future versions will implement JWT authentication.

### Headers

All requests should include:
- `Content-Type: application/json`

## Error Responses

All errors follow a consistent format:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 403 | Forbidden (CSRF token missing/invalid) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

## Endpoints

### Consultation Endpoints

#### Create Consultation

Create a new consultation request.

**Endpoint**: `POST /api/consultations`

**Rate Limit**: 5 requests per 15 minutes per IP

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp",
  "service": "Web Development",
  "message": "I'd like to discuss a new project.",
  "source": "contact"
}
```

**Request Fields**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | 1-120 characters, no HTML tags |
| email | string | Yes | Valid email, max 254 characters |
| phone | string | No | Max 40 characters |
| company | string | No | Max 120 characters |
| service | string | Yes | 1-120 characters, no HTML tags |
| message | string | Yes | 1-2000 characters, no HTML tags |
| source | enum | No | `"contact"` or `"book-consultation"` (default: `"contact"`) |

**Validation Rules**

- All strings are automatically trimmed
- HTML tags (`<`, `>`) are not allowed
- JavaScript protocol (`javascript:`) is rejected
- URLs must be valid HTTP/HTTPS protocols
- Email must follow RFC 5322 standard

**Success Response** (201 Created)

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Web Development",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**

**400 - Validation Error**

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ],
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**403 - CSRF Protection**

```json
{
  "status": "error",
  "code": "CSRF_TOKEN_MISSING",
  "message": "CSRF token missing or invalid",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**429 - Rate Limited**

```json
{
  "status": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 300,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Examples**

cURL:
```bash
curl -X POST https://api.hb-technologies.com/api/consultations \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Web Development",
    "message": "I would like to discuss my project needs."
  }'
```

JavaScript/Fetch:
```javascript
const response = await fetch('https://api.hb-technologies.com/api/consultations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken // Get from page or response header
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    service: 'Web Development',
    message: 'I would like to discuss my project needs.'
  })
});

const data = await response.json();
console.log(data);
```

## Security Features

### Rate Limiting

- **Global**: 120 requests per minute
- **Consultation**: 5 requests per 15 minutes per IP

Exceeding limits returns:
- Status: 429
- Header: `Retry-After: <seconds>`

### Input Sanitization

All input is sanitized to remove:
- HTML tags and special characters
- JavaScript protocols
- Null bytes
- Control characters

### CORS

The API enforces strict CORS policies:
- Only configured origins are allowed
- Credentials are handled securely
- Preflight requests validated

### HTTPS

- All requests must use HTTPS
- HTTP requests are redirected with 308 status
- HSTS headers enforce HTTPS for 1 year

### CSRF Protection

- Token-based CSRF protection
- Tokens must be included in request headers or body
- Double-submit cookie validation

### Helmet Security Headers

All responses include comprehensive security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` with restrictive policy

## Request Tracing

Every request is assigned a unique ID in the `X-Request-ID` header for debugging and tracing:

```
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

Include this ID when reporting issues.

## Common Issues

### "Invalid email address"
- Ensure email follows standard format (e.g., `user@domain.com`)
- Check for extra spaces before/after

### "CSRF token missing"
- Include the `X-CSRF-Token` header in your POST request
- Get the token from the page or API response header

### "Rate limit exceeded"
- Wait for the time specified in `Retry-After` header
- Consider caching results

### "HTML tags not allowed"
- Ensure message doesn't contain `<` or `>`
- HTML is not allowed; use plain text only

## Webhooks (Future)

Future versions will support webhooks for asynchronous notifications when consultations are received.

## API Versioning

Current Version: **v1**

The API uses URI versioning: `/api/v1/...`

Future versions will maintain backward compatibility or provide migration path.

## Support

For API issues or questions:
- Check this documentation first
- Review error codes and messages
- Include your request ID in support tickets
- Contact: api-support@hb-technologies.com

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Consultation endpoint
- Comprehensive security measures
- Rate limiting
- CSRF protection
