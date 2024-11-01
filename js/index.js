// import PlayGroundCreationPage from "./components/playGroundCreationPage.js";

const ROOT_USER_ID = 1001;
var dataArray = [];

const contentType = Object.freeze({
    todayTask: "Today Task",
    dailyQuizCreation: "Daily Quiz Creation",
    quizHistory: "Quiz History",
    playGround: "Play Ground",
    createPlayGround: "Create Play Ground",
    playGroundHistory: "Play Ground History",
})

const initialDoms = {
    banners: document.querySelector(".banners"),
    bannersButtons: document.querySelectorAll(".banners button"),
    contents: document.querySelector(".contents"),
    quizButtons: null,
}

// build a filter instance
const filters = new Filters();

// UIs
/**
 * find which banners button has active in its class, 
 * and determine which enum is current enum
 * return enum value
 */
function findContent() {
    var activeButton = initialDoms.banners.querySelector(".active") ?? null;
    var resultContentType = null;
    var activeButtonClass = activeButton.classList[0];

    switch (activeButtonClass) {
        case "todayTasks":
            resultContentType = contentType.todayTask;
            break;
        case "dailyQuizCreation":
            resultContentType = contentType.dailyQuizCreation;
            break;
        case "quizHistory":
            resultContentType = contentType.quizHistory;
            break;
        case "newPlayground":
            resultContentType = contentType.playGround;
            break;
        case "createPlayground":
            resultContentType = contentType.createPlayGround;
            break;
        case "playgroundHistory":
            resultContentType = contentType.playGroundHistory;
            break;
    }

    // default we are on Daily Quiz Creation.
    resultContentType = resultContentType === null ? contentType.todayTask : resultContentType;
    return resultContentType;
}


function renderPage() {
    var contentType = findContent();

    switch (contentType) {
        // case contentType.todayTask: 
        case "Today Task":
            initialDoms.contents.innerHTML = returnTodayTasks();
            // showPreviousQuizs();
            filters.renderFilters(filters.tag, filters.order, "today");
            showPreviousQuizs(false, filters.tag, filters.order);
            // should instantiate a new instance, so no coupling with 
            // Today task and Quiz History
            const finished = new Finished();
            finished.addQuizCardToParent();

            break;
        case "Daily Quiz Creation":
            initialDoms.contents.innerHTML = returnDailyQuizCreation();
            renderAllTags();
            renderTodayTags();
            addEventListenerOfResetDate();
            addSaveButtonEventListener();
            addTagsEventListern();
            addEventListenerOfResetButton();
            break;
        case "Quiz History":
            initialDoms.contents.innerHTML = returnQuizHistory();
            filters.renderFilters(filters.tag, filters.order, "history");
            showPreviousQuizs(true, filters.tag, filters.order);
            break;
        case "Play Ground":
            initialDoms.contents.innerHTML = returnPlayGround();
            break;
        case "Create Play Ground":
            const pgcp = new PlayGroundCreationPage();
            let innerHTML = pgcp.buildWholePage({
                dateIndex: 1, titleIndex: 2,
                descIndex: 3, videoIndex: 4, buttonIndex: 5
            });
            initialDoms.contents.innerHTML = innerHTML;
            pgcp.addEventListeners();
            break;
        case "Play Ground History": 
            const pghp = new PlayGroundHistoryPage(4);
            // initialDoms.contents.innerHTML = pghp.buildWholePage({historyIdx : 2});

            initialDoms.contents.innerHTML = pghp.buildWholePage({historyIdx: 2})
            pghp.buildHistoryTabs(2); // 2 should be constant with the above line historyIdx.
            // let a = pghp.buildWholePage({historyIdx : 2});
            // console.log("AAA: ", a);

            // pghp.addEventListeners();
            break;

    }
}

// 
function returnPlayGround(videoPath, codePenPath = "https://codepen.io/pen/") {
    // return html: 
    const strOfhtml = `
        <div class="playgroundContainer">
            <div class="sub-header clearfix">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, sapiente.</p>

                <div class="buttons">
                    <a href="${videoPath}" target="_blank"><button class="video">Open video</button></a>
                    
                    
                    <span class="github-link">
                        <button class="save-to-gist">Save Github link here</button>
                        <input type="text" name="" id="">
                    </span>

                    <span class="share-link">
                        <button class="save-to-gist">Save Sharing link here </button>
                        <input type="text" name="" id="">
                    </span>

                    <button class="return">return</button>
                    
                    
                </div>
            </div>
            <iframe class="codepen" src=${codePenPath} frameborder="0"></iframe>
        </div>

    `
    return strOfhtml;
}



async function renderAllTags() {
    // get the data from backend
    const mongoDbAtlas = new MongoDBAtlas();
    const tags = await mongoDbAtlas.getAllTags(ROOT_USER_ID);

    let parent = document.querySelector(".allTags");
    let span = '';
    if (tags.length <= 0) {
        span = '<i>No Tags found</i>';
    } else {
        for (let tag of tags) {
            span += `<p>${tag}</p>`
        }
    }
    parent.innerHTML = span;
}

async function renderTodayTags() {
    // get the data from backend
    const mongoDbAtlas = new MongoDBAtlas();
    let date = getSelectedDate();

    const tags = await mongoDbAtlas.getAllTags(ROOT_USER_ID, date);

    let parent = document.querySelector(".todayTags");
    let span = '';
    if (tags.length <= 0) {
        span = '<i>No Tags found</i>';
    } else {
        for (let tag of tags) {
            // span += `<p>${tag}</p>`
            span += `<button class="todayTagTabs ${tag}" title="click to prefill">${tag}</button>`
        }
    }
    parent.innerHTML = span;
    addEventListenerOfTodayTags();
}

// add event listener of button of tags: 
function addEventListenerOfTodayTags() {
    let buttons = document.querySelectorAll(".todayTagTabs");
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            let date = getSelectedDate();
            let tag = button.textContent;

            let prefill = new Prefill(date, tag);
            prefill.prefillQuizAnsAnswer();
        })
    })
}

function returnQuizHistory() {
    return `
        <div class="QuizHistoryContainer">
            <p>All Past Quizs</p>
            <div class="filters-container"></div>
            <div class="quiz">
                
                
            </div>
        </div>
    `;
}

function needsReview(quiz) {
    const todayDate = getTodayDate();
    const quizDate = quiz.date;

    const diffDays = (new Date(todayDate).getTime() - new Date(quizDate).getTime()) / (1000 * 3600 * 24);

    // // This implementation valid until Oct.30. 
    // if ((quiz.results.length === 0 && diffDays !== 0) ||
    //     [1, 7, 14, 28, 56].includes(diffDays) && Array.from(quiz.results).at(-1).finishedDateTime.split(" ")[0] !== todayDate) {
    //     return true;
    // }

    if ((quiz.results.length === 0 && diffDays !== 0) ||
        [7, 28].includes(diffDays) && Array.from(quiz.results).at(-1).finishedDateTime.split(" ")[0] !== todayDate) {
        return true;
    }
    
    else return false;
}

function replaceHtmlEntity(str) {
    return str.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// show all quizs under div.quiz
async function showPreviousQuizs(showAll, tagValue, orderValue) {
    let changed = false;
    // console.log("showAll, tagValue, orderValue: ", showAll, tagValue, orderValue);

    try {
        // get quizs as an array and including todays.
        var previousQuizArray = await getPreviousQuizesFromDataBase() ?? [1, 2, 3];
        if (previousQuizArray[0] !== 1) {
            previousQuizArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            dataArray = previousQuizArray;
        }



        // get all quiz that has not been finished.
        // get quiz that is 7 days ago, or one month ago, or two month ago

        if (tagValue && tagValue !== "") {
            previousQuizArray = previousQuizArray.filter(quiz => quiz.tag === tagValue);
            changed = true;
        }

        // bug1, please see the typeof case, I was struggling because 2 !== "2"; type is different.
        // bug2, the order must all have new in front of the Date(), new was missing
        if (orderValue && orderValue > 1) {

            switch (parseInt(orderValue)) {
                // non-chronological:
                case 2:
                    previousQuizArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                    // console.log("previousQuizArray: ", previousQuizArray);
                    break;
                // chronological:
                case 3:
                    previousQuizArray.sort((a, b) => new Date(a.date) - new Date(b.date));
                    // console.log("previousQuizArray: ", previousQuizArray);
                    break;
                default:
                    // console.log("the order value is not valid");
                    break;
            }
            changed = true;
        }

        if (showAll === false) {
            // previousQuizArray = previousQuizArray.filter(quiz => quiz.results.length === 0);
            previousQuizArray = previousQuizArray.filter(quiz => needsReview(quiz));
            // console.log("!showAll");
        }
        if (showAll === true && changed === false) {
            previousQuizArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            // console.log("showAll");
        }

        if (previousQuizArray && previousQuizArray.length > 0) {
            for (let i = 0; i < previousQuizArray.length; i++) {
                let quiz = previousQuizArray[i];
                let date = quiz.date ?? "unfound";
                let quizContent = quiz.content ?? "unfound";
                let tag = quiz.tag;
                let numbers = getNumbersOfQuestions(quizContent);

                // should substitute <, > whith html entity in quizContent, and Answer so to make it easier.
                quizContent = replaceHtmlEntity(quizContent);

                const newQuizTab = document.createElement('div');
                newQuizTab.classList.add("quiz-item")
                newQuizTab.innerHTML =
                    `<div class="quiz-cards ${i}">
                            <div class="card-content">
                                <h3>Date: ${date}, Tag: ${tag}, Numbers: ${numbers}</h3>
                                <pre>${quizContent}</pre>
                            </div>
                            <button class="take">Take quiz</button>
                            <button class="logs">Logs v</button>
                            
                    </div>
                    <div class="card-logs-${i}">

                    </div>
                    `

                let parent = document.querySelector(".quiz");

                parent.appendChild(newQuizTab);

            }
        }

        // Not decoubpled very well: I am adding a new section: "Today's finished "
        // on the same page but will we need to use the same index? it might not 
        // return correct contents: 
        // @date: oct112024
        // @author: yuanfengl
        // @todo: fix in finished.js in version1.0
        //        fix here in version2.0
        let quizButton = document.querySelectorAll('button.take');
        quizButton.forEach((button, index) => {
            let idx = index;
            button.addEventListener('click', function () {
                renderQuizOfIndex(idx, previousQuizArray);
            })
        })

        let quizLogs = document.querySelectorAll('button.logs');
        quizLogs.forEach((button, index) => {
            let idx = index;
            button.addEventListener('click', function () {
                renderLogsOfIndex(idx, previousQuizArray, false);
                button.textContent = `Hide Logs`;
                button.classList.add("hide");
            })
        })


    } catch (e) {
        console.error(e);
    }

    return;
}

// return the previous score, by clicking the `Logs v` button.
function renderLogsOfIndex(idx, previousQuizArray, isHidden, parent) {
    // get results
    let quiz = previousQuizArray[idx];
    var element = `<h4>Logs:</h4>`;


    if (isHidden) {
        element = ``;
    }
    else {
        if (quiz.results.length > 0) {
            // only get most recent 5 times score! for logs!
            for (const res of quiz.results.slice(-5).reverse()) {
                const finishedDateAndTime = res.finishedDateTime;
                const score = res.score;

                element += `
                    <p>Finished Date: ${finishedDateAndTime}, Score: ${score}.</p>
                `
            }
        } else {
            element = `<p>There is no logs available yet, please take the quiz!!!`;
        }
    }

    // if argument of parent is undefined/null, 
    // we use the first of we can find in the page
    // need to update: 
    if (!parent) {
        parent = document.querySelector(`.card-logs-${idx}`);
    }

    parent.innerHTML = element;


    // TODO: 
    // the hide is not good for now.
    // you have to click button twice.
    let hideLogs = document.querySelectorAll('.hide');
    hideLogs.forEach((button, index) => {
        // let idx = index;
        button.addEventListener('click', function () {
            // button.classList.remove("hide");
            // console.log("index, clicked: ", index)
            renderPage();
        })
    })
}

// return an object 
async function getPreviousQuizesFromDataBase() {
    const mongoDbAtlas = new MongoDBAtlas();
    const response = await mongoDbAtlas.getAllQuiz();
    const datesObject = await response;



    // const datesObject = mongoDbAtlas.getAllQuiz();
    const result = [];

    for (const property in datesObject) {
        const tagObject = datesObject[property];
        for (const tagProperty in tagObject) {
            const obj = {};
            obj.date = property;
            const tag = tagObject[tagProperty];
            obj.tag = tag.quizTags;
            obj.content = tag.quizContent;
            obj.answer = tag.quizAnswerContent;
            obj.hasFinished = tag.hasFinished;
            obj.results = tag.results;

            result.push(obj);
        }
    }

    return result.length === 0 ? null : result;
}

function returnDailyQuizCreation() {
    // Format date as YYYY-MM-DD
    const formattedDate = getTodayDate();


    return `
        <div class="dailyQuizCreation">
            <div class="date">
                <h4>Today's Date</h4> 
                
                <input type="date" value=${formattedDate}></input>
                <button class="resetDate">Reset date</button>
            </div>
            <div class="quizAndAnswer">
                <div class="creation">
                    <h4>Create Quiz:</h4>
                    <p>Write your quiz in the input box below:</p>
                    <textArea required placeholder="Enter your content here:" rows="15" cols="50"></textArea>
                </div>
                
                <div class="answer">
                    <h4>Write Answers: </h4>
                    <p>Write down your answers: </p>
                    <textArea placeholder="Enter your answers here:" rows="15" cols="50"></textArea>
                </div>
                
            </div>
            <div class="tags">
                <div class="input">
                    <h4>Tags</h4>
                    <input></input>
                    <div class="data-container"></div>
                </div>

                <div class="history">
                    <p><b>Used Tags</b></p>
                    <div class="allTags tabs">
                        
                        
                    </div>
                    <hr>
                    <p><b>Selected Date Tags (click to prefill)</b></p>
                    <div class="todayTags tabs">
                        
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button id="save">Save Quiz and Answer</button>
                <button disabled>Append to Same Tag Today</button>
                <button id="reset">Reset quiz, answer, tag</button>
            </div>

        </div>
    `;
}

function returnTodayTasks() {
    return `
        <div class="todayTaskContainer">
            <p>Up to recent 3 day's Quiz</p>
            <div class="filters-container"></div>
            <div class="quiz">
                
                
            </div>

            <div class="today-finished">
                Today's Finished:
            </div>
            <!-- TODO in version 2.0
            <div class="test">Last week's Test on Monday</div>
            <div class="Exam">Last Month's Exam on First Week's Monday</div> 
            -->
        </div>
    `;
}

function getCurrentTime() {
    const now = new Date();

    // Get the current time
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

function getCurrentDateAndTime(connector = " ") {
    let date = getTodayDate();
    let time = getCurrentTime();

    return date + connector + time;
}

function renderQuizOfIndex(index, previousQuizArray) {
    let data = previousQuizArray[index];
    let date = data.date;
    let tag = data.tag;
    // let quiz = data.content;
    // let answer = data.answer;

    let quiz = replaceHtmlEntity(data.content);
    let answer = replaceHtmlEntity(data.answer);

    // we want quiz to be redden if needs to 
    const redden = new Redden();
    const lines = redden.getWrongLines(data.results); // will return [] if none;
    quiz = redden.makeLinesRed(quiz, lines);
    answer = redden.makeLinesRed(answer, lines);

    const parent = document.querySelector(".contents");
    const newElementHTML = `
        <div class="takeQuiz">
            <p>${date}</p>
            <p>Tag: ${tag}</p>
            <div class="threeParts">
                <div id="quiz_paragraph">
                    <pre>${quiz}</pre>
                </div>
                
                <div id="write_answer">
                    <textarea placeholder="write your answer"></textarea>
                </div>

                <div>
                    <p>what is your score?</p>
                    <input type="text" class='scoreInput'>
                    <button class='saveScore'>Save Score</button>
                    <button class='showAnswer'>show answer</button>
                    <button class='hideAnswer'>hide answer</button>
                    <button class='return'>Return</button>

                    <span class='successed'>Saved Successed!</span>
                    <span class='failed'>Failed to Save</span>
                </div>
                

                <div id="answer_paragraph"></p>
                    <pre>${answer}</pre>
                </div>
            </div>
            
            
        </div>
    `
    parent.innerHTML = newElementHTML;

    let saveButton = document.querySelector('.saveScore');
    let showAnswerButton = document.querySelector('.showAnswer');
    let hideAnswerButton = document.querySelector('.hideAnswer');
    let returnButton = document.querySelector('.return');
    let answerP = document.getElementById('answer_paragraph');


    saveButton.addEventListener('click', function () {
        let type = 'quiz';
        let finishedDateTime = getCurrentDateAndTime();

        let score = document.querySelector('.scoreInput').value;

        if (!score) {
            window.alert("Please enter a number as score!");
            return;
        }

        const mongoDbAtlas = new MongoDBAtlas();
        const result = mongoDbAtlas.postScore(date, type, finishedDateTime, score, ROOT_USER_ID, tag);
        result.then(res => {
            if (res === true) {
                let span = document.querySelector('span.successed');
                span.classList.add('active');

                setTimeout(() => {
                    span.classList.remove('active');
                }, 2000);
            } else {
                let span = document.querySelector('span.failed');
                span.classList.add('active');

                setTimeout(() => {
                    span.classList.remove('active');
                }, 2000);
            }
        })

    })

    showAnswerButton.addEventListener('click',
        function () {
            answerP.classList.add("active");
        })

    hideAnswerButton.addEventListener('click',
        function () {
            answerP.classList.remove("active");
        })

    returnButton.addEventListener('click',
        function () {
            renderPage();
        })
}

renderPage();


// Data
// return today's date in format: YYYY-MM-DD
function getPreviousQuizFromLocalStorage(dateStr) {
    try {
        const resultObj = {};
        resultObj.date = dateStr;

        const localStorageObject = new localStorage();
        var quiz = localStorageObject.getQuizByDate(dateStr);
        resultObj.quizContent = quiz;


        return resultObj;
    } catch (e) {
        console.error(e);
    }

}

// not usable 
// TODO: find out reason why!
const postRenderDoms = {
    textAreaOfQuiz: document.querySelector(".quizAndAnswer div.creation textArea"),
    textAreaOfAnswer: document.querySelector(".quizAndAnswer div.answer textArea"),
    tagsInput: document.querySelector(".input input"),
    date: document.querySelector(".date input"),
    buttons: document.querySelectorAll(".contents .buttons"),
    saveButton: document.querySelector("button#save"),
    resetButton: document.querySelector("button#reset"),
    takeQuizButtons: document.querySelectorAll('button.take')
}

// return what user has typed for quiz
function getQuizCreaionContent() {
    return document.querySelector(".quizAndAnswer div.creation textArea")?.value ?? "";
};

function getTodayDate() {
    // Get today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');

    // Format date as YYYY-MM-DD
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate;
}

// return what user has typed for answer
function getAnswerContent() {
    return document.querySelector(".quizAndAnswer div.answer textArea")?.value ?? "";
};

// return what user has typed in tags
function getTagInputs() {
    return document.querySelector(".input input")?.value ?? "";
}

// return what user has selected for the date
function getSelectedDate() {
    return document.querySelector(".date input")?.value;
}

// return an object including all the content user typed.
function createObjectOfInputs() {
    var quiz = getQuizCreaionContent();
    var answer = getAnswerContent();
    var tag = getTagInputs();

    if (quiz === "" || answer === "" || tag === "") {
        window.alert("All fields must not be empty!");
    } else {
        const resultObj = {
            quiz: quiz,
            answer: answer,
            tag: tag,
            date: getSelectedDate(),
        }

        return resultObj;
    }
}

// clear all inputs of user's input, date will return to today's date.
function resetInputs() {
    document.querySelector(".creation textarea").value = "";
    document.querySelector(".answer textarea").value = "";
    document.querySelector(".input input").value = "";
}

// handle and change UI content based on banners button click
function handleClick(event) {
    // add active if not active found;
    if (event.target.classList.contains("active")) {
        return;
    } else {
        var activeButton = initialDoms.banners.querySelector(".active");
        activeButton.classList.remove("active");
        event.target.classList.add("active");
    }

    renderPage();
}


// Commute to backend.
// insert a object.
function createSerialObject(obj) {
    const resultObj = {
        // TODO: change it later.
        userID: ROOT_USER_ID,
        date: obj.date,
        quizTags: obj.tag,
        quizContent: obj.quiz,
        quizAnswerContent: obj.answer,
        hasFinished: false,
        results: [],
    }

    return resultObj;
}

// EventListeners: 
// banner buttons click
initialDoms.bannersButtons.forEach(button => {
    button.addEventListener('click', handleClick);
})


function addSaveButtonEventListener() {
    let button = document.querySelector("button#save");

    button.addEventListener('click', function () {
        // TODO: check if this quiz has been saved to database?
        // Assume we will never update quiz
        const obj = createObjectOfInputs();
        const dataBaseObj = createSerialObject(obj);

        const mongoDbAtlas = new MongoDBAtlas(dataBaseObj);
        mongoDbAtlas.saveToDatabase();

        // TODO: 
        // not waiting for the saveTODatabase finish 
        // because can't add await before the above line
        // quickfix: add setTimeOut
        // renderTodayTags();
        setTimeout(() => renderTodayTags(), 1000);
    })
}

function addEventListenerOfResetButton() {
    document.querySelector("button#reset").addEventListener('click', function () {
        // console.log("reset pressed!!");
        resetInputs();
    })
}


function addTagsEventListern() {
    if (document.querySelector('.date input')) {
        document.querySelector('.date input').addEventListener('change', function () {
            renderAllTags();
            renderTodayTags();
        })
    }
}

function addEventListenerOfResetDate() {
    let button = document.querySelector(".dailyQuizCreation .date button.resetDate");
    button.addEventListener('click', () => {
        document.querySelector(".date input").value = getTodayDate();
        renderTodayTags();
    })
}





// TODO: 
// in next version, write in ES6 classes method!!
