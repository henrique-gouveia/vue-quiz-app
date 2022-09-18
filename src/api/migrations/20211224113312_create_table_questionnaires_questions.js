exports.up = function(knex, Promise) {
    return knex.schema.createTable('questionnaires_questions', table => {
        table.increments('id').primary()
        table.string('questionnaireId').references('id').inTable('questionnaires').notNull()
        table.integer('questionId').references('id').inTable('questions').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('questionnaires_questions')
};
