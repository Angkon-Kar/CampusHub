// client/src/utils/subjects.js
// Turns syllabusData.js into the subject list for one department + semester.
// Plain courses come first. Elective placeholders such as "Option-I (Elective Theory)" are replaced by
// the real elective courses of that group, so students can pick the exact subject.
import {
  DEPARTMENTS_WITH_SYLLABUS,
  SEMESTER_COUNT,
  getSemesterCourses,
  getOptionCourses,
  getEeeOptionCourses,
  getCeOptionCourses,
  CE_OPTION_COURSES,
  getMeOptionCourses,
} from '../constants/syllabusData.js';

export { DEPARTMENTS_WITH_SYLLABUS, SEMESTER_COUNT };
export { semesterLabel } from '../constants/syllabusData.js';

// "CSE-4XXX", "EEE 41XX", "CE-8XX", "MEC 40XX" are placeholders, not real course codes
const isPlaceholder = ({ code }) => /X{2,}/i.test(code);

// "CSE-4XXX (Opt-I Lab)" -> "Option-I Lab"
const cseOptionKey = ({ code }) => {
  const match = code.match(/\(Opt-([IV]+)(\s+Lab)?\)/i);
  return match ? `Option-${match[1].toUpperCase()}${match[2] ? ' Lab' : ''}` : null;
};

const electivesFor = (department, semester, placeholders) => {
  if (placeholders.length === 0) return []; // only semesters that list an elective slot get electives

  if (department === 'CSE') {
    return placeholders.flatMap((placeholder) => {
      const key = cseOptionKey(placeholder);
      return key ? getOptionCourses(key).map((course) => ({ ...course, group: `Elective: ${key}` })) : [];
    });
  }
  if (department === 'EEE') {
    const key = semester === 7 ? '4th Year 1st Semester' : '4th Year 2nd Semester';
    return getEeeOptionCourses(key).map((course) => ({ ...course, group: `Elective (${key})` }));
  }
  if (department === 'CE') {
    return Object.keys(CE_OPTION_COURSES).flatMap((groupName) =>
      getCeOptionCourses(groupName).map((course) => ({ ...course, group: `Elective: ${groupName}` }))
    );
  }
  if (department === 'ME') {
    return getMeOptionCourses().map((course) => ({ ...course, group: 'Optional courses' }));
  }
  return [];
};

// -> [{ code, name, group }]  (no topics: this list is only used for dropdowns and validation)
export const getSubjectOptions = (department, semester) => {
  const courses = getSemesterCourses(department, Number(semester));
  const core = courses.filter((course) => !isPlaceholder(course));
  const placeholders = courses.filter(isPlaceholder);

  const seen = new Set();
  return [
    ...core.map((course) => ({ ...course, group: 'Courses' })),
    ...electivesFor(department, Number(semester), placeholders),
  ]
    .filter(({ code }) => !seen.has(code) && seen.add(code))
    .map(({ code, name, group }) => ({ code, name, group }));
};

// Group options for <optgroup>: [{ group: 'Courses', items: [...] }, ...]
export const groupSubjectOptions = (options) =>
  Object.entries(
    options.reduce((acc, option) => {
      (acc[option.group] ||= []).push(option);
      return acc;
    }, {})
  ).map(([group, items]) => ({ group, items }));

// "Semester 3 (Year 2, 1st sem)" for dropdowns and filters
export const semesterText = (semester) =>
  `Semester ${semester} (Year ${Math.ceil(semester / 2)}, ${semester % 2 === 1 ? '1st' : '2nd'} sem)`;
