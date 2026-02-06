const teacherData = {
  id: "T001",
  name: "Mrs. Kavita Sharma",
  role: "teacher",

  
  isClassTeacher: true,
  classTeacherOf: "10A",

  
  subjects: ["Mathematics"],
  sections: ["10A"],

  
  permissions: {
    canMarkAttendance: true,
    canEditAttendance: false, 
  },
};

export default teacherData;