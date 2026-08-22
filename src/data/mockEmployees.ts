export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: string;
  status: 'present' | 'absent' | 'leave' | 'half-day';
  company?: string;
  manager?: string;
  location?: string;
  dob?: string;
  address?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  avatarUrl?: string;
  about?: string;
  whatILove?: string;
  interests?: string;
  skills?: string[];
  certifications?: string[];
}

export const initialEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Aarav Sharma",
    designation: "Software Engineer",
    department: "Engineering",
    email: "aarav.sharma@dayflow.com",
    phone: "+91 98765 43210",
    joiningDate: "2024-01-15",
    status: "present",
    company: "Dayflow Technologies",
    manager: "Ananya Rao (HR Specialist)",
    location: "Mumbai, India",
    dob: "1996-10-24",
    address: "Flat 402, Sea Breeze Apartments, Bandra West, Mumbai - 400050",
    nationality: "Indian",
    personalEmail: "aarav.sharma.personal@gmail.com",
    gender: "Male",
    maritalStatus: "Single",
    about: "Software Engineer focused on frontend and backend web development. Loves building products that solve real-world problems and writing clean, scalable code.",
    whatILove: "Solving complex engineering challenges and collaborating with cross-functional teams to build beautiful user interfaces.",
    interests: "Open-source development, hiking, playing guitar, and photography.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
    certifications: ["AWS Certified Developer - Associate", "Certified ScrumMaster (CSM)"]
  },
  {
    id: "EMP002",
    name: "Priya Patel",
    designation: "Senior UX Designer",
    department: "Design",
    email: "priya.patel@dayflow.com",
    phone: "+91 98765 43211",
    joiningDate: "2023-11-10",
    status: "leave"
  },
  {
    id: "EMP003",
    name: "Rohan Deshmukh",
    designation: "Product Manager",
    department: "Product",
    email: "rohan.deshmukh@dayflow.com",
    phone: "+91 98765 43212",
    joiningDate: "2024-02-01",
    status: "present"
  },
  {
    id: "EMP004",
    name: "Ananya Rao",
    designation: "HR Specialist",
    department: "People Ops",
    email: "ananya.rao@dayflow.com",
    phone: "+91 98765 43213",
    joiningDate: "2023-08-20",
    status: "present",
    about: "HR Specialist passionate about building high-performing teams, fostering a positive workplace culture, and matching exceptional talent with growth opportunities.",
    whatILove: "Fostering collaboration across teams and witnessing employee growth from onboarding to leadership milestones.",
    interests: "Blogging on organization culture, traveling, cooking, and reading personal growth books.",
    skills: ["Talent Acquisition", "Conflict Resolution", "Performance Management", "Workplace Compliance"],
    certifications: ["SHRM Certified Professional (SHRM-CP)", "Professional in Human Resources (PHR)"]
  },
  {
    id: "EMP005",
    name: "Kabir Malhotra",
    designation: "QA Lead",
    department: "Engineering",
    email: "kabir.malhotra@dayflow.com",
    phone: "+91 98765 43214",
    joiningDate: "2024-03-15",
    status: "absent"
  },
  {
    id: "EMP006",
    name: "Diya Sen",
    designation: "Marketing Manager",
    department: "Marketing",
    email: "diya.sen@dayflow.com",
    phone: "+91 98765 43215",
    joiningDate: "2023-05-12",
    status: "present"
  },
  {
    id: "EMP007",
    name: "Vivaan Verma",
    designation: "DevOps Engineer",
    department: "Engineering",
    email: "vivaan.verma@dayflow.com",
    phone: "+91 98765 43216",
    joiningDate: "2024-04-01",
    status: "leave"
  },
  {
    id: "EMP008",
    name: "Ishaan Nair",
    designation: "Financial Analyst",
    department: "Finance",
    email: "ishaan.nair@dayflow.com",
    phone: "+91 98765 43217",
    joiningDate: "2023-09-01",
    status: "present"
  },
  {
    id: "EMP009",
    name: "Meera Joshi",
    designation: "Content Strategist",
    department: "Marketing",
    email: "meera.joshi@dayflow.com",
    phone: "+91 98765 43218",
    joiningDate: "2023-12-05",
    status: "half-day"
  }
];
