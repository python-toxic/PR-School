import { teacherTimetable } from "../../data/Teacher/academics.data.js";

export const getTimetable = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(teacherTimetable), 300);
  });
};
