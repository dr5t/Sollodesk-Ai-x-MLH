import React, { useState } from 'react';
import { 
  DollarSign, 
  WifiOff, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const WhyOpenWeightSection: React.FC = () => {
  const [monthlyInvoices, setMonthlyInvoices] = useState<number>(60);

  // Cost calculator
  // Closed API cost: ~$0.045 per multi-turn document audit + extraction + drafting
  // Proprietary Freelance SaaS: ~$29/mo base + usage
  const closedMonthlyCost = 29 + (monthlyInvoices * 0.45);
  const annualSavings = closedMonthlyCost * 12;

  const pillars = [
    {
      icon: Lock,
      title: 'Zero NDA & Client Data Leakage',
      desc: 'Freelancers routinely handle strict client non-disclosure agreements, proprietary codebases, and financial bank wires. Uploading these documents to closed cloud model APIs introduces third-party training and compliance liabilities. With Gemma open weights, not a single byte leaves the local machine.',
      badge: '100% Client Privacy',
      color: '#10b981'
    },
    {
      icon: DollarSign,
      title: 'Zero Marginal Cost Enables Micro-Margins',
      desc: 'Closed commercial AI APIs levy ongoing per-token taxes. For a solo freelancer or side-hustler operating on tight cash flow, paying $30-$150/month in SaaS and token tolls destroys profitability. Gemma runs for $0.00 forever on standard hardware.',
      badge: '$0.00 Ongoing API Cost',
      color: '#34d399'
    },
    {
      icon: WifiOff,
      title: 'True Offline Independence',
      desc: 'Freelance work happens everywhere: commuter trains, transatlantic flights, client air-gapped security offices, and rural retreats. Closed AI stops working the second Wi-Fi drops. Gemma runs locally on CPU/Metal/WebGPU without a heartbeat ping.',
      badge: 'Air-Gapped & Offline',
      color: '#6366f1'
    },
    {
      icon: Layers,
      title: 'Open Innovation Over Vendor Lock-In',
      desc: 'Proprietary APIs arbitrarily deprecate endpoints, enforce unpredictable rate-limiting, and modify system prompt guardrails overnight. Open-weight models like Google Gemma grant absolute sovereignty, predictable behavior, and model-swapping flexibility.',
      badge: 'Complete Sovereignty',
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '3rem' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
            <Sparkles size={14} color="#34d399" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why Open Innovation Wins for Solo Hustlers
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Built on Open Weights Because Your Client Data is Not for Sale
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            When building for freelancers, closed AI fails on the two things that matter most: 
            <strong> privacy</strong> and <strong>margin</strong>. SoloDesk AI anchors on Google Gemma 2 
            to prove that solo builders can access state-of-the-art financial intelligence without 
            sacrificing client trust or paying monthly cloud rent.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span>Gemma 2 Open License</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span>Zero External Cloud Packets</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span>Runs on M-Series / Intel / AMD Laptops</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {pillars.map((p, idx) => {
          const IconComp = p.icon;
          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: `${p.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.color
                  }}>
                    <IconComp size={20} />
                  </div>
                  <span className="badge" style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30`, fontSize: '0.65rem' }}>
                    {p.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Cost & Privacy Comparison Calculator */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Interactive Side Hustle ROI Calculator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              See how much you save every year by replacing closed cloud tools with on-device Gemma open weights.
            </p>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            Annual Savings: +${annualSavings.toFixed(0)} / yr
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              Monthly Client Documents & Audits Processed:
            </span>
            <span style={{ color: 'var(--brand-primary-light)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {monthlyInvoices} Invoices / Scans
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={monthlyInvoices}
            onChange={(e) => setMonthlyInvoices(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
          />
        </div>

        {/* Comparison Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Closed SaaS/API */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Closed Cloud Alternative
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              ${closedMonthlyCost.toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.2rem' }}>
              <li>Requires monthly SaaS fee + API per-token usage fees</li>
              <li>Exposes client receipts to cloud database leaks</li>
              <li>Zero functionality when offline or traveling</li>
            </ul>
          </div>

          {/* SoloDesk with Gemma */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              SoloDesk (Gemma 2 Open Weights)
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              $0.00 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.6, paddingLeft: '1.2rem' }}>
              <li>Zero monthly subscription or token billing forever</li>
              <li>100% private: client data never leaves laptop</li>
              <li>Runs smoothly offline with no internet access needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
