# Security Documentation - H&B Technologies API

## Overview
This document outlines the security measures implemented in the H&B Technologies API to protect against common vulnerabilities and attacks.

## Security Layers

### 1. **Transport Security**

#### HTTPS Enforcement (TLS/SSL)
- **Middleware**: `requireHttps`
- **Effect**: All traffic is redirected to HTTPS in production
- **Implementation**: Automatic redirection of HTTP requests to HTTPS with status code 308 (Permanent Redirect)
- **HSTS Header**: Enabled via Helmet
  - Max-age: 31536000 seconds (1 year)
  - IncludeSubDomains: Enabled
  - Preload: Enabled (allows browser to preload HSTS policy)

### 2. **Input Validation & Sanitization**

#### Schema Validation (Zod)
- All request payloads validated against strict schemas
- Type checking for all input fields
- String length limits to prevent buffer overflow attacks
- Email validation using RFC 5322 standards
- Enum validation for restricted fields (e.g., `source` field)

#### Input Sanitization
- **Middleware**: `sanitizeMiddleware`
- **Techniques Applied**:
  - HTML/script tag stripping (`< >` character removal)
  - JavaScript protocol removal (`javascript:` prevention)
  - URL encoding for potentially dangerous characters
  - Whitespace trimming to prevent bypass techniques
  - Special character escaping for database operations

#### Consultation Route Validation
- Name: Max 120 characters, no HTML tags
- Email: RFC-compliant format, max 254 characters
- Phone: Optional, max 40 characters
- Company: Optional, max 120 characters
- Service: Max 120 characters, no HTML tags
- Message: Max 2000 characters, no HTML tags
- Source: Restricted enum values only

### 3. **HTTP Security Headers**

All responses include the following security headers (via Helmet):

| Header | Purpose | Value |
|--------|---------|-------|
| Strict-Transport-Security | Force HTTPS | `max-age=31536000; includeSubDomains; preload` |
| X-Content-Type-Options | Prevent MIME sniffing | `nosniff` |
| X-Frame-Options | Prevent clickjacking | `DENY` |
| X-XSS-Protection | Legacy XSS protection | `1; mode=block` |
| Content-Security-Policy | Prevent injection attacks | Restrictive policy with `'self'` origin |
| Referrer-Policy | Control referrer information | `strict-origin-when-cross-origin` |
| Permissions-Policy | Control browser features | Disabled for geolocation, microphone, camera, etc. |

### 4. **Rate Limiting**

#### Global Rate Limit
- **Limit**: 120 requests per 60 seconds (2 requests/second)
- **Strategy**: Sliding window
- **Storage**: Memory-based (production should use Redis)

#### Consultation-Specific Rate Limit
- **Limit**: 5 requests per 15 minutes per IP
- **Purpose**: Prevent consultation submission abuse
- **Effect**: Returns 429 (Too Many Requests) status

### 5. **CORS (Cross-Origin Resource Sharing)**

- **Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Max Age**: 86400 seconds (24 hours)
- **Origin Validation**:
  - Non-browser clients (no origin header) are allowed
  - Browser clients must have origin in `CORS_ORIGINS` environment variable
  - Configured via `corsOrigins` from environment

### 6. **CSRF Protection**

- **Middleware**: `csrfProtection`
- **Implementation**: Token-based CSRF protection
- **Token Storage**: Session/cookie based
- **Validation**: Double-submit cookie pattern (token in request body/header vs. cookie)

### 7. **Request Logging & Monitoring**

#### Request ID
- **Middleware**: `requestId`
- **Purpose**: Unique identifier for each request for tracing
- **Format**: UUID v4
- **Header**: `X-Request-ID`

#### Request Logger
- **Middleware**: `requestLogger`
- **Logs**: 
  - Request method, path, and timestamp
  - Response status code
  - Response time
  - User agent
  - IP address
- **Purpose**: Security auditing and debugging

### 8. **Error Handling**

#### Error Handler Middleware
- **Purpose**: Consistent error responses
- **Features**:
  - Sensitive error details hidden in production
  - Stack traces removed in production
  - Generic error messages shown to clients
  - Proper HTTP status codes

### 9. **Express Security Best Practices**

- **Disabled Headers**: `X-Powered-By` (hides Express version)
- **Trust Proxy**: Enabled for accurate IP detection behind reverse proxies
- **JSON Payload Limit**: 100KB (prevents large payload attacks)
- **Rate Limit Headers**: Standard format enabled
- **Trust Proxy**: Set to 1 for cloud environments with single proxy

### 10. **Database & Data Protection**

#### Input Encoding
- SQL injection prevention via parameterized queries (when using SQL)
- NoSQL injection prevention via schema validation

#### Data Minimization
- Only collect necessary information
- No sensitive data logging
- Temporary data retention policies

## Environment Configuration

### Required Environment Variables

```env
NODE_ENV=production                    # Set to production for security
CORS_ORIGINS=https://hb-technologies.com,https://api.example.com
PORT=3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
CONSULTATION_RATE_LIMIT_MAX=5
CONSULTATION_RATE_LIMIT_WINDOW=900000
```

### Development vs. Production

| Aspect | Development | Production |
|--------|-------------|-----------|
| HTTPS | Redirects logged but allowed | Enforced, HTTP rejected |
| Stack Traces | Visible | Hidden |
| Logs | Verbose | Minimal (security focused) |
| Rate Limits | Relaxed | Strict |
| CORS | May be permissive | Restrictive |
| HSTS Preload | Not included | Included |

## Threat Model

### Protected Against

1. **Injection Attacks**
   - SQL Injection: Schema validation + parameterized queries
   - NoSQL Injection: Schema validation
   - Command Injection: Input sanitization

2. **Cross-Site Attacks**
   - XSS: Input sanitization + CSP headers
   - CSRF: Token-based protection
   - Clickjacking: X-Frame-Options header

3. **Network Attacks**
   - MITM: HTTPS + HSTS
   - Protocol Downgrade: HTTPS-only enforcement

4. **Brute Force Attacks**
   - Rate limiting per IP
   - Consultation-specific rate limits

5. **Data Exposure**
   - MIME sniffing: X-Content-Type-Options
   - Referrer leakage: Referrer-Policy
   - Browser feature abuse: Permissions-Policy

## Security Checklist for Deployment

- [ ] HTTPS certificates installed and valid
- [ ] CORS_ORIGINS configured correctly
- [ ] NODE_ENV=production
- [ ] Rate limit storage upgraded to Redis for production
- [ ] Request logs monitored for suspicious activity
- [ ] Error logs reviewed regularly
- [ ] Secrets not committed to repository
- [ ] Database credentials configured securely
- [ ] Regular security audits scheduled
- [ ] Dependencies updated and scanned for vulnerabilities
- [ ] Backup and disaster recovery plan in place
- [ ] Security headers tested in production

## Regular Maintenance

### Monthly
- Review security headers via security.txt or SSL Labs
- Audit rate limit metrics
- Check for suspicious patterns in request logs

### Quarterly
- Update dependencies: `npm audit fix`
- Run security scanning tools
- Review CORS origins configuration

### Annually
- Security audit by third party
- Penetration testing
- Update security documentation
- Review threat model for changes

## Incident Response

### Suspected Security Incident
1. Enable detailed logging
2. Isolate affected systems
3. Review logs for compromise indicators
4. Notify relevant parties
5. Implement fixes and deploy
6. Post-incident review and documentation

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [HSTS Preload List](https://hstspreload.org/)

## Questions & Support

For security concerns or questions, please:
1. Document the issue
2. Contact the security team
3. Do not disclose publicly before resolution
