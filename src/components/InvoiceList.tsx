import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  onSelectInvoice: (invoice: Invoice) => void;
  onMarkStatus: (invoiceId: string, status: InvoiceStatus) => void;
  onDraftChaser: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  selectedInvoice,
  onSelectInvoice,
  onMarkStatus,
  onDraftChaser
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch = 
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Paid</span>;
      case 'overdue':
        return <span className="badge badge-rose"><AlertTriangle size={12} /> Overdue</span>;
      case 'pending':
        return <span className="badge badge-amber"><Clock size={12} /> Pending</span>;
      case 'draft':
      default:
        return <span className="badge badge-slate"><FileText size={12} /> Draft</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Top Filter & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'overdue', 'pending', 'paid', 'draft'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilter(statusKey)}
              className={`btn btn-sm ${filter === statusKey ? 'btn-secondary' : ''}`}
              style={{
                textTransform: 'capitalize',
                background: filter === statusKey ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                borderColor: filter === statusKey ? 'var(--brand-primary)' : 'var(--border-subtle)',
                color: filter === statusKey ? 'var(--text-bright)' : 'var(--text-muted)'
              }}
            >
              {statusKey}
              <span style={{
                fontSize: '0.7rem',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0,0,0,0.3)',
                marginLeft: '0.3rem'
              }}>
                {statusKey === 'all' 
                  ? invoices.length 
                  : invoices.filter(i => i.status === statusKey).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search client, project, or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Invoice & Client</th>
              <th style={{ padding: '0.75rem 1rem' }}>Project</th>
              <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
              <th style={{ padding: '0.75rem 1rem' }}>Total</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Gemma Intelligence</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No invoices found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const unresolvedFindings = inv.auditFindings.filter(f => !f.resolved);
                const totalLeak = unresolvedFindings.reduce((s, f) => s + f.potentialRecoveredAmount, 0);
                const isSelected = selectedInvoice?.id === inv.id;

                return (
                  <tr 
                    key={inv.id}
                    onClick={() => onSelectInvoice(inv)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Invoice & Client */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>
                        {inv.clientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {inv.invoiceNumber}
                      </div>
                    </td>

                    {/* Project */}
                    <td style={{ padding: '1rem', color: 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.projectTitle}
                    </td>

                    {/* Due Date */}
                    <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      <div>{inv.dueDate}</div>
                      {inv.status === 'overdue' && (
                        <span style={{ fontSize: '0.7rem', color: '#fda4af', fontWeight: 600 }}>
                          Past Net-14
                        </span>
                      )}
                    </td>

                    {/* Total */}
                    <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                      ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(inv.status)}
                    </td>

                    {/* Gemma Audit Finding Pill */}
                    <td style={{ padding: '1rem' }}>
                      {unresolvedFindings.length > 0 ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#a5b4fc',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          <Sparkles size={13} color="#818cf8" />
                          <span>{unresolvedFindings.length} Leak{unresolvedFindings.length > 1 ? 's' : ''} (+${totalLeak.toFixed(0)})</span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          <ShieldCheck size={13} />
                          <span>Verified Clean</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => onMarkStatus(inv.id, 'paid')}
                            className="btn btn-secondary btn-sm"
                            title="Mark as Paid"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Check size={13} color="#34d399" />
                            Paid
                          </button>
                        )}
                        <button
                          onClick={() => onDraftChaser(inv)}
                          className="btn btn-secondary btn-sm"
                          title="Generate payment email with Gemma"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          Chaser
                          <ArrowUpRight size={13} />
                        </button>
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          Audit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
