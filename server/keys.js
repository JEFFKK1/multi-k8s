export const envVars = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,
    ssl: process.env.NODE_ENV !== 'production'
        ? false
        : { rejectUnauthorized: false }
}

// export const redisHost = process.env.REDIS_HOST;
// export const redisPort = process.env.REDIS_PORT;
// export const pgUser = process.env.PGUSER
// export const pgHost = process.env.PGHOST
// export const pgDatabase = process.env.PGDATABASE
// export const pgPassword = process.env.PGPASSWORD
// export const pgPort = process.env.PGPORT