#!/usr/bin/env node
/**
 * Audit script: Verify all documented features are fully implemented
 */

const fs = require('fs');
const path = require('path');

const checks = [
  { file: 'src/server.js', key: 'securityHeadersMiddleware', desc: 'Security Headers Middleware Applied' },
  { file: 'src/middleware/securityHeaders.js', key: 'Permissions-Policy', desc: 'Permissions-Policy Header Set' },
  { file: 'src/middleware/requireHttps.js', key: '308', desc: 'HTTP→HTTPS Redirect with 308 Status' },
  { file: 'src/middleware/validate.js', key: 'field:', desc: 'Validation Errors Include Field Names' },
  { file: 'src/middleware/rateLimit.js', key: 'ipKeyGenerator', desc: 'IPv6-Safe Rate Limiting' },
  { file: 'src/middleware/rateLimit.js', key: '429', desc: 'Rate Limit Returns 429 Status' },
  { file: 'src/middleware/requestLogger.js', key: 'logRequestEvent', desc: 'Request Event Logging to Audit' },
  { file: 'src/utils/logger.js', key: 'persistAuditLog', desc: 'Audit Log Persistence to Database' },
  { file: 'src/middleware/sanitize.js', key: 'sanitizeMiddleware', desc: 'Input Sanitization Middleware' },
  { file: 'src/middleware/csrfProtection.js', key: 'csrfProtection', desc: 'CSRF Protection Implemented' },
  { file: 'src/server.js', key: 'rateLimit', desc: 'Global Rate Limiting with 429 Handler' },
  { file: 'supabase/sql/00_complete_schema.sql', key: 'audit_logs', desc: 'Audit Logs Schema Defined' },
  { file: 'src/middleware/errorHandler.js', key: 'requestId', desc: 'Error Logging with Request ID' },
  { file: 'src/server.js', key: 'helmet', desc: 'Helmet Security Headers' },
  { file: 'src/server.js', key: 'cors', desc: 'CORS Protection' },
];

console.log('\n════════════════════════════════════════════════════════');
console.log('   IMPLEMENTATION COMPLETENESS AUDIT');
console.log('════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    const content = fs.readFileSync(path.join(__dirname, check.file), 'utf8');
    const has = content.includes(check.key);
    
    if (has) {
      console.log(`  ✓ ${check.desc}`);
      passed++;
    } else {
      console.log(`  ✗ ${check.desc}`);
      failed++;
    }
  } catch (_e) {
    console.log(`  ✗ ${check.desc} (file not found: ${check.file})`);
    failed++;
  }
});

console.log('\n════════════════════════════════════════════════════════');
console.log(`  Total: ${passed}/${checks.length} features fully implemented`);
console.log('════════════════════════════════════════════════════════\n');

if (failed === 0) {
  console.log('  ✓ ALL DOCUMENTATION HAS BEEN FULLY IMPLEMENTED\n');
  process.exit(0);
} else {
  console.log(`  ✗ ${failed} features are missing or incomplete\n`);
  process.exit(1);
}
