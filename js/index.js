const contentType = Object.freeze({
    todayTask: "Today Task",
    dailyQuizCreation: "Daily Quiz Creation",
})

const doms = {
    banners: document.querySelector(".banners"),
    bannersButtons: document.querySelectorAll(".banners button"),
    contents: document.querySelector(".contents"),
}

/**
 * find which banners button has active in its class, 
 * and determine which enum is current enum
 * return enum value
 */
function findContent() {
    var activeButton = doms.banners.querySelector(".active");
    // console.log("activeButton: ", activeButton);
    var activeButtonClass = activeButton.classList[0];
    // console.log("activeButtonClass ", activeButtonClass);
    var resultContentType = null;

    switch (activeButtonClass) {
        case "todayTasks": 
            resultContentType = contentType.todayTask;
            break;
        case "dailyQuizCreation":
            resultContentType = contentType.dailyQuizCreation;
            break;
    }

    
    // default we are on Today's Task page.
    resultContentType = resultContentType === null ? contentType.todayTask : resultContentType;

    // console.log(resultContentType);
    return resultContentType;
}


function renderPage() {
    var contentType = findContent();
    var contentHTML = null;

    switch (contentType) {
        // case contentType.todayTask: 
        case "Today Task":
            contentHTML = returnTodayTasks();
            // console.log("Today Tasks page!")
            break;
        case "Daily Quiz Creation":
            contentHTML = returnDailyQuizCreation();
            break;
    }

    doms.contents.innerHTML = contentHTML;
}

renderPage();

function returnTodayTasks() {
    return `
        <div class="todayTaskContainer">
            <div class="quiz">
                <p>Up to recent 3 day's Quiz</p>
            </div>
            <div class="test">Last week's Test on Monday</div>
            <div class="Exam">Last Month's Exam on First Week's Monday</div>
        </div>
    `;
}

function returnDailyQuizCreation() {
    // Get today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');

    // Format date as YYYY-MM-DD
    const formattedDate = `${yyyy}-${mm}-${dd}`;


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
                    <textArea placeholder="Enter your content here:" rows="15" cols="50"></textArea>
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
                <button>Save Quiz and Answer</button>
                <button disabled>Update Quiz and Answer</button>
                <button disabled>Append to Same Tag Today</button>
                <button>Reset Quiz and Answer</button>
            </div>

        </div>
    `;
}

function handleClick(event) {
    // console.log("button clicked: ", event.target.textContent);
    
    // add active if not active found;
    if (event.target.classList.contains("active")) {
        return;
    } else {
        // doms.banners.querySelector(".active");
        var activeButton = doms.banners.querySelector(".active");
        activeButton.classList.remove("active");

        event.target.classList.add("active");
    }

    renderPage();
}

doms.bannersButtons.forEach(button => {
    button.addEventListener('click', handleClick);
})