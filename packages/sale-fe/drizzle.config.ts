import type { Config } from 'drizzle-kit';

export default {
    schema: './packages/sale-fe/src/server/schema.ts',
    connectionString: 'mysql://b54t0qgtzwqz8pnki9ho:pscale_pw_kHLr0f9SSXQaaGCtfJi84BrE7hip4uPtQHtGaAvhiFz@aws.connect.psdb.cloud/corazon?ssl={"rejectUnauthorized":true}'
} satisfies Config;