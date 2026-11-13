import React, { useState } from 'react';
import { useSeva } from '../../context/SevaContext';
import { VolunteerRequirement, Gender, AttendanceStatus } from '../../types';
import {
  LayoutDashboard,
  PlusCircle,
  CalendarCheck2,
  Users,
  CheckSquare,
  History,
  LogOut,
  Clock,
  Calendar,
  MapPin,
  Share2,
  Check,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Trash2,
  X,
  UserCheck,
  User,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';

interface CoordinatorDashboardProps {
  onLogout: () => void;
  onNavigateToPublic: () => void;
}

type TabType =
  | 'overview'
  | 'create'
  | 'manage'
  | 'volunteers'
  | 'attendance'
  | 'history'
  | 'profile';

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  onLogout,
  onNavigateToPublic,
}) => {
  const {
    requirements,
    registrations,
    createRequirement,
    updateRequirementStatus,
    updateRequirementSlots,
    deleteRequirement,
    markAttendance,
    generateWhatsAppAnnouncement,
    currentCoordinator,
    updateCoordinatorProfile,
  } = useSeva();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedReqId, setCopiedReqId] = useState<string | null>(null);

  // Coordinator Profile State & Handlers
  const [profileNameInput, setProfileNameInput] = useState(currentCoordinator?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [profileNotice, setProfileNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfileName = () => {
    if (!profileNameInput.trim()) {
      setProfileNotice({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    updateCoordinatorProfile({ name: profileNameInput.trim() });
    setIsEditingName(false);
    setProfileNotice({ type: 'success', text: 'Coordinator name updated and saved!' });
    setTimeout(() => setProfileNotice(null), 4000);
  };

  const handleSaveNewPin = () => {
    setPinChangeError(null);
    if (!newPinInput.trim()) {
      setPinChangeError('Please enter a new security PIN.');
      return;
    }
    // Strict confirmation match requested by user:
    if (newPinInput.trim() !== confirmNewPinInput.trim()) {
      setPinChangeError('PIN not correct: The re-entered confirmation PIN does not match the Security PIN you set.');
      return;
    }

    updateCoordinatorProfile({ securityPin: newPinInput.trim() });
    setIsChangingPin(false);
    setNewPinInput('');
    setConfirmNewPinInput('');
    setProfileNotice({ type: 'success', text: 'Security PIN updated successfully!' });
    setTimeout(() => setProfileNotice(null), 4000);
  };

  // Form state for Create Requirement
  const [newTitle, setNewTitle] = useState('Daily Lunch Food Distribution');
  const [newDate, setNewDate] = useState('2026-11-16');
  const [newStartTime, setNewStartTime] = useState('11:00 AM');
  const [newEndTime, setNewEndTime] = useState('02:00 PM');
  const [newMaleReq, setNewMaleReq] = useState(3);
  const [newFemaleReq, setNewFemaleReq] = useState(3);
  const [newLocation, setNewLocation] = useState(
    'Kidwai Memorial Institute of Oncology, Gate 2 Seva Counter, Bengaluru'
  );
  const [newInstructions, setNewInstructions] = useState(
    'Report by 10:45 AM. Aprons and hairnets will be provided. Please wear comfortable footwear.'
  );
  const [createSuccessMsg, setCreateSuccessMsg] = useState(false);

  // Filters for Registered Volunteers Table
  const [volunteerDateFilter, setVolunteerDateFilter] = useState('all');
  const [volunteerGenderFilter, setVolunteerGenderFilter] = useState('all');
  const [volunteerSearch, setVolunteerSearch] = useState('');

  // Attendance management filters (default 'all' to show all registered volunteers immediately)
  const [attendanceDate, setAttendanceDate] = useState('all');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<'all' | AttendanceStatus>('all');

  // WhatsApp announcement modal/notification
  const handleCopyWhatsApp = (reqId: string) => {
    const text = generateWhatsAppAnnouncement(reqId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedReqId(reqId);
      setTimeout(() => setCopiedReqId(null), 3000);
    }
  };

  // Stats view scope: 'all' (default) shows overall operational totals, 'today' focuses on today's shift
  const [statsScope, setStatsScope] = useState<'all' | 'today'>('all');
  const todayStr = new Date().toISOString().split('T')[0];

  // Comprehensive KPI calculations across all launched requirements
  const totalVolunteersRequired = requirements.reduce(
    (acc, r) => acc + (Number(r.maleRequired) || 0) + (Number(r.femaleRequired) || 0),
    0
  );
  const totalVolunteersRegistered = registrations.filter(
    (r) => r.attendanceStatus !== 'CANCELLED'
  ).length;
  const totalRemainingPositions = Math.max(
    0,
    totalVolunteersRequired - totalVolunteersRegistered
  );
  const fullyFilledCount = requirements.filter((r) => {
    const reqCount = (Number(r.maleRequired) || 0) + (Number(r.femaleRequired) || 0);
    const regCount = (Number(r.maleRegistered) || 0) + (Number(r.femaleRegistered) || 0);
    return reqCount > 0 && regCount >= reqCount;
  }).length;

  // Today-specific KPIs
  const todayReqs = requirements.filter((r) => r.date === todayStr || r.date === '2026-11-10');
  const totalVolunteersRequiredToday = todayReqs.reduce(
    (acc, r) => acc + (Number(r.maleRequired) || 0) + (Number(r.femaleRequired) || 0),
    0
  );
  const totalVolunteersRegisteredToday = todayReqs.reduce(
    (acc, r) => acc + (Number(r.maleRegistered) || 0) + (Number(r.femaleRegistered) || 0),
    0
  );
  const remainingPositionsToday = Math.max(
    0,
    totalVolunteersRequiredToday - totalVolunteersRegisteredToday
  );
  const fullyFilledCountToday = todayReqs.filter((r) => {
    const reqCount = (Number(r.maleRequired) || 0) + (Number(r.femaleRequired) || 0);
    const regCount = (Number(r.maleRegistered) || 0) + (Number(r.femaleRegistered) || 0);
    return reqCount > 0 && regCount >= reqCount;
  }).length;

  const highlightReq = todayReqs[0] || requirements[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequirement({
      title: newTitle,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      maleRequired: Number(newMaleReq),
      femaleRequired: Number(newFemaleReq),
      location: newLocation,
      instructions: newInstructions,
    });
    setCreateSuccessMsg(true);
    setTimeout(() => {
      setCreateSuccessMsg(false);
      setActiveTab('manage');
    }, 1500);
  };

  // Filtered registrations for the Volunteer Tracking table
  const filteredRegistrations = registrations.filter((reg) => {
    if (volunteerDateFilter !== 'all' && reg.requirementDate !== volunteerDateFilter) return false;
    if (volunteerGenderFilter !== 'all' && reg.gender !== volunteerGenderFilter) return false;
    if (volunteerSearch.trim()) {
      const q = volunteerSearch.toLowerCase();
      const matchName = reg.fullName.toLowerCase().includes(q);
      const matchPhone = reg.mobile.includes(q);
      const matchTitle = reg.requirementTitle.toLowerCase().includes(q);
      return matchName || matchPhone || matchTitle;
    }
    return true;
  });

  // Attendance list for selected attendance date or all active registrations
  const attendanceRegistrations = registrations.filter((reg) => {
    if (reg.attendanceStatus === 'CANCELLED') return false;
    if (attendanceDate !== 'all' && reg.requirementDate !== attendanceDate) return false;
    if (attendanceStatusFilter !== 'all' && reg.attendanceStatus !== attendanceStatusFilter) return false;
    if (attendanceSearch.trim()) {
      const q = attendanceSearch.toLowerCase();
      const matchName = reg.fullName.toLowerCase().includes(q);
      const matchPhone = reg.mobile.includes(q);
      const matchTitle = reg.requirementTitle.toLowerCase().includes(q);
      return matchName || matchPhone || matchTitle;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#45382F] text-white p-5 flex flex-col justify-between shrink-0 border-r border-[#C49A45]/20">
        <div>
          {/* Brand & Portal Label */}
          <div className="pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
              <span>Operations Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_81b81f34.png"
                alt="NNS Emblem"
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-[#C49A45]/40 shrink-0 shadow-xs"
              />
              <div>
                <h2 className="font-serif text-base font-bold text-white leading-tight">NNS Coordinator Hub</h2>
                <p className="text-[11px] text-white/60">Kidwai Memorial Institute Seva</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Requirement</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Manage Requirements</span>
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'volunteers'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Volunteers</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Attendance Management</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Volunteer History</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#C49A45] text-white shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Coordinator Profile</span>
            </button>
          </nav>
        </div>

        {/* Logged in Coordinator Chip */}
        <div className="pt-3 pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#C49A45] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentCoordinator?.name ? currentCoordinator.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate group-hover:text-[#C49A45] transition-colors">
                {currentCoordinator?.name || 'Coordinator'}
              </p>
              <p className="text-[10px] text-white/60 truncate">
                {currentCoordinator?.phone || 'Verified Lead'}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateToPublic}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <span>Public Website</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Coordinator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                  Coordinator Overview
                </h1>
                <p className="text-xs sm:text-sm text-[#45382F]/70">
                  Daily volunteer fulfillment for Kidwai Memorial Institute of Oncology.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish New Requirement</span>
                </button>
              </div>
            </div>

            {/* Top Stat Cards as requested */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
                  Key Seva Operations Metrics
                </span>
                <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#45382F]/10 text-xs shadow-xs">
                  <button
                    onClick={() => setStatsScope('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      statsScope === 'all'
                        ? 'bg-[#C49A45] text-white shadow-xs'
                        : 'text-[#45382F]/70 hover:text-[#45382F]'
                    }`}
                  >
                    All Scheduled Events ({requirements.length})
                  </button>
                  <button
                    onClick={() => setStatsScope('today')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      statsScope === 'today'
                        ? 'bg-[#C49A45] text-white shadow-xs'
                        : 'text-[#45382F]/70 hover:text-[#45382F]'
                    }`}
                  >
                    Today Only ({todayReqs.length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#45382F]/10 shadow-xs hover:border-[#C49A45]/30 transition-colors">
                  <div className="text-xs font-medium text-[#45382F]/70">
                    {statsScope === 'all' ? 'Total Required' : 'Required Today'}
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#45382F] tabular-nums mt-2">
                    {statsScope === 'all' ? totalVolunteersRequired : totalVolunteersRequiredToday}
                  </div>
                  <div className="text-[11px] text-[#45382F]/60 mt-1">
                    {statsScope === 'all'
                      ? `Across ${requirements.length} scheduled event${requirements.length === 1 ? '' : 's'}`
                      : `${todayReqs.length} shift${todayReqs.length === 1 ? '' : 's'} scheduled today`}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#45382F]/10 shadow-xs hover:border-[#819B82]/30 transition-colors">
                  <div className="text-xs font-medium text-[#45382F]/70">
                    {statsScope === 'all' ? 'Registered Volunteers' : 'Registered Today'}
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#819B82] tabular-nums mt-2">
                    {statsScope === 'all' ? totalVolunteersRegistered : totalVolunteersRegisteredToday}
                  </div>
                  <div className="text-[11px] text-[#819B82] font-semibold mt-1">
                    Confirmed volunteers
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#45382F]/10 shadow-xs hover:border-[#C49A45]/30 transition-colors">
                  <div className="text-xs font-medium text-[#45382F]/70">
                    {statsScope === 'all' ? 'Remaining Positions' : 'Remaining Today'}
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#C49A45] tabular-nums mt-2">
                    {statsScope === 'all' ? totalRemainingPositions : remainingPositionsToday}
                  </div>
                  <div className="text-[11px] text-[#C49A45] font-semibold mt-1">
                    {(statsScope === 'all' ? totalRemainingPositions : remainingPositionsToday) === 0 &&
                    (statsScope === 'all' ? requirements.length : todayReqs.length) > 0
                      ? 'Full capacity!'
                      : 'Positions still open'}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#45382F]/10 shadow-xs hover:border-[#45382F]/20 transition-colors">
                  <div className="text-xs font-medium text-[#45382F]/70">
                    {statsScope === 'all' ? 'Fully Filled Events' : 'Filled Today'}
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#45382F] tabular-nums mt-2">
                    {statsScope === 'all' ? fullyFilledCount : fullyFilledCountToday}
                  </div>
                  <div className="text-[11px] text-[#45382F]/60 mt-1">
                    {statsScope === 'all'
                      ? `of ${requirements.length} total event${requirements.length === 1 ? '' : 's'}`
                      : `of ${todayReqs.length} shift${todayReqs.length === 1 ? '' : 's'} today`}
                  </div>
                </div>
              </div>
            </div>

            {/* Next or Live Upcoming Requirement Highlight */}
            {highlightReq && (
              <div className="bg-[#F5EEDC] rounded-3xl p-6 sm:p-8 border border-[#C49A45]/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
                      {highlightReq.date === todayStr
                        ? "Today's Live Food Seva (Kidwai Gate 2)"
                        : `Next Scheduled Food Seva (${highlightReq.date})`}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#45382F]">
                      {highlightReq.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteRequirement(highlightReq.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
                    title="Delete this requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Event</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white p-4 rounded-2xl border border-[#45382F]/10 mb-4">
                  <div>
                    <span className="text-[#45382F]/70 block">Male Volunteers:</span>
                    <span className="font-bold text-sm text-[#45382F] tabular-nums">
                      {highlightReq.maleRegistered} / {highlightReq.maleRequired} filled
                    </span>
                  </div>
                  <div>
                    <span className="text-[#45382F]/70 block">Female Volunteers:</span>
                    <span className="font-bold text-sm text-[#45382F] tabular-nums">
                      {highlightReq.femaleRegistered} / {highlightReq.femaleRequired} filled
                    </span>
                  </div>
                  <div>
                    <span className="text-[#45382F]/70 block">Total Remaining:</span>
                    <span className="font-bold text-sm text-[#C49A45] tabular-nums">
                      {Math.max(
                        0,
                        highlightReq.maleRequired +
                          highlightReq.femaleRequired -
                          (highlightReq.maleRegistered + highlightReq.femaleRegistered)
                      )}{' '}
                      positions open
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#45382F]/75">
                  Pro-tip: Once volunteer requirements are launched, volunteer sign-ups, male/female balances, and remaining positions update dynamically in real time.
                </p>
              </div>
            )}

            {/* Upcoming Service Opportunities Timeline */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#45382F]">
                Upcoming Daily Schedule & Capacity
              </h2>
              <div className="bg-white rounded-3xl border border-[#45382F]/10 overflow-hidden divide-y divide-[#45382F]/10">
                {requirements.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#45382F]/70">
                    No volunteer requirements launched yet. Click "Publish New Requirement" above to launch an event.
                  </div>
                ) : (
                  requirements.map((req) => {
                  const total = req.maleRequired + req.femaleRequired;
                  const reg = req.maleRegistered + req.femaleRegistered;
                  const rem = Math.max(0, total - reg);
                  const isFull = rem === 0;

                  return (
                    <div
                      key={req.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFFDF7]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#C49A45]">
                            {req.date}
                          </span>
                          <span className="text-xs text-[#45382F]/60">·</span>
                          <span className="text-xs text-[#45382F]/70">
                            {req.startTime} – {req.endTime}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-[#45382F]">{req.title}</h4>
                        <div className="text-xs text-[#45382F]/60 flex items-center gap-3">
                          <span>
                            Male: {req.maleRegistered}/{req.maleRequired}
                          </span>
                          <span>·</span>
                          <span>
                            Female: {req.femaleRegistered}/{req.femaleRequired}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isFull
                              ? 'bg-neutral-100 text-neutral-600'
                              : rem < 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#819B82]/20 text-[#819B82]'
                          }`}
                        >
                          {isFull ? 'Fulfilled' : `${rem} Open Slots`}
                        </span>

                        <button
                          onClick={() => deleteRequirement(req.id)}
                          title="Delete this event"
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE REQUIREMENT */}
        {activeTab === 'create' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-md space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] block mb-1">
                New Opportunity
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                Create Volunteer Requirement
              </h1>
              <p className="text-xs text-[#45382F]/75 mt-1">
                Published opportunities immediately appear on the public volunteer dashboard.
              </p>
            </div>

            {createSuccessMsg && (
              <div className="p-4 rounded-2xl bg-[#819B82]/20 border border-[#819B82] text-[#45382F] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#819B82]" />
                <span>Requirement published successfully! Redirecting to Manage view...</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Service Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                    Starting Time
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                    Ending Time
                  </label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
              </div>

              {/* Volunteer Quotas with automatic calculation */}
              <div className="bg-[#F5EEDC] p-4 rounded-2xl border border-[#C49A45]/30 space-y-3">
                <span className="text-xs font-bold text-[#45382F] block">
                  Volunteer Capacity & Category Quotas
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#45382F]/80 mb-1">
                      Male Volunteers Required
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={newMaleReq}
                      onChange={(e) => setNewMaleReq(Number(e.target.value))}
                      required
                      className="w-full px-4 py-2 rounded-xl bg-white border border-[#45382F]/20 text-xs font-bold text-[#45382F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#45382F]/80 mb-1">
                      Female Volunteers Required
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={newFemaleReq}
                      onChange={(e) => setNewFemaleReq(Number(e.target.value))}
                      required
                      className="w-full px-4 py-2 rounded-xl bg-white border border-[#45382F]/20 text-xs font-bold text-[#45382F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#45382F]/15 font-semibold text-[#45382F]">
                  <span>Total Calculated Requirement:</span>
                  <span className="font-serif text-base text-[#C49A45] font-bold tabular-nums">
                    {Number(newMaleReq) + Number(newFemaleReq)} Volunteers
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Additional Instructions
                </label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#45382F]/20 text-xs text-[#45382F]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-98"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MANAGE REQUIREMENTS */}
        {activeTab === 'manage' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                  Manage Service Requirements
                </h1>
                <p className="text-xs text-[#45382F]/70">
                  Track live slot quotas, close registrations, or modify volunteer positions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-[#C49A45] text-white text-xs font-semibold rounded-xl"
              >
                + New Requirement
              </button>
            </div>

            <div className="space-y-4">
              {requirements.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-[#45382F]/10 text-center text-xs text-[#45382F]/70 space-y-3">
                  <p className="font-serif text-lg font-bold text-[#45382F]">No volunteer requirements created yet</p>
                  <p className="max-w-md mx-auto text-[#45382F]/70">
                    Click the button below to publish a requirement with volunteer quotas for Kidwai Hospital.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-5 py-2.5 bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    + Launch Your First Requirement
                  </button>
                </div>
              ) : (
                requirements.map((req) => {
                  const totalReq = req.maleRequired + req.femaleRequired;
                const totalReg = req.maleRegistered + req.femaleRegistered;
                const remaining = Math.max(0, totalReq - totalReg);
                const isFull = remaining === 0 || req.status === 'CLOSED';

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-[#45382F]/10 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#45382F]/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#C49A45]">
                            {req.date}
                          </span>
                          <span className="text-xs text-[#45382F]/60">·</span>
                          <span className="text-xs text-[#45382F]/80">
                            {req.startTime} – {req.endTime}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#45382F]">{req.title}</h3>
                        <p className="text-xs text-[#45382F]/70">{req.location}</p>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isFull ? (
                          <button
                            onClick={() => updateRequirementStatus(req.id, 'OPEN')}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          >
                            Re-Open
                          </button>
                        ) : (
                          <button
                            onClick={() => updateRequirementStatus(req.id, 'CLOSED')}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                          >
                            Close Registration
                          </button>
                        )}

                        <button
                          onClick={() => deleteRequirement(req.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-xs"
                          title="Delete requirement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Tracking Box matching user instructions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FFFDF7] p-4 rounded-2xl border border-[#45382F]/10 text-xs">
                      <div>
                        <span className="text-[#45382F]/60 block">Total Required:</span>
                        <span className="font-bold text-base text-[#45382F] tabular-nums">
                          {totalReq}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#45382F]/60 block">Registered:</span>
                        <span className="font-bold text-base text-[#819B82] tabular-nums">
                          {totalReg}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#45382F]/60 block">Remaining:</span>
                        <span className="font-bold text-base text-[#C49A45] tabular-nums">
                          {remaining}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#45382F]/60 block">Status:</span>
                        <span className="font-semibold text-xs text-[#45382F]">{req.status}</span>
                      </div>
                    </div>

                    {/* Male and Female Separated Progress Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#45382F]/80">Male Volunteers</span>
                          <span className="font-bold tabular-nums">
                            {req.maleRegistered} / {req.maleRequired} filled
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className="h-full bg-[#C49A45] rounded-full transition-all"
                            style={{
                              width: `${
                                req.maleRequired > 0
                                  ? (req.maleRegistered / req.maleRequired) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#45382F]/80">Female Volunteers</span>
                          <span className="font-bold tabular-nums">
                            {req.femaleRegistered} / {req.femaleRequired} filled
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className="h-full bg-[#819B82] rounded-full transition-all"
                            style={{
                              width: `${
                                req.femaleRequired > 0
                                  ? (req.femaleRegistered / req.femaleRequired) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED VOLUNTEERS (VOLUNTEER TRACKING TABLE) */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                Volunteer Tracking & Roster
              </h1>
              <p className="text-xs text-[#45382F]/70">
                All registered community volunteers and contact details for Kidwai Seva.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl border border-[#45382F]/10">
              {/* Date Filter */}
              <div className="sm:w-56">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Filter by Date
                </label>
                <select
                  value={volunteerDateFilter}
                  onChange={(e) => setVolunteerDateFilter(e.target.value)}
                  className="w-full p-2 bg-[#FFFDF7] rounded-xl border border-[#45382F]/20 text-xs text-[#45382F]"
                >
                  <option value="all">All Dates ({registrations.length})</option>
                  {requirements.map((r) => (
                    <option key={r.id} value={r.date}>
                      {r.date} — {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="sm:w-40">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Filter by Gender
                </label>
                <select
                  value={volunteerGenderFilter}
                  onChange={(e) => setVolunteerGenderFilter(e.target.value)}
                  className="w-full p-2 bg-[#FFFDF7] rounded-xl border border-[#45382F]/20 text-xs text-[#45382F]"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Search Volunteer Name or Mobile
                </label>
                <input
                  type="text"
                  placeholder="Type name or phone number..."
                  value={volunteerSearch}
                  onChange={(e) => setVolunteerSearch(e.target.value)}
                  className="w-full p-2 bg-[#FFFDF7] rounded-xl border border-[#45382F]/20 text-xs text-[#45382F]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-[#45382F]/10 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#45382F]">
                  <thead className="bg-[#F5EEDC] text-[#45382F] font-bold border-b border-[#45382F]/10">
                    <tr>
                      <th className="py-3 px-4">Volunteer Name</th>
                      <th className="py-3 px-4">Mobile Phone</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">Service Date</th>
                      <th className="py-3 px-4">Attendance Status</th>
                      <th className="py-3 px-4 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#45382F]/10">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#45382F]/60">
                          No registered volunteers found matching these filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FFFDF7] transition-colors">
                          <td className="py-3.5 px-4 font-semibold">{reg.fullName}</td>
                          <td className="py-3.5 px-4 font-mono">{reg.mobile}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                reg.gender === 'Male'
                                  ? 'bg-[#C49A45]/15 text-[#45382F]'
                                  : 'bg-[#819B82]/20 text-[#45382F]'
                              }`}
                            >
                              {reg.gender}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium">{reg.requirementDate}</div>
                            <div className="text-[10px] text-[#45382F]/60">{reg.serviceTimings}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={reg.attendanceStatus}
                              onChange={(e) => markAttendance(reg.id, e.target.value as AttendanceStatus)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-hidden ${
                                reg.attendanceStatus === 'PRESENT'
                                  ? 'bg-[#819B82] text-white border-[#819B82]'
                                  : reg.attendanceStatus === 'ABSENT'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : reg.attendanceStatus === 'CANCELLED'
                                  ? 'bg-neutral-200 text-neutral-600 border-neutral-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              <option value="PENDING" className="bg-white text-[#45382F]">PENDING</option>
                              <option value="PRESENT" className="bg-white text-[#45382F]">✓ PRESENT</option>
                              <option value="ABSENT" className="bg-white text-[#45382F]">✗ ABSENT</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <a
                              href={`https://wa.me/91${reg.mobile}?text=Namaskara%20${encodeURIComponent(
                                reg.fullName
                              )},%20confirming%20your%20NNS%20seva%20at%20Kidwai%20Hospital.`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-[#819B82]/15 text-[#819B82] hover:bg-[#819B82] hover:text-white transition-colors font-medium text-[11px]"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`tel:${reg.mobile}`}
                              className="px-2.5 py-1 rounded-lg bg-[#F5EEDC] text-[#45382F] hover:bg-[#EBE2CC] transition-colors font-medium text-[11px]"
                            >
                              Call
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE MANAGEMENT */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                  Attendance Management
                </h1>
                <p className="text-xs text-[#45382F]/70">
                  Mark volunteer presence at Kidwai Gate 2 Seva Station in real time.
                </p>
              </div>

              {attendanceRegistrations.some((r) => r.attendanceStatus === 'PENDING') && (
                <button
                  onClick={() => {
                    attendanceRegistrations.forEach((r) => {
                      if (r.attendanceStatus === 'PENDING') {
                        markAttendance(r.id, 'PRESENT');
                      }
                    });
                  }}
                  className="px-4 py-2 bg-[#819B82] hover:bg-[#688269] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All Pending as Present</span>
                </button>
              )}
            </div>

            {/* Attendance Filter Controls */}
            <div className="bg-white p-4 rounded-3xl border border-[#45382F]/10 flex flex-col md:flex-row gap-3 shadow-xs">
              {/* Date / Requirement Selector */}
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Filter by Requirement / Service Date
                </label>
                <div className="flex items-center gap-2 bg-[#FFFDF7] px-3 py-2 rounded-xl border border-[#45382F]/20">
                  <Calendar className="w-4 h-4 text-[#C49A45] shrink-0" />
                  <select
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full text-xs font-semibold text-[#45382F] bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">
                      All Service Dates ({registrations.filter((r) => r.attendanceStatus !== 'CANCELLED').length} Total Registered)
                    </option>
                    {requirements.map((r) => {
                      const count = registrations.filter(
                        (reg) => reg.requirementId === r.id && reg.attendanceStatus !== 'CANCELLED'
                      ).length;
                      return (
                        <option key={r.id} value={r.date}>
                          {r.date} — {r.title} ({count} registered)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Filter Status
                </label>
                <select
                  value={attendanceStatusFilter}
                  onChange={(e) => setAttendanceStatusFilter(e.target.value as any)}
                  className="w-full p-2 bg-[#FFFDF7] rounded-xl border border-[#45382F]/20 text-xs font-semibold text-[#45382F]"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending Check-in</option>
                  <option value="PRESENT">Marked Present</option>
                  <option value="ABSENT">Marked Absent</option>
                </select>
              </div>

              {/* Search Volunteer */}
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#45382F]/60 mb-1">
                  Search Name or Mobile
                </label>
                <div className="flex items-center gap-2 bg-[#FFFDF7] px-3 py-2 rounded-xl border border-[#45382F]/20">
                  <Search className="w-4 h-4 text-[#45382F]/50 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search volunteer name or phone..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    className="w-full text-xs text-[#45382F] bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Attendance Tally Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 text-center shadow-xs">
                <span className="text-[11px] text-[#45382F]/60 uppercase tracking-wider block">
                  Total in View
                </span>
                <span className="font-serif text-2xl font-bold text-[#45382F] tabular-nums">
                  {attendanceRegistrations.length}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 text-center shadow-xs">
                <span className="text-[11px] text-[#819B82] uppercase tracking-wider block font-semibold">
                  Present
                </span>
                <span className="font-serif text-2xl font-bold text-[#819B82] tabular-nums">
                  {attendanceRegistrations.filter((r) => r.attendanceStatus === 'PRESENT').length}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 text-center shadow-xs">
                <span className="text-[11px] text-amber-700 uppercase tracking-wider block font-semibold">
                  Pending
                </span>
                <span className="font-serif text-2xl font-bold text-amber-600 tabular-nums">
                  {attendanceRegistrations.filter((r) => r.attendanceStatus === 'PENDING').length}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 text-center shadow-xs">
                <span className="text-[11px] text-rose-700 uppercase tracking-wider block font-semibold">
                  Absent
                </span>
                <span className="font-serif text-2xl font-bold text-rose-600 tabular-nums">
                  {attendanceRegistrations.filter((r) => r.attendanceStatus === 'ABSENT').length}
                </span>
              </div>
            </div>

            {/* Attendance Registration Cards */}
            <div className="space-y-3">
              {registrations.filter((r) => r.attendanceStatus !== 'CANCELLED').length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-[#45382F]/10 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#C49A45]/15 text-[#C49A45] flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-[#45382F]">
                      No Registered Volunteers Yet
                    </h3>
                    <p className="text-xs text-[#45382F]/70 max-w-md mx-auto">
                      Once volunteers sign up for any published Seva date, their contact details and shift will automatically appear here for real-time check-in (Present / Absent / Pending).
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-2 bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Publish Volunteer Requirement
                    </button>
                    <button
                      onClick={onNavigateToPublic}
                      className="px-4 py-2 bg-[#F5EEDC] text-[#45382F] hover:bg-[#EBE2CC] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      View Public Portal
                    </button>
                  </div>
                </div>
              ) : attendanceRegistrations.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-[#45382F]/10 text-center space-y-3 shadow-xs">
                  <p className="text-xs text-[#45382F]/70">
                    No active volunteer registrations match your current filter.
                  </p>
                  <button
                    onClick={() => {
                      setAttendanceDate('all');
                      setAttendanceStatusFilter('all');
                      setAttendanceSearch('');
                    }}
                    className="px-4 py-2 bg-[#45382F] text-white text-xs font-semibold rounded-xl hover:bg-[#2D241E] transition-colors cursor-pointer"
                  >
                    Reset Filters & Show All Registered Volunteers
                  </button>
                </div>
              ) : (
                attendanceRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#45382F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#C49A45]/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-[#45382F]">{reg.fullName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            reg.gender === 'Male'
                              ? 'bg-[#C49A45]/15 text-[#45382F]'
                              : 'bg-[#819B82]/20 text-[#45382F]'
                          }`}
                        >
                          {reg.gender}
                        </span>
                        <a
                          href={`tel:${reg.mobile}`}
                          className="text-xs font-mono text-[#45382F] hover:text-[#C49A45] bg-[#F5EEDC] px-2 py-0.5 rounded-md transition-colors"
                          title="Call volunteer"
                        >
                          +91 {reg.mobile}
                        </a>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            reg.attendanceStatus === 'PRESENT'
                              ? 'bg-[#819B82] text-white'
                              : reg.attendanceStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {reg.attendanceStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#45382F]/70 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#C49A45]">{reg.requirementDate}</span>
                        <span>·</span>
                        <span>{reg.requirementTitle}</span>
                        <span>·</span>
                        <span className="text-[#45382F]/60">{reg.serviceTimings}</span>
                      </div>
                    </div>

                    {/* Interactive 3-way attendance status toggles */}
                    <div className="flex items-center gap-2 p-1.5 bg-[#F5EEDC] rounded-2xl self-start sm:self-center shrink-0">
                      <button
                        onClick={() => markAttendance(reg.id, 'PRESENT')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                          reg.attendanceStatus === 'PRESENT'
                            ? 'bg-[#819B82] text-white shadow-xs ring-2 ring-[#819B82]/40'
                            : 'text-[#45382F]/70 hover:text-[#45382F] hover:bg-white/60'
                        }`}
                        title="Mark as Present"
                      >
                        <Check className="w-4 h-4" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => markAttendance(reg.id, 'ABSENT')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                          reg.attendanceStatus === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/40'
                            : 'text-[#45382F]/70 hover:text-[#45382F] hover:bg-white/60'
                        }`}
                        title="Mark as Absent"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={() => markAttendance(reg.id, 'PENDING')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                          reg.attendanceStatus === 'PENDING'
                            ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-500/40'
                            : 'text-[#45382F]/70 hover:text-[#45382F] hover:bg-white/60'
                        }`}
                        title="Set to Pending"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: VOLUNTEER HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                Volunteer Service History & Statistics
              </h1>
              <p className="text-xs text-[#45382F]/70">
                Archival data of volunteer participation and Kidwai food seva milestones.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#45382F]/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#45382F]">Cumulative Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block">Total Registrations</span>
                  <span className="font-serif text-2xl font-bold text-[#45382F] tabular-nums">
                    {registrations.length}
                  </span>
                </div>
                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block">Verified Present</span>
                  <span className="font-serif text-2xl font-bold text-[#819B82] tabular-nums">
                    {registrations.filter((r) => r.attendanceStatus === 'PRESENT').length}
                  </span>
                </div>
                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block">Total Requirements</span>
                  <span className="font-serif text-2xl font-bold text-[#C49A45] tabular-nums">
                    {requirements.length}
                  </span>
                </div>
                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block">Seva Station</span>
                  <span className="font-bold text-[#45382F] mt-1 block">Kidwai Bengaluru</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COORDINATOR PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-4xl">
            {/* Page Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
                <span>Authorized Management Profile</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                Coordinator Profile & Credentials
              </h1>
              <p className="text-xs sm:text-sm text-[#45382F]/70 mt-1">
                Your official administrative profile for Nitya Narayana Seva at Kidwai Memorial Institute of Oncology, Bengaluru.
              </p>
            </div>

            {/* Notification Banner */}
            {profileNotice && (
              <div
                className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between gap-3 animate-fadeIn ${
                  profileNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {profileNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{profileNotice.text}</span>
                </div>
                <button
                  onClick={() => setProfileNotice(null)}
                  className="p-1 hover:bg-black/5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Profile Header Card */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#45382F]/15 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#45382F]/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C49A45] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shrink-0 shadow-md border-2 border-white ring-2 ring-[#C49A45]/30">
                    {currentCoordinator?.name ? currentCoordinator.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45382F]">
                        {currentCoordinator?.name || 'Authorized Coordinator'}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#45382F]/70 font-medium mt-0.5">
                      {currentCoordinator?.role || 'Operations Coordinator'} • Nitya Narayana Seva
                    </p>
                    <p className="text-xs text-[#C49A45] flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Kidwai Memorial Institute of Oncology, Bengaluru</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditingName ? (
                    <button
                      onClick={() => {
                        setProfileNameInput(currentCoordinator?.name || '');
                        setIsEditingName(true);
                      }}
                      className="px-4 py-2 bg-[#F5EEDC] hover:bg-[#EBE2CC] text-[#45382F] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Name</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profileNameInput}
                        onChange={(e) => setProfileNameInput(e.target.value)}
                        placeholder="Coordinator Full Name"
                        className="px-3 py-1.5 rounded-xl border border-[#C49A45] text-xs bg-white text-[#45382F] focus:outline-hidden"
                      />
                      <button
                        onClick={handleSaveProfileName}
                        className="p-2 bg-[#C49A45] hover:bg-[#A57F32] text-white rounded-xl cursor-pointer"
                        title="Save name"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-2 bg-[#45382F]/10 hover:bg-[#45382F]/20 text-[#45382F] rounded-xl cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Mobile Phone */}
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/10 space-y-1">
                  <div className="flex items-center justify-between text-[#45382F]/60">
                    <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
                      <span>Mobile Number</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Primary Contact
                    </span>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#45382F] pt-1">
                    {currentCoordinator?.phone ? `+91 ${currentCoordinator.phone}` : 'Not provided'}
                  </p>
                  <p className="text-[11px] text-[#45382F]/60">Used for coordinator login & WhatsApp alerts</p>
                </div>

                {/* Security PIN Display */}
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/10 space-y-1">
                  <div className="flex items-center justify-between text-[#45382F]/60">
                    <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#C49A45]" />
                      <span>Security PIN</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="text-[#C49A45] hover:text-[#A57F32] flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                    >
                      {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showCurrentPin ? 'Hide PIN' : 'View PIN'}</span>
                    </button>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#45382F] tracking-widest pt-1">
                    {showCurrentPin
                      ? currentCoordinator?.securityPin || '1008'
                      : '••••••••'}
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsChangingPin(!isChangingPin);
                        setPinChangeError(null);
                      }}
                      className="text-[11px] font-semibold text-[#C49A45] hover:underline cursor-pointer"
                    >
                      {isChangingPin ? 'Cancel PIN Change' : 'Change Security PIN'}
                    </button>
                  </div>
                </div>

                {/* Service Center */}
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/10 space-y-1">
                  <span className="text-[#45382F]/60 font-semibold uppercase tracking-wider text-[11px] block">
                    Service Center Location
                  </span>
                  <p className="font-semibold text-xs text-[#45382F] pt-0.5">
                    {currentCoordinator?.location || 'Kidwai Memorial Institute of Oncology, Bengaluru'}
                  </p>
                  <p className="text-[11px] text-[#45382F]/60">Gate 2 Operations Desk • Daily ~800 People Served</p>
                </div>

                {/* Coordinator Account Record */}
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/10 space-y-1">
                  <div className="flex items-center justify-between text-[#45382F]/60">
                    <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                      <span>Coordinator Session</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Verified Lead
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#45382F] break-all pt-0.5">
                    ID: {currentCoordinator?.id || 'coord-local'}
                  </p>
                  <p className="text-[10px] text-[#45382F]/60">
                    Last Logged In: {currentCoordinator?.lastLoginAt ? new Date(currentCoordinator.lastLoginAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              {/* Change Security PIN Sub-form (with mandatory confirmation validation) */}
              {isChangingPin && (
                <div className="p-5 rounded-2xl bg-[#F5EEDC] border border-[#C49A45]/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#45382F] flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-[#C49A45]" />
                        <span>Update Security PIN</span>
                      </h3>
                      <p className="text-[11px] text-[#45382F]/75 mt-0.5">
                        Enter your new PIN and re-enter it to confirm. Both entries must match.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsChangingPin(false)}
                      className="p-1 hover:bg-black/5 rounded-lg text-[#45382F]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {pinChangeError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{pinChangeError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#45382F] mb-1">
                        New Security PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPin ? 'text' : 'password'}
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value)}
                          placeholder="e.g. 4-digit PIN"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="absolute right-3 top-2.5 text-[#45382F]/40 hover:text-[#45382F]"
                        >
                          {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#45382F] mb-1">
                        Confirm New PIN (Re-enter)
                      </label>
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={confirmNewPinInput}
                        onChange={(e) => setConfirmNewPinInput(e.target.value)}
                        placeholder="Re-enter to confirm"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] ${
                          confirmNewPinInput && newPinInput && confirmNewPinInput !== newPinInput
                            ? 'border-rose-400 bg-rose-50/20'
                            : confirmNewPinInput && newPinInput && confirmNewPinInput === newPinInput
                            ? 'border-emerald-500 bg-emerald-50/20'
                            : 'border-[#45382F]/20'
                        }`}
                      />
                    </div>
                  </div>

                  {confirmNewPinInput && newPinInput && (
                    <div className="text-[11px] font-medium">
                      {confirmNewPinInput === newPinInput ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Both PIN entries match!
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> PINs do not match
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveNewPin}
                      className="px-4 py-2 bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Save & Confirm PIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="px-4 py-2 bg-white hover:bg-[#FFFDF7] text-[#45382F] text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-[#45382F]/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Coordinator Operational Statistics */}
            <div className="p-6 bg-white rounded-3xl border border-[#45382F]/15 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#45382F] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C49A45]" />
                <span>Seva Operations Activity Summary</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block font-medium">Requirements Launched</span>
                  <span className="font-serif text-2xl font-bold text-[#C49A45] tabular-nums">
                    {requirements.length}
                  </span>
                  <span className="text-[10px] text-[#45382F]/50 block mt-0.5">Active food distribution shifts</span>
                </div>

                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block font-medium">Total Volunteers Managed</span>
                  <span className="font-serif text-2xl font-bold text-[#819B82] tabular-nums">
                    {registrations.length}
                  </span>
                  <span className="text-[10px] text-[#45382F]/50 block mt-0.5">Registered community volunteers</span>
                </div>

                <div className="p-4 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10">
                  <span className="text-[#45382F]/60 block font-medium">Daily Beneficiaries</span>
                  <span className="font-serif text-2xl font-bold text-[#45382F] tabular-nums">
                    800+
                  </span>
                  <span className="text-[10px] text-[#45382F]/50 block mt-0.5">Patients & families served daily</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
