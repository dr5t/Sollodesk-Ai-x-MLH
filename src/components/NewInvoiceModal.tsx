import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  FilePlus 
} from 'lucide-react';
import type { Invoice, InvoiceItem } from '../types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [contractHourlyRate, setContractHourlyRate] = useState<number>(110);
  const [issuedDate, setIssuedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 14);
  const [dueDate, setDueDate] = useState<string>(defaultDue.toISOString().split('T')[0]);

  const [taxRate, setTaxRate] = useState<number>(0.08);
  const [notes, setNotes] = useState<string>('Payment terms: Net-14. Late payments subject to 2.5% statutory monthly fee.');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item-${Date.now()}-1`,
      description: 'Initial Deliverable / Sprint Milestone',
      quantity: 15,
      rate: 110,
      amount: 1650,
      category: 'development'
    }
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}-${items.length + 1}`,
        description: '',
        quantity: 5,
        rate: contractHourlyRate,
        amount: 5 * contractHourlyRate,
        category: 'development'
      }
    ]);
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        merged.amount = merged.quantity * merged.rate;
        return merged;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = subtotal + taxAmount;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectTitle.trim()) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || `billing@${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      projectTitle: projectTitle.trim(),
      issuedDate,
      dueDate,
      status: 'pending',
      currency: 'USD',
      items,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      contractHourlyRate,
      notes,
      auditFindings: []
    };

    onInvoiceCreated(newInvoice);
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
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(12, 16, 23, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FilePlus size={22} color="var(--brand-primary-light)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Create New Client Invoice
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Add line items and terms to your private local ledger.
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

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Client Organization *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Creative Studio"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Client Billing Email
              </label>
              <input
                type="email"
                placeholder="billing@client.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Project Deliverable Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Brand Identity Sprint"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Agreed Contract Rate ($/hr)
              </label>
              <input
                type="number"
                min={1}
                value={contractHourlyRate}
                onChange={(e) => setContractHourlyRate(parseInt(e.target.value, 10) || 100)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Issue Date
              </label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Due Date (Net Terms)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Tax Rate (%):
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={Math.round(taxRate * 100)}
                onChange={(e) => setTaxRate((parseFloat(e.target.value) || 0) / 100)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Remittance Terms & Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Line Items */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                Line Items & Billables
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={13} />
                Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 2.5fr) 1.2fr 80px 100px 100px 40px',
                    gap: '0.65rem',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Description of work"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleUpdateItem(item.id, { category: e.target.value as any })}
                  >
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="revision">Revision</option>
                    <option value="expense">Expense</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => handleUpdateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', textAlign: 'right' }}>
                    ${item.amount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn btn-secondary btn-icon"
                    disabled={items.length <= 1}
                    style={{ padding: '0.4rem', opacity: items.length <= 1 ? 0.3 : 1 }}
                  >
                    <Trash2 size={14} color="#fb7185" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              minWidth: '240px',
              background: 'rgba(11, 15, 23, 0.6)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax (8%):</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${taxAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', paddingTop: '0.5rem', borderTop: '1px solid var(--border-medium)' }}>
                <span>Total Due:</span>
                <span style={{ color: 'var(--brand-primary-light)', fontFamily: 'var(--font-mono)' }}>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              Save Invoice & Run Gemma Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
