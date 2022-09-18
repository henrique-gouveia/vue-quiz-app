export default class Questionnaire {
    public id!: string;
    public start!: Date;
    public end!: Date;
    public count!: number;

    constructor(data: any = {}) {
        if (!data) {
            data = {}
        }

        this.id = data.id || '';
        this.start = data.start ? new Date(data.start) : new Date();
        this.end = data.end ? new Date(data.end) : new Date();
        this.count = data.count || 10;
    }
}
