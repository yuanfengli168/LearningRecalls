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
            console.log("Play clicked!!! ", index);

            let contents = document.querySelector(".contents");
            contents.innerHTML = '';
            
            let pG = returnPlayGround(this.arrayOfObj[index].videoPath);
            contents.innerHTML = pG;

            this.addEventListenerOfReturn();

            console.log("Video Path: ", this.arrayOfObj[index].videoPath);
        }))

        
    }

    // add event listener for logs button: 
    addEventListenerOfLogs() {
        return;
    }

    // add event listener for return: 
    addEventListenerOfReturn() {
        const returnButtonElement = document.querySelector(".contents .playgroundContainer .buttons button.return");

        returnButtonElement.addEventListener('click', () => {
            console.log("Clicked")
            let contents = document.querySelector(".contents");
            contents.innerHTML = '';
            
            let pG = this.buildWholePage({historyIdx: 2});
            contents.innerHTML = pG;
        })
    }
}