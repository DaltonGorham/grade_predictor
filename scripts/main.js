import { Course } from "./course.js";
import { Assignments } from "./assignments.js";
import { Predictor } from "./predictor.js";

document.addEventListener('DOMContentLoaded', () => {
  const appHTML = document.querySelector(".app");

  appHTML.innerHTML = "";

let courses = [];

const courseInput = document.querySelector("#course-name");
const assignmentInput = document.querySelector("#assignment-name");
const gradeInput = document.querySelector("#assignment-grade");
const weightInput = document.querySelector("#assignment-weight");

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

const render = () => {
  appHTML.innerHTML = "";
  
  courses.forEach(course => {
    const courseAssignments = course.getCourseAssignments();
    const predictor = new Predictor(course, courseAssignments);
    
    const gridElement = document.createElement('div');
    gridElement.className = 'course-block';
    gridElement.setAttribute('data-course', course.getCourseName());
    gridElement.innerHTML = `
      <div class="grid">
        <div class="course">Course: ${course.getCourseName()}</div>
        <div class="assignments">Assignments:</div>
        <div class="grade">Grade:</div>
        <div class="weight">Weight:</div>
        <div class="predictor">Predicted Final Grade: ${predictor.getPredictedGrade()}</div>
      </div>`;
    appHTML.appendChild(gridElement);
    
    const assignmentHTML = gridElement.querySelector(".assignments");
    const gradeHTML = gridElement.querySelector(".grade");
    const weightHTML = gridElement.querySelector(".weight");
    
    course.getCourseAssignments().forEach(assignment => {
      assignmentHTML.innerHTML += `<div class="assignment">${assignment.getAssignmentName()}</div>`;
      gradeHTML.innerHTML += `<div class="grade">${assignment.getAssignmentGrade()}</div>`;
      weightHTML.innerHTML += `<div class="weight">${assignment.getAssignmentWeight()}</div>`;
    });
  });
}

const addCourse = () => {
  const course = new Course(courseInput.value, []);
  courses.push(course);
  console.log(courses);
  render();
  clearInputs();
}

const createAssignment = () => {
  if (!assignmentInput.value || !gradeInput.value || !weightInput.value) {
    alert("Please fill out all fields");
    return;
  }
  
  const selectedCourse = courses.find(course => course.getCourseName() === courseInput.value);
  console.log(selectedCourse);

  if (!selectedCourse) {
    alert("Course not found. Please enter an existing course name");
    return;
  }

  const assignment = new Assignments(assignmentInput.value, parseFloat(gradeInput.value), parseFloat(weightInput.value));
  
  selectedCourse.addAssignment(assignment);
  
  const currentCourseDiv = document.querySelector(`.course-block[data-course='${selectedCourse.getCourseName()}']`);

  if (currentCourseDiv) {
    const assignmentHTML = currentCourseDiv.querySelector(".assignments");
    const gradeHTML = currentCourseDiv.querySelector(".grade");
    const weightHTML = currentCourseDiv.querySelector(".weight");
    
    assignmentHTML.innerHTML += `<div class="assignment">${assignment.getAssignmentName()}</div>`;
    gradeHTML.innerHTML += `<div class="grade">${assignment.getAssignmentGrade()}</div>`;
    weightHTML.innerHTML += `<div class="weight">${assignment.getAssignmentWeight()}</div>`;

    const predictor = new Predictor(selectedCourse, selectedCourse.getCourseAssignments());
    const predictorDiv = currentCourseDiv.querySelector(".predictor");
    predictorDiv.innerHTML = `Predicted Final Grade: ${predictor.getPredictedGrade()}`;
  }
  
  clearInputs();
}

const clearInputs = () => {
  courseInput.value = "";
  assignmentInput.value = "";
  gradeInput.value = "";
  weightInput.value = "";
}
});