// client/src/components/cgpa/cgpaDefaults.js
import { makeId } from '../../hooks/useLocalStorage';

export const newCourse = () => ({ id: makeId(), name: '', credit: 3, marks: '', grade: '' });
export const newSemester = (number) => ({ id: makeId(), name: `Semester ${number}`, courses: Array.from({ length: 5 }, newCourse) });