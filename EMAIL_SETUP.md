# Email Configuration Setup Guide

## Quick Start (Gmail - Development)

### 1. Create App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Find "App passwords" → Select "Mail" → Get 16-character password

### 2. Add to .env
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=htechnob@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM="H&B Technologies <htechnob@gmail.com>"
```

### 3. Test Locally
```bash
cd hb-technologies-api
npm start

# In another terminal, submit a test consultation:
curl -X POST http://localhost:4000/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "+254700000000",
    "service": "Test",
    "message": "Test message",
    "source": "contact"
  }'
```

## For Production (Still Gmail Only)

Use the same Gmail account in production. No custom domain or additional email provider is needed.

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=htechnob@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="H&B Technologies <htechnob@gmail.com>"
```

Push changes → Render auto-deploys → Send test form submission

## Email Workflow

```
User submits form
    ↓
Validated & sanitized
    ↓
Stored in Supabase
    ↓
Email sent to htechnob@gmail.com (async, doesn't block response)
    ↓
✅ User gets success message
✅ Email logged with status
```

**Key Point:** Data is stored even if email fails. Always returns 200 to frontend.

## Configuration Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `EMAIL_HOST` | smtp.gmail.com | SMTP server |
| `EMAIL_PORT` | 587 | 587=TLS, 465=SSL |
| `EMAIL_USER` | htechnob@gmail.com | SMTP login |
| `EMAIL_PASS` | xxxx xxxx xxxx xxxx | App password for Gmail |
| `EMAIL_FROM` | H&B Technologies <htechnob@gmail.com> | Display name + email |

## Troubleshooting

**Email not received?**
- Check Gmail: Settings → Forwarding → Correct recipient
- Check spam folder
- Verify EMAIL_PASS is correct (use App Password, not Gmail password)

**Port blocked?**
- Most hosts allow port 587 (TLS)
- Contact provider if blocked

**Rate limiting?**
- Gmail: 100 emails/min per account
- SendGrid free: 100 emails/day (paid: unlimited)
- API: 5 consultations per 15 min per IP

## Email Template Contents

Emails include:
- ✅ Submission timestamp
- ✅ Full name, email, phone
- ✅ Company (if provided)
- ✅ Service interested in
- ✅ Full message (quoted)
- ✅ "Next steps" instruction
- ✅ Both HTML and plain-text versions

## Providers Comparison

| Provider | Price | Setup Time | Notes |
|----------|-------|-----------|-------|
| Gmail | Free | 5 min | Great for dev and production, no domain needed |

## For More Details

See [DEPLOYMENT.md](./hb-technologies-api/DEPLOYMENT.md#email-configuration) for complete setup instructions for each provider.
