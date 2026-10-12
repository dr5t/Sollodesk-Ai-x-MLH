import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { KpiMetrics } from './components/KpiMetrics';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { ToneEngineView } from './components/ToneEngineView';
import { ScannerModal } from './components/ScannerModal';
import { WhyOpenWeightSection } from './components/WhyOpenWeightSection';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { INITIAL_INVOICES, AVAILABLE_GEMMA_MODELS } from './data/sampleInvoices';
import type { Invoice, InvoiceStatus, GemmaModelConfig } from './types';
import { gemmaService } from './services/gemmaEngine';

export const App: React.FC = () => {
  // Invoices state with localStorage persistence
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('solodesk_invoices_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error, using defaults:', e);
    }
    return INITIAL_INVOICES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('solodesk_invoices_v1', JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [invoices]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'ledger' | 'scanner' | 'communication' | 'open_weights'>('ledger');

  // Selected invoice for detail / audit modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Invoice for tone engine
  const [chaserInvoice, setChaserInvoice] = useState<Invoice | null>(null);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  // Gemma Model configuration
  const [models, setModels] = useState<GemmaModelConfig[]>(AVAILABLE_GEMMA_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('gemma-2-2b-it');

  const activeModel = models.find(m => m.id === activeModelId) || models[0];

  const handleSelectModel = (modelId: string) => {
    setActiveModelId(modelId);
    gemmaService.setModel(modelId);
    setModels(models.map(m => ({ ...m, active: m.id === modelId })));
    setIsModelSelectorOpen(false);
  };

  // Status toggle & celebration
  const handleMarkStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status };
      }
      return inv;
    }));

    if (status === 'paid') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6366f1', '#fbbf24']
      });
    }
  };

  // Click on invoice row
  const handleOpenInvoiceDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleUpdateInvoice = (updated: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
    setSelectedInvoice(updated);
  };

  // New Invoice handler
  const handleInvoiceCreated = async (newInv: Invoice) => {
    // Run instant audit on the newly created invoice with Gemma
    const auditRes = await gemmaService.auditInvoice(newInv);
    const auditedInv: Invoice = {
      ...newInv,
      auditFindings: auditRes.findings
    };

    setInvoices(prev => [auditedInv, ...prev]);
    setSelectedInvoice(auditedInv);
    setIsDetailModalOpen(true);
  };

  // Draft chaser jump
  const handleDraftChaser = (invoice: Invoice) => {
    setChaserInvoice(invoice);
    setActiveTab('communication');
  };

  // Export ledger to JSON
  const handleExportLedger = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `solodesk_ledger_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModel={activeModel}
        onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
        onExportLedger={handleExportLedger}
        onOpenModelSelector={() => setIsModelSelectorOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.75rem 1.5rem', flex: 1 }}>
        {activeTab === 'ledger' && (
          <div>
            <KpiMetrics invoices={invoices} />
            <InvoiceList
              invoices={invoices}
              selectedInvoice={selectedInvoice}
              onSelectInvoice={handleOpenInvoiceDetail}
              onMarkStatus={handleMarkStatus}
              onDraftChaser={handleDraftChaser}
            />
          </div>
        )}

        {activeTab === 'communication' && (
          <ToneEngineView
            invoices={invoices}
            initialInvoice={chaserInvoice}
          />
        )}

        {activeTab === 'scanner' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                Local Receipt & Time-Log Parser
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Feed raw notes or receipt text to Gemma 2. It structures items into formal invoices on-device with zero server uploads.
              </p>
            </div>
            <ScannerModal
              isOpen={true}
              onClose={() => setActiveTab('ledger')}
              onInvoiceCreated={handleInvoiceCreated}
            />
          </div>
        )}

        {activeTab === 'open_weights' && (
          <WhyOpenWeightSection />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.95)',
        padding: '1.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>SoloDesk AI</strong> — Built with Google Gemma 2 Open Weights for Hacktoberfest Week 2: Side Hustle.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Zero Cloud Egress</span>
            <span>Client Privacy Protected</span>
            <span>100% Offline Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isDetailModalOpen && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {isNewInvoiceOpen && (
        <NewInvoiceModal
          isOpen={isNewInvoiceOpen}
          onClose={() => setIsNewInvoiceOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {isModelSelectorOpen && (
        <ModelSelectorModal
          isOpen={isModelSelectorOpen}
          onClose={() => setIsModelSelectorOpen(false)}
          models={models}
          activeModelId={activeModelId}
          onSelectModel={handleSelectModel}
        />
      )}
    </div>
  );
};

export default App;
