exports.up = function(knex, Promise) {
    return knex.schema.createTable('questionnaires', table => {
        table.string('id').primary()
        table.datetime('start').notNull()
        table.datetime('end').notNull()
        table.integer('count').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('questionnaires')
};
