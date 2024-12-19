export class Course {
  constructor(name, assignments) {
    this.name = name;
    this.assignments = assignments;
  }
  
  getCourseName() {
    return this.name;
  }

  getCourseAssignments() {
    return this.assignments;
  }
  
  addAssignment(assignment) {
    this.assignments.push(assignment);
  }

 setCourseAssignments(assignments){
  this.assignments = assignments;
 }
}
