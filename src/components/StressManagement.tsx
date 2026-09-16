import { useState, useEffect, useRef } from 'react';

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  stressLevel: number;
  activity: string;
  notes: string;
}

export default function StressManagement() {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const [newMood, setNewMood] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 3,
    stressLevel: 3,
    activity: '',
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (breathingActive) {
      const phases = { inhale: 4, hold: 4, exhale: 6, rest: 2 };
      let phase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
      let timer = phases[phase];
      setBreathPhase(phase);
      setBreathTimer(timer);

      intervalRef.current = window.setInterval(() => {
        timer -= 1;
        if (timer <= 0) {
          if (phase === 'inhale') { phase = 'hold'; timer = phases.hold; }
          else if (phase === 'hold') { phase = 'exhale'; timer = phases.exhale; }
          else if (phase === 'exhale') { phase = 'rest'; timer = phases.rest; }
          else { phase = 'inhale'; timer = phases.inhale; }
          setBreathPhase(phase);
        }
        setBreathTimer(timer);
      }, 1000);

      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [breathingActive]);

  const addMoodEntry = () => {
    const entry: MoodEntry = { id: Date.now().toString(), ...newMood };
    setEntries(prev => [...prev, entry]);
    setNewMood({ date: new Date().toISOString().split('T')[0], mood: 3, stressLevel: 3, activity: '', notes: '' });
    setShowForm(false);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('inhale');
    setBreathTimer(0);
  };

  const last7 = entries.slice(-7);
  const avgMood = last7.length > 0 ? Math.round(last7.reduce((acc, e) => acc + e.mood, 0) / last7.length * 10) / 10 : 0;
  const avgStress = last7.length > 0 ? Math.round(last7.reduce((acc, e) => acc + e.stressLevel, 0) / last7.length * 10) / 10 : 0;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 5) return '😊';
    if (mood >= 4) return '🙂';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😟';
    return '😢';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🧘 Stress Management</h1>
          <p className="text-slate-500 mt-1">Tools and tracking for managing stress and mood</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : '+ Log Mood'}
        </button>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100">
        <h3 className="font-semibold text-teal-800 mb-2">🧠 Stress & Epilepsy Connection</h3>
        <p className="text-sm text-teal-700">
          Stress is a common seizure trigger — managing it proactively can help reduce seizure frequency. Even 5 minutes of daily stress management can make a significant difference.
        </p>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">How are you feeling?</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Mood</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(m => (
                  <button
                    key={m}
                    onClick={() => setNewMood(prev => ({ ...prev, mood: m }))}
                    className={`flex-1 py-3 rounded-xl text-2xl transition-all ${
                      newMood.mood === m ? 'bg-indigo-100 border-2 border-indigo-400 scale-110' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    {getMoodEmoji(m)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Stress Level</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setNewMood(prev => ({ ...prev, stressLevel: s }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newMood.stressLevel === s ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s === 1 ? 'Low' : s === 3 ? 'Med' : s === 5 ? 'High' : s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">What are you doing?</label>
              <input
                type="text"
                value={newMood.activity}
                onChange={e => setNewMood(prev => ({ ...prev, activity: e.target.value }))}
                placeholder="e.g., Working, Relaxing, Exercising..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
              <textarea
                value={newMood.notes}
                onChange={e => setNewMood(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How are you feeling?"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={2}
              />
            </div>
          </div>
          <button
            onClick={addMoodEntry}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
          >
            Save Entry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Avg. Mood (7 days)</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl">{avgMood > 0 ? getMoodEmoji(Math.round(avgMood)) : '—'}</span>
            <span className="text-2xl font-bold text-slate-800">{avgMood > 0 ? `${avgMood}/5` : 'N/A'}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Avg. Stress (7 days)</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl">{avgStress <= 2 ? '😌' : avgStress <= 3 ? '😐' : '😰'}</span>
            <span className="text-2xl font-bold text-slate-800">{avgStress > 0 ? `${avgStress}/5` : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">4-4-6 Breathing Exercise</h2>
        {!breathingActive ? (
          <div className="text-center">
            <p className="text-slate-600 mb-4">A calming breath technique: inhale for 4, hold for 4, exhale for 6</p>
            <button
              onClick={() => setBreathingActive(true)}
              className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors font-medium"
            >
              Start Breathing Exercise
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <div
                className={`absolute inset-0 rounded-full border-4 border-indigo-300 transition-all duration-1000 ${
                  breathPhase === 'inhale' ? 'scale-110 bg-indigo-100' :
                  breathPhase === 'hold' ? 'scale-110 bg-indigo-200' :
                  breathPhase === 'exhale' ? 'scale-75 bg-indigo-50' :
                  'scale-75 bg-transparent'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-indigo-700">{breathTimer}</span>
                <span className="text-sm text-indigo-500 capitalize">{breathPhase}</span>
              </div>
            </div>
            <p className="text-indigo-600 mb-4">
              {breathPhase === 'inhale' && 'Breathe in slowly through your nose...'}
              {breathPhase === 'hold' && 'Hold your breath gently...'}
              {breathPhase === 'exhale' && 'Release slowly through your mouth...'}
              {breathPhase === 'rest' && 'Rest briefly before the next cycle...'}
            </p>
            <button
              onClick={stopBreathing}
              className="bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
            >
              Stop Exercise
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">Mood History</h2>
        {entries.length === 0 ? (
          <p className="text-slate-400 text-sm">No mood entries yet. Start tracking how you feel!</p>
        ) : (
          <div className="space-y-3">
            {[...entries].reverse().slice(0, 10).map(entry => (
              <div key={entry.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <p className="text-sm text-slate-700">
                      Mood: {entry.mood}/5 • Stress: {entry.stressLevel}/5
                    </p>
                    {entry.activity && <p className="text-xs text-slate-500">Activity: {entry.activity}</p>}
                    {entry.notes && <p className="text-xs text-slate-400 mt-1 italic">"{entry.notes}"</p>}
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
