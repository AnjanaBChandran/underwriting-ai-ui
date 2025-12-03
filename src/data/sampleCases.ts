export type ConfidenceLevel = "High" | "Medium" | "Low" | "Unknown";

interface Document {
  name: string;
  uploadDate: string;
  path?: string;
  quality?: "High" | "Medium" | "Low";
  ocrConfidence?: "High" | "Medium" | "Low";
  ocrScore?: number;
}

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
  evidenceSnippets?: { text: string; source: string; page?: number }[];
  rationale?: string;
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
  channel?: string;
  product?: string;
  ageing?: number;
  policyNumber?: string;
  age?: number;
  gender?: string;
  education?: string;
  occupation?: string;
  drcScore?: string;
  nominee?: string;
  uwSummary?: string;
  financialInfo?: ExtractedField[];
  medicalInfo?: ExtractedField[];
  documents?: Document[];
  requiredDocuments?: string[];
  missingDocuments?: string[];
  iibData?: { label: string; value: string }[];
  auditLogs?: { timestamp: string; user: string; action: string }[];
}

export const sampleCases: Case[] = [
  {
    id: "009976959",
    applicantName: "Amit Sharma",
    priority: "High",
    sumAssured: "₹2.55 Cr",
    premium: "₹89,897.53",
    status: "Pending",
    createdDate: "2024-11-28",
    updatedBy: "Rohan Mehta",
    channel: "DSF Individual Agent",
    product: "ABSLI Super Term – TERM Option",
    ageing: 5,
    policyNumber: "009976959",
    age: 42,
    gender: "M",
    education: "Postgrad",
    occupation: "Self Employed",
    drcScore: "Standard",
    nominee: "Mother",
    uwSummary: `Summary
009976959
Amit Sharma
11/28/2024, 9:15:32 AM
******************************

No potential match found
DRC std
42/ M / postgrad/ self empl / AI 2.55cr
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
        value: "₹2.55Cr",
        confidence: "High",
        confidencePercentage: 89,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.25, width: 0.35, height: 0.08 },
        evidenceSnippets: [
          { text: "Annual Income: ₹2.55Cr", source: "Financial Statements", page: 2 }
        ],
        rationale: "The value was determined based on the highlighted text in the uploaded financial statement. The information appears clearly in the source document."
      },
      { 
        label: "Net Worth", 
        value: "₹21Cr",
        confidence: "Medium",
        confidencePercentage: 72,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.45, width: 0.35, height: 0.08 },
        evidenceSnippets: [
          { text: "Net Worth: ₹21Cr", source: "Financial Statements", page: 3 }
        ],
        rationale: "Net worth value extracted from financial documents. Confidence is Medium due to partially unclear text in some sections."
      },
      { 
        label: "ITR Filed", 
        value: "Last 3 years available",
        confidence: "High",
        confidencePercentage: 95,
        sourceDocs: ["Income Tax Returns"],
        sourceDoc: "Income Tax Returns",
        highlightLocation: { x: 0.1, y: 0.15, width: 0.4, height: 0.1 },
        evidenceSnippets: [
          { text: "ITR Filed for AY 2021-22, 2022-23, 2023-24", source: "Income Tax Returns", page: 1 }
        ],
        rationale: "ITR filing records verified from uploaded income tax returns. All three years are clearly documented."
      },
      { 
        label: "Income Source", 
        value: "Business Revenue",
        confidence: "Medium",
        confidencePercentage: 68,
        sourceDocs: ["Financial Statements"],
        sourceDoc: "Financial Statements",
        highlightLocation: { x: 0.15, y: 0.65, width: 0.3, height: 0.08 },
        evidenceSnippets: [
          { text: "Primary Income: Business Operations", source: "Financial Statements", page: 1 }
        ],
        rationale: "Income source identified from financial statements. Medium confidence due to document requiring cross-verification with other proofs."
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
        highlightLocation: { x: 0.1, y: 0.3, width: 0.25, height: 0.06 },
        evidenceSnippets: [
          { text: "BMI: 23.5 kg/m² (Normal Range)", source: "Medical Examination Report", page: 1 }
        ],
        rationale: "BMI value calculated and clearly documented in the medical examination report."
      },
      { 
        label: "Blood Pressure", 
        value: "120/80 mmHg",
        confidence: "High",
        confidencePercentage: 96,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.42, width: 0.3, height: 0.06 },
        evidenceSnippets: [
          { text: "BP: 120/80 mmHg (Normal)", source: "Medical Examination Report", page: 1 }
        ],
        rationale: "Blood pressure reading is clearly visible and within normal range according to the medical examination report."
      },
      { 
        label: "Smoking Status", 
        value: "Non-smoker 10+ years",
        confidence: "Low",
        confidencePercentage: 58,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.52, width: 0.35, height: 0.06 },
        evidenceSnippets: [
          { text: "Smoking Status: Non-smoker 10+ years", source: "Medical Examination Report", page: 2 }
        ],
        rationale: "Smoking status extracted from medical examination report. Low confidence due to poor document scan quality and unclear text."
      },
      { 
        label: "Medical History", 
        value: "No significant conditions",
        confidence: "Medium",
        confidencePercentage: 75,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
        highlightLocation: { x: 0.1, y: 0.68, width: 0.4, height: 0.1 },
        evidenceSnippets: [
          { text: "Past Medical History: No significant conditions reported", source: "Medical Examination Report", page: 2 }
        ],
        rationale: "Medical history extracted from the examination report. Medium confidence as this requires additional verification from patient declaration forms."
      },
    ],
    documents: [
      { 
        name: "Medical Examination Report", 
        uploadDate: "2024-11-25", 
        path: "/docs/medical_exam.jpg",
        quality: "Low",
        ocrConfidence: "Low",
        ocrScore: 58
      },
      { 
        name: "Financial Statements", 
        uploadDate: "2024-11-24", 
        path: "/docs/financial_statements.jpg",
        quality: "Medium",
        ocrConfidence: "Medium",
        ocrScore: 76
      },
      { 
        name: "Identity Verification", 
        uploadDate: "2024-11-24", 
        path: "/docs/identity_verification.jpg",
        quality: "High",
        ocrConfidence: "High",
        ocrScore: 94
      },
      { 
        name: "Income Tax Returns", 
        uploadDate: "2024-11-23",
        quality: "High",
        ocrConfidence: "High",
        ocrScore: 91
      },
    ],
    requiredDocuments: ["Identity Verification", "Financial Statements", "Medical Examination Report", "Income Tax Returns", "Bank Statement"],
    missingDocuments: ["Bank Statement"],
    iibData: [
      { label: "Previous Policy", value: "Term Plan - HDFC Life" },
      { label: "Policy Number", value: "HDFC/TP/2020/45678" },
      { label: "Sum Assured", value: "₹42L" },
      { label: "Status", value: "Active" },
      { label: "Premium Paid", value: "Regular - No defaults" },
    ],
    auditLogs: [
      { timestamp: "2024-11-28 14:30", user: "Rohan Mehta", action: "Case assigned" },
      { timestamp: "2024-11-27 16:45", user: "System", action: "Documents uploaded" },
      { timestamp: "2024-11-27 10:20", user: "Amit Sharma", action: "Application submitted" },
    ],
  },
  {
    id: "009986208",
    applicantName: "Riya Kapoor",
    priority: "Medium",
    sumAssured: "₹50,00,000",
    premium: "₹3,14,431.27",
    status: "In Review",
    createdDate: "2024-11-27",
    updatedBy: "Priya Nair",
    channel: "D2C INSURANCE BROKING PVT",
    product: "ABSLI DigiShield 2021 OPT1 T35 P35",
    ageing: 22,
    policyNumber: "009986208",
  },
  {
    id: "009990346",
    applicantName: "Harsh Verma",
    priority: "High",
    sumAssured: "₹1 Cr",
    premium: "₹33,326.68",
    status: "In Review",
    createdDate: "2024-11-26",
    updatedBy: "Dev Singh",
    channel: "POLICY BAZAAR INSURANCE B",
    product: "ABSLI Super Term – TERM Option",
    ageing: 1,
    policyNumber: "009990346",
  },
  {
    id: "009990675",
    applicantName: "Meenal Joshi",
    priority: "Low",
    sumAssured: "₹1 Cr",
    premium: "₹71,744",
    status: "Approved",
    createdDate: "2024-11-25",
    updatedBy: "Sanjay Rao",
    channel: "DSF Individual Agent",
    product: "ABSLI Super Term – TERM Option",
    ageing: 3,
    policyNumber: "009990675",
  },
  {
    id: "009991418",
    applicantName: "Suresh Iyer",
    priority: "Medium",
    sumAssured: "₹1 Cr",
    premium: "₹9,233.50",
    status: "Pending",
    createdDate: "2024-11-24",
    updatedBy: "Kavita Menon",
    channel: "DSF Individual Agent",
    product: "ABSLI PoornaSuraksha Kawach OPT1 P24T24",
    ageing: 3,
    policyNumber: "009991418",
  }
];
