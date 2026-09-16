import { useState, useEffect } from 'react';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes: string;
}

export default function SleepTracker() {
  const [entries, setEntries] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem('sleepEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:00',
    wakeTime: '07:00',
    quality: 3,
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('sleepEntries', JSON.stringify(entries));
  }, [entries]);

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let bedMinutes = bH * 60 + bM;
    let wakeMinutes = wH * 60 + wM;
    if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;
    return Math.round((wakeMinutes - bedMinutes) / 60 * 10) / 10;
  };

  const addEntry = () => {
    const duration = calculateDuration(newEntry.bedtime, newEntry.wakeTime);
    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      bedtime: newEntry.bedtime,
      wakeTime: newEntry.wakeTime,
      duration,
      quality: newEntry.quality,
      notes: newEntry.notes,
    };
    setEntries(prev => [...prev, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:00',
      wakeTime: '07:00',
      quality: 3,
      notes: '',
    });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const last7 = entries.slice(-7);
  const avgDuration = last7.length > 0
    ? Math.round(last7.reduce((acc, e) => acc + e.duration, 0) / last7.length * 10) / 10
    : 0;
  const avgQuality = last7.length > 0
    ? Math.round(last7.reduce((acc, e) => acc + e.quality, 0) / last7.length * 10) / 10
    : 0;

  const bedtimes = last7.map(e => {
    const [h, m] = e.bedtime.split(':').map(Number);
    return h * 60 + m;
  });
  const avgBedtime = bedtimes.length > 0 ? bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length : 0;
  const bedtimeVariance = bedtimes.length > 0
    ? Math.sqrt(bedtimes.reduce((acc, t) => acc + Math.pow(t - avgBedtime, 2), 0) / bedtimes.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🌙 Sleep Tracker</h1>
          <p className="text-slate-500 mt-1">Good sleep is essential for seizure management</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : '+ Log Sleep'}
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-2">💡 Sleep & Epilepsy</h3>
        <p className="text-sm text-indigo-700">
          Sleep deprivation is one of the most common seizure triggers. Aim for 7-9 hours of consistent, quality sleep each night. Maintaining a regular sleep schedule can significantly reduce seizure frequency.
        </p>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Log Sleep</h3>
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
              <label className="block text-sm font-medium text-slate-600 mb-1">Sleep Quality</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(q => (
                  <button
                    key={q}
                    onClick={() => setNewEntry(prev => ({ ...prev, quality: q }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newEntry.quality === q ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Bedtime</label>
              <input
                type="time"
                value={newEntry.bedtime}
                onChange={e => setNewEntry(prev => ({ ...prev, bedtime: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Wake Time</label>
              <input
                type="time"
                value={newEntry.wakeTime}
                onChange={e => setNewEntry(prev => ({ ...prev, wakeTime: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
              <textarea
                value={newEntry.notes}
                onChange={e => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations? (e.g., restless, vivid dreams, etc.)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Estimated duration: <strong>{calculateDuration(newEntry.bedtime, newEntry.wakeTime)} hours</strong>
            </p>
          </div>
          <button
            onClick={addEntry}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
          >
            Save Entry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Avg. Duration (7d)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{avgDuration}h</p>
          <p className={`text-xs mt-1 ${avgDuration >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
            {avgDuration >= 7 ? '✓ On target' : 'Below recommended 7h'}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Avg. Quality (7d)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{avgQuality}/5</p>
          <p className="text-xs text-slate-400 mt-1">
            {avgQuality >= 4 ? 'Excellent' : avgQuality >= 3 ? 'Good' : avgQuality > 0 ? 'Needs work' : 'No data'}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Bedtime Consistency</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">±{Math.round(bedtimeVariance)} min</p>
          <p className={`text-xs mt-1 ${bedtimeVariance <= 30 ? 'text-green-600' : 'text-orange-600'}`}>
            {bedtimeVariance <= 30 ? '✓ Consistent' : 'Try to be more regular'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">Sleep History</h2>
        {entries.length === 0 ? (
          <p className="text-slate-400 text-sm">No sleep entries yet. Start logging your sleep!</p>
        ) : (
          <div className="space-y-3">
            {[...entries].reverse().slice(0, 10).map(entry => (
              <div key={entry.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{entry.duration}h</span> sleep
                    </p>
                    <p className="text-xs text-slate-500">
                      {entry.bedtime} → {entry.wakeTime} • Quality: {entry.quality}/5
                    </p>
                    {entry.notes && <p className="text-xs text-slate-400 mt-1 italic">"{entry.notes}"</p>}
                  </div>
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="text-slate-300 hover:text-red-400">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
