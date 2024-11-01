class PlayGroundHistoryPage extends CreationPage {

    constructor(number) {
        super(number);
        this.db = new MongoDBAtlas();
        // // you can't call async in constructor it will return 
        // // promises only
        // this.arrayOfObj = this.getHistory();
        this.arrayOfObj = null;
        this.historyIdx;
    }

    // get history of obj in data form from backend database
    async getHistory() {
        // for testing purposes!!
        // return mockPlayGroundHistory;

        const result = await this.db.getPlayGroundHistory();
        this.arrayOfObj = result;

        console.log("THIS. arrayOfObj: ", this.arrayOfObj);

        return result;
    }

    // create the whole html tabs and return
    async createHistoryHTML() {
        // return this.getHistory().then((result) => {
        //     console.log("Result: ", result);
        //     this.arrayOfObj = result;
        //     let content = createPlayGroundCards(result);
        //     console.log("CONTENT: ", content);
        //     // return createPlayGroundCards(result);
        //     return content;
        // }).catch((error) => {
        //     console.error("Result Error: ", error);
        // })

        // return "hahhahaha";
        const result = await this.getHistory();
        console.log("RESULT-: ", result);

        const html = createPlayGroundCards(result);
        console.log("HTML: ", html);

        return html;
    }

    // // build the histroy tabs and put it into this.array
    // // modify this to an separate function, do not return!
    // // call it in index.js
    // buildHistoryTabs(historyIdx) {
    //     let tabsHTML = this.createHistoryHTML();
    //     console.log("TABS-HTML: ", tabsHTML);

    //     this.array[historyIdx] = tabsHTML;
    //     // this.array[historyIdx] = "lkajlkjlkj"


    //     return tabsHTML;
    // }

    // will be a separate things, and build wholepage w
    // will go first!!
    async buildHistoryTabs(historyIdx) {
        let tabsHTML = await this.createHistoryHTML();
        console.log("TABS-HTML: ", tabsHTML);

        // this.array[historyIdx] = tabsHTML;
        // this.array[historyIdx] = "lkajlkjlkj"
        let parent = document.querySelectorAll(`div.contents div.skeleton div.section`)[historyIdx - 1];

        parent.innerHTML = tabsHTML;
        // return tabsHTML;
        this.addEventListeners();
    }



    // buildWholePage({historyIdx}) {
    //     this.historyIdx = historyIdx;
    //     // this.buildHistoryTabs(historyIdx);
    //     return this.buildSkeleton();
    // }

    buildWholePage({ historyIdx }) {
        this.historyIdx = this.historyIdx;
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
            console.log("THIS arrayOFOBJ: ", this.arrayOfObj);


            let contents = document.querySelector(".contents");
            contents.innerHTML = '';

            let currentObj = this.arrayOfObj[index];
            let videoHTMLPagePath = this.arrayOfObj[index].videoHTMLPagePath;


            // quick fix to pass date, title, desc, videoHTMLPagePath
            let obj = {
                userID: ROOT_USER_ID,
                date: currentObj.date,
                title: currentObj.title,
                desc: currentObj.desc,
                videoHTMLPagePath: currentObj.videoHTMLPagePath
            }
            let pG = returnPlayGround(videoHTMLPagePath, "", obj);
            contents.innerHTML = pG;

            this.addEventListenerOfSaveBothLinks(obj);
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
        let videoHTMLPagePath = this.arrayOfObj[parentIndex].videoHTMLPagePath;
        let logs = this.arrayOfObj[parentIndex].logs;
        let contents = document.querySelector(".contents");


        childElements.forEach((button, index) => {
            button.addEventListener("click", () => {
                let codePenPath = logs[index].codepenLink;
                console.log("codePenPath: ", codePenPath);

                contents.innerHTML = '';
                let currentObj = this.arrayOfObj[parentIndex];
                console.log("CURRENT obj", currentObj);
                let obj = {
                    userID: ROOT_USER_ID,
                    date: currentObj.date,
                    title: currentObj.title,
                    desc: currentObj.desc,
                    videoHTMLPagePath: currentObj.videoHTMLPagePath
                }
                let pG = returnPlayGround(videoHTMLPagePath, codePenPath, obj);
                contents.innerHTML = pG;



                this.addEventListenerOfSaveBothLinks(obj);
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

            let pG = this.buildWholePage({ historyIdx: 2 });
            contents.innerHTML = pG;
            this.buildHistoryTabs(2);

            // this.addEventListeners();
        })


    }

    // saving both github gists and sharing link with one button
    addEventListenerOfSaveBothLinks(obj) {
        const saveBothButton = document.querySelector(".contents .playgroundContainer .sub-header .buttons button.save-all");


        saveBothButton.addEventListener('click', async () => {
            const strGithub = document.querySelector(".contents .playgroundContainer .sub-header .buttons .github-link input").value;
            const strCodepen = document.querySelector(".contents .playgroundContainer .sub-header .buttons .share-link input").value;
            const strScore = document.querySelector(".contents .playgroundContainer .sub-header .buttons .score input").value;

            if (!strGithub || !strCodepen) {
                window.alert("Both link need to be filled");
                return;
            }

            console.log("g, s, c", strGithub, strCodepen, strScore);

            let data = {
                queryObj: obj,
                paramObj: {
                    date: '2024-10-31',
                    time: getCurrentTime(),
                    score: strScore,
                    githubLink: strGithub,
                    codepenLink: strCodepen
                }
            }
            console.log("DATA: ", data);
            data = JSON.stringify(data);
            let saved = await this.db.postBothLink(data);
            console.log("SAVED: ", saved);

            let spanIndicator = document.getElementById("playground-indicator");
            if (saved) {
                console.log("Successed!!!")
                spanIndicator.textContent = "Saved";
                spanIndicator.setAttribute("style", "background: darkgreen;");
            }
            else {
                console.log("Something error happend!!");
                spanIndicator.textContent = "Failed";
                spanIndicator.setAttribute("style", "background: red;");
            }
            setTimeout(() => spanIndicator.setAttribute("style", "display: none"), 3000);
        })

    }

    // create the log part for the divs.
    createLogs(arrayOfLogs) {
        if (!arrayOfLogs || arrayOfLogs.length < 1) {
            return "No logs so far!!!!";
        }

        arrayOfLogs.reverse();
        arrayOfLogs = arrayOfLogs.slice(0, 3);

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