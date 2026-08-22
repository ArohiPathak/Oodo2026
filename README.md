# ⚡ Dayflow
### HR shouldn't feel like paperwork.

**Dayflow** is a modern Human Resource Management platform that brings employee management, attendance, leave, payroll visibility, profiles, and employee self-service into one clean workspace.

Built for the **Odoo Hackathon × NMIT Bengaluru** 🚀


## 💡 The Idea
HR teams often juggle multiple tools for:

-  Employee records
-  Attendance
-  Leave requests
-  Salary information
-  Employee documents
-  Account management

That creates fragmented data and unnecessary administrative work.
**Dayflow brings all of it together.**

```text
                DAYFLOW
                   │
        ┌──────────┴──────────┐
        │                     │
     👨‍💼 ADMIN             👨‍💻 EMPLOYEE
        │                     │
   Manage Team           Self Service
   Attendance            Attendance
   Time Off              Time Off
   Employee Data         My Profile
   Salary Details        Salary View
                         Resume
                         Security
```

# ✨ What Can Dayflow Do?
## 👨‍💼 Admin Workspace

Admins get a centralized workspace for managing the organization.

###  Employee Management

- Create employees
- View employee directory
- Search employees
- Open detailed employee profiles
- Update employee information
- Manage employment details
- Manage salary information

###  Attendance
Monitor employee attendance from one place.

###  Time Off
View and manage employee leave information.

###  Controlled Access
Administrative functionality is separated from employee self-service routes.

---

##  Employee Workspace
Employees get their own dedicated dashboard — without exposing administrative functionality.

###  My Profile
Employees can view:

| Personal | Employment |
|---|---|
| 👤 Full Name | 💼 Designation |
| 📧 Email | 🏢 Department |
| 📱 Phone | 👨‍💼 Manager |
| 📍 Address | 📍 Work Location |
| 🎂 Date of Birth | 📅 Joining Date |
| 🌎 Nationality | 🆔 Employee ID |

### 🏦 Private & Bank Information
Employees can securely access information such as:

- Bank account number
- Bank name
- IFSC code
- PAN number
- UAN number
- Employee code
- Personal email
- Marital status

###  Resume
Employees can upload their resume as a **PDF**.

```text
Select Resume
      ↓
   Dayflow
      ↓
Supabase Storage
      ↓
Document linked to employee
      ↓
 View / Download
```

###  Security

Employees can update their account password through Supabase Authentication.

###  Attendance

Employees can:

- Check in
- Check out
- View attendance information

###  Time Off

Employees have a dedicated space for leave/time-off functionality.

---

#  Two Roles. Two Experiences.

One of Dayflow's core design decisions is separating **Admin** and **Employee** experiences.

## Admin

```text
Login
  ↓
Role = Admin
  ↓
Admin Workspace
  ├── Employees
  ├── Attendance
  ├── Time Off
  └── Admin Profile
```

Admin routes include:

```text
/employees
/employees/[id]
/attendance
/time-off
/profile
```

## Employee

```text
Login
  ↓
Role = Employee
  ↓
Employee Workspace
  ├── Dashboard
  ├── Attendance
  ├── Time Off
  └── My Profile
```

Employee routes include:

```text
/employee/dashboard
/employee/attendance
/employee/time-off
/employee/profile
```

The role stored in the user's profile determines the experience shown to them.

---

# 🧠 How Dayflow Works

```text
┌─────────────────────────────────────────────┐
│                  USER                       │
└────────────────────┬────────────────────────┘
                     │
                     ▼
             ┌───────────────┐
             │ Supabase Auth │
             └───────┬───────┘
                     │
                  Role Check
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   ┌─────────────┐       ┌─────────────┐
   │    ADMIN    │       │  EMPLOYEE   │
   │  WORKSPACE  │       │  WORKSPACE  │
   └──────┬──────┘       └──────┬──────┘
          │                     │
          └──────────┬──────────┘
                     ▼
              ┌─────────────┐
              │   Next.js   │
              │ API / UI    │
              └──────┬──────┘
                     │
                     ▼
       ┌─────────────────────────┐
       │        SUPABASE         │
       ├─────────────────────────┤
       │ 🔐 Authentication       │
       │ 🗄️ PostgreSQL          │
       │ 📦 File Storage         │
       └─────────────────────────┘
```


# 🗄️ Real Data. Not Just UI.
Dayflow is backed by **Supabase + PostgreSQL**.
Employee information isn't limited to static frontend cards — the application reads and writes employee information through the backend.
Core tables include:

```text
companies
    │
    ├── departments
    │
    └── profiles
          │
          ├── employee_private_info
          ├── payroll
          └── salary_structures
```

The project includes:

```text
POST /api/employees
```

and employee update functionality through:

```text
/api/employees/update
```

Privileged employee provisioning is handled server-side rather than exposing administrative credentials in the browser.

---

# 🧰 Built With

| Technology | Purpose |
|---|---|
|  **Next.js** | Application framework |
|  **React** | Component-based UI |
|  **TypeScript** | Type-safe development |
|  **Tailwind CSS** | Responsive styling |
|  **Supabase** | Backend platform |
|  **Supabase Auth** | Authentication |
|  **PostgreSQL** | Database |
|  **Supabase Storage** | Resume storage |
|  **Lucide React** | Icons |
|  **Git** | Version control |
|  **GitHub** | Team collaboration |

# 📂 Project Structure

```text
src/
│
├── app/
│   │
│   ├── api/
│   │   └── employees/
│   │
│   ├── employee/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── attendance/
│   │   └── time-off/
│   │
│   ├── employees/
│   ├── attendance/
│   ├── time-off/
│   ├── profile/
│   ├── login/
│   └── signup/
│
├── components/
│   ├── employee/
│   ├── employees/
│   ├── layout/
│   └── ui/
│
├── context/
│   └── AppContext.tsx
│
├── services/
│   └── employeeService.ts
│
└── lib/
    └── supabase/
```

---

#  Run Dayflow Locally

## 1️⃣ Clone

```bash
git clone https://github.com/ArohiPathak/Oodo2026.git
cd Oodo2026
```

## 2️⃣ Install

```bash
npm install
```

## 3️⃣ Configure Supabase

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

> ⚠️ Never commit `.env.local` or your Supabase service-role key.

## 4️⃣ Start Development Server

```bash
npm run dev
```

## 5️⃣ Verify Production Build

```bash
npm run build
```


# 🎬 Demo Flow
For a quick demonstration of Dayflow:

### 1. Login as Admin

```text
Login → Admin Workspace
```

### 2. Open Employee Directory

```text
Employees → View Team
```

### 3. Create an Employee

```text
Add Employee
      ↓
Supabase Auth
      +
Employee Profile
```

### 4. Login as Employee

```text
Employee Login
      ↓
Employee Dashboard
```

### 5. Open My Profile

Show:

```text
Private Info
Resume
Salary
Security
```

### 6. Upload Resume

```text
PDF → Supabase Storage → Employee Profile
```

### 7. Show Attendance / Time Off

Demonstrate the employee self-service workflow.

---

#  Security Design
Dayflow separates normal client operations from privileged administrative actions.
Key considerations include:

-  Supabase authentication
-  Role-based application access
-  Server-side employee provisioning
-  Service-role credentials kept server-side
-  Passwords managed by Supabase Auth
-  Employee data persisted in PostgreSQL

For a production deployment, authorization should additionally be enforced comprehensively through carefully tested Supabase **Row Level Security (RLS)** policies.


# 🎯 Why Dayflow?

Traditional HR workflows can become:

```text
Spreadsheet
    +
Attendance Tool
    +
Employee Records
    +
Leave Tracker
    +
Payroll Data
    +
Documents
    =
😵 HR Chaos
```

Dayflow aims for:

```text
              DAYFLOW
                 ↓
      ┌─────────────────────┐
      │ One HR Workspace    │
      ├─────────────────────┤
      │ Employees           │
      │ Attendance          │
      │ Time Off            │
      │ Profiles            │
      │ Salary Information  │
      │ Documents           │
      └─────────────────────┘
                 ↓
          Perfection
```



# 🔮 What's Next?

Dayflow can be extended with:

-  HR analytics dashboard
-  Real-time notifications
-  Email notifications
-  Full leave approval workflow
-  Attendance analytics
-  Payslip generation
-  Extended document management
-  Organization hierarchy
-  Employee profile edit approvals
-  Audit logs
-  Expanded RLS policies
-  Production deployment

---

## Team Members
- Akshata Chettiar
- Arohi Pathak
- Pavitra Boga

#  Built for Odoo Hackathon × NMIT Bengaluru

Dayflow was built as a collaborative hackathon project with a focus on:
**clean UX • real database integration • role separation • employee self-service • practical HR workflows**

> **Dayflow — Your people. Their workday. One flow. ⚡**
