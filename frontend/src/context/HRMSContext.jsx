import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, session } from '../services/api';

const HRMSContext = createContext(null);

export const HRMSProvider = ({ children }) => {
  // Toast system
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Transform backend employee profile to UI format
  const formatEmployee = (p) => ({
    id: p.id,
    userId: p.userId,
    employeeId: p.user?.employeeId || p.id,
    name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Staff Member',
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    email: p.user?.email || '',
    role: p.designation || 'Staff Member',
    department: p.department || 'General',
    employmentStatus: p.employmentStatus === 'ACTIVE' ? 'Active' : p.employmentStatus === 'ON_LEAVE' ? 'On Leave' : 'Inactive',
    phone: p.phone || '—',
    address: p.address || '—',
    dob: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '1995-01-01',
    joiningDate: p.joiningDate ? p.joiningDate.split('T')[0] : '2023-01-01',
    avatar: p.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.firstName || 'S')}+${encodeURIComponent(p.lastName || 'M')}&background=8b5cf6&color=fff`,
    workLocation: p.address || 'Headquarters',
    manager: 'Elena Vance'
  });

  // Transform backend attendance to UI format
  const formatAttendance = (a) => {
    const fName = a.employee?.firstName || 'Staff';
    const lName = a.employee?.lastName || 'Member';
    return {
      id: a.id,
      employeeId: a.employeeId,
      employeeName: `${fName} ${lName}`.trim(),
      department: a.employee?.department || 'General',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fName)}+${encodeURIComponent(lName)}&background=8b5cf6&color=fff`,
      date: a.date ? a.date.split('T')[0] : selectedDate,
      checkIn: a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
      checkOut: a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
      totalHours: a.checkIn && a.checkOut ? `${Math.max(0, Math.round((new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / 3600000))}h 00m` : '—',
      status: a.status === 'PRESENT' ? 'Present' : a.status === 'HALF_DAY' ? 'Half-day' : a.status === 'LEAVE' ? 'Leave' : 'Absent',
      isLate: false,
      overtime: '-'
    };
  };

  // Transform backend leave to UI format
  const formatLeave = (l) => {
    const fName = l.employee?.firstName || 'Staff';
    const lName = l.employee?.lastName || 'Member';
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);

    return {
      id: l.id,
      employeeId: l.employeeId,
      employeeName: `${fName} ${lName}`.trim(),
      department: l.employee?.department || 'General',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fName)}+${encodeURIComponent(lName)}&background=8b5cf6&color=fff`,
      leaveType: l.type === 'PAID' ? 'Paid Leave' : l.type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave',
      startDate: l.startDate ? l.startDate.split('T')[0] : '',
      endDate: l.endDate ? l.endDate.split('T')[0] : '',
      totalDays: days,
      reason: l.remarks || 'Personal / General leave',
      status: l.status === 'APPROVED' ? 'Approved' : l.status === 'REJECTED' ? 'Rejected' : l.status === 'CANCELLED' ? 'Cancelled' : 'Pending',
      adminRemarks: l.reviewerComment || '',
      appliedOn: l.createdAt ? l.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
    };
  };

  // Load all real data from API
  const refreshData = useCallback(async () => {
    if (!session.token) return;
    setLoadingData(true);
    try {
      const [empRes, attRes, leaveRes] = await Promise.allSettled([
        api.employees('?limit=100'),
        api.allAttendance('?limit=100'),
        api.allLeaves()
      ]);

      if (empRes.status === 'fulfilled' && Array.isArray(empRes.value.data)) {
        setEmployees(empRes.value.data.map(formatEmployee));
      }

      if (attRes.status === 'fulfilled' && Array.isArray(attRes.value.data)) {
        setAttendance(attRes.value.data.map(formatAttendance));
      }

      if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value.data)) {
        setLeaveRequests(leaveRes.value.data.map(formatLeave));
      }
    } catch {
      // Ignore initial load background errors
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Modal actions
  const openEmployeeProfile = (empId) => {
    setSelectedEmployeeId(empId);
    setIsProfileModalOpen(true);
  };

  const closeEmployeeProfile = () => {
    setIsProfileModalOpen(false);
    setSelectedEmployeeId(null);
  };

  // Employee update
  const updateEmployee = async (updatedEmployee) => {
    try {
      const payload = {
        firstName: updatedEmployee.firstName || updatedEmployee.name?.split(' ')[0],
        lastName: updatedEmployee.lastName || updatedEmployee.name?.split(' ').slice(1).join(' '),
        phone: updatedEmployee.phone,
        department: updatedEmployee.department,
        designation: updatedEmployee.role,
        address: updatedEmployee.address,
        employmentStatus: updatedEmployee.employmentStatus === 'Active' ? 'ACTIVE' : updatedEmployee.employmentStatus === 'On Leave' ? 'ON_LEAVE' : 'INACTIVE'
      };

      await api.updateEmployee(updatedEmployee.id, payload);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp))
      );
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: `Changes for ${updatedEmployee.name} have been saved successfully.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update employee'
      });
    }
  };

  // Leave Actions
  const approveLeave = async (leaveId, adminRemarks = 'Approved by Admin.') => {
    try {
      await api.approveLeave(leaveId, adminRemarks);
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === leaveId
            ? { ...req, status: 'Approved', adminRemarks: adminRemarks || 'Approved' }
            : req
        )
      );
      addToast({
        type: 'success',
        title: 'Leave Approved',
        message: 'Leave request has been approved in the system.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Approval Failed',
        message: err.message || 'Unable to approve leave'
      });
    }
  };

  const rejectLeave = async (leaveId, adminRemarks = 'Request declined.') => {
    try {
      await api.rejectLeave(leaveId, adminRemarks);
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === leaveId
            ? { ...req, status: 'Rejected', adminRemarks: adminRemarks || 'Declined' }
            : req
        )
      );
      addToast({
        type: 'error',
        title: 'Leave Rejected',
        message: 'Leave request was declined.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Rejection Failed',
        message: err.message || 'Unable to reject leave'
      });
    }
  };

  const bulkApproveLeaves = async (leaveIds, adminRemarks = 'Bulk approved by Admin.') => {
    for (const id of leaveIds) {
      try {
        await api.approveLeave(id, adminRemarks);
      } catch {}
    }
    setLeaveRequests((prev) =>
      prev.map((req) =>
        leaveIds.includes(req.id)
          ? { ...req, status: 'Approved', adminRemarks }
          : req
      )
    );
    addToast({
      type: 'success',
      title: 'Bulk Approval Complete',
      message: `Successfully processed ${leaveIds.length} requests.`
    });
  };

  const bulkRejectLeaves = async (leaveIds, adminRemarks = 'Bulk declined by Admin.') => {
    for (const id of leaveIds) {
      try {
        await api.rejectLeave(id, adminRemarks);
      } catch {}
    }
    setLeaveRequests((prev) =>
      prev.map((req) =>
        leaveIds.includes(req.id)
          ? { ...req, status: 'Rejected', adminRemarks }
          : req
      )
    );
    addToast({
      type: 'error',
      title: 'Bulk Rejection Complete',
      message: `Declined ${leaveIds.length} requests.`
    });
  };

  const applyLeaveRequest = async (newRequest) => {
    try {
      const typeMap = {
        'Paid Leave': 'PAID',
        'Sick Leave': 'SICK',
        'Unpaid Leave': 'UNPAID',
        'Casual Leave': 'PAID'
      };
      const payload = {
        type: typeMap[newRequest.leaveType] || 'PAID',
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        remarks: newRequest.reason || ''
      };

      const result = await api.applyLeave(payload);
      const formatted = formatLeave(result.data);
      setLeaveRequests((prev) => [formatted, ...prev]);
      addToast({
        type: 'success',
        title: 'Leave Submitted',
        message: 'Your leave application has been submitted for review.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Could not submit leave request'
      });
    }
  };

  const updateAttendanceRecord = (recordId, updates) => {
    setAttendance((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, ...updates } : rec))
    );
    addToast({
      type: 'success',
      title: 'Attendance Saved',
      message: 'Attendance record updated successfully.'
    });
  };

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  return (
    <HRMSContext.Provider
      value={{
        employees,
        attendance,
        weeklyAttendance,
        leaveRequests,
        selectedDate,
        setSelectedDate,
        selectedEmployeeId,
        isProfileModalOpen,
        openEmployeeProfile,
        closeEmployeeProfile,
        updateEmployee,
        updateAttendanceRecord,
        approveLeave,
        rejectLeave,
        bulkApproveLeaves,
        bulkRejectLeaves,
        applyLeaveRequest,
        pendingLeavesCount,
        refreshData,
        loadingData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};

export default HRMSContext;
