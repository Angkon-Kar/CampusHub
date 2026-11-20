// client/src/components/cgpa/CalculatorTab.jsx
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { GRADES, CREDIT_OPTIONS, effectiveGrade, pointOf, gradeFromMarks, calcGpa } from '../../constants/duGrading';
import { newCourse, newSemester } from './cgpaDefaults';

const gradeBadge = (grade) =>
  grade === 'F' ? 'bg-rose-50 text-rose-700' : grade === 'A+' || grade === 'A' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700';

const CourseRow = ({ course, index, onChange, onRemove }) => {
  const grade = effectiveGrade(course);
  const point = pointOf(grade);

  // Typing marks sets the grade for you. Picking a grade clears the marks.
  const setMarks = (value) => onChange({ marks: value, grade: gradeFromMarks(value) ?? course.grade });
  const setGrade = (value) => onChange({ grade: value, marks: '' });

  return (
    <div className="grid grid-cols-6 sm:grid-cols-[minmax(0,1fr)_84px_92px_92px_64px_36px] gap-2 items-center py-2.5 border-b border-slate-100 last:border-0">
      <input
        type="text"
        value={course.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder={`Course ${index + 1}`}
        aria-label={`Course ${index + 1} name`}
        maxLength={60}
        className="input !py-2 col-span-4 order-1 sm:col-span-1 sm:order-none"
      />
      <select
        value={course.credit}
        onChange={(e) => onChange({ credit: Number(e.target.value) })}
        aria-label={`Course ${index + 1} credit`}
        className="input !py-2 cursor-pointer col-span-2 order-4 sm:col-span-1 sm:order-none"
      >
        {CREDIT_OPTIONS.map((credit) => (
          <option key={credit} value={credit}>
            {credit} cr
          </option>
        ))}
      </select>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        max="100"
        step="0.5"
        value={course.marks}
        onChange={(e) => setMarks(e.target.value)}
        placeholder="Marks"
        aria-label={`Course ${index + 1} marks out of 100`}
        className="input !py-2 col-span-2 order-5 sm:col-span-1 sm:order-none"
      />
      <select
        value={grade ?? ''}
        onChange={(e) => setGrade(e.target.value)}
        aria-label={`Course ${index + 1} grade`}
        className="input !py-2 cursor-pointer col-span-2 order-6 sm:col-span-1 sm:order-none"
      >
        <option value="">Grade</option>
        {GRADES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <div className="text-center col-span-1 order-2 sm:order-none">
        {grade ? (
          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${gradeBadge(grade)}`}>{point.toFixed(2)}</span>
        ) : (
          <span className="text-xs text-slate-300">-</span>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove course ${index + 1}`}
        className="col-span-1 order-3 sm:order-none justify-self-end p-2.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export const CalculatorTab = ({ data, setData }) => {
  const patchSemester = (semesterId, changes) =>
    setData((prev) => ({ ...prev, semesters: prev.semesters.map((s) => (s.id === semesterId ? { ...s, ...changes } : s)) }));

  const patchCourse = (semesterId, courseId, changes) =>
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) =>
        s.id === semesterId ? { ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, ...changes } : c)) } : s
      ),
    }));

  const addCourse = (semesterId) =>
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === semesterId ? { ...s, courses: [...s.courses, newCourse()] } : s)),
    }));

  const removeCourse = (semesterId, courseId) =>
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === semesterId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s)),
    }));

  const removeSemester = (semesterId) => setData((prev) => ({ ...prev, semesters: prev.semesters.filter((s) => s.id !== semesterId) }));

  const addSemester = () => setData((prev) => ({ ...prev, semesters: [...prev.semesters, newSemester(prev.semesters.length + 1)] }));

  const setPrevious = (changes) => setData((prev) => ({ ...prev, previous: { ...prev.previous, ...changes } }));

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Type the <span className="font-medium text-slate-700">marks</span> (the grade is filled in for you) or pick the
        <span className="font-medium text-slate-700"> grade</span> directly. Courses with no grade are left out.
      </p>

      {data.semesters.map((semester) => {
        const { gpa, credits } = calcGpa(semester.courses);
        return (
          <section key={semester.id} className="card p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <input
                type="text"
                value={semester.name}
                onChange={(e) => patchSemester(semester.id, { name: e.target.value })}
                aria-label="Semester name"
                maxLength={40}
                className="text-lg font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none min-w-0 w-48"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  SGPA <span className="text-xl font-extrabold text-indigo-600 ml-1">{gpa === null ? '--' : gpa.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 ml-2">{credits} cr</span>
                </span>
                {data.semesters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSemester(semester.id)}
                    aria-label={`Remove ${semester.name}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_84px_92px_92px_64px_36px] gap-2 px-0.5 pb-1 text-xs font-medium text-slate-400">
              <span>Course</span>
              <span>Credit</span>
              <span>Marks</span>
              <span>Grade</span>
              <span className="text-center">Point</span>
              <span />
            </div>

            {semester.courses.map((course, index) => (
              <CourseRow
                key={course.id}
                course={course}
                index={index}
                onChange={(changes) => patchCourse(semester.id, course.id, changes)}
                onRemove={() => removeCourse(semester.id, course.id)}
              />
            ))}

            <button type="button" onClick={() => addCourse(semester.id)} className="btn-secondary !py-2 mt-3">
              <Plus size={15} /> Add course
            </button>
          </section>
        );
      })}

      <button type="button" onClick={addSemester} className="btn-primary">
        <Plus size={16} /> Add semester
      </button>

      <section className="card p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap size={19} />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900">Already have a result?</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Do not want to type old semesters again? Enter your earlier CGPA and credits here. They are added to the total.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 max-w-md">
          <div className="space-y-1.5">
            <label htmlFor="prev-cgpa" className="text-xs font-medium text-slate-500">
              Earlier CGPA
            </label>
            <input
              id="prev-cgpa"
              type="number"
              inputMode="decimal"
              min="0"
              max="4"
              step="0.01"
              value={data.previous.cgpa}
              onChange={(e) => setPrevious({ cgpa: e.target.value })}
              placeholder="e.g. 3.42"
              className="input"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="prev-credits" className="text-xs font-medium text-slate-500">
              Credits completed
            </label>
            <input
              id="prev-credits"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={data.previous.credits}
              onChange={(e) => setPrevious({ credits: e.target.value })}
              placeholder="e.g. 60"
              className="input"
            />
          </div>
        </div>
      </section>
    </div>
  );
};