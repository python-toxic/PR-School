import api from '../../lib/api';

export const getClasses = async () => {
  const response = await api.get('/classes');
  // Transform or adapt if necessary to match old mock shape
  // e.g. [{ id: '1', name: '10', section: 'A' }] -> label/value format ?
  // For now returning raw data
  return response.data;
};

export const getTeachers = async () => {
  const response = await api.get('/teachers');
  return response.data;
};

// Timetables are not yet implemented in backend DB, keeping as mock or empty for now
// to prevent crash, we'll return empty array until backend supports it.
export const getClassTimetable = async (classId) => {
  console.warn('Timetable API not connected yet');
  return [];
};

export const getTeacherTimetable = async (teacherId) => {
  console.warn('Timetable API not connected yet');
  return [];
};
