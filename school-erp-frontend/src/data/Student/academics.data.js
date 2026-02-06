// Subjects for student
export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    teacher: "Mr. Sharma",
  },
  {
    id: 2,
    name: "Science",
    teacher: "Ms. Gupta",
  },
  {
    id: 3,
    name: "English",
    teacher: "Mrs. Thomas",
  },
  {
    id: 4,
    name: "Social Studies",
    teacher: "Mr. Verma",
  },
];

// Weekly timetable (entire week)
export const timetable = [
  {
    day: "Monday",
    periods: [
      { time: "09:00 - 09:45", subject: "Mathematics" },
      { time: "09:50 - 10:35", subject: "Science" },
      { time: "10:40 - 11:25", subject: "English" },
    ],
  },
  {
    day: "Tuesday",
    periods: [
      { time: "09:00 - 09:45", subject: "Social Studies" },
      { time: "09:50 - 10:35", subject: "Mathematics" },
      { time: "10:40 - 11:25", subject: "Science" },
    ],
  },
  {
    day: "Wednesday",
    periods: [
      { time: "09:00 - 09:45", subject: "English" },
      { time: "09:50 - 10:35", subject: "Science" },
      { time: "10:40 - 11:25", subject: "Mathematics" },
    ],
  },
  {
    day: "Thursday",
    periods: [
      { time: "09:00 - 09:45", subject: "Mathematics" },
      { time: "09:50 - 10:35", subject: "English" },
      { time: "10:40 - 11:25", subject: "Social Studies" },
    ],
  },
  {
    day: "Friday",
    periods: [
      { time: "09:00 - 09:45", subject: "Science" },
      { time: "09:50 - 10:35", subject: "Mathematics" },
      { time: "10:40 - 11:25", subject: "English" },
    ],
  },
];
