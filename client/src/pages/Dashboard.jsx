import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BookOpen, Target, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function Dashboard() {
  const [revenueSummary, setRevenueSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({ overallGPA: 0, courses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [revRes, assignRes, gradesRes] = await Promise.all([
          fetch('/api/revenue/summary').then(r => r.json()),
          fetch('/api/academics/assignments').then(r => r.json()),
          fetch('/api/academics/grades').then(r => r.json()),
        ]);
        setRevenueSummary(revRes);
        setAssignments(assignRes.slice(0, 5));
        setGrades(gradesRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = [
    { name: 'Income', value: revenueSummary.income, fill: '#34d399' },
    { name: 'Expenses', value: revenueSummary.expenses, fill: '#f87171' },
  ];

  const monthlyData = revenueSummary.byMonth?.reduce((acc, item) => {
    const month = item.MONTH || item.month;
    const existing = acc.find(d => d.month === month);
    if (existing) {
      existing[item.TYPE || item.type] = item.TOTAL || item.total;
    } else {
      acc.push({ month, [item.TYPE || item.type]: item.TOTAL || item.total });
    }
    return acc;
  }, []) || [];

  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-1">Overview of your startup and academic performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                ${revenueSummary.income.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                ${revenueSummary.expenses.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Net Revenue</p>
              <p className="text-2xl font-bold text-primary-400 mt-1">
                ${revenueSummary.net.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current GPA</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{grades.overallGPA}%</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={grades.courses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="currentGrade" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            Upcoming Deadlines
          </h3>
          <span className="text-sm text-gray-400">{pendingAssignments.length} pending</span>
        </div>
        <div className="space-y-3">
          {pendingAssignments.map(a => (
            <div key={a.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.course_color || '#6366f1' }} />
                <div>
                  <p className="font-medium text-gray-100">{a.name}</p>
                  <p className="text-sm text-gray-400">{a.course_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary-400">
                  {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No date'}
                </p>
                <p className="text-xs text-gray-500">{a.weight}% weight</p>
              </div>
            </div>
          ))}
          {pendingAssignments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
          )}
        </div>
      </div>
    </div>
  );
}
