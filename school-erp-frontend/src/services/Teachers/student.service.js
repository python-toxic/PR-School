
export function getStudentsForClass(students, classId) {
  return students.filter((student) => student.classId === classId);
}
