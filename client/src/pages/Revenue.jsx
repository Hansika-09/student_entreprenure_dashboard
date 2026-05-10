import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Revenue() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: '', amount: '', type: 'income', category: '', entry_date: new Date().toISOString().split('T')[0], recurring: false
  });

  async function fetchData() {
    const [entriesRes, summaryRes] = await Promise.all([
      fetch('/api/revenue/entries').then(r => r.json()),
      fetch('/api/revenue/summary').then(r => r.json()),
    ]);
    setEntries(entriesRes);
    setSummary(summaryRes);
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/revenue/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount))
      }),
    });
    setShowForm(false);
    setForm({ description: '', amount: '', type: 'income', category: '', entry_date: new Date().toISOString().split('T')[0], recurring: false });
    fetchData();
  }

  async function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/revenue/entries/${id}`, { method: 'DELETE' });
    fetchData();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Revenue</h2>
          <p className="text-gray-400 mt-1">Track startup income and expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-emerald-500">
          <p className="text-sm text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${summary.income.toLocaleString()}</p>
        </div>
        <div className="card border-l-4 border-red-500">
          <p className="text-sm text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400 mt-1">${summary.expenses.toLocaleString()}</p>
        </div>
        <div className="card border-l-4 border-primary-500">
          <p className="text-sm text-gray-400">Net Revenue</p>
          <p className="text-2xl font-bold text-primary-400 mt-1">${summary.net.toLocaleString()}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">New Entry</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <input className="input lg:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            <input className="input" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input className="input" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <input className="input" type="date" value={form.entry_date} onChange={e => setForm({...form, entry_date: e.target.value})} required />
            <div className="lg:col-span-6 flex gap-3">
              <button type="submit" className="btn-primary">Save Entry</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Entries Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {entry.type === 'income' 
                        ? <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                        : <ArrowDownCircle className="w-4 h-4 text-red-400" />
                      }
                      <span className="font-medium text-gray-200">{entry.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{entry.category || '-'}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString() : '-'}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-medium ${entry.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {entry.type === 'income' ? '+' : ''}${Math.abs(entry.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => deleteEntry(entry.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No entries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
