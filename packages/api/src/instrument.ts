import * as Sentry from '@sentry/nestjs';
import 'dotenv/config';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  sendDefaultPii: true,
});
