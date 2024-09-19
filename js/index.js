// // import saveObject from "./database";
// import sessionStorage from "./session";

const ROOT_USER_ID = '1001';

const contentType = Object.freeze({
    todayTask: "Today Task",
    dailyQuizCreation: "Daily Quiz Creation",
})

const initialDoms = {
    banners: document.querySelector(".banners"),
    bannersButtons: document.querySelectorAll(".banners button"),
    contents: document.querySelector(".contents"),
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
            contentHTML = returnTodayTasks();
            
            break;
        case "Daily Quiz Creation":
            contentHTML = returnDailyQuizCreation();
            break;
    }

    initialDoms.contents.innerHTML = contentHTML;
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
    // TODO: build getPreviousQuiz();
    var previousQuiz = getPreviousQuiz("2024-09-17"); //dateStr: 2024-09-17
    var date = "";
    var quizContent = "";
    var answerContent = "";

    if (previousQuiz) {
        date = previousQuiz.date;
        quizContent = previousQuiz.quizContent;
        // TODO later
        // answerContent = previousQuiz.answerContent;
    }

    return `
        <div class="todayTaskContainer">
            <div class="quiz">
                <p>Up to recent 3 day's Quiz</p>
                <div class="quiz-section">
                    <div class="quiz-cards">
                        <div class="card-content">
                            <h1>Date: ${date}</h1>
                            <p>${quizContent}</p>
                        </div>
                        <button class="take">Take quiz</button>
                        <button disabled class="logs">Logs V</button>
                    </div>
                </div>
            </div>
            <div class="test">Last week's Test on Monday</div>
            <div class="Exam">Last Month's Exam on First Week's Monday</div>
        </div>
    `;
}

renderPage();

// Data
// return today's date in format: YYYY-MM-DD
function getPreviousQuiz(dateStr) {
    const resultObj = {};
    resultObj.date = dateStr;
    
    const localStorageObject = new localStorage();
    var quiz = localStorageObject.getQuizByDate(dateStr);
    resultObj.quizContent = quiz;


    return resultObj;
}

const postRenderDoms = {
    textAreaOfQuiz : document.querySelector(".quizAndAnswer div.creation textArea"),
    textAreaOfAnswer: document.querySelector(".quizAndAnswer div.answer textArea"),
    tagsInput: document.querySelector(".input input"),
    date: document.querySelector(".date input"),
    buttons: document.querySelectorAll(".contents .buttons"),
    saveButton: document.querySelector("button#save"),
    resetButton: document.querySelector("button#reset"),
}

// return what user has typed for quiz
function getQuizCreaionContent() {
    return postRenderDoms.textAreaOfQuiz.value;
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
    return postRenderDoms.textAreaOfAnswer.value;
};

// return what user has typed in tags
function getTagInputs() {
    return postRenderDoms.tagsInput.value;;
}

// return what user has selected for the date
function getSelectedDate() {
    return postRenderDoms.date.value;
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

// function saveToDataBase(obj) {

// }


// EventListeners: 
// banner buttons click
initialDoms.bannersButtons.forEach(button => {
    button.addEventListener('click', handleClick);
})

// saveButton and return values.
postRenderDoms.saveButton.addEventListener('click', function() {
    // TODO: check if this quiz has been saved to database?

    // Assume we will never update quiz
    const obj = createObjectOfInputs();
    const dataBaseObj = createSerialObject(obj);

    // // local Storage saving methods: 
    // const myLocalStorage = new localStorage(dataBaseObj);
    // myLocalStorage.saveToLocalStorage();

    
    console.log("starting to save to database")
    console.log("object: ", obj);
    const mongoDbAtlas = new MongoDBAtlas(dataBaseObj);
    let result = mongoDbAtlas.saveToDatabase();

    console.log("Result: ", result);
    if (result === 'success') {
        console.log("Successfully saved to database!");
    } else {
        console.log("Error occured for saving to database")
    }
})

// reset all the content of buttons.
postRenderDoms.resetButton.addEventListener('click', function() {
    resetInputs();
})











// TODO: 
// in next version, write in ES6 classes method!!
