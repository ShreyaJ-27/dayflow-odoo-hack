// CSV Export utilities for Dayflow HRMS

const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAttendanceToCSV = (records, dateStr = '') => {
  const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Check-In', 'Check-Out', 'Total Hours', 'Status', 'Late Arrival', 'Overtime'];
  
  const rows = records.map((rec) => [
    rec.employeeId || '',
    `"${(rec.employeeName || '').replace(/"/g, '""')}"`,
    `"${(rec.department || '').replace(/"/g, '""')}"`,
    rec.date || dateStr,
    rec.checkIn || '-',
    rec.checkOut || '-',
    rec.totalHours || '0h 00m',
    rec.status || '',
    rec.isLate ? 'Yes' : 'No',
    rec.overtime || '-'
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map((r) => r.join(','))
  ].join('\r\n');

  const fileDate = dateStr || new Date().toISOString().split('T')[0];
  downloadCSV(csvString, `dayflow_attendance_${fileDate}.csv`);
};

export const exportTimeOffToCSV = (requests) => {
  const headers = ['Request ID', 'Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Total Days', 'Applied On', 'Status', 'Reason', 'Admin Remarks'];

  const rows = requests.map((req) => [
    req.id || '',
    req.employeeId || '',
    `"${(req.employeeName || '').replace(/"/g, '""')}"`,
    `"${(req.department || '').replace(/"/g, '""')}"`,
    `"${(req.leaveType || '').replace(/"/g, '""')}"`,
    req.startDate || '',
    req.endDate || '',
    req.totalDays || 0,
    req.appliedOn || '',
    req.status || '',
    `"${(req.reason || '').replace(/"/g, '""')}"`,
    `"${(req.adminRemarks || '').replace(/"/g, '""')}"`
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map((r) => r.join(','))
  ].join('\r\n');

  const fileDate = new Date().toISOString().split('T')[0];
  downloadCSV(csvString, `dayflow_leave_requests_${fileDate}.csv`);
};
