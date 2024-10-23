// class Prefill will get selected date, and selected tag
// and return the content, and quiz, and auto fill it in the 
// related text areas on Daily Quiz Creation page only.
class Prefill {
    constructor(date, tag) {
        this.date = date;
        this.tag = tag;
        this.mongodbAtls = new MongoDBAtlas();
    }

    async getContentAndAnswer(date, tag) {
        let quiz, answer;
        
        try {
            // let res = await this.mongodbAtls.getContentAndAnswer(date, tag);
            let res = await this.mongodbAtls.getContentAndAnswerByQuery(ROOT_USER_ID, date, tag);
            quiz = res[0];
            answer = res[1];

            return [quiz, answer];
        } catch {
            // preventing console error in chrome console.
            return [quiz, answer];
        }
    }

    async prefillQuizAnsAnswer() {
        let [quiz, answer] = await this.getContentAndAnswer(this.date, this.tag);

        document.querySelector(".creation textarea").value = quiz;
        document.querySelector(".answer textarea").value = answer;
        document.querySelector(".input input").value = this.tag;
    }
}