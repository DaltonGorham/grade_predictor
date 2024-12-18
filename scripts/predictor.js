export class Predictor {
  constructor(course, assignments) {
    this.course = course;
    this.assignments = assignments;
  }

  predictGrade(){
    let grade = 0;
    for (let assignment of this.assignments) {
      grade += assignment.getAssignmentGrade() * assignment.getAssignmentWeight();
    }
    return grade;
  }

  getWeightedTotal() {
    let total = 0;
    for (let assignment of this.assignments) {
      total += assignment.getAssignmentWeight();
    }
    return total;
  }

  getPredictedGrade() {
    let grade = this.predictGrade() / this.getWeightedTotal();
    return grade.toFixed(2) + "%";
  }
}