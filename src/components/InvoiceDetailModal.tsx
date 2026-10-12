import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Code2, 
  Cpu, 
  Zap
} from 'lucide-react';
import type { Invoice, AuditFinding, InvoiceItem, GenerationMetrics } from '../types';
import { gemmaService } from '../services/gemmaEngine';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onUpdateInvoice: (updatedInvoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onUpdateInvoice
}) => {
  if (!invoice) return null;

  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gemma_reasoning'>('overview');
  const [rawReasoning, setRawReasoning] = useState<string>('');
  const [metrics, setMetrics] = useState<GenerationMetrics | null>(null);

  // Trigger Gemma Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await gemmaService.auditInvoice(invoice);
      setRawReasoning(res.rawReasoning);
      setMetrics(res.metrics);

      // Merge findings
      const existingIds = new Set(invoice.auditFindings.map(f => f.title));
      const mergedFindings = [...invoice.auditFindings];
      res.findings.forEach(newF => {
        if (!existingIds.has(newF.title)) {
          mergedFindings.push(newF);
        }
      });

      onUpdateInvoice({
        ...invoice,
        auditFindings: mergedFindings
      });
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Apply Remediation Action from Gemma Finding
  const handleApplyRemediation = (finding: AuditFinding) => {
    if (!finding.remediationPayload) return;

    let updatedItems = [...invoice.items];
    let updatedRate = invoice.contractHourlyRate;

    if (finding.remediationPayload.addedItem) {
      const newItem: InvoiceItem = {
        id: `item-remedy-${Date.now()}`,
        description: finding.remediationPayload.addedItem.description || 'Remediated Deliverable',
        quantity: finding.remediationPayload.addedItem.quantity || 1,
        rate: finding.remediationPayload.addedItem.rate || 100,
        amount: finding.remediationPayload.addedItem.amount || 100,
        category: finding.remediationPayload.addedItem.category || 'development',
        taxDeductible: finding.remediationPayload.addedItem.taxDeductible
      };
      updatedItems.push(newItem);
    }

    if (finding.remediationPayload.updatedRate) {
      updatedRate = finding.remediationPayload.updatedRate;
      updatedItems = updatedItems.map(item => {
        if (item.category !== 'expense' && item.rate < updatedRate!) {
          return {
            ...item,
            rate: updatedRate!,
            amount: item.quantity * updatedRate!
          };
        }
        return item;
      });
    }

    const newSubtotal = updatedItems.reduce((acc, cur) => acc + cur.amount, 0);
    const newTax = Number((newSubtotal * invoice.taxRate).toFixed(2));
    const newTotal = newSubtotal + newTax;

    const updatedFindings = invoice.auditFindings.map(f => {
      if (f.id === finding.id) {
        return { ...f, resolved: true };
      }
      return f;
    });

    onUpdateInvoice({
      ...invoice,
      items: updatedItems,
      subtotal: newSubtotal,
      taxAmount: newTax,
      totalAmount: newTotal,
      contractHourlyRate: updatedRate,
      auditFindings: updatedFindings
    });
  };

  // Resolve finding manually
  const handleToggleResolve = (findingId: string) => {
    const updatedFindings = invoice.auditFindings.map(f => {
      if (f.id === findingId) {
        return { ...f, resolved: !f.resolved };
      }
      return f;
    });
    onUpdateInvoice({
      ...invoice,
      auditFindings: updatedFindings
    });
  };

  const unresolvedFindings = invoice.auditFindings.filter(f => !f.resolved);
  const totalLeakAmount = unresolvedFindings.reduce((s, f) => s + f.potentialRecoveredAmount, 0);

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
          maxWidth: '960px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)'
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {invoice.invoiceNumber}
              </h2>
              <span className={`badge ${
                invoice.status === 'paid' ? 'badge-emerald' :
                invoice.status === 'overdue' ? 'badge-rose' : 'badge-amber'
              }`}>
                {invoice.status}
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                {invoice.projectTitle}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Client: <strong style={{ color: 'var(--text-main)' }}>{invoice.clientName}</strong> ({invoice.clientEmail}) | Due: {invoice.dueDate}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              {isAuditing ? (
                <>
                  <Zap size={14} className="animate-spin-slow" />
                  Gemma Auditing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Run Gemma Audit
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(16, 22, 34, 0.5)',
          padding: '0 1.75rem'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Invoice & Line Items
          </button>
          <button
            onClick={() => setActiveTab('gemma_reasoning')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'gemma_reasoning' ? '2px solid var(--brand-secondary-light)' : '2px solid transparent',
              color: activeTab === 'gemma_reasoning' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Code2 size={15} color="#818cf8" />
            Gemma 2 Neural Trace
            {unresolvedFindings.length > 0 && (
              <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {unresolvedFindings.length} Leaks
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: 'auto', padding: '1.75rem', flex: 1 }}>
          {activeTab === 'overview' ? (
            <div>
              {/* Gemma Audit Alert Banner if findings exist */}
              {unresolvedFindings.length > 0 ? (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8'
                    }}>
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        Gemma Intelligence Identified {unresolvedFindings.length} Billing Opportunity{unresolvedFindings.length > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Potential Capital Recovery: <strong style={{ color: '#34d399' }}>+${totalLeakAmount.toFixed(2)}</strong> (Scope Creep & Reimbursables)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('gemma_reasoning')}
                    className="btn btn-accent btn-sm"
                  >
                    View Gemma Analysis & Remediate
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#34d399'
                }}>
                  <ShieldCheck size={16} />
                  <span>Invoice audit clean. No rate leaks or unbilled out-of-scope revisions detected.</span>
                </div>
              )}

              {/* Line Items Table */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '0.75rem' }}>
                  Billed Line Items
                </h3>
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.65rem 1rem' }}>Description</th>
                        <th style={{ padding: '0.65rem 1rem' }}>Category</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Hours / Qty</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Rate</th>
                        <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {item.description}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {item.quantity}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            ${item.rate}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  minWidth: '280px',
                  background: 'rgba(11, 15, 23, 0.6)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                    <span>Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--border-medium)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#ffffff'
                  }}>
                    <span>Total Due:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-primary-light)' }}>
                      ${invoice.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes & Contractual Terms */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Contract Terms & Remittance Notes:
                </strong>
                {invoice.notes}
              </div>
            </div>
          ) : (
            /* Gemma Neural Reasoning View */
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={18} color="#10b981" />
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>Gemma 2 Open-Weight Financial Audit</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>100% On-Device</span>
                </div>
                {metrics && (
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    <span>Latency: <strong style={{ color: '#34d399' }}>{metrics.latencyMs}ms</strong></span>
                    <span>Tokens/sec: <strong style={{ color: '#818cf8' }}>{metrics.tokensPerSec}</strong></span>
                    <span>Egress: <strong style={{ color: '#34d399' }}>0 bytes</strong></span>
                  </div>
                )}
              </div>

              {/* Detailed Findings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {invoice.auditFindings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No audit findings recorded yet. Click "Run Gemma Audit" above to analyze line items.
                  </div>
                ) : (
                  invoice.auditFindings.map((finding) => (
                    <div
                      key={finding.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: finding.resolved 
                          ? 'rgba(16, 185, 129, 0.04)' 
                          : 'rgba(16, 22, 34, 0.8)',
                        border: `1px solid ${
                          finding.resolved 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : finding.severity === 'critical' 
                              ? 'rgba(244, 63, 94, 0.35)' 
                              : 'rgba(99, 102, 241, 0.35)'
                        }`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${
                            finding.severity === 'critical' ? 'badge-rose' :
                            finding.severity === 'warning' ? 'badge-amber' : 'badge-indigo'
                          }`}>
                            {finding.type.replace('_', ' ')}
                          </span>
                          <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: finding.resolved ? 'var(--text-muted)' : '#ffffff',
                            textDecoration: finding.resolved ? 'line-through' : 'none'
                          }}>
                            {finding.title}
                          </h4>
                        </div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#34d399',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          +${finding.potentialRecoveredAmount.toFixed(2)}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        {finding.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <strong>Action:</strong> {finding.suggestedAction}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {finding.remediationPayload && !finding.resolved && (
                            <button
                              onClick={() => handleApplyRemediation(finding)}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                            >
                              <Plus size={13} />
                              Apply Gemma Remediation
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleResolve(finding.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          >
                            {finding.resolved ? 'Mark Unresolved' : 'Dismiss / Resolved'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Gemma Prompt Trace Inspection */}
              {rawReasoning && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Raw Gemma 2 Execution Log & Thought Chain:
                  </h4>
                  <pre className="code-box" style={{ maxHeight: '200px', whiteSpace: 'pre-wrap' }}>
                    {rawReasoning}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
