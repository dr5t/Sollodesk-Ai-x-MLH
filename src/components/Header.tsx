import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Plus, 
  Download, 
  Sparkles,
  LayoutDashboard,
  ScanText,
  Mail,
  HelpCircle
} from 'lucide-react';
import type { GemmaModelConfig } from '../types';

interface HeaderProps {
  activeTab: 'ledger' | 'scanner' | 'communication' | 'open_weights';
  setActiveTab: (tab: 'ledger' | 'scanner' | 'communication' | 'open_weights') => void;
  activeModel: GemmaModelConfig;
  onOpenNewInvoice: () => void;
  onExportLedger: () => void;
  onOpenModelSelector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeModel,
  onOpenNewInvoice,
  onExportLedger,
  onOpenModelSelector
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                SoloDesk<span style={{ color: 'var(--brand-primary-light)' }}>.ai</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                Gemma 2 Powered
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Private Freelance Ledger & Open-Weight Financial Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(16, 22, 34, 0.6)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`btn btn-sm ${activeTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'ledger' ? 'none' : 'transparent' }}
          >
            <LayoutDashboard size={15} />
            Ledger & Auditor
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`btn btn-sm ${activeTab === 'communication' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'communication' ? 'none' : 'transparent' }}
          >
            <Mail size={15} />
            Gemma Tone Engine
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`btn btn-sm ${activeTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'scanner' ? 'none' : 'transparent' }}
          >
            <ScanText size={15} />
            Local Parser
          </button>
          <button
            onClick={() => setActiveTab('open_weights')}
            className={`btn btn-sm ${activeTab === 'open_weights' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'open_weights' ? 'none' : 'transparent' }}
          >
            <HelpCircle size={15} />
            Why Open Weights
          </button>
        </nav>

        {/* Model Status Pill & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Gemma Runtime Status */}
          <button
            onClick={onOpenModelSelector}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease'
            }}
            title="Click to view Gemma runtime settings"
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <Cpu size={14} color="#10b981" />
            <span style={{ fontWeight: 600 }}>{activeModel.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <ShieldCheck size={14} color="#34d399" />
            <span style={{ color: '#34d399', fontSize: '0.7rem' }}>Zero Egress</span>
          </button>

          {/* Export Ledger Button */}
          <button 
            onClick={onExportLedger} 
            className="btn btn-secondary btn-sm"
            title="Export Ledger as JSON/CSV"
          >
            <Download size={14} />
            Export
          </button>

          {/* New Invoice */}
          <button 
            onClick={onOpenNewInvoice} 
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            New Invoice
          </button>
        </div>
      </div>
    </header>
  );
};
