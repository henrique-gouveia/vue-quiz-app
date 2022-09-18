module.exports = app => {
    app.get('/', (req, res) => res.send('Vue Quiz App is Running...'))

    app.route('/questions')
        .get(app.resources.question.get)
        .post(app.resources.question.save)

    app.route('/questions/:id')
        .get(app.resources.question.getById)
        .put(app.resources.question.save)
        .delete(app.resources.question.remove)

    app.route('/questionnaires')
        .get(app.resources.questionnaire.get)
        .post(app.resources.questionnaire.save)

    app.route('/questionnaires/:id')
        .get(app.resources.questionnaire.getById)
        .put(app.resources.questionnaire.save)
        .delete(app.resources.questionnaire.remove)

    app.get('/questionnaires/:id/questions', app.resources.questionnaire.getQuestionsByQuestionnaireId)
}
