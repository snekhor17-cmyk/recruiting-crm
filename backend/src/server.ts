import { app } from './app.js';
import { env } from './config/env.js';
import { ensureAdminUserSeeded } from './services/authService.js';

async function bootstrap() {
  await ensureAdminUserSeeded();

  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
