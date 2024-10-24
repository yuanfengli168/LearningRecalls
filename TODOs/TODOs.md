1. fix the 2 image
2. resolve the logs v button 
3. learningRecalls> db.allData.updateOne({ "userID": 1001 }, { $unset: { "dates.2024-09-27": "" }}); using this to add a delete button, but needs to double check twice if really what to delte / cancel.


4. (10/10/2024) 
-3) Daily fun creation: 
    - creation page
    - history page
    - new database so not mixed with quiz

-3.2) CSS adjusting for Today's Task take quiz so small.

-2) function addSaveButtonEventListener() { and renderTodayTags and renderAllTags() should work when the Savebutton clicked!!
0) adding favorite/mastered button in the quiz tab && take quiz page.


[done] -1）if not full points received, put last wrong no. in front, and change the color of these to red
a) [done]add a finished today tab; (finished 10/11/2024 in 3.5 hours, but scalable, and reusable, more succinct);
[Learnings]:
    a)  encapsulation+consice!!! -> each mehtod function do not exceed 30lines of code, excluding comments. 
    b) decoupling -> utils.js created, very good!
    c) Readable+maintainable: Finished.returnFinished() has double for loop, (I used filter and some at the begining) but really hard to change in future!
    d) asked fewer questions to the ChatGPT: 
        -. only 4 questions: 
    e) finished new feature and worked in 2.5 hours(excluding summary): 
        -. 1)finished.js, 2)finished.css, 3)utils.js
    f) 4 ChatGPT Questions I asked: 
        1) how to change an object to array? I used `Array.from(obj)`;
        2) how to get object attribue value? turns out I was correct at concept but wrong for typo.
        3) parent.appendChild js? learned that naming should add element, after you created element!
        4) how to create a div element and adding class value at the same time? You have to do it in two steps, 1)create; 2)classList.add()

b) add a % in logs; 
c) add rules of writing, so writers can use them! e.g. 1.2.3. / (1,2,3a) / .,.
below are optional
c) add last time wrongs in tag quiz.
d) when loading adding a circling thing.


e) fix the toggle functions, with the help of chatGPT: (https://chatgpt.com/share/670f0b16-026c-800a-8a8f-71f88aed4752), see the third questions solution. 


