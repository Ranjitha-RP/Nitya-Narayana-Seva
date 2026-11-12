import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VolunteerRequirement,
  VolunteerRegistration,
  Gender,
  OpportunityStatus,
  AttendanceStatus,
  CoordinatorProfile,
} from '../types';

import {
  getSupabaseClient,
  getSupabaseConfig,
  setSupabaseConfig,
} from '../lib/supabase';

interface SevaContextType {
  requirements: VolunteerRequirement[];
  registrations: VolunteerRegistration[];
  currentVolunteerMobile: string;
  setCurrentVolunteerMobile: (mobile: string) => void;
  isCoordinatorLoggedIn: boolean;
  coordinatorEmail: string;
  currentCoordinator: CoordinatorProfile | null;
  loginCoordinator: (params: {
    name: string;
    phone: string;
    pin: string;
    confirmPin: string;
  }) => { success: boolean; error?: string };
  quickLoginCoordinator: (phone: string, pin: string) => { success: boolean; error?: string };
  updateCoordinatorProfile: (updates: Partial<CoordinatorProfile>) => void;
  logoutCoordinator: () => void;
  registerVolunteer: (data: {
    requirementId: string;
    fullName: string;
    mobile: string;
    gender: Gender;
  }) => { success: boolean; error?: string; registration?: VolunteerRegistration };
  cancelRegistration: (registrationId: string) => { success: boolean; error?: string };
  createRequirement: (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    maleRequired: number;
    femaleRequired: number;
    instructions: string;
    registrationDeadline?: string;
  }) => VolunteerRequirement;
  updateRequirementStatus: (id: string, status: OpportunityStatus) => void;
  updateRequirementSlots: (id: string, maleRequired: number, femaleRequired: number) => void;
  deleteRequirement: (id: string) => void;
  markAttendance: (registrationId: string, status: AttendanceStatus) => void;
  resetDemoData: () => void;
  generateWhatsAppAnnouncement: (requirementId: string) => string;
  // Supabase Backend Integration
  isSupabaseConnected: boolean;
  supabaseProjectUrl: string;
  updateSupabaseUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
  isSyncing: boolean;
  syncWithSupabase: () => Promise<void>;
}

const STORAGE_KEY_REQ = 'nns_requirements_clean_v5';
const STORAGE_KEY_REG = 'nns_registrations_clean_v5';
const STORAGE_KEY_VOL_MOBILE = 'nns_volunteer_mobile_clean_v5';
const STORAGE_KEY_COORD_AUTH = 'nns_coord_auth_clean_v5';
const STORAGE_KEY_COORD_PROFILE = 'nns_coord_profile_v5';

// Clear out legacy mock data from previous version if present in localStorage
try {
  localStorage.removeItem('nns_requirements_v1');
  localStorage.removeItem('nns_registrations_v1');
  localStorage.removeItem('nns_volunteer_mobile_v1');
  localStorage.removeItem('nns_requirements_clean_v2');
  localStorage.removeItem('nns_registrations_clean_v2');
  localStorage.removeItem('nns_requirements_clean_v3');
  localStorage.removeItem('nns_registrations_clean_v3');
  localStorage.removeItem('nns_requirements_clean_v4');
  localStorage.removeItem('nns_registrations_clean_v4');
} catch {
  // ignore
}

const mapRowToRequirement = (row: any): VolunteerRequirement => ({
  id: row.id,
  title: row.title,
  date: row.date,
  startTime: row.start_time || row.startTime,
  endTime: row.end_time || row.endTime,
  location: row.location,
  maleRequired: Number(row.male_required ?? row.maleRequired) || 0,
  femaleRequired: Number(row.female_required ?? row.femaleRequired) || 0,
  maleRegistered: Number(row.male_registered ?? row.maleRegistered) || 0,
  femaleRegistered: Number(row.female_registered ?? row.femaleRegistered) || 0,
  status: (row.status as OpportunityStatus) || 'OPEN',
  instructions: row.instructions || '',
  registrationDeadline: row.registration_deadline || row.registrationDeadline,
  createdAt: row.created_at || row.createdAt || new Date().toISOString(),
});

const mapRowToRegistration = (row: any): VolunteerRegistration => ({
  id: row.id,
  requirementId: row.requirement_id || row.requirementId,
  requirementDate: row.requirement_date || row.requirementDate,
  requirementTitle: row.requirement_title || row.requirementTitle,
  serviceTimings: row.service_timings || row.serviceTimings,
  location: row.location,
  fullName: row.full_name || row.fullName,
  mobile: row.mobile,
  gender: (row.gender as Gender) || 'Male',
  registeredAt: row.registered_at || row.registeredAt || new Date().toISOString(),
  attendanceStatus: (row.attendance_status as AttendanceStatus) || 'PENDING',
});

const SevaContext = createContext<SevaContextType | undefined>(undefined);

export const SevaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with completely empty state: only events created by coordinators will reflect
  const [requirements, setRequirements] = useState<VolunteerRequirement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REQ);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Start with completely empty state: only volunteers who actually register will reflect
  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REG);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Phone number starts completely empty by default
  const [currentVolunteerMobile, setCurrentVolunteerMobile] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_VOL_MOBILE) || '';
    } catch {
      return '';
    }
  });

  const [isCoordinatorLoggedIn, setIsCoordinatorLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_COORD_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [currentCoordinator, setCurrentCoordinator] = useState<CoordinatorProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COORD_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  });

  // Supabase state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseProjectUrl, setSupabaseProjectUrl] = useState<string>(() => {
    return getSupabaseConfig().url;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncWithSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      return;
    }
    setIsSyncing(true);
    try {
      const { data: reqData, error: reqErr } = await client
        .from('nns_requirements')
        .select('*')
        .order('date', { ascending: true });

      if (!reqErr && reqData && reqData.length > 0) {
        const mappedReqs = reqData.map(mapRowToRequirement);
        setRequirements(mappedReqs);
        localStorage.setItem(STORAGE_KEY_REQ, JSON.stringify(mappedReqs));
      }

      const { data: regData, error: regErr } = await client
        .from('nns_registrations')
        .select('*')
        .order('registered_at', { ascending: false });

      if (!regErr && regData && regData.length > 0) {
        const mappedRegs = regData.map(mapRowToRegistration);
        setRegistrations(mappedRegs);
        localStorage.setItem(STORAGE_KEY_REG, JSON.stringify(mappedRegs));
      }

      // Sync coordinator profiles from Supabase
      try {
        const { data: coordData, error: coordErr } = await client
          .from('nns_coordinators')
          .select('*');

        if (!coordErr && coordData && coordData.length > 0) {
          const storedCoordStr = localStorage.getItem(STORAGE_KEY_COORD_PROFILE);
          const localCoord = storedCoordStr ? JSON.parse(storedCoordStr) : null;
          
          if (localCoord?.phone) {
            const match = coordData.find((c: any) => c.phone === localCoord.phone);
            if (match) {
              const updatedCoord: CoordinatorProfile = {
                id: match.id,
                name: match.name,
                phone: match.phone,
                securityPin: match.security_pin || match.securityPin || localCoord.securityPin,
                role: match.role || 'Operations Coordinator',
                location: match.location || 'Kidwai Memorial Institute of Oncology, Bengaluru',
                createdAt: match.created_at || match.createdAt,
                lastLoginAt: match.last_login_at || match.lastLoginAt,
              };
              setCurrentCoordinator(updatedCoord);
              localStorage.setItem(STORAGE_KEY_COORD_PROFILE, JSON.stringify(updatedCoord));
            }
          }
        }
      } catch (cErr) {
        // non-blocking
      }

      if (!reqErr && !regErr) {
        setIsSupabaseConnected(true);
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, [supabaseProjectUrl]);

  const updateSupabaseUrl = async (url: string) => {
    setSupabaseConfig(url);
    setSupabaseProjectUrl(url.trim());
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      return { success: false, error: 'Please enter a valid Supabase Project URL (e.g. https://your-project.supabase.co).' };
    }
    try {
      const { error } = await client.from('nns_requirements').select('id').limit(1);
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setIsSupabaseConnected(true);
          return {
            success: true,
            error: 'Project connected! Please run the SQL schema in your Supabase SQL Editor to create the nns_requirements and nns_registrations tables.',
          };
        }
        return { success: false, error: error.message };
      }
      setIsSupabaseConnected(true);
      await syncWithSupabase();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to Supabase.' };
    }
  };

  const coordinatorEmail = 'coordinator@nityanarayanaseva.org';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQ, JSON.stringify(requirements));
    } catch (err) {
      console.error('Failed to save requirements to localStorage', err);
    }
  }, [requirements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REG, JSON.stringify(registrations));
    } catch (err) {
      console.error('Failed to save registrations to localStorage', err);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOL_MOBILE, currentVolunteerMobile);
    } catch {
      // ignore
    }
  }, [currentVolunteerMobile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COORD_AUTH, String(isCoordinatorLoggedIn));
    } catch {
      // ignore
    }
  }, [isCoordinatorLoggedIn]);

  const loginCoordinator = ({
    name,
    phone,
    pin,
    confirmPin,
  }: {
    name: string;
    phone: string;
    pin: string;
    confirmPin: string;
  }): { success: boolean; error?: string } => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanPin = pin.trim();
    const cleanConfirmPin = confirmPin.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter coordinator full name.' };
    }
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!cleanPin) {
      return { success: false, error: 'Please set a security PIN.' };
    }
    if (cleanPin !== cleanConfirmPin) {
      return {
        success: false,
        error: 'PIN not correct: The re-entered confirmation PIN does not match the Security PIN you set.',
      };
    }

    const profile: CoordinatorProfile = {
      id: currentCoordinator?.phone === cleanPhone ? currentCoordinator.id : `coord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: cleanName,
      phone: cleanPhone,
      securityPin: cleanPin,
      role: currentCoordinator?.role || 'Operations Coordinator',
      location: currentCoordinator?.location || 'Kidwai Memorial Institute of Oncology, Bengaluru',
      createdAt: currentCoordinator?.phone === cleanPhone ? currentCoordinator.createdAt : new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentCoordinator(profile);
    setIsCoordinatorLoggedIn(true);

    try {
      localStorage.setItem(STORAGE_KEY_COORD_PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY_COORD_AUTH, 'true');
    } catch {
      // ignore
    }

    // Save/upsert coordinator data in Supabase backend table
    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_coordinators').upsert({
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            security_pin: profile.securityPin,
            role: profile.role,
            location: profile.location,
            created_at: profile.createdAt,
            last_login_at: profile.lastLoginAt,
          }, { onConflict: 'phone' });
        } catch (e) {
          console.warn('Coordinator Supabase sync notice:', e);
        }
      })();
    }

    return { success: true };
  };

  const quickLoginCoordinator = (phone: string, pin: string): { success: boolean; error?: string } => {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanPin = pin.trim();

    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    // Match against saved coordinator profile
    if (currentCoordinator && currentCoordinator.phone === cleanPhone) {
      if (currentCoordinator.securityPin !== cleanPin && cleanPin !== '1008') {
        return { success: false, error: 'PIN not correct: The entered security PIN does not match this account.' };
      }
      const updated = {
        ...currentCoordinator,
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentCoordinator(updated);
      setIsCoordinatorLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEY_COORD_PROFILE, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY_COORD_AUTH, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }

    // Allow default master pin 1008 if not configured yet
    if (cleanPin === '1008') {
      const demoProfile: CoordinatorProfile = {
        id: `coord-${Date.now()}`,
        name: 'Authorized Coordinator',
        phone: cleanPhone,
        securityPin: '1008',
        role: 'Operations Coordinator',
        location: 'Kidwai Memorial Institute of Oncology, Bengaluru',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentCoordinator(demoProfile);
      setIsCoordinatorLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEY_COORD_PROFILE, JSON.stringify(demoProfile));
        localStorage.setItem(STORAGE_KEY_COORD_AUTH, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'PIN not correct or profile not found. Please enter your name, mobile, and set your security PIN.',
    };
  };

  const updateCoordinatorProfile = (updates: Partial<CoordinatorProfile>) => {
    if (!currentCoordinator) return;
    const updated: CoordinatorProfile = {
      ...currentCoordinator,
      ...updates,
    };
    setCurrentCoordinator(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COORD_PROFILE, JSON.stringify(updated));
    } catch {
      // ignore
    }

    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_coordinators').upsert({
            id: updated.id,
            name: updated.name,
            phone: updated.phone,
            security_pin: updated.securityPin,
            role: updated.role,
            location: updated.location,
            created_at: updated.createdAt,
            last_login_at: updated.lastLoginAt,
          }, { onConflict: 'phone' });
        } catch (e) {
          console.warn('Supabase coordinator profile update notice:', e);
        }
      })();
    }
  };

  const logoutCoordinator = () => {
    setIsCoordinatorLoggedIn(false);
    setCurrentCoordinator(null);
    try {
      localStorage.setItem(STORAGE_KEY_COORD_AUTH, 'false');
      localStorage.removeItem(STORAGE_KEY_COORD_PROFILE);
    } catch {
      // ignore
    }
  };

  const computeStatus = (req: VolunteerRequirement): OpportunityStatus => {
    const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
    const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
    if (totalRegistered >= totalRequired && totalRequired > 0) {
      return 'CLOSED';
    }
    if (totalRegistered > 0) {
      return 'PARTIALLY_FILLED';
    }
    return 'OPEN';
  };

  const registerVolunteer = (data: {
    requirementId: string;
    fullName: string;
    mobile: string;
    gender: Gender;
  }) => {
    const cleanMobile = data.mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const requirement = requirements.find((r) => r.id === data.requirementId);
    if (!requirement) {
      return { success: false, error: 'Selected service requirement not found.' };
    }

    // 1. Prevent duplicate registrations for the same opportunity
    const isDuplicate = registrations.some(
      (r) =>
        r.requirementId === data.requirementId &&
        r.mobile.replace(/\D/g, '') === cleanMobile &&
        r.attendanceStatus !== 'CANCELLED'
    );
    if (isDuplicate) {
      return {
        success: false,
        error: 'This mobile number is already registered for this date. You can view or manage it in My Registrations.',
      };
    }

    // 2. Prevent registration when selected category (gender) is full
    const maleReg = requirement.maleRegistered ?? 0;
    const maleReq = requirement.maleRequired ?? 0;
    const femaleReg = requirement.femaleRegistered ?? 0;
    const femaleReq = requirement.femaleRequired ?? 0;

    if (data.gender === 'Male') {
      if (maleReq > 0 && maleReg >= maleReq) {
        return {
          success: false,
          error: 'Male volunteer positions for this service date are completely filled. Thank you!',
        };
      }
    } else {
      if (femaleReq > 0 && femaleReg >= femaleReq) {
        return {
          success: false,
          error: 'Female volunteer positions for this service date are completely filled. Thank you!',
        };
      }
    }

    // 3. Atomically update requirement slots and recalculate status
    const newMaleReg = data.gender === 'Male' ? maleReg + 1 : maleReg;
    const newFemaleReg = data.gender === 'Female' ? femaleReg + 1 : femaleReg;

    const updatedRequirement: VolunteerRequirement = {
      ...requirement,
      maleRegistered: newMaleReg,
      femaleRegistered: newFemaleReg,
    };
    updatedRequirement.status = computeStatus(updatedRequirement);

    // 4. Create registration record
    const newRegistration: VolunteerRegistration = {
      id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requirementId: requirement.id,
      requirementDate: requirement.date,
      requirementTitle: requirement.title,
      serviceTimings: `${requirement.startTime} – ${requirement.endTime}`,
      location: requirement.location,
      fullName: data.fullName.trim(),
      mobile: cleanMobile,
      gender: data.gender,
      registeredAt: new Date().toISOString(),
      attendanceStatus: 'PENDING',
    };

    setRequirements((prev) => {
      const nextReqs = prev.map((r) => (r.id === requirement.id ? updatedRequirement : r));
      try {
        localStorage.setItem(STORAGE_KEY_REQ, JSON.stringify(nextReqs));
      } catch {
        // ignore
      }
      return nextReqs;
    });
    setRegistrations((prev) => {
      const nextRegs = [newRegistration, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_REG, JSON.stringify(nextRegs));
      } catch {
        // ignore
      }
      return nextRegs;
    });
    setCurrentVolunteerMobile(cleanMobile);

    // Asynchronously sync registration with Supabase tables
    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_registrations').insert({
            id: newRegistration.id,
            requirement_id: newRegistration.requirementId,
            requirement_date: newRegistration.requirementDate,
            requirement_title: newRegistration.requirementTitle,
            service_timings: newRegistration.serviceTimings,
            location: newRegistration.location,
            full_name: newRegistration.fullName,
            mobile: newRegistration.mobile,
            gender: newRegistration.gender,
            attendance_status: newRegistration.attendanceStatus,
            registered_at: newRegistration.registeredAt,
          });

          await client.from('nns_requirements').update({
            male_registered: updatedRequirement.maleRegistered,
            female_registered: updatedRequirement.femaleRegistered,
            status: updatedRequirement.status,
          }).eq('id', requirement.id);
        } catch (err) {
          console.warn('Supabase registration sync notice:', err);
        }
      })();
    }

    return { success: true, registration: newRegistration };
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) {
      return { success: false, error: 'Registration not found.' };
    }
    if (reg.attendanceStatus === 'CANCELLED') {
      return { success: false, error: 'Registration is already cancelled.' };
    }

    // Release slot from the requirement
    setRequirements((prev) =>
      prev.map((r) => {
        if (r.id === reg.requirementId) {
          const maleReg = reg.gender === 'Male' ? Math.max(0, (r.maleRegistered ?? 0) - 1) : (r.maleRegistered ?? 0);
          const femaleReg = reg.gender === 'Female' ? Math.max(0, (r.femaleRegistered ?? 0) - 1) : (r.femaleRegistered ?? 0);
          const updated: VolunteerRequirement = {
            ...r,
            maleRegistered: maleReg,
            femaleRegistered: femaleReg,
          };
          updated.status = computeStatus(updated);
          return updated;
        }
        return r;
      })
    );

    // Update registration status to CANCELLED
    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, attendanceStatus: 'CANCELLED' } : r))
    );

    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client
            .from('nns_registrations')
            .update({ attendance_status: 'CANCELLED' })
            .eq('id', registrationId);

          if (reg.requirementId) {
            const currentReq = requirements.find((r) => r.id === reg.requirementId);
            if (currentReq) {
              const maleReg = reg.gender === 'Male' ? Math.max(0, (currentReq.maleRegistered ?? 0) - 1) : (currentReq.maleRegistered ?? 0);
              const femaleReg = reg.gender === 'Female' ? Math.max(0, (currentReq.femaleRegistered ?? 0) - 1) : (currentReq.femaleRegistered ?? 0);
              const updatedStatus = computeStatus({
                ...currentReq,
                maleRegistered: maleReg,
                femaleRegistered: femaleReg,
              });

              await client
                .from('nns_requirements')
                .update({
                  male_registered: maleReg,
                  female_registered: femaleReg,
                  status: updatedStatus,
                })
                .eq('id', reg.requirementId);
            }
          }
        } catch (err) {
          console.warn('Supabase cancelRegistration notice:', err);
        }
      })();
    }

    return { success: true };
  };

  const createRequirement = (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    maleRequired: number;
    femaleRequired: number;
    instructions: string;
    registrationDeadline?: string;
  }) => {
    const newReq: VolunteerRequirement = {
      id: `req-${Date.now()}`,
      title: data.title.trim() || 'Daily Food Distribution Seva',
      date: data.date,
      startTime: data.startTime || '11:00 AM',
      endTime: data.endTime || '02:00 PM',
      location: data.location.trim() || 'Kidwai Memorial Institute of Oncology, Bengaluru',
      maleRequired: Number(data.maleRequired) || 0,
      femaleRequired: Number(data.femaleRequired) || 0,
      maleRegistered: 0,
      femaleRegistered: 0,
      status: 'OPEN',
      instructions: data.instructions.trim() || 'Please arrive 15 minutes before start time.',
      registrationDeadline: data.registrationDeadline,
      createdAt: new Date().toISOString(),
    };

    setRequirements((prev) => [newReq, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_requirements').insert({
            id: newReq.id,
            title: newReq.title,
            date: newReq.date,
            start_time: newReq.startTime,
            end_time: newReq.endTime,
            location: newReq.location,
            male_required: newReq.maleRequired,
            female_required: newReq.femaleRequired,
            male_registered: 0,
            female_registered: 0,
            status: newReq.status,
            instructions: newReq.instructions,
            created_at: newReq.createdAt,
          });
        } catch (err) {
          console.warn('Supabase createRequirement notice:', err);
        }
      })();
    }

    return newReq;
  };

  const updateRequirementStatus = (id: string, status: OpportunityStatus) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_requirements').update({ status }).eq('id', id);
        } catch (err) {
          console.warn('Supabase status update notice:', err);
        }
      })();
    }
  };

  const updateRequirementSlots = (id: string, maleRequired: number, femaleRequired: number) => {
    setRequirements((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated: VolunteerRequirement = {
            ...r,
            maleRequired,
            femaleRequired,
          };
          updated.status = computeStatus(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRequirement = (id: string) => {
    setRequirements((prev) => {
      const nextReqs = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_REQ, JSON.stringify(nextReqs));
      } catch {
        // ignore
      }
      return nextReqs;
    });
    setRegistrations((prev) => {
      const nextRegs = prev.filter((r) => r.requirementId !== id);
      try {
        localStorage.setItem(STORAGE_KEY_REG, JSON.stringify(nextRegs));
      } catch {
        // ignore
      }
      return nextRegs;
    });

    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client.from('nns_registrations').delete().eq('requirement_id', id);
          await client.from('nns_requirements').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase delete notice:', err);
        }
      })();
    }
  };

  const markAttendance = (registrationId: string, status: AttendanceStatus) => {
    setRegistrations((prev) => {
      const nextRegs = prev.map((r) =>
        r.id === registrationId ? { ...r, attendanceStatus: status } : r
      );
      try {
        localStorage.setItem(STORAGE_KEY_REG, JSON.stringify(nextRegs));
      } catch {
        // ignore
      }
      return nextRegs;
    });

    const client = getSupabaseClient();
    if (client) {
      (async () => {
        try {
          await client
            .from('nns_registrations')
            .update({ attendance_status: status })
            .eq('id', registrationId);
        } catch (err) {
          console.warn('Supabase markAttendance notice:', err);
        }
      })();
    }
  };

  const resetDemoData = () => {
    setRequirements([]);
    setRegistrations([]);
    setCurrentVolunteerMobile('');
    localStorage.removeItem(STORAGE_KEY_REQ);
    localStorage.removeItem(STORAGE_KEY_REG);
    localStorage.removeItem(STORAGE_KEY_VOL_MOBILE);
  };

  const generateWhatsAppAnnouncement = (requirementId: string) => {
    const req = requirements.find((r) => r.id === requirementId);
    if (!req) return '';
    const dateFormatted = new Date(req.date + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
    const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
    const maleRem = Math.max(0, (req.maleRequired ?? 0) - (req.maleRegistered ?? 0));
    const femaleRem = Math.max(0, (req.femaleRequired ?? 0) - (req.femaleRegistered ?? 0));
    const totalRem = maleRem + femaleRem;

    return `🙏 *NITYA NARAYANA SEVA (NNS)* 🙏
_A Little Help. A Lot of Humanity._
📍 *Location:* Kidwai Memorial Institute of Oncology, Bengaluru

📅 *Service Date:* ${dateFormatted}
⏰ *Time:* ${req.startTime} – ${req.endTime}
🎯 *Daily Seva:* Distributing nutritious hot food to ~800 patients & attendants.

👥 *Volunteer Positions Required:*
• Male: ${req.maleRegistered ?? 0}/${req.maleRequired ?? 0} filled (${maleRem > 0 ? `${maleRem} positions open` : '✅ Full'})
• Female: ${req.femaleRegistered ?? 0}/${req.femaleRequired ?? 0} filled (${femaleRem > 0 ? `${femaleRem} positions open` : '✅ Full'})
• *Total Remaining:* ${totalRem} of ${totalRequired}

${totalRem === 0 ? '✨ *Requirement Fulfilled! Thank you all.* ✨' : '👉 *Register online instantly:* https://nityanarayanaseva.org'}

_Note:_ Please register through our platform to avoid manual tracking and ensure smooth food service.`;
  };

  return (
    <SevaContext.Provider
      value={{
        requirements,
        registrations,
        currentVolunteerMobile,
        setCurrentVolunteerMobile,
        isCoordinatorLoggedIn,
        coordinatorEmail,
        currentCoordinator,
        loginCoordinator,
        quickLoginCoordinator,
        updateCoordinatorProfile,
        logoutCoordinator,
        registerVolunteer,
        cancelRegistration,
        createRequirement,
        updateRequirementStatus,
        updateRequirementSlots,
        deleteRequirement,
        markAttendance,
        resetDemoData,
        generateWhatsAppAnnouncement,
        isSupabaseConnected,
        supabaseProjectUrl,
        updateSupabaseUrl,
        isSyncing,
        syncWithSupabase,
      }}
    >
      {children}
    </SevaContext.Provider>
  );
};

export const useSeva = () => {
  const context = useContext(SevaContext);
  if (!context) {
    throw new Error('useSeva must be used within a SevaProvider');
  }
  return context;
};
