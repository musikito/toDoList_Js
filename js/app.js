/**
* Select element
* this needs to be change to jQuery
*/

const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//some varables
let LIST , id;

//get item from localStorage
let data = localStorage.getItem("TODO");

//check if data is empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length; //set the id to the last value in the list
  loadList(LIST); //load the list to the UI

} else {
  //data is empty, or first timeusing
  LIST = [];
  id =0;
}




//Shows date on the header
const options = {
  weekday: "long",
  month: "short",
  day: "numeric"
};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US",options);

/**
* this refresh or load the list into the UI
*it takes a arrary as PARAMS
*/
function loadList(array) {
  array.forEach(function (item) {
    //call addToDo with the items from the array
    addToDo(item.name, item.id, item.done,item.trash);

  })

}//end function loadList

//click event to clear all todos and reload the page
clear.addEventListener("click",function () {
  localStorage.clear();
  location.reload();

})//end of clear

//add To do function
/**
* PARAMS:
* toDo  String
* id number
* done boolean
* trash boolean
*/
function addToDo(toDo, id, done, trash) {
  //first check if todo is in trash
  if (trash) { return;}

  //check to is it done
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  //template literal to be used as list elements
  const item = `
  <li class="item">
      <i class="fa ${DONE} co" job="complete" id="${id}"></i>
      <p class="text ${LINE}">${toDo}</p>
      <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
  </li>
  `;

  //where we want to position our items
  const position = "beforeend";

  //and the "items" to the list
  list.insertAdjacentHTML(position,item);

}//end function addToDo

//add an item when user type it and hit enter
document.addEventListener("keyup",function (even) {
  //check for enter
  if (event.keyCode == 13) {
      const toDo = input.value;
      //if input is not empty
      if (toDo) {
        //call the function
        addToDo(toDo, id, false, false);

        LIST.push({
          name : toDo,
          id : id,
          done : false,
          trash : false

        });
        //add item to localstorage, this needs to be added whenever le LIST array is updated
        localStorage.setItem("TODO", JSON.stringify(LIST));
        //increment the id for next todo
        id++;
      }
      //clear the field
      input.value = "";
  }
}); //end of eventListener


/**
* complete tod function
* it will take a HTML element
*/
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  //check for true or false if the todo is DONE
  LIST[element.id].done = LIST[element.id].done ? false : true;
}//end function completeToDo

/**
*Remove todo function
*takes an HTML elementas param
*/
function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);

  //update the LIST
  LIST[element.id].trash = true;

}//end of function removeToDo

//click event to target the items created dinamically
list.addEventListener("click",function(event) {
  const element = event.target; //return the clicked element inside the list
  const elementJob = element.attributes.job.value; //is completed or delete?

  if (elementJob == "complete") { //is marked as completed?
    completeToDo(element);
  }else if (elementJob == "delete") { //is marked as removed?
    removeToDo(element);
  }
  //add item to localstorage, this needs to be added whenever le LIST array is updated
  localStorage.setItem("TODO", JSON.stringify(LIST));
});//end of call back
