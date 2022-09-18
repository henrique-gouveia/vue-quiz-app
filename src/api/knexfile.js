// Update with your config settings.

module.exports = {
    client: 'postgresql',
    connection: {
        host: process.env.DATABASE_HOST || "localhost",
        port: process.env.DATABASE_PORT || 5432,
        database: process.env.DATABASE_NAME || "vue_quiz",
        user: process.env.DATABASE_USER || "postegres",
        password: process.env.DATABASE_PASSWORD || 'psql123',
        ssl: process.env.NODE_ENV === 'development' ? null : { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
}
