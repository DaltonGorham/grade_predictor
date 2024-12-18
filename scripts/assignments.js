export class Assignments {
  constructor(name, grade, weight) {
    this.name = name;
    this.grade = grade;
    this.weight = weight;
  }

  getAssignmentName() {
    return this.name;
  }

  getAssignmentGrade() {
    return this.grade;
  }

  getAssignmentWeight() {
    return this.weight;
  }

  
}