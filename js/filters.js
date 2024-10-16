class Filters {
    constructor(tag = "", order = "1", type="today") {
        this.tag = tag;
        this.order = order;
        this.type = type;
    }


    // type is in string format
    async getTagCount(type) {
        // make a map of key (tag), value (number)
        const map = new Map();

        // get the array of quizes:
        var previousQuizArray = await getPreviousQuizesFromDataBase() ?? [1, 2, 3];
        if (previousQuizArray[0] !== 1 && type === "today") {
            previousQuizArray = previousQuizArray.filter(quiz => needsReview(quiz));
        } 
        
        for (let quiz of previousQuizArray) {
                let count = map.get(quiz.tag) || 0;
                map.set(quiz.tag, count + 1);
        }

        return map;
    }

    // adding the filters into the webpage:
    async renderFilters(tag, order, type) {
        this.type = type;
        this.tag = tag;
        this.order = order;

        try {
            // get the data from backend
            const mongoDbAtlas = new MongoDBAtlas();
            const tags = await mongoDbAtlas.getAllTags(ROOT_USER_ID);

            let tagOptions = ``;
            const tagMap = await this.getTagCount(this.type);
            let totalCount = 0;

            for (let tag of tags) {
                let tagCount = tagMap.get(tag) || 0;
                totalCount += tagCount;

                let tagOption = `
                     <option value=${tag}>
                        ${tag} (${tagCount})
                    </option>
                `
                tagOptions += tagOption;
            }

            let quizHistoryContainer = document.querySelector('.filters-container');
            if (quizHistoryContainer) {
                let newChild = document.createElement('div');
                let filterContent = `
                    <div class="filters">
                        <form action="">
                            <label for="filter-select">Filters: </label>
                            <select name="" id="tag">
                                <option value="">
                                    choose one tag (${totalCount})
                                </option>
                                ${tagOptions}
                            </select>

                            <select name="" id="order">
                                <option value="1">
                                    choose order
                                </option>
                                <option value="2">
                                    non-chronological (Most Recent first)
                                </option>
                                <option value="3">
                                    chronological (Least Recent first)
                                </option>
                                
                            </select>
                        </form>
                    </div>`
                newChild.innerHTML = filterContent;
                let parentElemnt = quizHistoryContainer;
                parentElemnt.appendChild(newChild);


                this.addOrderEventListener(type);
                this.addTagEventListener(type);

                this.setTagValue(tag);
                this.setOrderValue(order);

            }
        } 
        catch(e) {
            throw new Error(e);
        }
    }


    // listen to the filters and get value for tag and order:
    // return tag value
    getTagValue() {
        // add event listener on option. 
        return document.querySelector('.filters form select#tag').value;
    }


    getOrderValue() {
        return document.querySelector('.filters form select#order')?.value;
    }
    
    setTagValue(tag) {
        // add event listener on option. 
        document.querySelector('.filters form select#tag').value = tag;
    }


    setOrderValue(order) {
        document.querySelector('.filters form select#order').value = order;
    }

    // bug1: this.order in the function() {} 
    //       the this is referring to the functio instead of the class.
    addTagEventListener(type) {
        this.type = type;
        let tag = document.querySelector('.filters form select#tag');
        this.order = this.getOrderValue();

        if (tag) {
                tag.addEventListener('change', () => {
                // get the value of the selected option;
                let selectedValue = tag.value;
                let parent = document.querySelector(".quiz");
                parent.innerHTML = '';

                // ??? will the arrow function helping 
                //     making this reference to the class instead of function?
                // console.log(this.tag);
                this.tag = selectedValue;
                this.order = this.getOrderValue();
                type = this.type === "today" ? false : null;
                showPreviousQuizs(type, this.tag, this.order);
            })
        }
        
    }

    addOrderEventListener(type) {
        this.type = type;

        let order = document.querySelector('.filters form select#order');
        this.tag = this.getTagValue();
        

        if (order) {
            order.addEventListener('change', () => {
            let selectedValue = order.value;
            let parent = document.querySelector(".quiz");
            parent.innerHTML = '';
            this.order = selectedValue;
            this.tag = this.getTagValue();
            type = this.type === "today" ? false : null;
            showPreviousQuizs(type, this.tag, this.order);
            })
        }
        
    }
}