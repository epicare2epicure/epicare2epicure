type Page = 'dashboard' | 'medications' | 'sleep' | 'seizures' | 'stress';

interface DashboardProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ currentPage, onNavigate }: DashboardProps) {
  if (currentPage === 'medications') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">💊 Medication Tracker</h2>
        <p className="text-slate-600">Medication tracking features coming soon!</p>
      </div>
    );
  }

  if (currentPage === 'sleep') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">🌙 Sleep Tracker</h2>
        <p className="text-slate-600">Sleep tracking features coming soon!</p>
      </div>
    );
  }

  if (currentPage === 'seizures') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">📋 Seizure Journal</h2>
        <p className="text-slate-600">Seizure journal features coming soon!</p>
      </div>
    );
  }

  if (currentPage === 'stress') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">🧘 Stress Management</h2>
        <p className="text-slate-600">Stress management features coming soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Health Dashboard</h1>
        <p className="text-slate-500 mt-2">Track your epilepsy management journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('medications')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <span className="text-2xl">💊</span>
          <h3 className="font-semibold text-slate-700 mt-3">Medications</h3>
          <p className="text-sm text-slate-500 mt-1">Track your medications</p>
        </button>

        <button onClick={() => onNavigate('sleep')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <span className="text-2xl">🌙</span>
          <h3 className="font-semibold text-slate-700 mt-3">Sleep</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor sleep patterns</p>
        </button>

        <button onClick={() => onNavigate('seizures')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <span className="text-2xl">📋</span>
          <h3 className="font-semibold text-slate-700 mt-3">Seizures</h3>
          <p className="text-sm text-slate-500 mt-1">Journal seizure activity</p>
        </button>

        <button onClick={() => onNavigate('stress')} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
          <span className="text-2xl">🧘</span>
          <h3 className="font-semibold text-slate-700 mt-3">Stress</h3>
          <p className="text-sm text-slate-500 mt-1">Manage stress & mood</p>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">⚠️ Pilot Version</h3>
        <p className="text-sm text-amber-700">
          EpiCare is not a medical device. Always consult your doctor. Data is stored securely in the cloud.
        </p>
      </div>
    </div>
  );
}
