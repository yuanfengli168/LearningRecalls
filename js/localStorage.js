class localStorage {
    constructor(obj) {
        this.obj = obj ?? null;
        this.NOTHING = "Nothing in local storage!";
        this.key = "quizDatas";
        this.UNKNOWN_TAG = "Unknonwn";
    }

    saveToLocalStorage() {
        var mapOfDates = new Map();
        var mapOfTags = new Map();
        var tag = this.obj.quizTags ?? this.UNKNOWN_TAG;
        var mapOfTagsJson = null;
        var mapOfDatesJson = null;

        if (this.getFromLocalStorage() === this.NOTHING) {
            mapOfTags.set(tag, this.obj);
            mapOfTagsJson = this.transferMapToJSONString(mapOfTags);

            mapOfDates.set(this.obj.date, mapOfTagsJson); 
            mapOfDatesJson = this.transferMapToJSONString(mapOfDates);

            window.localStorage.setItem(this.key, mapOfDatesJson);
            console.log("first time saved to Session Storage");
        } else {
            var json = window.localStorage.getItem(this.key);
            var map = this.transferJsonToMap(json);

            mapOfDates = map ?? null;
            if (mapOfDates !== null) {
                mapOfTags = mapOfDates.get(this.obj.date) ?? null;
            } else {
                mapOfDates = new Map();
            }

            if (mapOfTags !== null) {
                mapOfTags = this.transferJsonToMap(mapOfTags);
            } else {
                mapOfTags = new Map();
            }

            mapOfTags.set(tag, this.obj);
            
            mapOfTagsJson = this.transferMapToJSONString(mapOfTags);
            mapOfDates.set(this.obj.date, mapOfTagsJson);
            mapOfDatesJson = this.transferMapToJSONString(mapOfDates);

            window.localStorage.setItem(this.key, mapOfDatesJson);
            console.log("Saved to Session Storage");
        }
    }

    transferMapToJSONString(map) {
        return JSON.stringify(Object.fromEntries(map));
    }

    transferJsonToMap(JsonStr) {
        var obj = JSON.parse(JsonStr);
        var map = new Map(Object.entries(obj));
        return map;
    }

    getFromLocalStorage() {
        const quizData = window.localStorage.getItem(this.key) ?? this.NOTHING; // JSON stringify format, we want string format
        return quizData;
    }

    getQuizByDate(dateStr) {
        var dataInJSON = this.getFromLocalStorage();  //in string format
        var map = this.transferJsonToMap(dataInJSON);
        var mapOfTags = map.get(dateStr) ?? null;
        if (mapOfTags === null) {
            throw new Error("mapOfTags is null");
        }

        mapOfTags = this.transferJsonToMap(mapOfTags);
        for (let [key, value] of mapOfTags) {
            // key: tags
            // value: obj. 
            // we only return the first for now. 
            return value.quizContent;
        }
    }
}


var obj = {
    date: "001",
}
var myLocalStorage = new localStorage(obj);