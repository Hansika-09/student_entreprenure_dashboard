import { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, BookOpen, TrendingUp } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api.js';

export default function Academics() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({ overallGPA: 0, courses: [] });
  const [activeTab, setActiveTab] = useState('courses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', code: '', credits: 3, semester: '', color: '#6366f1' });
  const [assignForm, setAssignForm] = useState({ course_id: '', name: '', due_date: '', weight: 0, max_score: 100 });

  async function fetchData() {
    const [coursesRes, assignRes, gradesRes] = await Promise.all([
      apiGet('/api/academics/courses'),
      apiGet('/api/academics/assignments'),
      apiGet('/api/academics/grades'),
    ]);
    setCourses(coursesRes);
    setAssignments(assignRes);
    setGrades(gradesRes);
  }

  useEffect(() => { fetchData(); }, []);

  async function addCourse(e) {
    e.preventDefault();
    await apiPost('/api/academics/courses', courseForm);
    setShowCourseForm(false);
    setCourseForm({ name: '', code: '', credits: 3, semester: '', color: '#6366f1' });
    fetchData();
  }

  async function addAssignment(e) {
    e.preventDefault();
    await apiPost('/api/academics/assignments', assignForm);
    setShowAssignForm(false);
    setAssignForm({ course_id: '', name: '', due_date: '', weight: 0, max_score: 100 });
    fetchData();
  }

  async function updateAssignment(id, score, status) {
    await apiPatch(`/api/academics/assignments/${id}`, { score, status });
    fetchData();
  }

  async function deleteItem(type, id) {
    if (!confirm(`Delete this ${type}?`)) return;
    await apiDelete(`/api/academics/${type}s/${id}`);
    fetchData();
  }

  const colors = ['#6366f1', '#34d399', '#f472b6', '#fbbf24', '#60a5fa', '#a78bfa'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Academics</h2>
          <p className="text-gray-400 mt-1">Manage courses, assignments, and grades</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCourseForm(!showCourseForm)} className="btn-secondary">
            <Plus className="w-4 h-4" /> Course
          </button>
          <button onClick={() => setShowAssignForm(!showAssignForm)} className="btn-primary">
            <Plus className="w-4 h-4" /> Assignment
          </button>
        </div>
      </div>

      {/* GPA Card */}
      <div className="card flex items-center gap-6">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Overall Grade Average</p>
          <p className="text-3xl font-bold text-amber-400">{grades.overallGPA}%</p>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ml-6">
          {grades.courses.map(c => (
            <div key={c.id} className="bg-gray-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 truncate">{c.name}</p>
              <p className="text-lg font-bold" style={{ color: c.color }}>{c.currentGrade}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Forms */}
      {showCourseForm && (
        <div className="card border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">New Course</h3>
          <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input className="input" placeholder="Course Name" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} required />
            <input className="input" placeholder="Code" value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} required />
            <input className="input" type="number" placeholder="Credits" value={courseForm.credits} onChange={e => setCourseForm({...courseForm, credits: parseInt(e.target.value)})} />
            <input className="input" placeholder="Semester" value={courseForm.semester} onChange={e => setCourseForm({...courseForm, semester: e.target.value})} />
            <div className="flex gap-2">
              {colors.map(c => (
                <button key={c} type="button" onClick={() => setCourseForm({...courseForm, color: c})}
                  className={`w-8 h-8 rounded-full border-2 ${courseForm.color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="md:col-span-5 flex gap-3">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setShowCourseForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showAssignForm && (
        <div className="card border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">New Assignment</h3>
          <form onSubmit={addAssignment} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <select className="input md:col-span-2" value={assignForm.course_id} onChange={e => setAssignForm({...assignForm, course_id: e.target.value})} required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input md:col-span-2" placeholder="Assignment Name" value={assignForm.name} onChange={e => setAssignForm({...assignForm, name: e.target.value})} required />
            <input className="input" type="date" value={assignForm.due_date} onChange={e => setAssignForm({...assignForm, due_date: e.target.value})} />
            <input className="input" type="number" placeholder="Weight %" value={assignForm.weight} onChange={e => setAssignForm({...assignForm, weight: parseFloat(e.target.value)})} />
            <div className="md:col-span-6 flex gap-3">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setShowAssignForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1 w-fit border border-gray-800">
        {['courses', 'assignments'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="card hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: course.color + '20' }}>
                    <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{course.name}</h3>
                    <p className="text-sm text-gray-400">{course.code} &bull; {course.credits} credits</p>
                  </div>
                </div>
                <button onClick={() => deleteItem('course', course.id)} className="text-gray-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{course.semester || 'No semester'}</span>
                {grades.courses.find(c => c.id === course.id)?.currentGrade && (
                  <span className="text-sm font-bold" style={{ color: course.color }}>
                    {grades.courses.find(c => c.id === course.id)?.currentGrade}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Assignment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Due Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Weight</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-200">{a.name}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.course_color }} />
                        {a.course_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {a.due_date ? new Date(a.due_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 text-sm">{a.weight}%</td>
                    <td className="py-3 px-4">
                      {a.status === 'completed' ? (
                        <span className="text-emerald-400 font-mono">{a.score}/{a.max_score}</span>
                      ) : (
                        <input 
                          type="number" 
                          className="w-20 input text-sm py-1 px-2 text-center"
                          placeholder="Score"
                          onBlur={e => e.target.value && updateAssignment(a.id, parseFloat(e.target.value), 'completed')}
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => updateAssignment(a.id, a.score, a.status === 'completed' ? 'pending' : 'completed')}>
                        {a.status === 'completed' 
                          ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                          : <Circle className="w-5 h-5 text-gray-500" />
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteItem('assignment', a.id)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No assignments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
