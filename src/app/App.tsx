import { 
  Heart,
  Search,
  Check,
  FileText,
  Upload,
  User,
  BarChart3,
  Bell,
  Pill,
  Clock,
  Calendar,
  Activity,
  TrendingUp,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, ResponsiveContainer, BarChart, Bar, YAxis } from 'recharts';
import doctorImage from 'figma:asset/0156464356af3d61263fb798bb6fc685dd674fc4.png';
import { useState } from 'react';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  color: string;
  taken: boolean;
  period: 'morning' | 'evening';
};

type Provider = {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  nextAppointment: string;
  image: string;
};

type Symptom = {
  id: number;
  icon: string;
  title: string;
  severity: string;
  time: string;
  bgColor: string;
  notes?: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', frequency: 'Daily', color: 'bg-blue-100', taken: true, period: 'morning' },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '8:00 AM', frequency: 'Twice daily', color: 'bg-purple-100', taken: false, period: 'morning' },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '6:00 PM', frequency: 'Daily', color: 'bg-teal-100', taken: false, period: 'evening' },
    { id: 4, name: 'Aspirin', dosage: '81mg', time: '8:00 PM', frequency: 'Daily', color: 'bg-orange-100', taken: false, period: 'evening' },
  ]);

  const adherenceData = [
    { name: 'Mon', value: 85 },
    { name: 'Toa', value: 88 },
    { name: 'Wed', value: 82 },
    { name: 'The', value: 90 },
    { name: 'Fin', value: 92 },
    { name: 'Sat', value: 95 },
    { name: 'Sun', value: 94 },
  ];

  const toggleMedication = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg mb-8 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-2xl font-semibold">MedCapsule</h1>
            </div>
            
            <nav className="flex items-center gap-8">
              <NavLink label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
              <NavLink label="Medications" active={activeTab === 'Medications'} onClick={() => setActiveTab('Medications')} />
              <NavLink label="Alternative" active={activeTab === 'Alternative'} onClick={() => setActiveTab('Alternative')} />
              <NavLink label="Symptoms" active={activeTab === 'Symptoms'} onClick={() => setActiveTab('Symptoms')} />
              <NavLink label="Providers" active={activeTab === 'Providers'} onClick={() => setActiveTab('Providers')} />
              <NavLink label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            </nav>

            <button className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content - Changes based on active tab */}
        {activeTab === 'Dashboard' && <DashboardView adherenceData={adherenceData} onViewAnalytics={() => setActiveTab('Analytics')} />}
        {activeTab === 'Medications' && (
          <MedicationsView 
            medications={medications} 
            onMedicationClick={setSelectedMedication}
            onToggleMedication={toggleMedication}
            onAddMedication={() => setShowAddMedication(true)}
          />
        )}
        {activeTab === 'Alternative' && <AlternativeView onCardClick={setSelectedAlternative} />}
        {activeTab === 'Symptoms' && (
          <SymptomsView 
            onSymptomClick={setSelectedSymptom}
            onAddSymptom={() => setShowAddSymptom(true)}
          />
        )}
        {activeTab === 'Providers' && (
          <ProvidersView onProviderClick={setSelectedProvider} />
        )}
        {activeTab === 'Analytics' && <AnalyticsView adherenceData={adherenceData} />}

        {/* Modals */}
        {selectedMedication && (
          <MedicationDetailModal 
            medication={selectedMedication} 
            onClose={() => setSelectedMedication(null)}
            onToggle={() => {
              toggleMedication(selectedMedication.id);
              setSelectedMedication({ ...selectedMedication, taken: !selectedMedication.taken });
            }}
          />
        )}

        {selectedProvider && (
          <ProviderDetailModal 
            provider={selectedProvider} 
            onClose={() => setSelectedProvider(null)}
          />
        )}

        {selectedSymptom && (
          <SymptomDetailModal 
            symptom={selectedSymptom} 
            onClose={() => setSelectedSymptom(null)}
          />
        )}

        {showAddMedication && (
          <AddMedicationModal onClose={() => setShowAddMedication(false)} />
        )}

        {showAddSymptom && (
          <AddSymptomModal onClose={() => setShowAddSymptom(false)} />
        )}

        {selectedAlternative && (
          <AlternativeDetailModal 
            title={selectedAlternative}
            onClose={() => setSelectedAlternative(null)}
          />
        )}
      </div>
    </div>
  );
}

function DashboardView({ adherenceData, onViewAnalytics }: { adherenceData: any[]; onViewAnalytics: () => void }) {
  const [medicationTaken, setMedicationTaken] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Medication Due Now */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Medication Due Now</h2>
          
          <div className={`flex items-center justify-between rounded-2xl p-6 transition-all ${medicationTaken ? 'bg-green-50' : 'bg-teal-50'}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-300 to-blue-400 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-10 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Atorvastatin</h3>
                <p className="text-teal-600">6:00 AM</p>
                {medicationTaken && <p className="text-green-600 text-sm">✓ Taken</p>}
              </div>
            </div>
            <button 
              onClick={() => setMedicationTaken(!medicationTaken)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                medicationTaken ? 'bg-green-400' : 'bg-teal-400 hover:bg-teal-500'
              }`}
            >
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <ActionButton icon={<FileText />} label="Leg natoma" />
          <ActionButton icon={<Upload />} label="Upload" sublabel="Rescription" />
          <ActionButton icon={<User />} label="Contact" sublabel="Confriente" />
          <ActionButton icon={<BarChart3 />} label="View" sublabel="Analytics" onClick={onViewAnalytics} />
        </div>

        {/* Adherence */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Adherence</h2>
          
          <div className="text-6xl font-bold mb-6 text-gray-900">92%</div>
          
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                />
                <Line 
                  type="monotone"
                  dataKey="value" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  dot={false}
                  fill="url(#adherenceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Symptoms */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Symptoms</h2>
          
          <div className="space-y-4">
            <SymptomItem 
              icon="🤕"
              title="Headache"
              subtitle="Commet"
              bgColor="bg-teal-100"
            />
            <SymptomItem 
              icon="😴"
              title="Fatigue"
              subtitle="Deve styn"
              bgColor="bg-teal-100"
            />
          </div>

          {/* Doctor Profiles */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <DoctorCard 
              name="D. Jacob"
              specialty="Fer new Untall"
              image={doctorImage}
            />
            <DoctorCard 
              name="Squrah Moore"
              specialty="Equorded imeccent"
              image={doctorImage}
            />
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Medications</h2>
            <span className="text-teal-600">Auto</span>
          </div>
          
          <div className="space-y-4">
            <MedicationItem 
              name="Likinpprii"
              subtitle="bene"
              time="9:00 AM"
              checked
            />
            <MedicationItem 
              name="Metformin"
              subtitle="Autoriz"
              time="9:00 AM"
              icon="💊"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicationsView({ 
  medications, 
  onMedicationClick, 
  onToggleMedication,
  onAddMedication
}: { 
  medications: Medication[];
  onMedicationClick: (med: Medication) => void;
  onToggleMedication: (id: number) => void;
  onAddMedication: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold mb-8">All Medications</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Morning Medications */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Morning</h3>
          {medications.filter(med => med.period === 'morning').map(med => (
            <MedicationCard 
              key={med.id}
              medication={med}
              onClick={() => onMedicationClick(med)}
              onToggle={() => onToggleMedication(med.id)}
            />
          ))}
        </div>

        {/* Evening Medications */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Evening</h3>
          {medications.filter(med => med.period === 'evening').map(med => (
            <MedicationCard 
              key={med.id}
              medication={med}
              onClick={() => onMedicationClick(med)}
              onToggle={() => onToggleMedication(med.id)}
            />
          ))}
        </div>
      </div>

      {/* Add Medication Button */}
      <button className="mt-8 w-full py-4 bg-teal-400 text-white rounded-2xl font-semibold hover:bg-teal-500 transition-colors" onClick={onAddMedication}>
        + Add New Medication
      </button>
    </div>
  );
}

function AlternativeView({ onCardClick }: { onCardClick: (title: string) => void }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold mb-8">Alternative Treatments</h2>
      
      <div className="space-y-6">
        <AlternativeCard 
          title="Natural Supplements"
          description="Explore vitamin and mineral supplements"
          icon="🌿"
          onClick={() => onCardClick("Natural Supplements")}
        />
        <AlternativeCard 
          title="Herbal Remedies"
          description="Traditional herbal medicine options"
          icon="🍃"
          onClick={() => onCardClick("Herbal Remedies")}
        />
        <AlternativeCard 
          title="Lifestyle Changes"
          description="Diet and exercise recommendations"
          icon="🏃"
          onClick={() => onCardClick("Lifestyle Changes")}
        />
        <AlternativeCard 
          title="Mindfulness & Meditation"
          description="Mental wellness practices"
          icon="🧘"
          onClick={() => onCardClick("Mindfulness & Meditation")}
        />
      </div>
    </div>
  );
}

function SymptomsView({ onSymptomClick, onAddSymptom }: { onSymptomClick: (symptom: Symptom) => void; onAddSymptom: () => void }) {
  const symptoms: Symptom[] = [
    { id: 1, icon: "🤕", title: "Headache", severity: "Moderate", time: "2 hours ago", bgColor: "bg-yellow-100" },
    { id: 2, icon: "😴", title: "Fatigue", severity: "Mild", time: "4 hours ago", bgColor: "bg-blue-100" },
    { id: 3, icon: "🤢", title: "Nausea", severity: "Severe", time: "6 hours ago", bgColor: "bg-red-100" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold mb-8">Symptom Tracker</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Symptoms</h3>
          {symptoms.map(symptom => (
            <SymptomCard 
              key={symptom.id}
              icon={symptom.icon}
              title={symptom.title}
              severity={symptom.severity}
              time={symptom.time}
              bgColor={symptom.bgColor}
              onClick={() => onSymptomClick(symptom)}
            />
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Symptom</h3>
          <div className="bg-gray-50 rounded-2xl p-6">
            <button className="w-full py-4 bg-teal-400 text-white rounded-xl font-semibold hover:bg-teal-500 transition-colors" onClick={onAddSymptom}>
              + Log New Symptom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvidersView({ onProviderClick }: { onProviderClick: (provider: Provider) => void }) {
  const providers: Provider[] = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", phone: "(555) 123-4567", nextAppointment: "Feb 15, 2024", image: doctorImage },
    { id: 2, name: "Dr. Michael Chen", specialty: "Endocrinologist", phone: "(555) 234-5678", nextAppointment: "Feb 20, 2024", image: doctorImage },
    { id: 3, name: "Dr. Emily Rodriguez", specialty: "Primary Care", phone: "(555) 345-6789", nextAppointment: "Mar 1, 2024", image: doctorImage },
    { id: 4, name: "Dr. James Wilson", specialty: "Neurologist", phone: "(555) 456-7890", nextAppointment: "Mar 10, 2024", image: doctorImage },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold mb-8">Healthcare Providers</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {providers.map(provider => (
          <ProviderCard 
            key={provider.id}
            provider={provider}
            onClick={() => onProviderClick(provider)}
          />
        ))}
      </div>
    </div>
  );
}

function AnalyticsView({ adherenceData }: { adherenceData: any[] }) {
  const monthlyData = [
    { name: 'Jan', medications: 85, symptoms: 12 },
    { name: 'Feb', medications: 88, symptoms: 10 },
    { name: 'Mar', medications: 92, symptoms: 8 },
    { name: 'Apr', medications: 90, symptoms: 9 },
    { name: 'May', medications: 95, symptoms: 6 },
    { name: 'Jun', medications: 94, symptoms: 7 },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-8">Analytics Dashboard</h2>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Adherence Rate" value="92%" icon={<TrendingUp />} color="bg-green-100" />
          <StatCard title="Active Meds" value="4" icon={<Pill />} color="bg-blue-100" />
          <StatCard title="Symptoms Logged" value="12" icon={<Activity />} color="bg-yellow-100" />
          <StatCard title="Appointments" value="3" icon={<Calendar />} color="bg-purple-100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Weekly Adherence</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adherenceData}>
                  <XAxis dataKey="name" />
                  <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <Bar dataKey="medications" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="symptoms" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-base font-medium transition-colors ${
        active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({ 
  icon, 
  label, 
  sublabel,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  sublabel?: string;
  onClick?: () => void;
}) {
  return (
    <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4" onClick={onClick}>
      <div className="w-12 h-12 text-teal-600">
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium text-gray-900">{label}</div>
        {sublabel && <div className="text-gray-500 text-sm">{sublabel}</div>}
      </div>
    </button>
  );
}

function SymptomItem({ 
  icon, 
  title, 
  subtitle, 
  bgColor 
}: { 
  icon: string; 
  title: string; 
  subtitle: string; 
  bgColor: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

function DoctorCard({ 
  name, 
  specialty, 
  image 
}: { 
  name: string; 
  specialty: string; 
  image: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
        <p className="text-teal-600 text-xs truncate">{specialty}</p>
      </div>
    </div>
  );
}

function MedicationItem({ 
  name, 
  subtitle, 
  time, 
  checked = false,
  icon
}: { 
  name: string; 
  subtitle: string; 
  time: string; 
  checked?: boolean;
  icon?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${checked ? 'bg-teal-400' : 'bg-teal-100'} rounded-xl flex items-center justify-center`}>
          {checked ? (
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          ) : (
            <span className="text-xl">{icon}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="text-teal-600 font-semibold">{time}</div>
    </div>
  );
}

function MedicationCard({ 
  medication, 
  onClick, 
  onToggle
}: { 
  medication: Medication; 
  onClick: () => void;
  onToggle: () => void;
}) {
  return (
    <div 
      className={`bg-white rounded-3xl shadow-lg p-6 ${medication.color} cursor-pointer hover:shadow-xl transition-shadow`}
    >
      <div onClick={onClick}>
        <h3 className="text-xl font-semibold mb-2">{medication.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{medication.dosage}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-gray-500 text-sm">{medication.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <p className="text-gray-500 text-sm">{medication.frequency}</p>
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          medication.taken ? 'bg-green-400' : 'bg-teal-400 hover:bg-teal-500'
        }`}
      >
        <Check className="w-6 h-6 text-white" strokeWidth={3} />
      </button>
    </div>
  );
}

function AlternativeCard({ 
  title, 
  description, 
  icon,
  onClick
}: { 
  title: string; 
  description: string; 
  icon: string;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <span className="text-xl text-teal-600">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SymptomCard({ 
  icon, 
  title, 
  severity, 
  time, 
  bgColor,
  onClick
}: { 
  icon: string; 
  title: string; 
  severity: string; 
  time: string; 
  bgColor: string;
  onClick: () => void;
}) {
  return (
    <div 
      className="bg-white rounded-3xl shadow-lg p-6"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">{severity}</p>
          <p className="text-gray-500 text-sm">{time}</p>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ 
  provider,
  onClick
}: { 
  provider: Provider; 
  onClick: () => void;
}) {
  return (
    <div 
      className="bg-white rounded-3xl shadow-lg p-6"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <img 
            src={provider.image} 
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">{provider.name}</h4>
          <p className="text-teal-600 text-xs truncate">{provider.specialty}</p>
          <p className="text-gray-500 text-sm">{provider.phone}</p>
          <p className="text-gray-500 text-sm">Next Appointment: {provider.nextAppointment}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string;
}) {
  return (
    <div className={`bg-white rounded-3xl shadow-lg p-6 ${color}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MedicationDetailModal({ 
  medication, 
  onClose, 
  onToggle
}: { 
  medication: Medication; 
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Medication Details</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-300 to-blue-400 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-10 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{medication.name}</h3>
              <p className="text-teal-600">{medication.time}</p>
              {medication.taken && <p className="text-green-600 text-sm">✓ Taken</p>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <p className="text-gray-500 text-sm">{medication.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <p className="text-gray-500 text-sm">{medication.frequency}</p>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              medication.taken ? 'bg-green-400' : 'bg-teal-400 hover:bg-teal-500'
            }`}
          >
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProviderDetailModal({ 
  provider, 
  onClose
}: { 
  provider: Provider; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Provider Details</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={provider.image} 
                alt={provider.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{provider.name}</h3>
              <p className="text-teal-600 text-xs truncate">{provider.specialty}</p>
              <p className="text-gray-500 text-sm">{provider.phone}</p>
              <p className="text-gray-500 text-sm">Next Appointment: {provider.nextAppointment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SymptomDetailModal({ 
  symptom, 
  onClose
}: { 
  symptom: Symptom; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Symptom Details</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${symptom.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
              {symptom.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{symptom.title}</h3>
              <p className="text-gray-500 text-sm">{symptom.severity}</p>
              <p className="text-gray-500 text-sm">{symptom.time}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Additional Information:</p>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700">Severity: {symptom.severity}</p>
              <p className="text-sm text-gray-700">Reported: {symptom.time}</p>
              <p className="text-sm text-gray-700 mt-2">
                {symptom.notes || 'No additional notes available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddMedicationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add New Medication</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-300 to-blue-400 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-10 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Medication Name</h3>
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter medication name" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter time" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter frequency" />
            </div>
          </div>
          <button 
            className="w-full py-4 bg-teal-400 text-white rounded-xl font-semibold hover:bg-teal-500 transition-colors"
          >
            Add Medication
          </button>
        </div>
      </div>
    </div>
  );
}

function AddSymptomModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add New Symptom</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
              🤕
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Symptom Name</h3>
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter symptom name" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter time" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <input type="text" className="w-full py-2 px-4 border border-gray-300 rounded-xl" placeholder="Enter severity" />
            </div>
          </div>
          <button 
            className="w-full py-4 bg-teal-400 text-white rounded-xl font-semibold hover:bg-teal-500 transition-colors"
          >
            Add Symptom
          </button>
        </div>
      </div>
    </div>
  );
}

function AlternativeDetailModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Alternative Treatment Details</h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
              🌿
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">Explore vitamin and mineral supplements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}