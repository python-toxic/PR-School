import { subjects, timetable } from "../../data/Student/academics.data.js";

export const getSubjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(subjects), 500);
  });
};

export const getTimetable = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(timetable), 500);
  });
};
