const DEFAULT_CLASS_NAME = '.today-finished'

class Finished {
    constructor() {
        this.todayDate = getTodayDate();
        this.className = "";
        this.arrayOfFinishedQuizs = [];
    }

    // get all original quizs by calling utils
    async getAllQuizs() {
        return await getOriginalQuizs();
    }
    
    // return array of all quiz which results contains today's date/passed date
    // TODO: 
    // This naming is bad, advice: getArrayOfFinishedQuizs()
    async returnFinished(date) {
        if (!date) {
            date = this.todayDate;
        }
        let arrayOfQuizs = await this.getAllQuizs();

        const result = [];
        for (let quiz of arrayOfQuizs) {
            let results = quiz.results;
            for (let res of Array.from(results)) {
                let finishedDateTime  = res.finishedDateTime;
                let dateFinished = finishedDateTime.split(" ")[0];
                if (dateFinished === date) {
                    result.push(quiz);
                }
            }
        }

        // it might still be duplicate:
        // todo: in version2: think of deduplication
        // @date: 10/11/2024
        this.arrayOfFinishedQuizs = result;
        return result;
    }

    // return array of quiz that should show on the Today's Task which 
    // means only from the needs review section.
    async returnFinishedForTodayTaskPage() {
        let arrayOfFinished = this.returnFinished();
        let result = (await arrayOfFinished).filter(quiz => this.shouldRenderForTodayTask(quiz));
        return result;
    }

    // return an array that only should show for today's task:
    shouldRenderForTodayTask(quiz) {
        const todayDate = getTodayDate();
        const quizDate = quiz.date;
        // because result's first item is always the oldest time
        // TODO: write new util fundion to get all infos, @date:10/11/2024
        const quizLastResult = quiz.results[0];
        const quizLastResultDate = quizLastResult.finishedDateTime.split(" ")[0];
        const diffDays = (new Date(todayDate).getTime() - new Date(quizDate).getTime()) / (1000 * 3600 * 24);
        
        if ( [1,2,7,14,21,28,56].includes(diffDays) || quizLastResultDate === todayDate) {
                return true;    
        }
        
        return false;
    }

    // return array of quiz Card in html format in string type
    async createQuizCards(date) {
        const arrayOfFinished = await this.returnFinishedForTodayTaskPage();

        return createQuizCards(arrayOfFinished);
    }

    // find the parent by passing the class name/selector
    // className should have '.' in front: 
    // e.g. className = '.className';
    findParent(className) {
        const parent = document.querySelector(className || DEFAULT_CLASS_NAME);
        return parent;
    }

    // adding quizCards into parent
    async addQuizCardToParent(date) {
        const parentElement = this.findParent();
        if (parentElement) {
            const childElement = document.createElement('div');
            childElement.classList.add('finished-quiz');
            const quizCards = await this.createQuizCards(date || this.date);
            childElement.innerHTML = quizCards;

            parentElement.appendChild(childElement)

            // quick solution, adding listener here so after the await: 
            this.addEventListenerOfTakeQuiz();
            this.addEventListenerOfShowLogs();
        } 
    }

    // Caveat: this should be split from the other quiz-items 
    // sections on the same page
    addEventListenerOfTakeQuiz() {
        let selectorName = '.today-finished .finished-quiz .quiz-item .quiz-cards button.take';
        let quizButton = document.querySelectorAll(selectorName);

        quizButton.forEach((button, index) => {
            button.addEventListener('click', () => {
                renderQuizOfIndex(index, this.arrayOfFinishedQuizs);
            })
        })
    }

    // Caveat: this should be split from the other quiz-items 
    // sections on the same page
    addEventListenerOfShowLogs() {
        let selectorName = '.today-finished .finished-quiz .quiz-item .quiz-cards button.logs';
        let logButton = document.querySelectorAll(selectorName);

        logButton.forEach((button, index) => {
            button.addEventListener('click', () => {
                let parentSelectorName = `.today-finished .finished-quiz .quiz-item .card-logs-${index}`;
                let parent = document.querySelector(parentSelectorName);

                renderLogsOfIndex(index, this.arrayOfFinishedQuizs, false, parent);
                button.textContent = `Hide Logs`;
                button.classList.add("hide");
            })
        })
    }
}