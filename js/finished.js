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
    
    // return array of quiz which results contains today's date
    // TODO: 
    // This naming is bad, advice: getArrayOfFinishedQuizs()
    async returnFinished(date) {
        if (!date) {
            date = this.todayDate;
        }

        let arrayOfQuizs = await this.getAllQuizs();

        // method1: 
        // I prefer this one for better readability and maintainability in the future.
        const result = [];
        for (let quiz of arrayOfQuizs) {
            let results = quiz.results;
            for (let res of Array.from(results)) {
                // blocker 1: 5min block
                // let finishedDateAndTime  = typeof res.finishedDateAndTime;  
                // blocker: why finishedDataTime is undefined? because I typed And which is not in the attribute
                let finishedDateTime  = res.finishedDateTime;
                let dateFinished = finishedDateTime.split(" ")[0];
                if (dateFinished === date) {
                    result.push(quiz);
                }
            }
        }

        // Method2: following is fully functional
        // can use but really hard to read and maintain for future engineers, I would prefer the above way:
        // arrayOfQuizs = arrayOfQuizs.filter(quiz => Array.from(quiz.results)
                                        //    .some((element) => element.finishedDateTime.split(" ")[0] === date));
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
        // bug2: I forgot to write await here, so the return will
        // always return an "" string;
        // const arrayOfFinished = this.returnFinished(date);

        // correct version: 
        // do this inside of returnFinished.
        // const arrayOfFinished = await this.returnFinished(date);
        // update this.arrayOfFinishedQuizs only once in the entire class:
        // this.arrayOfFinishedQuizs = arrayOfFinished;
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

            // // Caveat: only update the class member value 
            // //         when we are on the page that needs it.
            // this.arrayOfFinishedQuizs = await this.createQuizCards(date || this.date);
            // console.log("update: ", this.arrayOfFinishedQuizs);

            const quizCards = await this.createQuizCards(date || this.date);
            childElement.innerHTML = quizCards;

            parentElement.appendChild(childElement)


            // quick solution, adding listener here so after the await: 
            this.addEventListenerOfTakeQuiz();
            this.addEventListenerOfShowLogs();
        } 
        else {
            return;
        }
    }

    // Caveat: this should be split from the other quiz-items 
    // sections on the same page
    addEventListenerOfTakeQuiz() {
        let selectorName = '.today-finished .finished-quiz .quiz-item .quiz-cards button.take';
        let quizButton = document.querySelectorAll(selectorName);
        quizButton.forEach((button, index) => {
            let idx = index;
            // bug!!!: any this inside of the function() is pointing 
            //         to the function it self rather than the class 
            //        Solution: using arrow funtion
            // button.addEventListener('click', function () {
            //     console.log("array: ", this.arrayOfFinishedQuizs);
            //     renderQuizOfIndex(idx, this.arrayOfFinishedQuizs);
            // })

            button.addEventListener('click', () => {
                renderQuizOfIndex(idx, this.arrayOfFinishedQuizs);
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