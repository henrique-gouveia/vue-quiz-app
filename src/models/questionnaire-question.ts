import Question from "./question";

export default class QuestionnaireQuestion extends Question {
    public selected?: boolean = false;

    constructor(data: any = {}) {
        super(data);
    }
}
