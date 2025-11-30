export interface Case {
  id: string;
  applicantName: string;
  priority: "High" | "Medium" | "Low";
  sumAssured: string;
  premium: string;
  status: "Pending" | "In Review" | "Approved" | "Declined";
  createdDate: string;
  updatedBy: string;
}

export const sampleCases: Case[] = [
  {
    id: "UW-2024-001",
    applicantName: "Sarah Johnson",
    priority: "High",
    sumAssured: "$1,500,000",
    premium: "$12,450/year",
    status: "Pending",
    createdDate: "2024-11-28",
    updatedBy: "Michael Chen"
  },
  {
    id: "UW-2024-002",
    applicantName: "Robert Martinez",
    priority: "Medium",
    sumAssured: "$750,000",
    premium: "$6,890/year",
    status: "In Review",
    createdDate: "2024-11-27",
    updatedBy: "Emma Wilson"
  },
  {
    id: "UW-2024-003",
    applicantName: "Jennifer Lee",
    priority: "High",
    sumAssured: "$2,000,000",
    premium: "$18,900/year",
    status: "In Review",
    createdDate: "2024-11-26",
    updatedBy: "David Park"
  },
  {
    id: "UW-2024-004",
    applicantName: "Michael Thompson",
    priority: "Low",
    sumAssured: "$500,000",
    premium: "$4,200/year",
    status: "Approved",
    createdDate: "2024-11-25",
    updatedBy: "Sarah Mitchell"
  },
  {
    id: "UW-2024-005",
    applicantName: "Emily Davis",
    priority: "Medium",
    sumAssured: "$1,000,000",
    premium: "$8,750/year",
    status: "Pending",
    createdDate: "2024-11-24",
    updatedBy: "James Anderson"
  },
  {
    id: "UW-2024-006",
    applicantName: "Daniel Wilson",
    priority: "High",
    sumAssured: "$1,750,000",
    premium: "$15,200/year",
    status: "In Review",
    createdDate: "2024-11-23",
    updatedBy: "Michael Chen"
  },
  {
    id: "UW-2024-007",
    applicantName: "Amanda Rodriguez",
    priority: "Low",
    sumAssured: "$600,000",
    premium: "$5,100/year",
    status: "Approved",
    createdDate: "2024-11-22",
    updatedBy: "Emma Wilson"
  },
  {
    id: "UW-2024-008",
    applicantName: "Christopher Brown",
    priority: "Medium",
    sumAssured: "$900,000",
    premium: "$7,650/year",
    status: "Declined",
    createdDate: "2024-11-21",
    updatedBy: "David Park"
  }
];
