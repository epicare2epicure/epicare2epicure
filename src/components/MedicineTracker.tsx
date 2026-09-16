import { useState, useEffect } from 'react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  active: boolean;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  taken: boolean;
  date: string;
  time: string;
}

export default function MedicineTracker() {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(() => {
    const saved = localStorage.getItem('medicationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'Daily', times: ['08:00'] });

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medicationLogs', JSON.stringify(medicationLogs));
  }, [medicationLogs]);

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = medicationLogs.filter(log => log.date === today);

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage) return;
    const med: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      times: newMed.times.filter(t => t),
      active: true,
    };
    setMedications(prev => [...prev, med]);
    setNewMed({ name: '', dosage: '', frequency: 'Daily', times: ['08:00'] });
    setShowAddForm(false);
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const logDose = (medicationId: string, medicationName: string, time: string) => {
    const existingLog = todayLogs.find(l => l.medicationId === medicationId && l.time === time);
    if (existingLog) {
      setMedicationLogs(prev => prev.map(l =>
        l.id === existingLog.id ? { ...l, taken: !l.taken } : l
      ));
    } else {
      const log: MedicationLog = {
        id: Date.now().toString(),
        medicationId,
        medicationName,
        taken: true,
        date: today,
        time,
      };
      setMedicationLogs(prev => [...prev, log]);
    }
  };

  const addTimeSlot = () => {
    setNewMed(prev => ({ ...prev, times: [...prev.times, '12:00'] }));
  };

  const removeTimeSlot = (idx: number) => {
    setNewMed(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== idx) }));
  };

  const updateTimeSlot = (idx: number, value: string) => {
    setNewMed(prev => ({ ...prev, times: prev.times.map((t, i) => i === idx ? value : t) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">💊 Medication Tracker</h1>
          <p className="text-slate-500 mt-1">Stay on top of your medication schedule</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Medication'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Add New Medication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Medication Name</label>
              <input
                type="text"
                value={newMed.name}
                onChange={e => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Levetiracetam"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Dosage</label>
              <input
                type="text"
                value={newMed.dosage}
                onChange={e => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 500mg"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Frequency</label>
              <select
                value={newMed.frequency}
                onChange={e => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option>Daily</option>
                <option>Twice Daily</option>
                <option>Three Times Daily</option>
                <option>As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {newMed.times.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <input
                      type="time"
                      value={time}
                      onChange={e => updateTimeSlot(idx, e.target.value)}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-sm"
                    />
                    {newMed.times.length > 1 && (
                      <button onClick={() => removeTimeSlot(idx)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addTimeSlot} className="text-indigo-500 text-sm hover:text-indigo-700">+ Time</button>
              </div>
            </div>
          </div>
          <button
            onClick={addMedication}
            className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium"
          >
            Save Medication
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 mb-4">Today's Schedule</h2>
        {medications.filter(m => m.active).length === 0 ? (
          <p className="text-slate-400 text-sm">No active medications. Add one to get started!</p>
        ) : (
          <div className="space-y-3">
            {medications.filter(m => m.active).map(med => (
              <div key={med.id} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-slate-700">{med.name}</h4>
                    <p className="text-sm text-slate-500">{med.dosage} • {med.frequency}</p>
                  </div>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="text-xs px-2 py-1 bg-red-50 rounded-full text-red-500 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {med.times.map(time => {
                    const isTaken = todayLogs.some(l => l.medicationId === med.id && l.time === time && l.taken);
                    return (
                      <button
                        key={time}
                        onClick={() => logDose(med.id, med.name, time)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isTaken
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {isTaken ? '✓ ' : ''}{time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
