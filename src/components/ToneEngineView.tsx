import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Repeat
} from 'lucide-react';
import type { Invoice, ToneType, ClientCommunication, GenerationMetrics } from '../types';
import { gemmaService } from '../services/gemmaEngine';

interface ToneEngineViewProps {
  invoices: Invoice[];
  initialInvoice?: Invoice | null;
}

export const ToneEngineView: React.FC<ToneEngineViewProps> = ({
  invoices,
  initialInvoice
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialInvoice?.id || invoices[0]?.id || ''
  );
  const [selectedTone, setSelectedTone] = useState<ToneType>('firm');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeComm, setActiveComm] = useState<ClientCommunication | null>(null);
  const [metrics, setMetrics] = useState<GenerationMetrics | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  const handleGenerate = async () => {
    if (!selectedInvoice) return;
    setIsGenerating(true);
    try {
      const res = await gemmaService.generateCommunication(selectedInvoice, selectedTone);
      setActiveComm(res.communication);
      setMetrics(res.metrics);
    } catch (err) {
      console.error('Tone generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!activeComm) return;
    const textToCopy = `Subject: ${activeComm.subject}\n\n${activeComm.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones: { type: ToneType; label: string; desc: string; icon: any; color: string }[] = [
    {
      type: 'friendly',
      label: 'Gentle & Friendly',
      desc: 'Warm check-in for recurring clients or newly issued milestones.',
      icon: Clock,
      color: '#34d399'
    },
    {
      type: 'firm',
      label: 'Firm & Professional',
      desc: 'Direct remittance reminder citing due dates and account holds.',
      icon: Mail,
      color: '#818cf8'
    },
    {
      type: 'executive',
      label: 'Executive Escalation',
      desc: 'High-urgency notice citing late fees, statutory terms, and legal recourse.',
      icon: AlertCircle,
      color: '#fb7185'
    },
    {
      type: 'renewal',
      label: 'Retainer Upsell',
      desc: 'Converts finished milestones into ongoing monthly retainer commitments.',
      icon: Repeat,
      color: '#fbbf24'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '3rem' }}>
      {/* Intro Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Gemma Tone Engine
          </h2>
          <span className="badge badge-emerald">On-Device Email Generator</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Generate tailored client payment communications without leaking sensitive client contracts, emails, or rates to cloud servers.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.4fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Configuration Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {/* Invoice Picker */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Select Invoice Context
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.clientName} — {inv.invoiceNumber} (${inv.totalAmount.toFixed(2)}) [{inv.status}]
                </option>
              ))}
            </select>
            {selectedInvoice && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Due Date: {selectedInvoice.dueDate}</span>
                <span style={{ textTransform: 'capitalize' }}>Status: {selectedInvoice.status}</span>
              </div>
            )}
          </div>

          {/* Tone Selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Select Strategic Tone
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {tones.map((t) => {
                const IconComponent = t.icon;
                const isSelected = selectedTone === t.type;
                return (
                  <div
                    key={t.type}
                    onClick={() => setSelectedTone(t.type)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? t.color : 'var(--border-subtle)'}`,
                      background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 22, 34, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <IconComponent size={16} color={t.color} />
                      <span style={{ fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-main)', fontSize: '0.9rem' }}>
                        {t.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {isGenerating ? (
              <>
                <Cpu size={18} className="animate-spin-slow" />
                Gemma 2 Synthesizing Draft...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Tailored Communication
              </>
            )}
          </button>

          {/* Local Runtime Guarantee */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#34d399'
          }}>
            <ShieldCheck size={16} />
            <span>Runs locally with Gemma 2 open weights. Zero cloud telemetry.</span>
          </div>
        </div>

        {/* Right Column: Draft Preview & Copy */}
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="var(--brand-primary-light)" />
              <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                Generated Output Draft
              </span>
            </div>

            {activeComm && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            )}
          </div>

          {activeComm ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Subject Line */}
              <div style={{
                background: 'rgba(11, 15, 23, 0.8)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Subject: </span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{activeComm.subject}</span>
              </div>

              {/* Email Body Textarea */}
              <textarea
                value={activeComm.body}
                onChange={(e) => setActiveComm({ ...activeComm, body: e.target.value })}
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '260px',
                  resize: 'vertical',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  padding: '1rem',
                  fontFamily: 'var(--font-sans)',
                  background: 'rgba(11, 15, 23, 0.6)'
                }}
              />

              {/* Performance & Egress Metrics */}
              {metrics && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <span>Latency: <strong style={{ color: '#34d399' }}>{metrics.latencyMs}ms</strong></span>
                  <span>Tokens/s: <strong style={{ color: '#818cf8' }}>{metrics.tokensPerSec}</strong></span>
                  <span style={{ color: '#34d399' }}>{metrics.privacyStatus}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '2rem'
            }}>
              <Mail size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                No Communication Generated Yet
              </p>
              <p style={{ fontSize: '0.8rem', maxWidth: '320px' }}>
                Select an invoice on the left, pick your preferred tone strategy, and click generate to craft a tailored message.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
