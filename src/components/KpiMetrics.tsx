import React from 'react';
import { 
  DollarSign, 
  AlertCircle, 
  Sparkles, 
  Receipt, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import type { Invoice } from '../types';

interface KpiMetricsProps {
  invoices: Invoice[];
  onFilterStatus?: (status: string) => void;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ invoices, onFilterStatus }) => {
  // Aggregate calculations
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const overdueAmount = overdueInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const paidAmount = paidInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Gemma audit recovered or claimable capital
  let totalAuditRecoverable = 0;
  let resolvedAuditSavings = 0;
  invoices.forEach(inv => {
    inv.auditFindings.forEach(f => {
      if (f.resolved) {
        resolvedAuditSavings += f.potentialRecoveredAmount;
      } else {
        totalAuditRecoverable += f.potentialRecoveredAmount;
      }
    });
  });

  // Schedule C tax write-offs identified
  const estimatedTaxDeductions = invoices.reduce((acc, curr) => {
    const expenseTotal = curr.items
      .filter(item => item.category === 'expense' || item.taxDeductible)
      .reduce((sum, item) => sum + item.amount, 0);
    return acc + expenseTotal;
  }, 330); // 330 base from hardware/staging setup

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {/* Total Billed */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          cursor: onFilterStatus ? 'pointer' : 'default'
        }}
        onClick={() => onFilterStatus && onFilterStatus('all')}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Pipeline Volume
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <DollarSign size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
          ${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <TrendingUp size={12} /> ${paidAmount.toLocaleString()}
          </span>
          <span>collected to date</span>
        </div>
      </div>

      {/* Cash at Risk / Overdue */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          cursor: onFilterStatus ? 'pointer' : 'default',
          borderColor: overdueAmount > 0 ? 'rgba(244, 63, 94, 0.25)' : 'var(--border-subtle)'
        }}
        onClick={() => onFilterStatus && onFilterStatus('overdue')}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #f43f5e, #fb7185)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Receivables At Risk
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e'
          }}>
            <AlertCircle size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: overdueAmount > 0 ? '#fda4af' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
          ${overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
            {overdueInvoices.length} Overdue
          </span>
          <span>Requires Gemma Chaser</span>
        </div>
      </div>

      {/* Recovered by Gemma Audit */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #10b981, #6366f1)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gemma Audit Recovery
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <Sparkles size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
          +${(totalAuditRecoverable + resolvedAuditSavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
            Scope & Leaks
          </span>
          <span>Protected freelancer margin</span>
        </div>
      </div>

      {/* Tax Write-Offs & Privacy */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #f59e0b, #10b981)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Schedule C Deductions
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Receipt size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
          ${estimatedTaxDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981' }}>
          <ShieldCheck size={14} />
          <span style={{ fontWeight: 600 }}>0 Cloud Egress | $0 API Cost</span>
        </div>
      </div>
    </div>
  );
};
