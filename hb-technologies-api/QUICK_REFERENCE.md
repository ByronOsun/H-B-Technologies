# Quick Reference Guide - API Development

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev

# API available at: http://localhost:4000
```

### Environment Setup

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=your-generated-secret-here
CORS_ORIGINS=http://localhost:3000
NODE_ENV=development
```

## Common API Requests

### Create Consultation

```bash
# Using curl
curl -X POST http://localhost:4000/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Web Development",
    "message": "I would like to discuss my project needs."
  }'

# Using JavaScript
fetch('http://localhost:4000/api/consultations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    service: 'Web Development',
    message: 'I would like to discuss my project needs.'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Run security tests
npm test -- tests/security/
```

## Debugging

### Enable Debug Logging

```bash
# Debug all modules
DEBUG=* npm run dev

# Debug specific module
DEBUG=hb-technologies:* npm run dev

# Check specific endpoint
DEBUG=hb-technologies:api npm run dev
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env or kill existing process |
| CORS errors | Check CORS_ORIGINS in .env matches origin |
| Rate limit exceeded | Wait or increase RATE_LIMIT_MAX in .env |
| Database connection error | Verify SUPABASE_URL and credentials |
| Email not sending | Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS |

## Security Checklist

### Before Committing
- [ ] No secrets in code
- [ ] No console.logs in production code
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] Security headers configured

### Before Deploying
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Security headers verified
- [ ] Rate limits appropriate
- [ ] HTTPS enabled
- [ ] Dependencies updated

## File Structure

```
hb-technologies-api/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── middleware/
│   │   ├── errorHandler.js # Error handling
│   │   ├── rateLimit.js    # Rate limiting
│   │   ├── validate.js     # Schema validation
│   │   ├── csrfProtection.js
│   │   ├── sanitize.js     # Input sanitization
│   │   └── requestLogger.js
│   ├── routes/
│   │   ├── index.js        # Router setup
│   │   └── consultation.js # Consultation endpoints
│   ├── controllers/
│   │   └── consultationController.js
│   └── utils/
│       ├── asyncHandler.js
│       └── requestId.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── security/
├── SECURITY.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
├── TESTING.md
└── package.json
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | development, test, or production |
| PORT | No | Server port (default: 4000) |
| CORS_ORIGINS | Yes (prod) | Comma-separated allowed origins |
| JWT_SECRET | Yes | Min 32 chars for production |
| SUPABASE_URL | No | Database connection URL |
| SUPABASE_SERVICE_ROLE_KEY | No | Database service key |
| EMAIL_HOST | No | SMTP server address |
| EMAIL_USER | No | Email account username |
| EMAIL_PASS | No | Email account password |
| RATE_LIMIT_MAX | No | Max requests per window (default: 120) |
| CONSULTATION_RATE_LIMIT_MAX | No | Consultation limit (default: 5) |

## API Endpoints

### Consultations

| Method | Endpoint | Rate Limit | Description |
|--------|----------|-----------|-------------|
| POST | `/api/consultations` | 5/15min | Create consultation |

## Response Format

### Success (2xx)

```json
{
  "status": "success",
  "data": { /* response data */ },
  "requestId": "uuid"
}
```

### Error (4xx, 5xx)

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "requestId": "uuid",
  "errors": [{ "field": "name", "message": "error" }]
}
```

## Deployment

### Quick Deploy to Render

```bash
# Push to GitHub
git push origin main

# Render auto-deploys from GitHub
# Set environment variables in Render dashboard
# Service will be available at your-service.onrender.com
```

### Using Docker

```bash
# Build image
docker build -t hb-technologies-api:latest .

# Run locally
docker run -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  hb-technologies-api:latest
```

## Useful Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# View logs
npm run logs

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Documentation Files

- **SECURITY.md** - Comprehensive security documentation
- **API_DOCUMENTATION.md** - Complete API reference
- **DEPLOYMENT.md** - Deployment and setup guide
- **TESTING.md** - Testing procedures and examples
- **QUICK_REFERENCE.md** - This file

## Support & Resources

### Internal Resources
- [Security Documentation](./SECURITY.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)

### External Resources
- [Node.js Security](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zod Documentation](https://zod.dev/)
- [Helmet.js](https://helmetjs.github.io/)

## Version Information

- **Node.js**: 18+ required
- **Express**: 4.x
- **Zod**: Latest
- **Helmet**: Latest
- **Rate Limit**: Latest

## Contact

For questions or issues:
- Email: api-support@hb-technologies.com
- GitHub Issues: [Project Repository]
- Documentation: See files in root directory
