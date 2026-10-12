import React, { useState } from 'react';
import { 
  ScanText, 
  Sparkles, 
  FileCheck, 
  Plus, 
  X, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';
import type { Invoice } from '../types';
import { gemmaService } from '../services/gemmaEngine';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (newInvoice: Invoice) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedInvoice, setExtractedInvoice] = useState<Partial<Invoice> | null>(null);

  const samplePresets = [
    {
      title: 'Slack Dev Sprint Log',
      text: `Client: Quantum Leap Labs
Project: Next.js Frontend Migration & Tailwind Styling
Rate: $125/hr
Logged Hours:
- Auth0 login integration & session tokens (16 hrs)
- Dashboard layout refactor & responsive charts (12 hrs)
- Bug fixes during staging deployment (4 hrs)
Notes: Net-14 terms. Need to reimburse $45 for Vercel team seat.`
    },
    {
      title: 'Photo & Creative Retainer',
      text: `Client: Solstice Artisan Roasters
Project: Fall Product Shoot & Instagram Asset Pack
Rate: $95/hr
Deliverables:
- Studio photography for 6 new coffee beans (10 hrs)
- Color grading, Lightroom exports, and Canva presets (8 hrs)
- Studio backdrop rental expense ($120)
Notes: Net-7 payment via direct ACH.`
    }
  ];

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await gemmaService.parseRawInvoice(rawText);
      setExtractedInvoice(res.invoice);
    } catch (err) {
      console.error('Extraction failed:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCommitToLedger = () => {
    if (!extractedInvoice) return;
    const finalInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: extractedInvoice.invoiceNumber || `INV-${Math.floor(100 + Math.random() * 900)}`,
      clientName: extractedInvoice.clientName || 'Unnamed Client',
      clientEmail: extractedInvoice.clientEmail || 'billing@example.com',
      projectTitle: extractedInvoice.projectTitle || 'Freelance Sprint',
      issuedDate: extractedInvoice.issuedDate || new Date().toISOString().split('T')[0],
      dueDate: extractedInvoice.dueDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      currency: 'USD',
      items: extractedInvoice.items || [],
      subtotal: extractedInvoice.subtotal || 0,
      taxRate: extractedInvoice.taxRate || 0.05,
      taxAmount: extractedInvoice.taxAmount || 0,
      totalAmount: extractedInvoice.totalAmount || 0,
      notes: extractedInvoice.notes || 'Parsed locally by Gemma 2.',
      contractHourlyRate: extractedInvoice.contractHourlyRate || 100,
      auditFindings: []
    };

    onInvoiceCreated(finalInvoice);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }}>
      <div 
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(12, 16, 23, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ScanText size={22} color="var(--brand-primary-light)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Local Text & Receipt Parser
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Extract invoices from messy notes or receipts using Gemma 2 on-device.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Load Sample Note / Receipt:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setRawText(preset.text)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Paste unformatted invoice notes, chat messages, or OCR text:
            </label>
            <textarea
              rows={7}
              placeholder="Paste time logs, project notes, or expenses here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                background: 'rgba(11, 15, 23, 0.7)'
              }}
            />
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.75rem' }}>
              <ShieldCheck size={16} />
              <span>Private processing: Notes never leave your browser/computer.</span>
            </div>
            <button
              onClick={handleExtract}
              disabled={isExtracting || !rawText.trim()}
              className="btn btn-primary"
            >
              {isExtracting ? (
                <>
                  <Cpu size={16} className="animate-spin-slow" />
                  Gemma Extracting...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Extract Line Items with Gemma 2
                </>
              )}
            </button>
          </div>

          {/* Extracted Preview */}
          {extractedInvoice && (
            <div style={{
              background: 'rgba(16, 22, 34, 0.8)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCheck size={18} color="#34d399" />
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>
                    Extracted Invoice: {extractedInvoice.invoiceNumber}
                  </span>
                </div>
                <div style={{ fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  ${extractedInvoice.totalAmount?.toFixed(2)}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Client: <strong style={{ color: 'var(--text-main)' }}>{extractedInvoice.clientName}</strong> | 
                Project: <strong style={{ color: 'var(--text-main)' }}>{extractedInvoice.projectTitle}</strong>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {extractedInvoice.items?.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.775rem'
                  }}>
                    <span>{item.description} ({item.quantity} hrs @ ${item.rate}/hr)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Commit Button */}
              <button
                onClick={handleCommitToLedger}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Plus size={16} />
                Save to Active Ledger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
