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
  policyNo: string;
  priority: string;
  planName: string;
  sar: string;
  premium: string;
  advisorLevel: string;
  channelName: string;
  medical: string;
  resumptionDate: string;
  lastUpdDt: string;
  ageing: string;
  activity: string;
  lastAssignedID: string;
  // Legacy fields for case workspace compatibility
  applicantName?: string;
  sumAssured?: string;
  status?: "Pending" | "In Review" | "Approved" | "Declined";
  createdDate?: string;
  updatedBy?: string;
  channel?: string;
  product?: string;
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

// Helper function to format SAR to readable format (e.g., 25500000 → ₹2.55 Cr)
export const formatSAR = (sar: string): string => {
  const num = parseInt(sar, 10);
  if (isNaN(num)) return sar;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Helper function to format Premium (e.g., 89897.53 → ₹89,898/year)
export const formatPremium = (premium: string): string => {
  const num = parseFloat(premium);
  if (isNaN(num)) return premium;
  return `₹${Math.round(num).toLocaleString('en-IN')}/year`;
};

export const sampleCases: Case[] = [
  {
    id: "UW-2024-001",
    policyNo: "009976959",
    priority: "1",
    planName: "ABSLI Super Term-TERM Option",
    sar: "25500000",
    premium: "89897.53",
    advisorLevel: "LEV5A",
    channelName: "DSF Individual Agent",
    medical: "MEDICAL CASE",
    resumptionDate: "2025-10-04",
    lastUpdDt: "2025-10-09",
    ageing: "5",
    activity: "UnderWriter",
    lastAssignedID: "MIN338075",
    // Legacy data for case workspace
    applicantName: "Applicant - 009976959",
    sumAssured: "₹2.55 Cr",
    status: "In Review",
    createdDate: "2025-10-04",
    updatedBy: "MIN338075",
    channel: "Agent",
    product: "Term Life Insurance",
    age: 35,
    gender: "M",
    education: "Graduate",
    occupation: "Employed",
    drcScore: "Standard",
    nominee: "Spouse",
    uwSummary: `Summary
009976959
ABSLI Super Term-TERM Option
2025-10-09, 10:15:32 AM
******************************

• No potential match found
• DRC: Standard
• 35/M, Graduate, Employed, SAR ₹2.55 Cr
• Nominee: Spouse ✔️
• KYC OK
• Medical Case - Examination Complete
• Premium: ₹89,898/year
• Channel: DSF Individual Agent
• Advisor Level: LEV5A

✔️ All documents verified
✔️ Medical clearance obtained`,
    financialInfo: [
      { 
        label: "Sum Assured", 
        value: "₹2.55 Cr",
        confidence: "High",
        confidencePercentage: 95,
        sourceDocs: ["Application Form"],
        sourceDoc: "Application Form",
      },
      { 
        label: "Annual Premium", 
        value: "₹89,898/year",
        confidence: "High",
        confidencePercentage: 98,
        sourceDocs: ["Premium Schedule"],
        sourceDoc: "Premium Schedule",
      },
    ],
    medicalInfo: [
      { 
        label: "Medical Status", 
        value: "MEDICAL CASE",
        confidence: "High",
        confidencePercentage: 100,
        sourceDocs: ["Medical Examination Report"],
        sourceDoc: "Medical Examination Report",
      },
    ],
    documents: [
      { name: "Medical Examination Report", uploadDate: "2025-10-04", path: "/docs/medical_exam.jpg", quality: "High", ocrConfidence: "High", ocrScore: 92 },
      { name: "Financial Statements", uploadDate: "2025-10-04", path: "/docs/financial_statements.jpg", quality: "High", ocrConfidence: "High", ocrScore: 94 },
      { name: "Identity Verification", uploadDate: "2025-10-04", path: "/docs/identity_verification.jpg", quality: "High", ocrConfidence: "High", ocrScore: 96 },
    ],
    auditLogs: [
      { timestamp: "2025-10-09 10:15", user: "MIN338075", action: "Case reviewed" },
      { timestamp: "2025-10-04 09:30", user: "System", action: "Case assigned" },
    ],
  },
  {
    id: "UW-2024-002",
    policyNo: "009986208",
    priority: "2",
    planName: "ABSLI DigiShield 2021 OPT1 T35 P35",
    sar: "50000000",
    premium: "314431.27",
    advisorLevel: "LEV1",
    channelName: "D2C INSURANCE BROKING PVT",
    medical: "MEDICAL CASE",
    resumptionDate: "2025-09-17",
    lastUpdDt: "2025-10-09",
    ageing: "22",
    activity: "UnderWriter",
    lastAssignedID: "MIN023395",
    applicantName: "Applicant - 009986208",
    sumAssured: "₹5.00 Cr",
    status: "In Review",
    createdDate: "2025-09-17",
    updatedBy: "MIN023395",
    channel: "Broker",
    product: "Term Life Insurance",
    uwSummary: `Summary
009986208
ABSLI DigiShield 2021 OPT1 T35 P35
2025-10-09, 11:30:00 AM
******************************

• No potential match found
• DRC: Standard
• SAR ₹5.00 Cr - High Value Case
• Nominee: To be verified
• KYC OK
• Medical Case - Pending Review
• Premium: ₹3,14,431/year
• Channel: D2C INSURANCE BROKING PVT
• Advisor Level: LEV1

⚠️ High ageing (22 days) - Priority attention needed
❌ Medical reports pending verification`,
    financialInfo: [
      { label: "Sum Assured", value: "₹5.00 Cr", confidence: "High", confidencePercentage: 95 },
      { label: "Annual Premium", value: "₹3,14,431/year", confidence: "High", confidencePercentage: 98 },
    ],
    documents: [
      { name: "Medical Examination Report", uploadDate: "2025-09-17", path: "/docs/medical_exam.jpg", quality: "Medium", ocrConfidence: "Medium", ocrScore: 78 },
      { name: "Financial Statements", uploadDate: "2025-09-17", path: "/docs/financial_statements.jpg", quality: "High", ocrConfidence: "High", ocrScore: 90 },
    ],
    auditLogs: [
      { timestamp: "2025-10-09 11:30", user: "MIN023395", action: "Case under review" },
      { timestamp: "2025-09-17 14:00", user: "System", action: "Case created" },
    ],
  },
  {
    id: "UW-2024-003",
    policyNo: "009990346",
    priority: "2",
    planName: "ABSLI Super Term-TERM Option",
    sar: "10000000",
    premium: "33326.68",
    advisorLevel: "LEV3",
    channelName: "POLICY BAZAAR INSURANCE B",
    medical: "MEDICAL CASE",
    resumptionDate: "2025-10-09",
    lastUpdDt: "2025-10-09",
    ageing: "-",
    activity: "UnderWriter",
    lastAssignedID: "IN616792",
    applicantName: "Applicant - 009990346",
    sumAssured: "₹1.00 Cr",
    status: "Pending",
    createdDate: "2025-10-09",
    updatedBy: "IN616792",
    channel: "Online",
    product: "Term Life Insurance",
    uwSummary: `Summary
009990346
ABSLI Super Term-TERM Option
2025-10-09, 09:00:00 AM
******************************

• No potential match found
• DRC: Standard
• SAR ₹1.00 Cr
• Nominee: Pending verification
• KYC OK
• Medical Case - New submission
• Premium: ₹33,327/year
• Channel: POLICY BAZAAR INSURANCE B
• Advisor Level: LEV3

✔️ Fresh case - Same day submission
⚠️ Awaiting document verification`,
    financialInfo: [
      { label: "Sum Assured", value: "₹1.00 Cr", confidence: "High", confidencePercentage: 95 },
      { label: "Annual Premium", value: "₹33,327/year", confidence: "High", confidencePercentage: 98 },
    ],
    documents: [
      { name: "Medical Examination Report", uploadDate: "2025-10-09", path: "/docs/medical_exam.jpg", quality: "High", ocrConfidence: "High", ocrScore: 88 },
      { name: "Identity Verification", uploadDate: "2025-10-09", path: "/docs/identity_verification.jpg", quality: "High", ocrConfidence: "High", ocrScore: 95 },
    ],
    auditLogs: [
      { timestamp: "2025-10-09 09:00", user: "IN616792", action: "Case assigned" },
      { timestamp: "2025-10-09 08:45", user: "System", action: "Case created" },
    ],
  },
  {
    id: "UW-2024-004",
    policyNo: "009990675",
    priority: "2",
    planName: "ABSLI Super Term-TERM Option",
    sar: "10000000",
    premium: "71744",
    advisorLevel: "LEV2",
    channelName: "DSF Individual Agent",
    medical: "MEDICAL CASE",
    resumptionDate: "2025-10-06",
    lastUpdDt: "2025-10-09",
    ageing: "3",
    activity: "UnderWriter",
    lastAssignedID: "MIN023395",
    applicantName: "Applicant - 009990675",
    sumAssured: "₹1.00 Cr",
    status: "In Review",
    createdDate: "2025-10-06",
    updatedBy: "MIN023395",
    channel: "Agent",
    product: "Term Life Insurance",
    uwSummary: `Summary
009990675
ABSLI Super Term-TERM Option
2025-10-09, 14:20:00 PM
******************************

• No potential match found
• DRC: Standard
• SAR ₹1.00 Cr
• Nominee: Verified ✔️
• KYC OK
• Medical Case - Under Review
• Premium: ₹71,744/year
• Channel: DSF Individual Agent
• Advisor Level: LEV2

✔️ Documents complete
⚠️ Medical report review in progress`,
    financialInfo: [
      { label: "Sum Assured", value: "₹1.00 Cr", confidence: "High", confidencePercentage: 95 },
      { label: "Annual Premium", value: "₹71,744/year", confidence: "High", confidencePercentage: 98 },
    ],
    documents: [
      { name: "Medical Examination Report", uploadDate: "2025-10-06", path: "/docs/medical_exam.jpg", quality: "High", ocrConfidence: "High", ocrScore: 91 },
      { name: "Financial Statements", uploadDate: "2025-10-06", path: "/docs/financial_statements.jpg", quality: "High", ocrConfidence: "High", ocrScore: 93 },
      { name: "Identity Verification", uploadDate: "2025-10-06", path: "/docs/identity_verification.jpg", quality: "High", ocrConfidence: "High", ocrScore: 97 },
    ],
    auditLogs: [
      { timestamp: "2025-10-09 14:20", user: "MIN023395", action: "Medical review started" },
      { timestamp: "2025-10-06 10:00", user: "System", action: "Case assigned" },
    ],
  },
  {
    id: "UW-2024-005",
    policyNo: "009991418",
    priority: "2",
    planName: "ABSLI PoornaSuraksha Kawach OPT1 P24T24",
    sar: "10000000",
    premium: "9233.5",
    advisorLevel: "LEV3",
    channelName: "DSF Individual Agent",
    medical: "MEDICAL CASE",
    resumptionDate: "2025-10-06",
    lastUpdDt: "2025-10-09",
    ageing: "3",
    activity: "UnderWriter",
    lastAssignedID: "IN448403",
    applicantName: "Applicant - 009991418",
    sumAssured: "₹1.00 Cr",
    status: "Pending",
    createdDate: "2025-10-06",
    updatedBy: "IN448403",
    channel: "Agent",
    product: "Critical Illness Cover",
    uwSummary: `Summary
009991418
ABSLI PoornaSuraksha Kawach OPT1 P24T24
2025-10-09, 16:45:00 PM
******************************

• No potential match found
• DRC: Standard
• SAR ₹1.00 Cr
• Nominee: Pending verification
• KYC OK
• Medical Case - Documents pending
• Premium: ₹9,234/year
• Channel: DSF Individual Agent
• Advisor Level: LEV3

⚠️ Awaiting additional documents
❌ Medical history verification pending`,
    financialInfo: [
      { label: "Sum Assured", value: "₹1.00 Cr", confidence: "High", confidencePercentage: 95 },
      { label: "Annual Premium", value: "₹9,234/year", confidence: "High", confidencePercentage: 98 },
    ],
    documents: [
      { name: "Identity Verification", uploadDate: "2025-10-06", path: "/docs/identity_verification.jpg", quality: "High", ocrConfidence: "High", ocrScore: 94 },
    ],
    missingDocuments: ["Medical Examination Report", "Financial Statements"],
    auditLogs: [
      { timestamp: "2025-10-09 16:45", user: "IN448403", action: "Document request sent" },
      { timestamp: "2025-10-06 11:30", user: "System", action: "Case assigned" },
    ],
  },
];
