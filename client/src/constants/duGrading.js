// client/src/constants/duGrading.js
// University of Dhaka undergraduate grading scale (4.00 scale) and the calculations built on it.
// GPA = sum(grade point x credits) / sum(credits)
// Pure functions only (no React), so they are easy to test.

export const GRADE_SCALE = [
  { grade: 'A+', point: 4.0, min: 80, max: 100, label: '80% and above', remark: 'Outstanding' },
  { grade: 'A', point: 3.75, min: 75, max: 79, label: '75% to less than 80%', remark: 'Excellent' },
  { grade: 'A-', point: 3.5, min: 70, max: 74, label: '70% to less than 75%', remark: 'Very good' },
  { grade: 'B+', point: 3.25, min: 65, max: 69, label: '65% to less than 70%', remark: 'Good' },
  { grade: 'B', point: 3.0, min: 60, max: 64, label: '60% to less than 65%', remark: 'Good' },
  { grade: 'B-', point: 2.75, min: 55, max: 59, label: '55% to less than 60%', remark: 'Satisfactory' },
  { grade: 'C+', point: 2.5, min: 50, max: 54, label: '50% to less than 55%', remark: 'Satisfactory' },
  { grade: 'C', point: 2.25, min: 45, max: 49, label: '45% to less than 50%', remark: 'Pass' },
  { grade: 'D', point: 2.0, min: 40, max: 44, label: '40% to less than 45%', remark: 'Pass' },
  { grade: 'F', point: 0.0, min: 0, max: 39, label: 'Less than 40%', remark: 'Fail' },
];

export const GRADES = GRADE_SCALE.map(({ grade }) => grade);
export const CREDIT_OPTIONS = [0.5, 0.75, 1, 1.5, 2, 3, 4];

const byGrade = Object.fromEntries(GRADE_SCALE.map((row) => [row.grade, row]));

export const pointOf = (grade) => byGrade[grade]?.point ?? null;

// Marks can be fractions (74.5), so the bands are compared with the lower limit of each grade
export const gradeFromMarks = (marks) => {
  const value = Number(marks);
  if (marks === '' || marks === null || marks === undefined || Number.isNaN(value) || value < 0 || value > 100) return null;
  return GRADE_SCALE.find(({ min }) => value >= min)?.grade ?? 'F';
};

// A course row: the grade comes from marks if marks are typed, otherwise from the chosen grade
export const effectiveGrade = ({ marks, grade }) => gradeFromMarks(marks) ?? (byGrade[grade] ? grade : null);

const round2 = (value) => Math.round(value * 100) / 100;

// Courses without a grade (or with 0 credits) are left out of the average
export const calcGpa = (courses = []) => {
  const counted = courses
    .map((course) => ({ credit: Number(course.credit), point: pointOf(effectiveGrade(course)) }))
    .filter(({ credit, point }) => credit > 0 && point !== null);

  const credits = counted.reduce((sum, { credit }) => sum + credit, 0);
  const points = counted.reduce((sum, { credit, point }) => sum + credit * point, 0);
  return { credits, points, gpa: credits > 0 ? round2(points / credits) : null };
};

// All semesters + an optional "previous record" (CGPA and credits from an earlier result)
export const calcCgpa = (semesters = [], previous = { cgpa: '', credits: '' }) => {
  const perSemester = semesters.map((semester) => ({ id: semester.id, name: semester.name, ...calcGpa(semester.courses) }));

  const prevCredits = Number(previous.credits);
  const prevCgpa = Number(previous.cgpa);
  const hasPrevious = previous.cgpa !== '' && previous.credits !== '' && prevCredits > 0 && prevCgpa >= 0 && prevCgpa <= 4;

  const credits = perSemester.reduce((sum, { credits: c }) => sum + c, 0) + (hasPrevious ? prevCredits : 0);
  const points = perSemester.reduce((sum, { points: p }) => sum + p, 0) + (hasPrevious ? prevCgpa * prevCredits : 0);

  return { perSemester, credits, points, cgpa: credits > 0 ? round2(points / credits) : null };
};

// ---------- Expected CGPA ----------
// Which average GPA do I need in the remaining credits to reach my target CGPA?
export const requiredGpa = ({ currentCgpa, doneCredits, targetCgpa, remainingCredits }) => {
  const current = Number(currentCgpa);
  const done = Number(doneCredits);
  const target = Number(targetCgpa);
  const remaining = Number(remainingCredits);
  if (![current, done, target, remaining].every(Number.isFinite) || remaining <= 0 || done < 0) return null;

  const needed = (target * (done + remaining) - current * done) / remaining;
  return {
    needed: round2(needed),
    status: needed > 4 ? 'impossible' : needed <= 0 ? 'secured' : 'possible',
    // The best CGPA that is still possible, if every remaining credit gets 4.00
    bestPossible: round2((current * done + 4 * remaining) / (done + remaining)),
  };
};

// What CGPA do I get if the next semester gives GPA x?
export const projectCgpa = ({ currentCgpa, doneCredits, nextCredits, nextGpa }) => {
  const done = Number(doneCredits);
  const next = Number(nextCredits);
  const total = done + next;
  if (!(total > 0)) return null;
  return round2((Number(currentCgpa) * done + Number(nextGpa) * next) / total);
};

// The smallest grade that reaches a required GPA (e.g. 3.40 -> "A-")
export const minGradeFor = (gpa) => [...GRADE_SCALE].reverse().find(({ point }) => point >= gpa - 1e-9)?.grade ?? 'A+';

// ---------- Converters ----------
export const gradeInfo = (grade) => byGrade[grade] ?? null;

// DU has no official CGPA -> percentage formula. This estimate takes the middle of the percentage band
// of the grade point and blends between neighbouring bands, so 4.00 -> 80+ and 2.00 -> about 42.
export const approxPercentage = (cgpa) => {
  const value = Number(cgpa);
  if (!Number.isFinite(value) || value < 0 || value > 4) return null;
  if (value >= 4) return { low: 80, high: 100, estimate: 85 };
  if (value < 2) return { low: 0, high: 39, estimate: Math.round(20 * value) };

  // An exact grade point (3.50) is just that grade's band (70-74)
  const exact = GRADE_SCALE.find(({ point }) => point === value);
  if (exact) return { low: exact.min, high: exact.max, estimate: Math.round((exact.min + exact.max) / 2) };

  const bands = GRADE_SCALE.filter(({ point }) => point >= 2).reverse(); // D ... A+
  for (let i = 0; i < bands.length - 1; i += 1) {
    const lower = bands[i];
    const upper = bands[i + 1];
    if (value >= lower.point && value <= upper.point) {
      const ratio = (value - lower.point) / (upper.point - lower.point);
      const mid = (band) => (band.min + band.max) / 2;
      const estimate = Math.round(mid(lower) + ratio * (mid(upper) - mid(lower)));
      return { low: lower.min, high: upper.max, estimate };
    }
  }
  return null;
};

// A rough label for the overall result (shown as "approximate", not an official class)
export const performanceLabel = (cgpa) => {
  if (cgpa === null || cgpa === undefined) return '';
  if (cgpa >= 3.75) return 'Outstanding';
  if (cgpa >= 3.5) return 'Excellent';
  if (cgpa >= 3.0) return 'Good';
  if (cgpa >= 2.5) return 'Satisfactory';
  if (cgpa >= 2.0) return 'Pass';
  return 'Below pass mark';
};