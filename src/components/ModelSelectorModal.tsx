import React from 'react';
import { 
  X, 
  Cpu, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import type { GemmaModelConfig } from '../types';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: GemmaModelConfig[];
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  models,
  activeModelId,
  onSelectModel
}) => {
  if (!isOpen) return null;

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
          maxWidth: '680px',
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
            <Cpu size={22} color="var(--brand-primary-light)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Gemma Open-Weight Architecture
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Select your on-device Google Gemma neural model runtime.
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

        {/* Content */}
        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {models.map((m) => {
              const isSelected = m.id === activeModelId;
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 22, 34, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                        {m.name}
                      </h3>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        {m.parameters}
                      </span>
                      {isSelected && (
                        <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                          Active
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--brand-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    {m.tagline}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block' }}>Context:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{m.contextWindow}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block' }}>Target Specs:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{m.recommendedHardware}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block' }}>Speed:</span>
                      <strong style={{ color: '#34d399' }}>{m.inferenceSpeed}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy Guarantee Note */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={20} color="#34d399" />
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>
                Open-Weight Financial Privacy Guarantee
              </strong>
              Both Gemma 2 variants run completely on-device. No telemetry, no cloud logging, no data retention.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
