import { supabase } from './supabaseClient';

// Dynamic Sound Synthesizer using Web Audio API
export const playSound = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'confirm') {
      const osc1 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc1.connect(gain);
      gain.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.1);
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.1);
      }, 120);
    } else if (type === 'logon') {
      const freqs = [261.63, 329.63, 392.00, 523.25]; // C major chord
      freqs.forEach((f, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(audioCtx.currentTime + index * 0.05);
        osc.stop(audioCtx.currentTime + 0.6);
      });
    } else if (type === 'alarm') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.9);
      osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    }
  } catch (e) {
    console.warn("AudioContext block by browser auto-play policy.");
  }
};

export const getDB = async () => {
  try {
    const [personnelRes, equipmentRes, dutiesRes, auditRes, appStateRes, maintenanceRes, assignmentsRes, allocationsRes] = await Promise.all([
      supabase.from('personnel').select('*'),
      supabase.from('equipment').select('*'),
      supabase.from('special_duties').select('*').order('start_time', { ascending: false }),
      supabase.from('audit_trail').select('*').order('created_at', { ascending: false }),
      supabase.from('app_state').select('*').eq('key', 'currentUser').single(),
      supabase.from('vehicle_maintenance').select('*').order('service_date', { ascending: false }),
      supabase.from('duty_assignments').select('*'),
      supabase.from('equipment_allocations').select('*')
    ]);

    const personnel = personnelRes.data || [];
    const equipment = equipmentRes.data || [];
    const audit = auditRes.data || [];
    const maintenance = maintenanceRes.data || [];
    
    // Process duties to include assignments and allocations
    const assignments = assignmentsRes.data || [];
    const allocations = allocationsRes.data || [];
    const duties = (dutiesRes.data || []).map(d => ({
      ...d,
      assignments: assignments.filter(a => a.duty_id === d.id),
      allocations: allocations.filter(al => al.duty_id === d.id)
    }));

    // Find current user object
    let currentUser = {};
    if (appStateRes.data && appStateRes.data.value) {
      currentUser = personnel.find(p => p.id === appStateRes.data.value) || {};
    }

    return { personnel, equipment, duties, audit, currentUser, maintenance };
  } catch (error) {
    console.error('Error fetching database:', error);
    return { personnel: [], equipment: [], duties: [], audit: [], currentUser: {}, maintenance: [] };
  }
};

export const authenticate = async (thanaId, password) => {
  // Mock authentication logic for Thana Level Login
  if (thanaId === 'CIVIL-LINES-01' && password === 'admin') {
    // Optionally log them in as a specific user in the mock DB, e.g., the SHO
    // We can fetch personnel and set the first Inspector/SHO as currentUser
    try {
      const { data: personnel } = await supabase.from('personnel').select('*').eq('rank', 'Inspector').limit(1);
      if (personnel && personnel.length > 0) {
        await switchRole(personnel[0].id);
      }
    } catch (e) {
      console.warn('Could not set role automatically during mock login');
    }
    return true;
  }
  return false;
};

export const logout = async () => {
  // Clear the currentUser from app_state
  try {
    await supabase.from('app_state').delete().eq('key', 'currentUser');
  } catch (e) {
    console.error('Error logging out:', e);
  }
};

export const addMaintenanceLog = async (logData) => {
  const { data, error } = await supabase.from('vehicle_maintenance').insert([logData]);
  if (error) throw error;
  if (logData.status === 'IN_PROGRESS') {
    await supabase.from('equipment').update({ status: 'MAINTENANCE' }).eq('id', logData.vehicle_id);
  }
  return data;
};

export const completeMaintenance = async (id, vehicle_id) => {
  const { error } = await supabase.from('vehicle_maintenance').update({ status: 'COMPLETED' }).eq('id', id);
  if (error) throw error;
  await supabase.from('equipment').update({ status: 'AVAILABLE' }).eq('id', vehicle_id);
  return { success: true };
};

export const logAudit = async (action, module, description) => {
  try {
    const { data: appState } = await supabase.from('app_state').select('value').eq('key', 'currentUser').single();
    let userName = "System";
    if (appState && appState.value) {
      const { data: user } = await supabase.from('personnel').select('name, rank').eq('id', appState.value).single();
      if (user) userName = `${user.name} (${user.rank})`;
    }

    await supabase.from('audit_trail').insert([{
      id: `au-${Date.now()}`,
      user_name: userName,
      action,
      module,
      description,
      created_at: new Date().toISOString()
    }]);
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

export const switchRole = async (userId) => {
  const { data, error } = await supabase.from('app_state').upsert({ key: 'currentUser', value: userId });
  if (error) throw error;
  return data;
};

export const createDuty = async (dutyData) => {
  const { assignments, allocations, ...dutyBase } = dutyData;
  const { error: dutyError } = await supabase.from('special_duties').insert([dutyBase]);
  if (dutyError) throw dutyError;

  if (assignments && assignments.length > 0) {
    const formattedAssignments = assignments.map(a => ({
      id: a.id,
      duty_id: dutyBase.id,
      personnel_id: a.personnel_id,
      role_in_duty: a.role_in_duty,
      status: 'ASSIGNED'
    }));
    await supabase.from('duty_assignments').insert(formattedAssignments);
    
    // Update personnel status
    const pIds = assignments.map(a => a.personnel_id);
    await supabase.from('personnel').update({ current_status: 'ON_DUTY' }).in('id', pIds);
  }

  if (allocations && allocations.length > 0) {
    const formattedAllocations = allocations.map(al => ({
      id: al.id,
      duty_id: dutyBase.id,
      equipment_id: al.equipment_id,
      assigned_to: al.assigned_to
    }));
    await supabase.from('equipment_allocations').insert(formattedAllocations);
    
    // Update equipment status
    const eqIds = allocations.map(al => al.equipment_id);
    await supabase.from('equipment').update({ status: 'ALLOCATED' }).in('id', eqIds);
  }
  return { success: true };
};

export const approveDuty = async (dutyId, approvedBy) => {
  const { error } = await supabase.from('special_duties').update({ status: 'ACTIVE', approved_by: approvedBy }).eq('id', dutyId);
  if (error) throw error;
  return { success: true };
};

export const rejectDuty = async (dutyId) => {
  const { error } = await supabase.from('special_duties').update({ status: 'REJECTED' }).eq('id', dutyId);
  if (error) throw error;
  return { success: true };
};

export const completeDuty = async (dutyId) => {
  const { error } = await supabase.from('special_duties').update({ status: 'COMPLETED' }).eq('id', dutyId);
  if (error) throw error;

  // Free up personnel
  const { data: assignments } = await supabase.from('duty_assignments').select('personnel_id').eq('duty_id', dutyId);
  if (assignments && assignments.length > 0) {
    const pIds = assignments.map(a => a.personnel_id);
    await supabase.from('personnel').update({ current_status: 'AVAILABLE' }).in('id', pIds);
  }

  // Free up equipment
  const { data: allocations } = await supabase.from('equipment_allocations').select('equipment_id').eq('duty_id', dutyId);
  if (allocations && allocations.length > 0) {
    const eqIds = allocations.map(al => al.equipment_id);
    await supabase.from('equipment').update({ status: 'AVAILABLE' }).in('id', eqIds);
  }
  
  return { success: true };
};

export const checkInOfficer = async (dutyId, personnelId, checkInTime, lat, lon) => {
  const { error } = await supabase.from('duty_assignments')
    .update({ status: 'CHECKED_IN', check_in_time: checkInTime, check_in_lat: lat, check_in_lon: lon })
    .match({ duty_id: dutyId, personnel_id: personnelId });
  if (error) throw error;
  return { success: true };
};

export const checkOutOfficer = async (dutyId, personnelId, checkOutTime) => {
  const { error } = await supabase.from('duty_assignments')
    .update({ status: 'CHECKED_OUT', check_out_time: checkOutTime })
    .match({ duty_id: dutyId, personnel_id: personnelId });
  if (error) throw error;
  return { success: true };
};

export const inductPersonnel = async (personnelData) => {
  const { error } = await supabase.from('personnel').insert([personnelData]);
  if (error) throw error;
  return { success: true };
};

export const addEquipment = async (equipmentData) => {
  const { error } = await supabase.from('equipment').insert([equipmentData]);
  if (error) throw error;
  return { success: true };
};

export const updatePersonnelStatus = async (personnelId, newStatus) => {
  const { error } = await supabase.from('personnel').update({ current_status: newStatus }).eq('id', personnelId);
  if (error) throw error;
  return { success: true };
};
