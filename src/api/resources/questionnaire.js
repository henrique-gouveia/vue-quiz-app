const uuid = require('uuid')

module.exports = app => {
    const { existsOrError, greaterOrEqualThanOrError } = app.assertions

    const save = async (req, res) => {
        const questionnaire = { ...req.body }
        if (req.params.id) questionnaire.id = req.params.id

        try {
            existsOrError(questionnaire.start, 'Start date should be informed')
            existsOrError(questionnaire.end, 'End date should be informed')
            existsOrError(questionnaire.count, 'Count question should be informed')
        } catch (err) {
            return res.status(400).send(err)
        }

        try {
            if (questionnaire.id) {
                await updateQuestionnaire(questionnaire)
            } else {
                await insertQuestionnaire(questionnaire)
            }
            res.status(204).send()
        } catch (err) {
            res.status(500).send(err)
        }
    }

    const updateQuestionnaire = async (questionnaire) => {
        await app.db('questionnaires').update(questionnaire).where({ id: questionnaire.id })
    }

    const insertQuestionnaire = async (questionnaire) => {
        questionnaire.id = uuid.v4()

        const questions = await raffleQuestions(questionnaire.count)
        const questionnaireQuestions = questions.map(q => ({
            questionnaireId: questionnaire.id,
            questionId: q.id
        }))

        await app.db('questionnaires').insert(questionnaire)
        await app.db('questionnaires_questions').insert(questionnaireQuestions)
    }

    const raffleQuestions = async (count) => {
        let questions = await app.db('questions').select('id')

        existsOrError(questions, 'There are no questions')
        greaterOrEqualThanOrError(questions.length, count, `There are no sufficient questions, only ${questions.length}`)

        let maxCount = count
        if (questions.length < count) maxCount = questions.length

        const raffle = () => {
            const idx = Math.floor(Math.random() * questions.length);
            const question = questions[idx]

            questions = questions.filter(q => q.id !== question.id)

            return question
        }

        const raffledQuestions = [];
        for (let i = 0; i < maxCount; i++) {
            raffledQuestions.push(raffle())
        }

        return raffledQuestions
    }

    const remove = async (req, res) => {
        try {
            const questionnaireId = req.params.id
            existsOrError(questionnaireId, 'Questionnaire id should be informed')

            await app.db('questionnaires_questions').where({ questionnaireId }).del()
            const rowsDeleted = await app.db('questionnaires').where({ id: questionnaireId }).del()

            existsOrError(rowsDeleted, 'Questionnaire not found')

            res.status(204).send()
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    const limit = 5

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('questionnaires').count('id').first()
        const count = parseInt(result.count)

        app.db('questionnaires')
            .select('id', 'start', 'end', 'count')
            .limit(limit).offset(page * limit - limit)
            .then(questionnaires => res.json({ data: questionnaires, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        try {
            const questionnaires = await app.db('questionnaires')
                .select('id', 'start', 'end', 'count')
                .where({ id: req.params.id })
                .first()

            res.json(questionnaires)
        } catch (err) {
            res.status(500).send(err)
        }
    }

    const getQuestionsByQuestionnaireId = async (req, res) => {
        try {
            const questionnaireId = req.params.id
            existsOrError(questionnaireId, 'Questionnaire id should be informed')

            let questions = await app.db({ qq: 'questionnaires_questions' })
                .innerJoin({ q: 'questions' }, 'qq.questionId', 'q.id')
                .select('qq.questionnaireId', 'q.id', 'q.title', 'q.text')
                .where({ 'qq.questionnaireId': questionnaireId })
            existsOrError(questions, 'There are no questions for this questionnaire')

            questions = await Promise.all(questions.map(async (q) => {
                const answers = await app.db('question_answers')
                    .select('questionId', 'option', 'title', 'correct')
                    .where({ questionId: q.id })

                return {
                    ...q,
                    text: (q.text || '').toString(),
                    answers
                }
            }))

            res.json(questions)
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    return { save, remove, get, getById, getQuestionsByQuestionnaireId }
}
