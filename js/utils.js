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

// create quizCard in html format: 
function createQuizCard(quiz, i) {
    let date, tag, numbers, quizContent;
    date = quiz.date ?? "unfound";
    quizContent = quiz.content ?? "unfound";
    tag = quiz.tag;

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

