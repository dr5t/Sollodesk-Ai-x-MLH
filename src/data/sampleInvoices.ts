import type { Invoice } from '../types';

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-084',
    clientName: 'Apex Creative Studio',
    clientEmail: 'billing@apexstudio.design',
    projectTitle: 'Brand Identity & Interactive Webflow Site',
    issuedDate: '2026-09-12',
    dueDate: '2026-09-26',
    status: 'overdue',
    currency: 'USD',
    taxRate: 0.08,
    contractHourlyRate: 110,
    items: [
      {
        id: 'item-101',
        description: 'Design System & Figma Component Tokens',
        quantity: 24,
        rate: 110,
        amount: 2640,
        category: 'design'
      },
      {
        id: 'item-102',
        description: 'Webflow Production Build & CMS Collection Setup',
        quantity: 30,
        rate: 110,
        amount: 3300,
        category: 'development'
      },
      {
        id: 'item-103',
        description: 'Client Feedback Sprint 1 (Initial Revisions)',
        quantity: 6,
        rate: 110,
        amount: 660,
        category: 'revision'
      }
    ],
    subtotal: 6600,
    taxAmount: 528,
    totalAmount: 7128,
    notes: 'Payment terms: Net-14. Late payments subject to 2.5% statutory monthly compounding fee.',
    hasScannedReceipt: true,
    auditFindings: [
      {
        id: 'find-001',
        type: 'scope_creep',
        severity: 'critical',
        title: 'Unbilled Out-of-Scope Revisions Detected',
        description: 'Client requested 3 rounds of extra 3D model integrations and micro-animations (11 extra hours logged in commits) outside the 2-round limit stated in the SOW.',
        potentialRecoveredAmount: 1210,
        suggestedAction: 'Append "Out-of-Scope 3D/Animation Revision Sprint" item at contract rate of $110/hr.',
        resolved: false,
        remediationPayload: {
          addedItem: {
            description: 'Out-of-Scope 3D Interaction & Spline Integration (11 hrs)',
            quantity: 11,
            rate: 110,
            amount: 1210,
            category: 'revision'
          }
        }
      },
      {
        id: 'find-002',
        type: 'leak',
        severity: 'warning',
        title: 'Unreimbursed Cloud Infrastructure Expense',
        description: 'Netlify Pro hosting & custom domain SSL purchase ($185.00) was paid on your personal card during staging setup and has not been billed to Apex.',
        potentialRecoveredAmount: 185,
        suggestedAction: 'Bill pass-through staging & hosting expense with attached receipt.',
        resolved: false,
        remediationPayload: {
          addedItem: {
            description: 'Pass-Through Expense: Netlify Pro & Custom Domain Annual Provisioning',
            quantity: 1,
            rate: 185,
            amount: 185,
            category: 'expense',
            taxDeductible: true
          }
        }
      },
      {
        id: 'find-003',
        type: 'late_penalty',
        severity: 'warning',
        title: 'Overdue Term Penalty Eligible (17 Days Past Net-14)',
        description: 'Invoice is 17 days past due date (due Sept 26). According to your stated contract terms (2.5% monthly), an accrued late penalty of $178.20 is legally claimable.',
        potentialRecoveredAmount: 178.2,
        suggestedAction: 'Send Firm/Executive Payment Follow-Up citing clause 4.2 with late accrual schedule.',
        resolved: false
      }
    ]
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-089',
    clientName: 'Vanguard Fintech Labs',
    clientEmail: 'finance@vanguardfintech.io',
    projectTitle: 'Real-time WebSocket Ledger & Auth Architecture',
    issuedDate: '2026-10-02',
    dueDate: '2026-10-16',
    status: 'pending',
    currency: 'USD',
    taxRate: 0.0,
    contractHourlyRate: 140,
    items: [
      {
        id: 'item-201',
        description: 'WebSocket Server Core & JWT Authentication Gateway',
        quantity: 40,
        rate: 140,
        amount: 5600,
        category: 'development'
      },
      {
        id: 'item-202',
        description: 'Stress Testing & Latency Benchmarks (Sub-20ms p99)',
        quantity: 16,
        rate: 140,
        amount: 2240,
        category: 'development'
      }
    ],
    subtotal: 7840,
    taxAmount: 0,
    totalAmount: 7840,
    notes: 'Milestone 2 deliverable. Net-14 direct wire transfer.',
    hasScannedReceipt: false,
    auditFindings: [
      {
        id: 'find-004',
        type: 'tax_writeoff',
        severity: 'info',
        title: 'Schedule C Freelance Tax Deduction Opportunity',
        description: 'Dedicated cloud test instances on AWS/DigitalOcean used during benchmarking ($145) qualify as 100% freelance business expenses under Section 162.',
        potentialRecoveredAmount: 145,
        suggestedAction: 'Tag benchmark compute receipts to Year-End Tax Ledger.',
        resolved: false
      }
    ]
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-077',
    clientName: 'Komorebi Artisan Teas',
    clientEmail: 'founders@komorebiteas.co',
    projectTitle: 'E-Commerce Product Visuals & Shopify Store Polish',
    issuedDate: '2026-08-20',
    dueDate: '2026-09-03',
    status: 'paid',
    currency: 'USD',
    taxRate: 0.06,
    contractHourlyRate: 95,
    items: [
      {
        id: 'item-301',
        description: 'Product Catalog Studio Photography & Retouching (14 SKUs)',
        quantity: 1,
        rate: 1800,
        amount: 1800,
        category: 'design'
      },
      {
        id: 'item-302',
        description: 'Shopify Dawn Theme Customization & Liquid Templates',
        quantity: 12,
        rate: 75, // Accidental underbilling! Contract rate was 95
        amount: 900,
        category: 'development'
      }
    ],
    subtotal: 2700,
    taxAmount: 162,
    totalAmount: 2862,
    notes: 'Paid via Stripe on Sept 02, 2026.',
    hasScannedReceipt: true,
    auditFindings: [
      {
        id: 'find-005',
        type: 'leak',
        severity: 'warning',
        title: 'Contract Rate Underbilling Flagged',
        description: 'Shopify Theme work was billed at $75/hr instead of your standard Q3 contract rate of $95/hr ($240 loss over 12 hours).',
        potentialRecoveredAmount: 240,
        suggestedAction: 'Lock contract rate default in client master profile to prevent repeat underbilling on upcoming Q4 retainer.',
        resolved: true
      }
    ]
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-092',
    clientName: 'Horizon Robotics Corp',
    clientEmail: 'ap@horizonrobotics.ai',
    projectTitle: 'Developer SDK Documentation & Interactive Sandbox',
    issuedDate: '2026-10-09',
    dueDate: '2026-10-23',
    status: 'draft',
    currency: 'USD',
    taxRate: 0.0,
    contractHourlyRate: 125,
    items: [
      {
        id: 'item-401',
        description: 'TypeScript SDK OpenAPI Spec Generation & TypeDoc',
        quantity: 20,
        rate: 125,
        amount: 2500,
        category: 'writing'
      },
      {
        id: 'item-402',
        description: 'Interactive Code Sandbox & Next.js Quickstart Guides',
        quantity: 15,
        rate: 125,
        amount: 1875,
        category: 'development'
      }
    ],
    subtotal: 4375,
    taxAmount: 0,
    totalAmount: 4375,
    notes: 'Draft stage. Pending final review before delivery.',
    hasScannedReceipt: false,
    auditFindings: []
  }
];

export const AVAILABLE_GEMMA_MODELS = [
  {
    id: 'gemma-2-2b-it',
    name: 'Gemma 2 (2B-IT)',
    tagline: 'Ultra-fast, on-device lightweight financial intelligence',
    parameters: '2.61 Billion',
    contextWindow: '8,192 tokens',
    recommendedHardware: 'Any laptop / CPU / M1/M2/M3 / 4GB RAM',
    inferenceSpeed: '42 tokens/sec',
    license: 'Gemma Open License (Google)',
    isLocal: true,
    active: true
  },
  {
    id: 'gemma-2-9b-it',
    name: 'Gemma 2 (9B-IT)',
    tagline: 'Deep reasoning open-weight engine for complex contract analysis',
    parameters: '9.24 Billion',
    contextWindow: '8,192 tokens',
    recommendedHardware: 'Apple Silicon / 12GB RAM or WebGPU',
    inferenceSpeed: '28 tokens/sec',
    license: 'Gemma Open License (Google)',
    isLocal: true,
    active: false
  }
];
