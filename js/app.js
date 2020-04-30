
//Select elements
const clear = document.querySelector(".clear");
const taskCount = document.querySelector(".task-count");
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");
const list = document.getElementById("list");
const input = document.getElementById("input");

//Class names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//Variables
let LIST, id;

//get item from local storage
let data = localStorage.getItem("TODO");

//check if data is not empty
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;   //set the do the number  of last element in the list
    loadList(LIST);
}else{
// if data is empty
    LIST = [];
    id = 0;
}

//clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

//load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

//filter kung ilan yung task na tapos na "done"
let doneCount = LIST.filter(item=>item.done).length;
 
// Show todays date
const options = {weekday : "long", month:"short", day:"numeric"};
const timeOpt = { hour: '2-digit', minute: '2-digit' };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);
timeElement.innerHTML = today.toLocaleTimeString([], timeOpt);

    taskCount.innerHTML = `
                        <i class="fa fa-check-circle">&nbsp;${doneCount}/${LIST.length}</i>  
                          `;

// Add to do function
function addToDo(toDo, id, done, trash){
    if(trash){
        return;
    }
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const item = `
                <li class="item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="text ${LINE}">${toDo}</p>
                <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
                `;
    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

// Add an item to the list when the user press the enter key

document.addEventListener("keyup", function(event){
    if(event.keyCode == 13){
        const toDo = input.value;
        if(toDo){
            addToDo(toDo);

            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash: false,
            });
        }
        //add item to local storage (this code must be added where the LIST array is updated)
        localStorage.setItem("TODO", JSON.stringify(LIST)); 
        id++;
        input.value = "";
        location.reload();
    }
});

//complete to do list
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
    location.reload();
    
}

//remove to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
    location.reload();
}

// target the items created dynamically
list.addEventListener("click", function(event){
    const element = event.target;
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }

    //add item to local storage (this code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});
