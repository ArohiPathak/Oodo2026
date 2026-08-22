export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: string;
  status: 'present' | 'absent' | 'leave';
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
    status: "present"
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
    status: "present"
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
    status: "present"
  }
];
