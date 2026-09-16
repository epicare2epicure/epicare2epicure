import MedicineTracker from './MedicineTracker';
import SleepTracker from './SleepTracker';
import SeizureJournal from './SeizureJournal';
import StressManagement from './StressManagement';

type Page = 'dashboard' | 'medications' | 'sleep' | 'seizures' | 'stress';

interface DashboardProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ currentPage, onNavigate }: DashboardProps) {
  if (currentPage === 'medications') return <MedicineTracker />;
  if (currentPage === 'sleep') return <SleepTracker />;
  if (currentPage === 'seizures') return <SeizureJournal />;
  if (currentPage === 'stress') return <StressManagement />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Good {getGreeting()}! 👋</h1>
        <p className="text-slate-500 mt-2">Here's your wellness overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('medications')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">💊</span>
          </div>
          <h3 className="font-semibold text-slate-700">Medication Adherence</h3>
          <p className="text-sm text-slate-500 mt-1">Track your daily medications</p>
        </button>

        <button onClick={() => onNavigate('sleep')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🌙</span>
          </div>
          <h3 className="font-semibold text-slate-700">Sleep Duration</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor your sleep patterns</p>
        </button>

        <button onClick={() => onNavigate('seizures')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-semibold text-slate-700">Seizure Journal</h3>
          <p className="text-sm text-slate-500 mt-1">Track and identify triggers</p>
        </button>

        <button onClick={() => onNavigate('stress')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🧘</span>
          </div>
          <h3 className="font-semibold text-slate-700">Mood & Stress</h3>
          <p className="text-sm text-slate-500 mt-1">Manage stress and mood</p>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-indigo-800 mb-2">💡 Daily Wellness Tip</h3>
        <p className="text-sm text-indigo-700">
          {getGreeting() === 'morning' && "Start your day by taking your medications at the same time each day. Consistency helps maintain stable blood levels."}
          {getGreeting() === 'afternoon' && "Take a moment to check in with yourself. How is your stress level? A quick breathing exercise can help reset your nervous system."}
          {getGreeting() === 'evening' && "Wind down with a consistent bedtime routine. Good sleep is one of the most effective ways to reduce seizure risk."}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">⚠️ Pilot Version</h3>
        <p className="text-sm text-amber-700">
          EpiCare is not a medical device. Always consult your doctor. Data is stored locally on your device.
        </p>
      </div>
    </div>
  );
}
