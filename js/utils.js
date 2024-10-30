// get the originalPreviousQuizArray from the backend: 
async function getOriginalQuizs() {
    try {
        return await getPreviousQuizesFromDataBase();
    }
    catch (e) {
        console.error(e);
        return [];
    }
}

// return number of Questions for quiz Content: 
function getNumbersOfQuestions(quizContent) {
    let numbers1Match = quizContent === "unfound" ? 0 : quizContent.match(/\d+\./g);
    let numbers1 = numbers1Match === 0 || numbers1Match === null ? 0 : numbers1Match.length;
    let numbers2 = quizContent === "unfound" ? 0 : quizContent.trim().split("\n").length;
    let numbers = Math.min(numbers1, numbers2);

    return numbers;
}

// create quizCard in html format: 
function createQuizCard(quiz, i) {
    let date, tag, numbers, quizContent;
    date = quiz.date ?? "unfound";
    quizContent = quiz.content ?? "unfound";
    tag = quiz.tag ?? "unfound";
    numbers = getNumbersOfQuestions(quizContent);

    

    const quizCard = `
    <div class="quiz-item">
        <div class="quiz-cards ${i}">
            <div class="card-content">
                <h3>Date: ${date}, Tag: ${tag}, Numbers: ${numbers}</h3>
                <pre>${quizContent}</pre>
            </div>
            <button class="take">Take quiz</button>
            <button class="logs">Logs v</button>
                            
        </div>
        <div class="card-logs-${i}">

        </div>
    </div>
    `
    return quizCard;
}

// create quizCards in html format: 
function createQuizCards(quizs) {
    let quizCards = ``;
    for (let i = 0; i < quizs.length; i++) {
        let quizCard = createQuizCard(quizs[i], i);
        quizCards += quizCard;
    }
    return quizCards;
}


// create quizCard in html format: 
function createPlayGroundCard(pg, i) {
    let date, title, desc;
    date = pg.date ?? "unfound";
    title = pg.title ?? "unfound";
    desc = pg.desc ?? "unfound";

    const card = `
    <div class="quiz-item playground-item">
        <div class="quiz-cards playground-cards ${i}">
            <div class="card-content">
                <h3>Date: ${date}, Title: ${title}</h3>
                <pre>${desc}</pre>
            </div>
            <button class="take">Play</button>
            <button class="logs">Logs v</button>
                            
        </div>
        <div class="card-logs-${i}">

        </div>
    </div>
    `
    return card;
}

// create quizCards in html format: 
function createPlayGroundCards(arrayOfPGs) {
    let cards = ``;
    for (let i = 0; i < arrayOfPGs.length; i++) {
        let card = createPlayGroundCard(arrayOfPGs[i], i);
        cards += card;
    }
    
    return '<div class="quiz" style="background: #008c8c">' + cards + '</div>';
}

