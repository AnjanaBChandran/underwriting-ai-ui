export type ConfidenceLevel = "High" | "Medium" | "Low" | "Unknown";

export interface ExtractedField {
  label: string;
  value: string;
  confidence?: ConfidenceLevel;
  confidencePercentage?: number;
  sourceDocs?: string[];
  sourceDoc?: string;
  highlightLocation?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Case {
  id: string;
  applicantName: string;
  priority: "High" | "Medium" | "Low";
  sumAssured: string;
  premium: string;
  status: "Pending" | "In Review" | "Approved" | "Declined";
  createdDate: string;
  updatedBy: string;
  age?: number;
  gender?: string;
  education?: string;
  occupation?: string;
  drcScore?: string;
  nominee?: string;
  uwSummary?: string;
  financialInfo?: ExtractedField[];
  medicalInfo?: ExtractedField[];
  documents?: { name: string; uploadDate: string; path?: string }[];
  iibData?: { label: string; value: string }[];
  auditLogs?: { timestamp: string; user: string; action: string }[];
}

export const sampleCases: Case[] = [
  {
    id: "UW-2024-001",
    applicantName: "Sarah Johnson",
    priority: "High",
    sumAssured: "₹1.5Cr",
    premium: "₹10,45,000/year",
    status: "Pending",
    createdDate: "2024-11-28",
    updatedBy: "Michael Chen",
    age: 42,
    gender: "F",
    education: "Postgrad",
    occupation: "Self Employed",
    drcScore: "Standard",
    nominee: "Mother",
    uwSummary: `Summary
UW-2024-001
Sarah Johnson
11/28/2024, 9:15:32 AM
******************************

No potential match found
DRC std
42/ F / postgrad/ self empl / AI 1.5cr
nom mother  ❌
KYC ok
Q 8 in IAR answered yes – need details
CDF ok
sign on medicals matches PAN

Since SAR with ABSLI above 5 cr, would need SRUW sign off however incomplete case, would need reqts first

❌ c/f specimen signatures of LA in diff styles,
ITRs and COI for last 3 yrs
Form 26AS for latest AY

Need details and reason for yes to Q8 in IAR
Income proof verification pending`,
    financialInfo: [
      { 
        label: "Annual Income", 
        value: "₹1.5Cr",
        confidence: "High",
        confidencePercentage: 89,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.25, width: 0.35, height: 0.08 }
      },
      { 
        label: "Net Worth", 
        value: "₹21Cr",
        confidence: "Medium",
        confidencePercentage: 72,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.45, width: 0.35, height: 0.08 }
      },
      { 
        label: "ITR Filed", 
        value: "Last 3 years available",
        confidence: "High",
        confidencePercentage: 95,
        sourceDocs: ["Income Tax Returns"],
        sourceDoc: "Income Tax Returns",
        highlightLocation: { x: 0.1, y: 0.15, width: 0.4, height: 0.1 }
      },
      { 
        label: "Income Source", 
        value: "Business Revenue",
        confidence: "Medium",
        confidencePercentage: 68,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.65, width: 0.3, height: 0.08 }
      },
    ],
    medicalInfo: [
      { 
        label: "BMI", 
        value: "23.5 (Normal)",
        confidence: "High",
        confidencePercentage: 92,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.3, width: 0.25, height: 0.06 }
      },
      { 
        label: "Blood Pressure", 
        value: "120/80 mmHg",
        confidence: "High",
        confidencePercentage: 96,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.42, width: 0.3, height: 0.06 }
      },
      { 
        label: "Smoking Status", 
        value: "Non-smoker 10+ years",
        confidence: "Low",
        confidencePercentage: 58,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.52, width: 0.35, height: 0.06 }
      },
      { 
        label: "Medical History", 
        value: "No significant conditions",
        confidence: "Medium",
        confidencePercentage: 75,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.68, width: 0.4, height: 0.1 }
      },
    ],
    documents: [
      { name: "Medical Examination Report", uploadDate: "2024-11-25", path: "/docs/medical_exam.jpg" },
      { name: "Financial Statements", uploadDate: "2024-11-24", path: "/docs/financial_statements.jpg" },
      { name: "Identity Verification", uploadDate: "2024-11-24", path: "/docs/identity_verification.jpg" },
      { name: "Income Tax Returns", uploadDate: "2024-11-23" },
    ],
    iibData: [
      { label: "Previous Policy", value: "Term Plan - HDFC Life" },
      { label: "Policy Number", value: "HDFC/TP/2020/45678" },
      { label: "Sum Assured", value: "₹42L" },
      { label: "Status", value: "Active" },
      { label: "Premium Paid", value: "Regular - No defaults" },
    ],
    auditLogs: [
      { timestamp: "2024-11-28 14:30", user: "Michael Chen", action: "Case assigned" },
      { timestamp: "2024-11-27 16:45", user: "System", action: "Documents uploaded" },
      { timestamp: "2024-11-27 10:20", user: "Sarah Johnson", action: "Application submitted" },
    ],
  },
  {
    id: "UW-2024-002",
    applicantName: "Robert Martinez",
    priority: "Medium",
    sumAssured: "₹63L",
    premium: "₹5,78,000/year",
    status: "In Review",
    createdDate: "2024-11-27",
    updatedBy: "Emma Wilson"
  },
  {
    id: "UW-2024-003",
    applicantName: "Jennifer Lee",
    priority: "High",
    sumAssured: "₹1.68Cr",
    premium: "₹15,87,000/year",
    status: "In Review",
    createdDate: "2024-11-26",
    updatedBy: "David Park"
  },
  {
    id: "UW-2024-004",
    applicantName: "Michael Thompson",
    priority: "Low",
    sumAssured: "₹42L",
    premium: "₹3,53,000/year",
    status: "Approved",
    createdDate: "2024-11-25",
    updatedBy: "Sarah Mitchell"
  },
  {
    id: "UW-2024-005",
    applicantName: "Emily Davis",
    priority: "Medium",
    sumAssured: "₹84L",
    premium: "₹7,35,000/year",
    status: "Pending",
    createdDate: "2024-11-24",
    updatedBy: "James Anderson"
  },
  {
    id: "UW-2024-006",
    applicantName: "Daniel Wilson",
    priority: "High",
    sumAssured: "₹1.47Cr",
    premium: "₹12,77,000/year",
    status: "In Review",
    createdDate: "2024-11-23",
    updatedBy: "Michael Chen"
  },
  {
    id: "UW-2024-007",
    applicantName: "Amanda Rodriguez",
    priority: "Low",
    sumAssured: "₹50L",
    premium: "₹4,29,000/year",
    status: "Approved",
    createdDate: "2024-11-22",
    updatedBy: "Emma Wilson"
  },
  {
    id: "UW-2024-008",
    applicantName: "Christopher Brown",
    priority: "Medium",
    sumAssured: "₹76L",
    premium: "₹6,43,000/year",
    status: "Declined",
    createdDate: "2024-11-21",
    updatedBy: "David Park"
  }
];
