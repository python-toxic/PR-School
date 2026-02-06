
export const teacherDashboardMock = {
 
  classes: [
    {
      subject: "Mathematics",
      class: "10-A",
      time: "09:00 – 09:45",
    },
    {
      subject: "Physics",
      class: "12-B",
      time: "11:30 – 12:15",
    },
  ],
   weeklyAttendance: [
    { day: "Mon", present: 32, total: 40 },
    { day: "Tue", present: 35, total: 40 },
    { day: "Wed", present: 30, total: 40 },
    { day: "Thu", present: 38, total: 40 },
    { day: "Fri", present: 36, total: 40 },
  ],



  attendance: {
    today: "Pending",
  },

  assignments: [
    { title: "Algebra Worksheet", pending: 12 },
    { title: "Unit Test Paper", pending: 5 },
  ],

  exams: [
    { subject: "Maths", date: "20 Feb" },
  ],

  notices: [
    { title: "Exam duty assigned", date: "Today" },
  ],
};
