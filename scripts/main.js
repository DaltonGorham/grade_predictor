import { Course } from "./course.js";
import { Assignments } from "./assignments.js";
import { Predictor } from "./predictor.js";


// Inputs
const courseInput = document.querySelector("#course-name");
const assignmentInput = document.querySelector("#assignment-name");
const gradeInput = document.querySelector("#assignment-grade");
const weightInput = document.querySelector("#assignment-weight");
const appHTML = document.querySelector(".app");


// Instructions or error messages
const instructionsContainer = document.querySelector(".instructions-container");

// load courses from local storage as strings
let courses = JSON.parse(localStorage.getItem('coursesToSave')) || [];




document.addEventListener('DOMContentLoaded', () => {
  // convert courses from strings to objects
  courses = loadFromLocalStorage(courses);
  updateCourseSuggestions();
  render();


// Initial Check for courses
if (courses.length === 0) {
  const instructions = document.createElement('div');
  instructions.className = 'instructions';
  instructions.innerHTML = "Please add a course to begin";
  instructionsContainer.appendChild(instructions);
}

// Event Listeners


window.addEventListener('resize', () => {
  updateButtonText();
});


courseInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addCourse();
  }
})

assignmentInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    createAssignment();
  }
})

gradeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    createAssignment();
  }
})

weightInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    createAssignment();
  }
})  


document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-course')){
    const courseName = e.target.dataset.course;
    deleteCourse(courseName);
  }
  else if (e.target.classList.contains('delete-assignment')){
    const assignmentName = e.target.dataset.assignment;
    const courseName = e.target.dataset.course;
    deleteAssignment(assignmentName, courseName);
  }

});


});





// Create Assignment
const createAssignment = () => {
  if (!assignmentInput.value || !gradeInput.value || !weightInput.value) {
    const instructions = document.createElement("div");
    instructions.className = 'instructions';
    instructions.innerHTML = "Please fill out all fields";

    if (instructionsContainer.innerHTML === "") {
      instructionsContainer.appendChild(instructions);
    }
    return;
  }
  
  const selectedCourse = courses.find(course => course.getCourseName() === courseInput.value);
  console.log(selectedCourse);

  if (!selectedCourse) {
    const instructions = document.createElement("div");
    instructions.className = 'instructions';
    instructions.innerHTML = "Course not found. Please enter an existing course name";
    if (instructionsContainer.innerHTML === "") {
      instructionsContainer.appendChild(instructions);
    }
    return;
  }

  const assignment = new Assignments(assignmentInput.value, parseFloat(gradeInput.value), parseFloat(weightInput.value));
  
  selectedCourse.addAssignment(assignment);

  render();
  clearInputs();
  saveToLocalStorage(courses);
}

// Add Course
const addCourse = () => {
  const course = new Course(courseInput.value, []);

  instructionsContainer.innerHTML = "";

  if (courseInput.value === "") {
    const instructions = document.createElement("div");
    instructions.className = 'instructions';
    instructions.innerHTML = "Please enter a course name";

    if (instructionsContainer.innerHTML === "") {
      instructionsContainer.appendChild(instructions);
    }
    return;
    }

  else if (courses.find(course => course.getCourseName() === courseInput.value)) {
    const instructions = document.createElement("div");
    instructions.className = 'instructions';
    instructions.innerHTML = "Course already exists, please enter assignment details or a new course name";

    if (instructionsContainer.innerHTML === "") {
      instructionsContainer.appendChild(instructions);
    }
    return;
  }
  courses.push(course);
  console.log(courses);
  updateCourseSuggestions();
  render();
  clearInputs();
  saveToLocalStorage(courses);
}




// Load courses from local storage
const loadFromLocalStorage = (courses) => {
  courses = courses.map(courseData => {
    const assignments = courseData.assignments.map(assignmentData => {
      return new Assignments(assignmentData.assignmentName, assignmentData.assignmentGrade, assignmentData.assignmentWeight);
    })
    return new Course(courseData.courseName, assignments);
  })
  return courses;
}

// Save courses to local storage
function saveToLocalStorage(courses){
  const coursesToSave = courses.map(course => {
    return {
      courseName: course.getCourseName(),
      assignments: course.getCourseAssignments().map(assignment => {
        return {
          assignmentName: assignment.getAssignmentName(),
          assignmentGrade: assignment.getAssignmentGrade(),
          assignmentWeight: assignment.getAssignmentWeight()
        }
      })
    }
  })
  localStorage.setItem('coursesToSave', JSON.stringify(coursesToSave));
}



// Clear Inputs
const clearInputs = () => {
  courseInput.value = "";
  assignmentInput.value = "";
  gradeInput.value = "";
  weightInput.value = "";
}


// Render HTML each time a course is added or an assignment is created
const render = () => {

  appHTML.innerHTML = "";

  if (courses.length === 0){
   return;
  }
  courses.forEach(course => {
    const courseAssignments = course.getCourseAssignments();
    const predictor = new Predictor(course, courseAssignments);
    
    const gridElement = document.createElement('div');
    gridElement.className = 'course-block';
    gridElement.innerHTML = `
      <div class="grid">
        <div class="course-name">
          Course:
          <div class="course">${course.getCourseName()}</div>
          <button class="delete-course" data-course="${course.getCourseName()}">Delete Course</button>
        </div>
        <div class="assignments assignments-name">Assignments:</div>
        <div class="grade grade-name">Grade:</div>
        <div class="weight weight-name">Weight:</div>
        <div class="predictor predictor-name">Final Grade: <div class="predictor-grade">${predictor.getPredictedGrade()}</div></div>
      </div>`;
    appHTML.appendChild(gridElement);
    
    const assignmentHTML = gridElement.querySelector(".assignments");
    const gradeHTML = gridElement.querySelector(".grade");
    const weightHTML = gridElement.querySelector(".weight");
    
    course.getCourseAssignments().forEach(assignment => {
      assignmentHTML.innerHTML += `<div class="assignment">${assignment.getAssignmentName()}
        <button class="delete-assignment" data-assignment="${assignment.getAssignmentName()}" data-course="${course.getCourseName()}">Delete Assignment</button>
      </div>`;
      gradeHTML.innerHTML += `<div class="grades">${assignment.getAssignmentGrade()}</div>`;
      weightHTML.innerHTML += `<div class="weights">${assignment.getAssignmentWeight()}</div>`;
    });
  });
  updateButtonText();
}


/*
delete assignment:
deletes the selected assignment from the selected course using 
the splice method to remove the assignment from the array
*/

function deleteAssignment(assignmentName, courseName){
  const selectedCourse = courses.find(course => course.getCourseName() === courseName);
  const selectedAssignmentIndex = selectedCourse.getCourseAssignments().findIndex(assignment => assignment.getAssignmentName() === assignmentName);
  selectedCourse.getCourseAssignments().splice(selectedAssignmentIndex, 1);
  render();
  saveToLocalStorage(courses);
}


/*
delete course: 
deletes the selected course from the DOM and creates a new array without the selected course
*/
function deleteCourse(courseName){
  const selectedCourse = document.querySelector(`.course-block[data-course="${courseName}"]`);

  if (selectedCourse){
    selectedCourse.remove();
  };

  courses = courses.filter(course => course.getCourseName() !== courseName);
  updateCourseSuggestions();
  render();
  saveToLocalStorage(courses);
}


// Update Course Suggestions for each course in the course array
function updateCourseSuggestions(){
  const datalist = document.querySelector("#course-suggestions");
  datalist.innerHTML = "";
  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.getCourseName();
    datalist.appendChild(option);
  })
}


// Update Delete Button for mobile devices or smaller screen widths
function updateButtonText(){
  const deleteButtons = document.querySelectorAll(".delete-assignment");
  const isMobile = window.innerWidth <= 768;

  deleteButtons.forEach(button => {
    if (isMobile){
      button.textContent = "X";
    }
    else{
      button.textContent = "Delete Assignment";
    }
  })
}