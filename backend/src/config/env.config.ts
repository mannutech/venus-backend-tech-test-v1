import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig | null = null;

export function loadEnvConfig(): EnvConfig {
  if (config) {
    return config;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map(
      (issue) => `  - ${issue.path.join('.')}: ${issue.message}`
    );
    throw new Error(
      `Missing or invalid environment variables:\n${missing.join('\n')}`
    );
  }

  config = result.data;
  return config;
}

export function getEnvConfig(): EnvConfig {
  if (!config) {
    throw new Error('Environment config not loaded. Call loadEnvConfig() first.');
  }
  return config;
}
