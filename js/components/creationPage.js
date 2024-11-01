// import CreationPageInterface from "./creationPageInterface.js";

class CreationPage extends CreationPageInterface {
    static SAVE_NAME = "";
    static RESET_NAME = "";
    static ID = "";

    constructor(number) {
        super(number);
        this.array = new Array(number + 1).fill(null);
    }

    buildSkeleton() {
        const sections = this.buildSections();
        const skeletonHTML = `<div class="skeleton" id="${this.constructor.ID}">` + sections + `</div>`;
        return skeletonHTML;
    }

    buildSections() {
        let result = ``;
        for (let i = 1; i <= this.number; i++) {
            let content = this.array[i] === null ? "" : this.array[i];
            console.log("This.array: ", this.array);

            let section = `
                <div class="section ${i}">
                    ${content}
                </div>
            `
            result += section;
        }
        return result;
    }


    /**
     * 
     * @param {number} buttonIndex should between 1 and the number you put in initialization
     */
    buildWholePage({dateIndex, buttonIndex, descIndex, videoIndex}) {
        this.buildButtons(buttonIndex);
        this.buildDateComponent(dateIndex);
        return this.buildSkeleton();
    }


    /**
     * determine which index it shows on the page!
     * 
     * @param {string} saveName 
     * @param {string} resetName 
     * @param {number} indexOnPage should between 1 and the number;
     * @returns html format of buttons
     */
    buildButtons(indexOnPage) {
        let buttons =
            `<div class="buttons">
                <button id="save">Save ${this.constructor.SAVE_NAME}</button>
                <button disabled>Append to Same Tag Today</button>
                <button id="reset">Reset ${this.constructor.RESET_NAME}</button>
        </div>`
        this.array[indexOnPage] = buttons;

        return buttons;
    }

    /**
     * put the date on the index section of the page
     * 
     * @param {number} indexOnPage 
     */
    buildDateComponent(indexOnPage) {
        let formattedDate = getTodayDate();
        let dateComponent = `
            <div class="date">
                <h4>Today's Date</h4> 
                
                <input type="date" value=${formattedDate}></input>
                <button class="resetDate">Reset date</button>
            </div>
        `

        this.array[indexOnPage] = dateComponent;
        return dateComponent;
    }
}

// export default CreationPage;