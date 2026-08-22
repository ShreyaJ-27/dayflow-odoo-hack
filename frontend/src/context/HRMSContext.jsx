import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialEmployees,
  initialAttendance,
  weeklyAttendanceMatrix,
  initialLeaveRequests,
  initialNotifications
} from '../data/mockData';

const HRMSContext = createContext(null);

export const HRMSProvider = ({ children }) => {
  // Current active role: 'admin' or 'hr_officer' (persisted in localStorage)
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('dayflow_role');
    return saved === 'hr_officer' ? 'hr_officer' : 'admin';
  });

  // Current logged-in profile synced with role
  const [currentUser, setCurrentUser] = useState(() => {
    return {
      name: role === 'admin' ? 'Elena Vance' : 'Amara Okonjo',
      email: role === 'admin' ? 'elena.vance@dayflow.io' : 'amara.okonjo@dayflow.io',
      title: role === 'admin' ? 'Administrator' : 'HR Officer',
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    };
  });

  useEffect(() => {
    localStorage.setItem('dayflow_role', role);
    setCurrentUser({
      name: role === 'admin' ? 'Elena Vance' : 'Amara Okonjo',
      email: role === 'admin' ? 'elena.vance@dayflow.io' : 'amara.okonjo@dayflow.io',
      title: role === 'admin' ? 'Administrator' : 'HR Officer',
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    });
  }, [role]);

  // Toast System (anchored top-right)
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

  // Employees State
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  // Selected Employee for Modal View/Edit
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openEmployeeProfile = (empId) => {
    setSelectedEmployeeId(empId);
    setIsProfileModalOpen(true);
  };

  const closeEmployeeProfile = () => {
    setIsProfileModalOpen(false);
    setSelectedEmployeeId(null);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
    // Also sync in attendance if name or avatar or department changed
    setAttendance((prev) =>
      prev.map((att) =>
        att.employeeId === updatedEmployee.id
          ? {
              ...att,
              employeeName: updatedEmployee.name,
              department: updatedEmployee.department,
              avatar: updatedEmployee.avatar
            }
          : att
      )
    );
    // Also sync in leave requests
    setLeaveRequests((prev) =>
      prev.map((lev) =>
        lev.employeeId === updatedEmployee.id
          ? {
              ...lev,
              employeeName: updatedEmployee.name,
              department: updatedEmployee.department,
              avatar: updatedEmployee.avatar
            }
          : lev
      )
    );
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: `Changes for ${updatedEmployee.name} have been saved successfully.`
    });
  };

  const addEmployee = (newEmpData) => {
    const id = `EMP-0${employees.length + 1}`.replace('010', '010');
    const fullEmployee = {
      id,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      ...newEmpData
    };
    setEmployees((prev) => [fullEmployee, ...prev]);

    // Also add to attendance list
    const newAtt = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      employeeId: fullEmployee.id,
      employeeName: fullEmployee.name,
      department: fullEmployee.department,
      avatar: fullEmployee.avatar,
      date: selectedDate,
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      totalHours: '8h 00m',
      status: 'Present',
      isLate: false,
      overtime: '-'
    };
    setAttendance((prev) => [newAtt, ...prev]);

    addToast({
      type: 'success',
      title: 'Employee Added',
      message: `${fullEmployee.name} (${fullEmployee.role}) registered in directory.`
    });
  };

  const deleteEmployee = (id) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmployeeId === id) {
      closeEmployeeProfile();
    }
    addToast({
      type: 'info',
      title: 'Employee Removed',
      message: `${emp?.name || 'Employee'} removed from registry.`
    });
  };

  // Attendance State
  const [selectedDate, setSelectedDate] = useState('2026-08-22');
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [weeklyAttendance, setWeeklyAttendance] = useState(() => {
    return weeklyAttendanceMatrix;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

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

  // Time Off / Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const approveLeave = (leaveId, adminRemarks = 'Approved by Admin.') => {
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === leaveId) {
          return {
            ...req,
            status: 'Approved',
            adminRemarks: adminRemarks || 'Approved by Admin.'
          };
        }
        return req;
      })
    );

    const req = leaveRequests.find((r) => r.id === leaveId);
    addToast({
      type: 'success',
      title: 'Leave Approved',
      message: `${req?.employeeName}'s ${req?.leaveType} request was approved.`
    });
  };

  const rejectLeave = (leaveId, adminRemarks = 'Request declined.') => {
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === leaveId) {
          return {
            ...req,
            status: 'Rejected',
            adminRemarks: adminRemarks || 'Declined by Admin.'
          };
        }
        return req;
      })
    );

    const req = leaveRequests.find((r) => r.id === leaveId);
    addToast({
      type: 'error',
      title: 'Leave Rejected',
      message: `${req?.employeeName}'s ${req?.leaveType} request was rejected.`
    });
  };

  const bulkApproveLeaves = (leaveIds, adminRemarks = 'Bulk approved by Admin.') => {
    if (!leaveIds || leaveIds.length === 0) return;
    setLeaveRequests((prev) =>
      prev.map((req) =>
        leaveIds.includes(req.id)
          ? { ...req, status: 'Approved', adminRemarks: adminRemarks || 'Bulk approved by Admin.' }
          : req
      )
    );
    addToast({
      type: 'success',
      title: 'Bulk Approval Complete',
      message: `Successfully approved ${leaveIds.length} leave requests.`
    });
  };

  const bulkRejectLeaves = (leaveIds, adminRemarks = 'Bulk declined by Admin.') => {
    if (!leaveIds || leaveIds.length === 0) return;
    setLeaveRequests((prev) =>
      prev.map((req) =>
        leaveIds.includes(req.id)
          ? { ...req, status: 'Rejected', adminRemarks: adminRemarks || 'Bulk declined by Admin.' }
          : req
      )
    );
    addToast({
      type: 'error',
      title: 'Bulk Rejection Complete',
      message: `Declined ${leaveIds.length} leave requests.`
    });
  };

  const applyLeaveRequest = (newRequest) => {
    const newId = `LEV-${Date.now().toString().slice(-3)}`;
    const fullRequest = {
      id: newId,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
      adminRemarks: '',
      ...newRequest
    };
    setLeaveRequests((prev) => [fullRequest, ...prev]);
    addToast({
      type: 'info',
      title: 'Leave Request Submitted',
      message: `Request for ${fullRequest.employeeName} logged.`
    });
  };

  // Notifications State
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const toggleRole = () => {
    const newRole = role === 'admin' ? 'hr_officer' : 'admin';
    setRole(newRole);
    addToast({
      type: 'info',
      title: `Switched to ${newRole === 'admin' ? 'Administrator' : 'HR Officer'}`,
      message:
        newRole === 'admin'
          ? 'Full access granted including sensitive Salary Info.'
          : 'HR Officer view active. Salary data is restricted.'
    });
  };

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  return (
    <HRMSContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        currentUser,
        employees,
        updateEmployee,
        addEmployee,
        deleteEmployee,
        selectedEmployeeId,
        isProfileModalOpen,
        openEmployeeProfile,
        closeEmployeeProfile,
        selectedDate,
        setSelectedDate,
        attendance,
        weeklyAttendance,
        updateAttendanceRecord,
        leaveRequests,
        approveLeave,
        rejectLeave,
        bulkApproveLeaves,
        bulkRejectLeaves,
        applyLeaveRequest,
        pendingLeavesCount,
        notifications,
        markAllNotificationsAsRead,
        markNotificationAsRead,
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
