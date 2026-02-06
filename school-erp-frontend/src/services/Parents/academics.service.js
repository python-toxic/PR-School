import { subjects, timetable } from "../../data/Parent/academics.data.js";

export const getSubjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(subjects), 300);
  });
};

export const getTimetable = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(timetable), 300);
  });
};
