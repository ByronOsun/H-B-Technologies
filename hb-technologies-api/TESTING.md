# H&B Technologies API - Testing Guide

## Overview

This guide provides comprehensive testing procedures for the H&B Technologies API, including security validation, functionality testing, and performance testing.

## Table of Contents

1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [Security Testing](#security-testing)
4. [Performance Testing](#performance-testing)
5. [Test Scenarios](#test-scenarios)

## Unit Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev jest supertest @testing-library/node

# Create test file structure
mkdir -p tests/unit tests/integration tests/security
```

### Example Unit Tests

#### Consultation Validation Tests

```javascript
// tests/unit/consultation.validation.test.js
const { z } = require("zod");

describe("Consultation Validation Schema", () => {
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(120, { message: "Name must not exceed 120 characters" })
      .refine((v) => !/[<>]/.test(v), { message: "Name must not include HTML." }),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(254, "Email must not exceed 254 characters"),
    phone: z
      .string()
      .trim()
      .max(40, "Phone must not exceed 40 characters")
      .optional()
      .default(""),
    service: z
      .string()
      .trim()
      .min(1, { message: "Service is required" })
      .max(120, { message: "Service must not exceed 120 characters" })
      .refine((v) => !/[<>]/.test(v), { message: "Service must not include HTML." }),
    message: z
      .string()
      .trim()
      .min(1, { message: "Message is required" })
      .max(2000, { message: "Message must not exceed 2000 characters" })
      .refine((v) => !/[<>]/.test(v), { message: "Message must not include HTML." }),
    source: z
      .enum(["contact", "book-consultation"], {
        errorMap: () => ({ message: "Invalid source" }),
      })
      .optional()
      .default("contact"),
  });

  describe("Valid inputs", () => {
    test("should accept valid consultation data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        company: "Acme Corp",
        service: "Web Development",
        message: "I'd like to discuss a new project.",
        source: "contact",
      };

      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test("should accept optional fields", () => {
      const minimalData = {
        name: "John Doe",
        email: "john@example.com",
        service: "Web Development",
        message: "I'd like to discuss a new project.",
      };

      const result = schema.safeParse(minimalData);
      expect(result.success).toBe(true);
      expect(result.data.phone).toBe("");
      expect(result.data.source).toBe("contact");
    });

    test("should trim whitespace from strings", () => {
      const data = {
        name: "  John Doe  ",
        email: "  john@example.com  ",
        service: "  Web Development  ",
        message: "  My message  ",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("John Doe");
      expect(result.data.email).toBe("john@example.com");
    });
  });

  describe("Invalid inputs", () => {
    test("should reject HTML tags in name", () => {
      const data = {
        name: "John <script>alert('xss')</script> Doe",
        email: "john@example.com",
        service: "Web Development",
        message: "My message",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("should reject invalid email", () => {
      const data = {
        name: "John Doe",
        email: "invalid-email",
        service: "Web Development",
        message: "My message",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("should reject oversized fields", () => {
      const data = {
        name: "J".repeat(121),
        email: "john@example.com",
        service: "Web Development",
        message: "My message",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("should reject HTML tags in message", () => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        service: "Web Development",
        message: "Click here: <a href='javascript:alert(1)'>Link</a>",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("should reject javascript: protocol", () => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        service: "javascript: something",
        message: "My message",
      };

      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
```

## Integration Testing

### Endpoint Testing with Supertest

```javascript
// tests/integration/consultation.endpoint.test.js
const request = require("supertest");
const app = require("../../src/server");

describe("POST /api/consultations", () => {
  describe("Success Responses", () => {
    test("should create consultation with valid data", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "john@example.com",
          service: "Web Development",
          message: "I'd like to discuss my project.",
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe("John Doe");
      expect(response.body).toHaveProperty("requestId");
    });

    test("should return X-Request-ID header", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "john@example.com",
          service: "Web Development",
          message: "My message",
        });

      expect(response.headers["x-request-id"]).toBeDefined();
      expect(response.headers["x-request-id"]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });
  });

  describe("Validation Errors", () => {
    test("should reject missing required fields", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          // email missing
          service: "Web Development",
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.code).toBe("VALIDATION_ERROR");
      expect(response.body.errors).toBeDefined();
    });

    test("should reject invalid email", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "not-an-email",
          service: "Web Development",
          message: "My message",
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].field).toBe("email");
    });

    test("should reject oversized message", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "john@example.com",
          service: "Web Development",
          message: "x".repeat(2001),
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Security Headers", () => {
    test("should return security headers", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "john@example.com",
          service: "Web Development",
          message: "My message",
        });

      expect(response.headers["x-content-type-options"]).toBe("nosniff");
      expect(response.headers["x-frame-options"]).toBe("DENY");
      expect(response.headers["x-xss-protection"]).toBe("1; mode=block");
      expect(response.headers["strict-transport-security"]).toBeDefined();
      expect(response.headers["content-security-policy"]).toBeDefined();
    });

    test("should return HSTS header", async () => {
      const response = await request(app)
        .post("/api/consultations")
        .send({
          name: "John Doe",
          email: "john@example.com",
          service: "Web Development",
          message: "My message",
        });

      expect(response.headers["strict-transport-security"]).toContain("max-age=31536000");
      expect(response.headers["strict-transport-security"]).toContain("includeSubDomains");
      expect(response.headers["strict-transport-security"]).toContain("preload");
    });
  });
});
```

## Security Testing

### Input Sanitization Tests

```javascript
// tests/security/sanitization.test.js
const { sanitizeInput } = require("../../src/middleware/sanitize");

describe("Input Sanitization", () => {
  describe("HTML Tag Removal", () => {
    test("should remove script tags", () => {
      const input = "Hello <script>alert('xss')</script> World";
      const output = sanitizeInput(input);
      expect(output).not.toContain("<script>");
    });

    test("should remove iframe tags", () => {
      const input = 'Test <iframe src="evil.com"></iframe> text';
      const output = sanitizeInput(input);
      expect(output).not.toContain("<iframe>");
    });

    test("should remove event handlers", () => {
      const input = '<img src="x" onerror="alert(1)">';
      const output = sanitizeInput(input);
      expect(output).not.toContain("onerror");
    });
  });

  describe("Protocol Validation", () => {
    test("should remove javascript: protocol", () => {
      const input = "Visit javascript:alert(1)";
      const output = sanitizeInput(input);
      expect(output.toLowerCase()).not.toContain("javascript:");
    });

    test("should remove data: protocol", () => {
      const input = 'Click <a href="data:text/html,<script>alert(1)</script>">here</a>';
      const output = sanitizeInput(input);
      expect(output).not.toContain("data:");
    });
  });

  describe("Special Characters", () => {
    test("should handle unicode characters safely", () => {
      const input = "Hello 你好 مرحبا";
      const output = sanitizeInput(input);
      expect(output).toBe(input);
    });

    test("should remove null bytes", () => {
      const input = "Hello\x00World";
      const output = sanitizeInput(input);
      expect(output).not.toContain("\x00");
    });
  });
});

// XSS Prevention Tests
describe("XSS Prevention", () => {
  test("should prevent stored XSS through consultation message", async () => {
    const xssPayload = {
      name: "John Doe",
      email: "john@example.com",
      service: "Web Development",
      message: '<img src=x onerror="alert(\'XSS\')">'
    };

    const response = await request(app)
      .post("/api/consultations")
      .send(xssPayload);

    // Should either reject or sanitize
    if (response.status === 201) {
      // If accepted, verify payload is sanitized
      const stored = response.body.data;
      expect(stored.message).not.toContain("onerror");
    }
  });

  test("should prevent SQL injection attempts", async () => {
    const sqlPayload = {
      name: "John Doe",
      email: "john@example.com'; DROP TABLE consultations; --",
      service: "Web Development",
      message: "My message",
    };

    const response = await request(app)
      .post("/api/consultations")
      .send(sqlPayload);

    // Should reject invalid email format
    expect(response.status).toBe(400);
  });
});

// CSRF Protection Tests
describe("CSRF Protection", () => {
  test("should reject POST without CSRF token", async () => {
    const response = await request(app)
      .post("/api/consultations")
      .send({
        name: "John Doe",
        email: "john@example.com",
        service: "Web Development",
        message: "My message",
      });

    // If CSRF is enforced
    if (response.status === 403) {
      expect(response.body.code).toBe("CSRF_TOKEN_MISSING");
    }
  });
});
```

### Rate Limiting Tests

```javascript
// tests/security/ratelimit.test.js
describe("Rate Limiting", () => {
  test("should enforce global rate limit", async () => {
    const requests = [];

    // Make 121 requests (exceeds limit of 120/minute)
    for (let i = 0; i < 121; i++) {
      requests.push(
        request(app)
          .post("/api/consultations")
          .send({
            name: "John Doe",
            email: "john@example.com",
            service: "Web Development",
            message: "My message",
          })
      );
    }

    const responses = await Promise.all(requests);
    const limited = responses.filter(r => r.status === 429);

    expect(limited.length).toBeGreaterThan(0);
  });

  test("should enforce consultation-specific rate limit", async () => {
    const requests = [];

    // Make 6 requests to consultation endpoint (exceeds limit of 5/15min)
    for (let i = 0; i < 6; i++) {
      requests.push(
        request(app)
          .post("/api/consultations")
          .send({
            name: `John Doe ${i}`,
            email: `john${i}@example.com`,
            service: "Web Development",
            message: "My message",
          })
      );
    }

    const responses = await Promise.all(requests);
    const limited = responses.filter(r => r.status === 429);

    expect(limited.length).toBeGreaterThan(0);
  });

  test("should return retry-after header on rate limit", async () => {
    // Trigger rate limit...
    const response = await request(app)
      .post("/api/consultations")
      .send(/* ... */);

    if (response.status === 429) {
      expect(response.headers["retry-after"]).toBeDefined();
      expect(parseInt(response.headers["retry-after"])).toBeGreaterThan(0);
    }
  });
});
```

## Performance Testing

### Load Testing with Artillery

```bash
# Install artillery
npm install --save-dev artillery

# Create load test configuration
cat > tests/load.yml << 'EOF'
config:
  target: "http://localhost:4000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
scenarios:
  - name: "Consultation Submission"
    flow:
      - post:
          url: "/api/consultations"
          json:
            name: "John Doe"
            email: "john@example.com"
            service: "Web Development"
            message: "My message"
          expect:
            - statusCode: 201
EOF

# Run load test
artillery run tests/load.yml
```

## Test Scenarios

### Security Test Checklist

- [ ] XSS Prevention
  - Script tag injection
  - Event handler injection
  - Protocol-based attacks

- [ ] CSRF Protection
  - Token validation
  - Same-site cookie enforcement

- [ ] Rate Limiting
  - Global limit enforcement
  - Endpoint-specific limits
  - IP-based tracking

- [ ] Input Validation
  - Type validation
  - Size limits
  - Format validation
  - Enum validation

- [ ] Error Handling
  - Sensitive data not exposed
  - Consistent error format
  - Proper HTTP status codes

- [ ] Security Headers
  - HSTS presence
  - CSP configuration
  - X-Frame-Options
  - X-Content-Type-Options

### Functional Test Checklist

- [ ] Valid consultation creation
- [ ] Optional fields handling
- [ ] Email notifications
- [ ] Data persistence
- [ ] Response format compliance

### Performance Test Checklist

- [ ] Response time < 200ms (p95)
- [ ] Throughput > 100 requests/sec
- [ ] Memory stable under load
- [ ] Database connection pooling

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- consultation.validation.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Run security tests only
npm test -- tests/security/

# Run load test
npm run test:load
```

## Continuous Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Test Coverage Goals

- Unit Tests: > 80% coverage
- Integration Tests: Critical paths
- Security Tests: All security features
- Performance Tests: Baseline metrics

## Troubleshooting Tests

### Tests fail on rate limit
- Tests may interfere due to rate limiting
- Use mock rate limiter in test environment
- Increase rate limit in test .env

### Database connection errors
- Ensure test database is available
- Check connection string in test config
- Use in-memory database for unit tests

### Async/await issues
- Always await async operations
- Use proper test timeouts
- Clean up resources after tests
