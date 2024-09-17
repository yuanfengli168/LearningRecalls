class localStorage {
    constructor(obj) {
        this.obj = obj ?? null;
        this.NOTHING = "Nothing in local storage!";
        this.key = "quizDatas";
    }

    saveToLocalStorage() {
        if (this.getFromLocalStorage() === this.NOTHING) {
            var map = new Map();
            map.set(this.obj.date, this.obj);
            const mapObject = Object.fromEntries(map);
            const json = JSON.stringify(mapObject);

            window.localStorage.setItem(this.key, json);
        } else {
            var json = window.localStorage.getItem(this.key);
            var mapObj = JSON.parse(json);
            var map = new Map(Object.entries(mapObj));
            map.set(this.obj.date, this.obj);
            var newMapObj = Object.fromEntries(map);
            var newJson = JSON.stringify(newMapObj);

            window.localStorage.setItem(this.key, newJson);
            console.log("Saved to Session Storage");
        }
    }

    getFromLocalStorage() {
        const quizData = window.localStorage.getItem(this.key) ?? this.NOTHING; // JSON stringify format, we want string format
        return quizData;
    }
}

var obj = {
    date: "001",
}
var myLocalStorage = new localStorage(obj);