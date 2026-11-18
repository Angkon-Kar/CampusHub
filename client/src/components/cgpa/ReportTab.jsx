// client/src/components/cgpa/ReportTab.jsx
import { useState } from 'react';
import { Download, ImageDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { effectiveGrade, pointOf, performanceLabel } from '../../constants/duGrading';
import { renderCgpaReport, downloadCanvas } from '../../utils/reportImage';

export const ReportTab = ({ data, setData, result }) => {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');

  const hasPrevious = data.previous.cgpa !== '' && data.previous.credits !== '' && Number(data.previous.credits) > 0;

  // Only courses that have a grade go into the picture
  const buildReportData = () => ({
    studentName: data.name.trim(),
    cgpa: result.cgpa,
    credits: result.credits,
    label: performanceLabel(result.cgpa),
    previous: hasPrevious ? { cgpa: Number(data.previous.cgpa).toFixed(2), credits: data.previous.credits } : null,
    semesters: data.semesters.map((semester) => {
      const summary = result.perSemester.find(({ id }) => id === semester.id);
      return {
        name: semester.name,
        sgpa: summary?.gpa ?? null,
        credits: summary?.credits ?? 0,
        courses: semester.courses
          .map((course) => ({ course, grade: effectiveGrade(course) }))
          .filter(({ grade }) => grade)
          .map(({ course, grade }) => ({
            name: course.name,
            credit: course.credit,
            marks: course.marks,
            grade,
            point: pointOf(grade),
          })),
      };
    }),
  });

  const handleCreate = async (download) => {
    if (result.cgpa === null) return toast.error('Add at least one graded course first.');
    setBusy(true);
    try {
      const canvas = await renderCgpaReport(buildReportData());
      setPreview(canvas.toDataURL('image/png'));
      if (download) {
        await downloadCanvas(canvas, `cgpa-report-${new Date().toISOString().slice(0, 10)}.png`);
        toast.success('Report image saved.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not create the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="card p-4 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600">
            <ImageDown size={19} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">CGPA report image</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Creates a picture with your CGPA and every semester, ready to share or print. It is made on your device.
            </p>
          </div>
        </div>

        <div className="space-y-1.5 max-w-sm">
          <label htmlFor="report-name" className="text-xs font-medium text-slate-500">
            Name on the report (optional)
          </label>
          <input
            id="report-name"
            type="text"
            value={data.name}
            maxLength={60}
            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Angkon Kar"
            className="input"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {[
            ['CGPA', result.cgpa === null ? '--' : result.cgpa.toFixed(2)],
            ['Credits', result.credits || '--'],
            ['Semesters', data.semesters.length],
          ].map(([name, value]) => (
            <div key={name} className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3 text-center">
              <p className="text-xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => handleCreate(true)} disabled={busy} className="btn-primary">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download image
          </button>
          <button type="button" onClick={() => handleCreate(false)} disabled={busy} className="btn-secondary">
            Preview first
          </button>
        </div>
      </section>

      {preview && (
        <section className="card p-3 sm:p-4">
          <img src={preview} alt="Preview of your CGPA report" className="w-full rounded-xl border border-slate-200" />
        </section>
      )}
    </div>
  );
};