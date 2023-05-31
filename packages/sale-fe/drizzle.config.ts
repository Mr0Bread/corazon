import type { Config } from 'drizzle-kit';

export default {
    schema: './packages/sale-fe/src/server/schema.ts',
    connectionString: 'mysql://qtja0olgc2m06g8b44cj:pscale_pw_4EBsSr8hWo0G0RkNL0FWnf3NAdtHR2qLBYhKl0qpoE9@aws.connect.psdb.cloud/corazon?ssl={"rejectUnauthorized":true}'
} satisfies Config;