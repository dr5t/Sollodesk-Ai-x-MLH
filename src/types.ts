export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: 'development' | 'design' | 'consulting' | 'expense' | 'writing' | 'revision';
  taxDeductible?: boolean;
}

export type FindingType = 'leak' | 'late_penalty' | 'tax_writeoff' | 'scope_creep' | 'compliance';
export type Severity = 'critical' | 'warning' | 'info';

export interface AuditFinding {
  id: string;
  type: FindingType;
  severity: Severity;
  title: string;
  description: string;
  potentialRecoveredAmount: number;
  suggestedAction: string;
  resolved: boolean;
  remediationPayload?: {
    addedItem?: Partial<InvoiceItem>;
    updatedDueDate?: string;
    updatedRate?: number;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  contractHourlyRate?: number;
  auditFindings: AuditFinding[];
  hasScannedReceipt?: boolean;
}

export type ToneType = 'friendly' | 'firm' | 'executive' | 'renewal';

export interface ClientCommunication {
  id: string;
  invoiceId: string;
  recipient: string;
  subject: string;
  body: string;
  tone: ToneType;
  generatedAt: string;
}

export interface GemmaModelConfig {
  id: string;
  name: string;
  tagline: string;
  parameters: string;
  contextWindow: string;
  recommendedHardware: string;
  inferenceSpeed: string;
  license: string;
  isLocal: boolean;
  active: boolean;
}

export interface GenerationMetrics {
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  tokensPerSec: number;
  externalNetworkBytes: number;
  privacyStatus: '100% On-Device (Zero Egress)';
}
