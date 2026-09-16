import { useState, useEffect } from 'react';

interface SeizureEntry {
  id: string;
  date: string;
  time: string;
  type: string;
  duration: string;
  severity: number;
  triggers: string[];
  notes: string;
}

const SEIZURE_TYPES = [
  'Focal Aware', 'Focal Impaired Awareness', 'Generalized Tonic-Clonic',
  'Absence', 'Myoclonic', 'Atonic', 'Tonic', 'Clonic', 'Other',
];

const COMMON_TRIGGERS = [
  'Sleep deprivation', 'Stress', 'Missed medication', 'Alcohol',
  'Illness/Fever', 'Flashing lights', 'Dehydration', 'Overexertion',
];

export default function SeizureJournal() {
  const [entries, setEntries] = useState<SeizureEntry[]>(() => {
    const saved = localStorage.getItem('seizureEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().substring(0, 5),
    type: 'Generalized Tonic-Clonic',
    duration: '1-2 minutes',
    severity: 3,
    triggers: [] as string[],
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('seizureEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const entry: SeizureEntry = { id: Date.now().toString(), ...newEntry };
    setEntries(prev => [...prev, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().substring(0, 5),
      type: 'Generalized Tonic-Clonic',
      duration: '1-2 minutes',
      severity: 3,
      triggers: [],
      notes: '',
    });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleTrigger = (trigger: string) => {
    setNewEntry(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger],
    }));
  };

  const thisMonth = new Date().toISOString().substring(0, 7);
  const seizuresThisMonth = entries.filter(s => s.date.startsWith(thisMonth)).length;

  const triggerCounts: Record<string, number> = {};
  entries.forEach(e => {
    e.triggers.forEach(t => { triggerCounts[t] = (triggerCounts[t] || 0) + 1; });
  });
  const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📋 Seizure Journal</h1>
          <p className="text-slate-500 mt-1">Track seizures to identify patterns and triggers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : '+ Log Seizure'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Log a Seizure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={e => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
              <input
                type="time"
                value={newEntry.time}
                onChange={e => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Seizure Type</label>
              <select
                value={newEntry.type}
                onChange={e => setNewEntry(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {SEIZURE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Duration</label>
              <select
                value={newEntry.duration}
                onChange={e => setNewEntry(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option>Seconds</option>
                <option>Less than 1 minute</option>
                <option>1-2 minutes</option>
                <option>2-5 minutes</option>
                <option>5-10 minutes</option>
                <option>More than 10 minutes</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Severity</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setNewEntry(prev => ({ ...prev, severity: s }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newEntry.severity === s ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-2">Possible Triggers</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TRIGGERS.map(trigger => (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      newEntry.triggers.includes(trigger)
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
              <textarea
                value={newEntry.notes}
                onChange={e => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={2}
              />
            </div>
          </div>
          <button
            onClick={addEntry}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
          >
            Save Entry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">This Month</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{seizuresThisMonth}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Top Trigger</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {topTriggers.length > 0 ? topTriggers[0][0] : 'None identified'}
          </p>
        </div>
      </div>

      {topTriggers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 mb-4">Identified Trigger Patterns</h2>
          <div className="space-y-3">
            {topTriggers.map(([trigger, count]) => (
              <div key={trigger} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-32 truncate">{trigger}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-rose-400" style={{ width: `${(count / entries.length) * 100}%` }} />
                </div>
                <span className="text-sm text-slate-500">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">Seizure History</h2>
        {entries.length === 0 ? (
          <p className="text-slate-400 text-sm">No seizures logged yet.</p>
        ) : (
          <div className="space-y-3">
            {[...entries].reverse().slice(0, 10).map(entry => (
              <div key={entry.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-700">{entry.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        entry.severity >= 4 ? 'bg-red-100 text-red-700' :
                        entry.severity >= 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        Severity: {entry.severity}/5
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {entry.time}
                    </p>
                    <p className="text-sm text-slate-500">Duration: {entry.duration}</p>
                    {entry.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.triggers.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}
                    {entry.notes && <p className="text-sm text-slate-400 mt-2 italic">Note: {entry.notes}</p>}
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="text-slate-300 hover:text-red-400 ml-2">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

