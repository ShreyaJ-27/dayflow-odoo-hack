# Dayflow HRMS 🏢⚡

> A modern, role-based Human Resource Management System (HRMS) built for fast-moving teams. Featuring an intuitive, high-fidelity dark-themed interface for Administrators and HR Officers.

---

## 🌟 Key Features

### 1. 🛡️ Role-Based Access Control (Admin vs HR Officer)
- **Live Role Switcher**: Seamlessly toggle between **Administrator** and **HR Officer** privileges.
- **Confidential Salary Guard**: 
  - **Admin**: Full access to compensation metrics, base wages, hourly rates, direct deposit/banking info, tax withholdings (Federal, State, FICA, 401k), and allowances breakdown.
  - **HR Officer**: Confidential data is protected with an explicit access-restricted shield.

### 2. 👥 Employee Directory & Profile Suite
- **Interactive Directory**: Responsive grid/card and table views with multi-criteria search (name, email, role, ID) and department/status filtering.
- **Comprehensive Profile Modal**: Multi-tab drawer covering **Personal Info**, **Job Info**, and **Salary Info**.
- **Real-Time Profile Editing**: Modify employee records with instant optimistic updates and toast alerts.
- **Add Employee**: Register new team members with customizable profiles and compensation details.

### 3. ⏱️ Attendance Management
- **Daily Attendance Tracking**: Real-time logs of check-in/check-out times, calculated daily hours, late arrival flags, and overtime indicators.
- **Weekly Timesheet Matrix**: Mon–Sun attendance view with daily status chips (`Present`, `Half-day`, `Leave`, `Absent`, `Off`) and weekly total hour aggregations.
- **Color-Coded Status Badges**:
  - 🟢 **Present**: Emerald Green
  - 🔴 **Absent**: Rose Red
  - 🟡 **Half-day**: Amber Yellow
  - 🟣 **On Leave**: Purple / Violet
- **Date Stepper & Picker**: Quick navigation between days, "Today" shortcut, and date-range filtering.
- **Manual Log & Overrides**: Override attendance records or log manual entries on behalf of employees.

### 4. 🏖️ Time Off & Leave Approvals
- **Leave Request Management**: Review PTO, sick leave, casual time off, and unpaid leaves.
- **Approve / Reject Action Workflows**: One-click authorization or rejection dialog with custom administrative remarks.
- **Live Status Badging & Metrics**: Track pending reviews, approved days, and total leave hours taken.
- **Apply Leave**: Submit new time-off requests directly from the dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Functional Components + Hooks), Vite
- **Styling**: Tailwind CSS (Dark theme palette with violet/fuchsia neon accents)
- **Routing**: React Router DOM v7
- **State Management**: React Context (`HRMSContext`) with persistent state & optimistic UI updates
- **Icons**: Lucide React
- **Backend**: Express / Node.js backend integration layer (`backend/`)

---

## 📂 Repository Structure

```
dayflow-odoo-hack/
├── backend/                  # Backend API services & environment configs
│   ├── .env.example
│   └── .gitignore
├── frontend/                 # React + Tailwind CSS Dashboard Client
│   ├── public/               # Favicons and static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # TopNav, Modal, Toast, StatCard, NotificationPanel
│   │   │   ├── employee/     # EmployeeList, EmployeeCard, EmployeeProfileModal, AddEmployeeModal
│   │   │   ├── attendance/   # AttendancePage, AttendanceDailyTable, AttendanceWeeklyGrid, AttendanceDateFilter, MarkAttendanceModal
│   │   │   └── timeoff/      # TimeOffPage, TimeOffTable, LeaveActionModal, ApplyLeaveModal
│   │   ├── context/          # HRMSContext (Role guard, CRUD, Leaves, Attendance, Toasts)
│   │   ├── data/             # Mock datasets for employees, attendance history, leave requests
│   │   ├── utils/            # Formatters, currency, date helpers, status styles
│   │   ├── App.jsx           # App layout & routing
│   │   ├── index.css         # Dark theme base styles & glow effects
│   │   └── main.jsx          # Application entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Configure environment variables
cp .env.example .env
```

---

## 📄 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.