class PlayGroundHistoryPage extends CreationPage {

    constructor(number) {
        super(number);
        this.arrayOfObj = this.getHistory();
        this.historyIdx;
    }

    // get history of obj in data form from backend database
    getHistory() {
        // for testing purposes!!
        return mockPlayGroundHistory;
    }

    // create the whole html tabs and return
    createHistoryHTML() {
        return createPlayGroundCards(this.arrayOfObj);
    }

    // build the histroy tabs and put it into this.array
    buildHistoryTabs(historyIdx) {
        let tabsHTML = this.createHistoryHTML();

        this.array[historyIdx] = tabsHTML;
        // this.array[historyIdx] = "lkajlkjlkj"
        return tabsHTML;
    }

    

    buildWholePage({historyIdx}) {
        this.historyIdx = historyIdx;
        this.buildHistoryTabs(historyIdx);
        return this.buildSkeleton();
    }

    // since we only have two buttons, will combine the eventListeners in the same class
    addEventListeners() {
        this.addEventListenerOfPlay();
        this.addEventListenerOfLogs();
    }

    // add event listener for play button
    addEventListenerOfPlay() {
        let playButtonElements = document.querySelectorAll(".contents .quiz .playground-item .playground-cards .take");
        playButtonElements.forEach((button, index) => button.addEventListener("click", () => {
            let contents = document.querySelector(".contents");
            contents.innerHTML = '';
            
            let videoPath = this.arrayOfObj[index].videoPath;
            let pG = returnPlayGround(videoPath);
            contents.innerHTML = pG;

            this.addEventListenerOfReturn();

        }))
    }

    // add event listener for logs button: 
    addEventListenerOfLogs() {
        let logsButtonElements = document.querySelectorAll(".contents .quiz .playground-item .playground-cards button.logs");
        logsButtonElements.forEach((button, index) => button.addEventListener("click", () => {
            const parent = document.querySelectorAll(".contents .quiz .playground-item")[index]; 

            if (button.classList.contains("active")) {
                button.classList.remove("active");
                const childNode = parent.querySelector("div.logs");
                parent.removeChild(childNode);
            }
            else {
                const arrayOfLogs = this.arrayOfObj[index].logs;
                const logsHTML = this.createLogs(arrayOfLogs);
                const childElement = document.createElement('div');

                childElement.setAttribute("class", "logs");
                childElement.innerHTML = logsHTML;
                parent.appendChild(childElement);

                this.addEventListenerOfContinueWork(index, parent);

                button.classList.add("active");
            }
        }))
    }

    addEventListenerOfContinueWork(parentIndex, parent) {
        const childElements = parent.querySelectorAll("div.logs div.log-item button.codepen");
        let videoPath = this.arrayOfObj[parentIndex].videoPath;
        let logs = this.arrayOfObj[parentIndex].logs;
        let contents = document.querySelector(".contents");

        childElements.forEach((button, index) => {
            button.addEventListener("click", () => {
                let codePenPath = logs[index].codepenLink;
                console.log("codePenPath: ", codePenPath);
                
                contents.innerHTML = '';
                let pG = returnPlayGround(videoPath, codePenPath);
                contents.innerHTML = pG;

                this.addEventListenerOfReturn();
            })            
        })
    }

    // add event listener for return: 
    addEventListenerOfReturn() {
        const returnButtonElement = document.querySelector(".contents .playgroundContainer .buttons button.return");

        returnButtonElement.addEventListener('click', () => {
            let contents = document.querySelector(".contents");
            contents.innerHTML = '';
            
            let pG = this.buildWholePage({historyIdx: 2});
            contents.innerHTML = pG;

            this.addEventListeners();
        })

        
    }

    // create the log part for the divs.
    createLogs(arrayOfLogs) {
        if (!arrayOfLogs) {
            return "No logs so far!!!!";
        }

        let result = "";
        // TODO: why it says arrayOfLogs is not iterable:
        for (let obj of arrayOfLogs) {
            result += this.createLog(obj);
        }

        // return '<div class="logs">' + result + '</div>';
        return result;
    }

    // create html content for logs part: 
    createLog(obj) {
        if (!obj) {
            return "Data missing";
        }
        // <a src=${obj.githubLink} target="_blank">See code on GitHub Gists</a>
        let logsHTML = `
            <div class="log-item">
                <p>date: ${obj.date}, time: ${obj.time}, score: ${obj.score}</p>
                <button class="github-gists" onclick="window.open('${obj.githubLink}', '_blank')">
                    See Code in GitHub Gists
                </button>
                <button class="codepen">Continue work on CodePen</button>
            </div>
        `

        return logsHTML;
    }
}