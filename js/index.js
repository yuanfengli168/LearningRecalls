// // import saveObject from "./database";
// import sessionStorage from "./session";

const ROOT_USER_ID = 1001;
var dataArray = [];

const contentType = Object.freeze({
    todayTask: "Today Task",
    dailyQuizCreation: "Daily Quiz Creation",
})

const initialDoms = {
    banners: document.querySelector(".banners"),
    bannersButtons: document.querySelectorAll(".banners button"),
    contents: document.querySelector(".contents"),
    quizButtons : null,
}

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
    }
 
    // default we are on Daily Quiz Creation.
    resultContentType = resultContentType === null ? contentType.todayTask : resultContentType;
    return resultContentType;
}


function renderPage() {
    var contentType = findContent();
    var contentHTML = null;

    switch (contentType) {
        // case contentType.todayTask: 
        case "Today Task":
            initialDoms.contents.innerHTML = returnTodayTasks();
            showPreviousQuizs();
            break;
        case "Daily Quiz Creation":
            initialDoms.contents.innerHTML = returnDailyQuizCreation();
            addSaveButtonEventListener();
            break;
    }
}

// show all quizs under div.quiz
async function showPreviousQuizs() {
    try {
        // get quizs as an array and including todays.
        var previousQuizArray = await getPreviousQuizesFromDataBase() ?? [1, 2, 3];
        if (previousQuizArray[0] !== 1) {
            previousQuizArray.sort((a, b) => new Date(a.date) - new Date(b.date));
            dataArray = previousQuizArray;
        }

        if (previousQuizArray && previousQuizArray.length > 0) {
            for (let i = 0; i < previousQuizArray.length; i++) {
                let quiz = previousQuizArray[i];

                let date = quiz.date ?? "unfound";
                let quizContent = quiz.content ?? "unfound";
                // var answer = quiz.answer;

                const newQuizTab = document.createElement('div');
                newQuizTab.classList.add("quiz-item")
                newQuizTab.innerHTML = 
                    `<div class="quiz-cards ${i}">
                            <div class="card-content">
                                <h1>Date: ${date}</h1>
                                <p>${quizContent}</p>
                            </div>
                            <button class="take">Take quiz</button>
                            <button disabled class="logs">Logs V</button>
                        </div>`

                let parent = document.querySelector(".quiz");
                parent.appendChild(newQuizTab);
            }
        }

        let quizButton  = document.querySelectorAll('button.take');

        quizButton.forEach((button, index) => {
            let idx = index;
            button.addEventListener('click', function() {
                renderQuizOfIndex(idx);
        })
    })
    } catch (e) {
        console.error(e);
    }

    return;
}

// return an object 
async function getPreviousQuizesFromDataBase() {
    const mongoDbAtlas = new MongoDBAtlas();
    const response = await mongoDbAtlas.getAllQuiz();
    const datesObject = await response;
    


    // const datesObject = mongoDbAtlas.getAllQuiz();
    const result = [];
    for (const property in datesObject) {
        const obj = {};
        obj.date = property;

        const tagObject = datesObject[property];
        for (const tagProperty in tagObject) {
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
                    <div class="tabs">
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p>
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p>
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p>
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p>
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p> 
                        <p>HTML+CSS</p>
                    </div>
                    <hr>
                    <p><b>Today Tags</b></p>
                    <div class="tabs">
                    <p>HTML+CSS</p>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button id="save">Save Quiz and Answer</button>
                <button disabled>Update Quiz and Answer</button>
                <button disabled>Append to Same Tag Today</button>
                <button id="reset">Reset Quiz and Answer</button>
            </div>

        </div>
    `;
}

function returnTodayTasks() {    
    return `
        <div class="todayTaskContainer">
            <p>Up to recent 3 day's Quiz</p>
            <div class="quiz">
                
                
            </div>
            <div class="test">Last week's Test on Monday</div>
            <div class="Exam">Last Month's Exam on First Week's Monday</div>
        </div>
    `;
}

function transferContentIntoLines(contentStr) {

}

function renderQuizOfIndex(index) {
    console.log(dataArray);

    let data = dataArray[index];
    let date = data.date;
    let tag = data.tag;
    let quiz = data.content;
    let answer = data.answer;

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
                    <input type="text">
                    <button class='showAnswer'>show answer</button>
                    <button class='hideAnswer'>hide answer</button>
                    <button class='return'>Return</button>
                </div>
                

                <div id="answer_paragraph"></p>
                    <pre>${answer}</pre>
                </div>
            </div>
            
            
        </div>
    `
    parent.innerHTML = newElementHTML;

    let showAnswerButton = document.querySelector('.showAnswer');
    let hideAnswerButton = document.querySelector('.hideAnswer');
    let returnButton = document.querySelector('.return');
    let answerP = document.getElementById('answer_paragraph');
    
    showAnswerButton.addEventListener('click', 
    function() {
        answerP.classList.add("active");
    })

    hideAnswerButton.addEventListener('click', 
    function() {
        answerP.classList.remove("active");
    })

    returnButton.addEventListener('click', 
    function() {
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

const postRenderDoms = {
    textAreaOfQuiz : document.querySelector(".quizAndAnswer div.creation textArea"),
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
    console.log("quiz content", document.querySelector(".quizAndAnswer div.creation textArea").value);
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
    console.log("answer content", document.querySelector(".quizAndAnswer div.answer textArea")?.value)
    return document.querySelector(".quizAndAnswer div.answer textArea")?.value ?? "";
};

// return what user has typed in tags
function getTagInputs() {
    console.log("tag content", document.querySelector(".input input")?.value);
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
    postRenderDoms.textAreaOfQuiz.value = "";
    postRenderDoms.textAreaOfAnswer.value = "";
    postRenderDoms.tagsInput.value = "";
    postRenderDoms.date.value = getTodayDate();
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
    console.log(button);

    button.addEventListener('click', function() {
        console.log("saving the contnet to database!")
        // TODO: check if this quiz has been saved to database?
        // Assume we will never update quiz
        const obj = createObjectOfInputs();
        const dataBaseObj = createSerialObject(obj);

        const mongoDbAtlas = new MongoDBAtlas(dataBaseObj);
        mongoDbAtlas.saveToDatabase();
    })
}


// reset all the content of buttons.
if (postRenderDoms.resetButton) {
    postRenderDoms.resetButton.addEventListener('click', function() {
    resetInputs();
})
}








// TODO: 
// in next version, write in ES6 classes method!!
