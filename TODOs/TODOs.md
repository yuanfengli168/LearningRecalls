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


## scalability: 

### New playground 加入后的问题： 
#### 问题：
1. 好像之前的代码没有那么好复用
    - 1）代码没有interface，我看代码的结构还需要去excalidraw里看设计稿
    - 2）原来的页面也不是一个可以被继承的object， 比如说我想加一个playGround Creation page，
    但是原来的也面需要完全复制粘贴，再加新的东西
    - 3.1）数据库的应用，没有考虑到新的playground，应不应该加在同一个数据库中？还是以你改分开？各项pros and cons 是什么？
    - 3.2）对于新加入的playground history， 新建立的tabs 如果想要在Today‘s Task 中运用，好像很麻烦，麻烦的点在于数据库的设计。如果分开储存，需要重新读取
        - 问题1: 你的filter 只能在现在的东西上filter， today’s finished， 以及新的playGround 都没法很好的用到，甚至需要改变filter 本来的逻辑，如果很多team 在用，这是一个潜在的风险，因为大家几乎都要改。
        - 问题1总结： 如何decoupling？的同时scalability 越来越好！！？？
        

#### 学到的或者提升空间：
- 对于问题的1.2）我们应该把每一个页面表示模块化，并且设定一些基本的样式，这样方便未来可以
代码复用或者添加新的小的功能。


#### 解决办法：

