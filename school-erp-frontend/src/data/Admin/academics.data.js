export const classes = [
  { id: "10-A", name: "Class 10 - A" },
  { id: "9-B", name: "Class 9 - B" },
];

export const teachers = [
  { id: 1, name: "Mr. Sharma" },
  { id: 2, name: "Ms. Gupta" },
];

export const classTimetables = {
  "10-A": [
    {
      day: "Monday",
      periods: [
        { subject: "Mathematics", teacher: "Mr. Sharma" },
        { subject: "Science", teacher: "Ms. Gupta" },
        { subject: "English", teacher: "Mrs. Thomas" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { subject: "Science", teacher: "Ms. Gupta" },
        { subject: "Mathematics", teacher: "Mr. Sharma" },
        { subject: "English", teacher: "Mrs. Thomas" },
      ],
    },
  ],
};

export const teacherTimetables = {
  1: [
    {
      day: "Monday",
      periods: [
        { subject: "Mathematics", class: "10-A" },
        { subject: "Mathematics", class: "9-B" },
        { subject: "Free", class: null },
      ],
    },
  ],
};
