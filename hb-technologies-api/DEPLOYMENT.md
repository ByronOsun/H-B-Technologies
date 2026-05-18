# H&B Technologies API - Deployment Guide

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Development Setup](#development-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Email Configuration](#email-configuration)
7. [Security Hardening](#security-hardening)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Checklist

### Security
- [ ] Change all default secrets and passwords
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Configure CORS_ORIGINS to specific domains
- [ ] Enable HTTPS/TLS certificates
- [ ] Review security headers configuration
- [ ] Verify rate limiting is appropriate for traffic
- [ ] Ensure sensitive environment variables are not in version control
- [ ] Update all dependencies to latest secure versions
- [ ] Run security audit: `npm audit`

### Database & Data
- [ ] Database backups configured
- [ ] Connection pooling configured
- [ ] Database credentials stored securely
- [ ] Migration scripts tested
- [ ] Data retention policies implemented

### Application
- [ ] All environment variables documented
- [ ] Error handling configured
- [ ] Logging configured appropriately
- [ ] Performance optimized
- [ ] Testing completed (unit, integration, E2E)
- [ ] Code reviewed and merged

### Infrastructure
- [ ] DNS configured
- [ ] SSL/TLS certificates installed
- [ ] CDN configured (if needed)
- [ ] Load balancer configured (if needed)
- [ ] Monitoring and alerting set up
- [ ] Backup and disaster recovery plan

## Development Setup

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/hb-technologies-api.git
cd hb-technologies-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with development configuration
# For development:
# - NODE_ENV=development
# - JWT_SECRET=dev-secret (minimum 32 characters)
# - CORS_ORIGINS=http://localhost:3000
nano .env
```

### Running Development Server

```bash
# Start development server with hot reload
npm run dev

# Server will start on http://localhost:4000
# API base: http://localhost:4000/api
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- consultation.test.js

# Watch mode
npm test -- --watch
```

## Production Deployment

### Option 1: Deploy to Render

#### Prerequisites
- Render account
- GitHub repository connected to Render
- PostgreSQL database (Render or external)

#### Steps

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

2. **Configure Environment Variables**
   - Navigate to "Environment" settings
   - Add all required variables from `.env.example`
   - Ensure NODE_ENV=production

3. **Connect Database**
   - Use Render PostgreSQL or external Supabase
   - Add connection string to environment

4. **Set Custom Domain**
   - Add your domain (e.g., api.hb-technologies.com)
   - Configure DNS records
   - Enable auto-SSL certificates

### Option 2: Deploy to Vercel

#### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

#### Steps

1. **Add API Route Configuration**
   ```javascript
   // vercel.json
   {
     "buildCommand": "npm install && npm run build",
     "functions": {
       "src/server.js": {
         "maxDuration": 30
       }
     },
     "env": {
       "NODE_ENV": "@env_NODE_ENV"
     }
   }
   ```

2. **Deploy**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Configure Environment**
   - Set environment variables in Vercel dashboard
   - Deploy again after configuration

### Option 3: Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

#### Build and Deploy

```bash
# Build image
docker build -t hb-technologies-api:latest .

# Run locally
docker run -p 4000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -e CORS_ORIGINS=https://yourdomain.com \
  hb-technologies-api:latest

# Push to registry (e.g., Docker Hub)
docker tag hb-technologies-api:latest yourusername/hb-technologies-api:latest
docker push yourusername/hb-technologies-api:latest
```

## Environment Configuration

### Production Environment Variables

```bash
# Application
NODE_ENV=production
PORT=4000

# CORS - CRITICAL: Set to your specific domains only
CORS_ORIGINS=https://hb-technologies.com,https://www.hb-technologies.com

# Security - CRITICAL: Generate strong secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRES_IN=15m

# Database (Supabase example)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
CONSULTATION_RATE_LIMIT_MAX=5
CONSULTATION_RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
```

### Environment Variable Security

**DO NOT:**
- Commit .env or secrets to version control
- Use weak secrets or default values
- Share secrets in email or chat
- Log sensitive values
- Reuse secrets across environments

**DO:**
- Use environment variable management services
- Rotate secrets regularly
- Use strong, random values
- Store in secure vaults
- Limit access to environment variables
- Audit access logs

## Database Setup

### Supabase Setup

1. **Create Supabase Project**
   - Visit supabase.com
   - Create new project
   - Note project URL and service role key

2. **Create Database Schema**
   ```sql
   CREATE TABLE consultations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(120) NOT NULL,
     email VARCHAR(254) NOT NULL,
     phone VARCHAR(40),
     company VARCHAR(120),
     service VARCHAR(120) NOT NULL,
     message TEXT NOT NULL,
     source VARCHAR(50) DEFAULT 'contact',
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     ip_address INET,
     user_agent TEXT
   );

   CREATE INDEX idx_consultations_email ON consultations(email);
   CREATE INDEX idx_consultations_created_at ON consultations(created_at);
   CREATE INDEX idx_consultations_status ON consultations(status);
   ```

3. **Enable Row Level Security (RLS)**
   - Enable RLS on consultations table
   - Create policies for API access

4. **Backups**
   - Enable automatic daily backups
   - Test restore procedures

### Alternative: PostgreSQL

If using self-hosted PostgreSQL:

```bash
# Connect to database
psql postgresql://user:password@host:5432/dbname

# Run migrations
npm run migrate
```

## Email Configuration

### Overview

The consultation form sends transactional emails to **htechnob@gmail.com** whenever a user submits a consultation request. The system uses **Nodemailer** with configurable SMTP providers.

**Features:**
- ✅ Secure TLS encryption (port 587 recommended)
- ✅ Professional HTML + plain-text email templates
- ✅ Fire-and-forget async pattern (doesn't block form response)
- ✅ Graceful degradation (email failure doesn't lose consultation data)
- ✅ Email send status tracked in database
- ✅ Comprehensive error logging

### Email Flow

```
User submits form
    ↓
[Frontend validation]
    ↓
POST /api/consultation
    ↓
[Backend validation + sanitization]
    ↓
Insert consultation into Supabase
    ↓
Send notification email (async, non-blocking)
    ↓
Return 200 to frontend
    ↓
✅ Data stored + Email sent (or queued for retry)
```

If the email fails, the consultation **remains stored** in the database and is flagged for manual review.

### Supported Email Providers

#### 1. Gmail with App Password (Free, Development/Small Scale)

**Setup Instructions:**

1. Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not already enabled)
3. In Security settings, find "App passwords"
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the generated 16-character password
6. Configure environment:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=htechnob@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-character app password
   EMAIL_FROM="H&B Technologies <htechnob@gmail.com>"
   ```

**Important:**
- ⚠️ Use App Password, NOT your Gmail password
- ⚠️ Never commit EMAIL_PASS to git
- ✅ Rotate App Password every 3 months
- ✅ Create separate app password for production
- ✅ If the host cannot reach IPv6 SMTP endpoints, set `EMAIL_FORCE_IPV4=true`
- ✅ If SMTP responses are slow, tune `EMAIL_CONNECTION_TIMEOUT_MS`, `EMAIL_GREETING_TIMEOUT_MS`, and `EMAIL_SOCKET_TIMEOUT_MS`

### Diagnostic Email Test on Render

Set a shared secret so you can verify the Gmail SMTP path from the deployed API:

```bash
EMAIL_TEST_TOKEN=some-long-random-secret
```

Call the endpoint with the header:

```bash
curl -H "x-email-test-token: some-long-random-secret" \
   https://your-render-service.onrender.com/api/debug/email-test
```

If the request succeeds, the API returns a JSON response and the Gmail inbox should receive a test email.

**Why this works without a domain:**
- Uses a Gmail sender address you already own
- No custom domain verification needed
- Keeps the consultation flow simple for Render deployments

#### 2. No custom domain required

Keep the Gmail sender address in Render and avoid provider-specific sender domains.

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=htechnob@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="H&B Technologies <htechnob@gmail.com>"
```

#### 4. AWS SES (Enterprise)

**Setup Instructions:**

1. Go to AWS SES console
2. Request production access (if in sandbox mode)
3. Verify sender identity (htechnob@gmail.com)
4. Create SMTP credentials
5. Configure environment:
   ```bash
   EMAIL_HOST=email-smtp.region.amazonaws.com  # e.g., email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_USER=AKIA...  # Your SMTP username
   EMAIL_PASS=xxxxx...  # Your SMTP password
   EMAIL_FROM="H&B Technologies <htechnob@gmail.com>"
   ```

### Email Template

Consultations receive a professional HTML email with:

```
📋 Submission Details
   - Submitted at: [timestamp in East Africa Time]

👤 Contact Information
   - Full Name
   - Email (with mailto: link)
   - Phone (with tel: link)
   - Company (if provided)

💼 Service Interest
   - Service requested

💬 Message
   - Full consultation message (quoted)

Next Steps Note:
   "Please follow up with the client within 24 hours..."
```

Both HTML and plain-text versions are sent for maximum compatibility.

### Environment Variables Reference

```bash
# Email transport configuration
EMAIL_HOST=smtp.gmail.com                          # SMTP server hostname
EMAIL_PORT=587                                      # SMTP port (587=TLS, 465=SSL)
EMAIL_USER=htechnob@gmail.com                      # SMTP username
EMAIL_PASS=your-app-password                       # SMTP password (use app password for Gmail)
EMAIL_FROM="H&B Technologies <htechnob@gmail.com>" # Sender name and email

# Optional: rate limiting for consultations
CONSULTATION_RATE_LIMIT_MAX=5          # Max 5 submissions per window
CONSULTATION_RATE_LIMIT_WINDOW=900000  # Per 15 minutes (900000 ms)
```

### Testing Email Configuration

**Local Testing:**

```bash
# 1. Set up .env with test credentials
# 2. Start the API server
npm start

# 3. Send test consultation
curl -X POST http://localhost:4000/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254 700 000 000",
    "company": "Test Company",
    "service": "Web Development",
    "message": "This is a test consultation request.",
    "source": "contact"
  }'

# 4. Check htechnob@gmail.com for the email
# 5. Monitor server logs for email send status
```

**Production Verification:**

1. Deploy API with production email credentials
2. Submit a test consultation from the contact form
3. Verify email arrives within 60 seconds
4. Check database for email_sent=true and email_sent_at timestamp
5. Monitor email deliverability (check spam folder)

### Troubleshooting

#### Email Not Being Sent

**Check 1: Environment Variables**
```bash
# Verify all email vars are set in your hosting environment
# Render: Settings → Environment → Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS
```

**Check 2: Gmail App Password**
```bash
# If using Gmail, ensure you're using App Password, not your regular password
# Regular Gmail password will fail with: 534 Application-specific password required
```

**Check 3: Firewall/Network**
```bash
# Verify SMTP port 587 is open (outbound)
# AWS SES might require port 2587 or 25
# Contact your hosting provider if blocked
```

**Check 4: Logs**
```bash
# Check server logs for email send errors
# Render: Logs → Search for "Failed to send email"
# Check audit_logs table in Supabase with category="email"
```

#### Email Going to Spam

**Solutions:**

1. **Add SPF Record**
   ```
   v=spf1 include:sendgrid.net ~all
   # Or for Gmail: include:google.com ~all
   ```

2. **Add DKIM Record**
   - Follow provider's DKIM setup instructions
   - Usually found in email service dashboard

3. **Add DMARC Policy**
   ```
   v=DMARC1; p=quarantine; rua=mailto:admin@hb-technologies.com
   ```

4. **Use Recognized Sender**
   - Send from your own domain, not a free email service
   - Keep reply-to consistent

#### High Email Bounce Rate

1. Verify email addresses in consultation form before inserting
2. Enable double opt-in verification (if applicable)
3. Monitor SendGrid/Brevo bounce reports
4. Clean up bounced emails from database

### Monitoring & Analytics

**SendGrid Dashboard:**
- Click rate, open rate, bounce rate
- Detailed delivery logs
- Link tracking

**Brevo Analytics:**
- Campaign performance
- Subscriber engagement
- Deliverability metrics

**Database Monitoring:**
```sql
-- Check email send status
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN email_sent = true THEN 1 END) as sent,
  COUNT(CASE WHEN email_sent = false THEN 1 END) as failed
FROM consultations
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Check email errors
SELECT email, email_error, COUNT(*) 
FROM consultations 
WHERE email_sent = false
GROUP BY email, email_error;
```

## WhatsApp Configuration

The API can send consultation alerts to a Meta WhatsApp Business number.

### Meta WhatsApp Cloud API

1. Create or open your Meta app and add the WhatsApp product.
2. Connect your business phone number in WhatsApp Manager.
3. Generate a long-lived access token for the app or system user.
4. Configure the environment:
   ```bash
   WHATSAPP_ACCESS_TOKEN=EAAG...
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_RECIPIENT_NUMBER=254700000000
   WHATSAPP_API_VERSION=v22.0
   ```

Optional template mode for business-initiated messages:

```bash
WHATSAPP_TEMPLATE_NAME=consultation_alert
WHATSAPP_TEMPLATE_LANGUAGE=en_US
```

If you use template mode, create an approved WhatsApp template with one body placeholder so the alert text can be inserted into the template message.

## Security Hardening

### HTTPS/TLS

1. **Install Certificate**
   - Use Let's Encrypt for free certificates
   - Or use managed certificates from hosting provider
   - Keep certificates up to date

2. **Configure HSTS**
   ```bash
   # Already configured in Helmet middleware
   # Max-age: 31536000 seconds (1 year)
   # Preload: Enabled
   ```

3. **Redirect HTTP to HTTPS**
   ```bash
   # Already implemented in requireHttps middleware
   ```

### Database Security

1. **Connection Encryption**
   - Use TLS for database connections
   - Enable SSL mode in connection string

2. **Access Control**
   - Use role-based database users
   - Limit IP addresses that can connect
   - Use strong passwords

3. **Backup Encryption**
   - Encrypt backups at rest
   - Encrypt backups in transit

### API Security

1. **Secrets Rotation**
   - Rotate JWT_SECRET every 90 days
   - Rotate API keys every 6 months

2. **Input Validation**
   - Already implemented with Zod schemas
   - Keep validation rules strict

3. **Rate Limiting**
   - Global: 120 requests/minute
   - Consultations: 5 requests/15 minutes
   - Adjust based on monitoring data

## Monitoring & Logging

### Setup Application Monitoring

1. **Error Tracking**
   - Integrate Sentry or similar
   - Monitor error rates
   - Set up alerts for critical errors

2. **Performance Monitoring**
   - Monitor API response times
   - Track resource usage
   - Set up alerts for slow requests

3. **Security Monitoring**
   - Monitor rate limit violations
   - Track failed validation attempts
   - Alert on suspicious patterns

### Logging Strategy

```bash
# Log levels in production
LOG_LEVEL=info

# Logs to collect:
# - API requests and responses
# - Authentication attempts
# - Rate limit violations
# - Errors and exceptions
# - Database queries (in debug mode only)
```

### Viewing Logs

```bash
# Render
# Navigate to Logs tab in Render dashboard

# Docker
docker logs container-id

# Self-hosted
tail -f logs/application.log
```

## Troubleshooting

### Common Issues

#### Issue: 503 Service Unavailable

**Causes:**
- Server crash
- Database connection lost
- Rate limit storage failure

**Solutions:**
1. Check server logs: `npm run logs`
2. Verify database connection
3. Restart application
4. Check rate limit storage (Redis)

#### Issue: High Response Times

**Causes:**
- Database queries slow
- External API calls
- Memory leak

**Solutions:**
1. Profile application: `npm run profile`
2. Check database query performance
3. Implement caching
4. Upgrade resources

#### Issue: CORS Errors

**Causes:**
- Missing CORS_ORIGINS configuration
- Incorrect origin format
- Browser security policy

**Solutions:**
1. Check CORS_ORIGINS: `console.log(env.corsOrigins)`
2. Verify format: `https://domain.com` (no trailing slash)
3. Clear browser cache
4. Test with curl: `curl -H "Origin: https://yourdomain.com" ...`

#### Issue: Rate Limit Not Working

**Causes:**
- Rate limiter not applied
- Redis not connected
- Configuration incorrect

**Solutions:**
1. Check middleware order in server.js
2. Verify rate limiter is imported
3. Check Redis connection
4. Review rate limit configuration

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Enable specific namespace
DEBUG=hb-technologies:* npm start
```

## Rollback Procedures

### Rollback on Error

1. **Identify Problem**
   - Check logs for error messages
   - Review recent changes
   - Verify monitoring alerts

2. **Rollback Application**
   ```bash
   # Render - select previous deployment
   # Vercel - navigate to Deployments and select previous
   # Docker - pull and run previous image tag
   ```

3. **Database Rollback**
   ```bash
   # Supabase - restore from backup
   # PostgreSQL - manual restore from backup
   ```

4. **Verify Rollback**
   - Test API endpoints
   - Check error logs
   - Verify data integrity

### Version Control

Always tag releases:

```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Performance Optimization

### Recommendations

1. **Enable Caching**
   - Cache validation results
   - Cache external API responses
   - Set appropriate TTLs

2. **Database Optimization**
   - Use connection pooling
   - Create indexes on frequently queried columns
   - Archive old data

3. **API Optimization**
   - Compress responses (gzip)
   - Implement request batching
   - Use CDN for static content

## Maintenance Schedule

### Daily
- Monitor error logs
- Check rate limit metrics
- Verify API availability

### Weekly
- Review security logs
- Check performance metrics
- Update documentation

### Monthly
- Security audit
- Dependency updates
- Backup verification

### Quarterly
- Major version updates
- Security assessment
- Capacity planning

## Support & Documentation

For additional help:
- [API Documentation](./API_DOCUMENTATION.md)
- [Security Documentation](./SECURITY.md)
- [README](./README.md)
- GitHub Issues
- Email: support@hb-technologies.com
