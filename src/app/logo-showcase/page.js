'use client';
import { useState } from 'react';
import Link from 'next/link';

const LOGO_OPTIONS = [
  {
    id: 10,
    title: 'Option 10: Diamond Facet U',
    slogan: "Instant Payments. Unlimited Growth.",
    image: '/opt10.png',
    desc: 'Paytm / Razorpay style 4-facet geometric diamond forming a modern U mark.'
  },
  {
    id: 11,
    title: 'Option 11: Contactless NFC Spark',
    slogan: "Pay Fast, Live Smart.",
    image: '/opt11.png',
    desc: 'PhonePe / Google Pay style dual interlocking NFC rings with lightning spark.'
  },
  {
    id: 1,
    title: 'Option 1: Digital Shield & Wallet Pulse',
    slogan: "India's Digital Payment Network",
    image: '/opt1.png',
    desc: 'Shield badge with digital wallet pulse line for security & speed.'
  },
  {
    id: 2,
    title: 'Option 2: Dynamic Speed Loop',
    slogan: "Smart Payment, Seamless Suvidha",
    image: '/opt2.png',
    desc: 'Circular U transfer arrows symbolizing fast recharges and BBPS.'
  },
  {
    id: 3,
    title: 'Option 3: Geometric U & Verified Check',
    slogan: "EMPOWERING LOCAL RETAILERS ACROSS INDIA",
    image: '/opt3.png',
    desc: 'Horizontal corporate emblem with lightning bolt & checkmark.'
  },
  {
    id: 4,
    title: 'Option 4: Royal Crown Banking',
    slogan: "Digital Banking Ka Naya Bharat",
    image: '/opt4.png',
    desc: 'Gold & Royal Blue crown emblem with heartbeat U pulse.'
  },
  {
    id: 5,
    title: 'Option 5: Tech Network & Fingerprint AEPS',
    slogan: "Aapki Apni Digital Suvidha",
    image: '/opt5.png',
    desc: 'Interconnected tech grid nodes + biometric fingerprint pulse.'
  },
  {
    id: 6,
    title: 'Option 6: 3D Infinity Loop Glow',
    slogan: "FAST. SECURE. UNLIMITED EARNINGS.",
    image: '/opt6.png',
    desc: 'Vibrant 3D infinity ribbon folded into a modern U mark.'
  },
  {
    id: 7,
    title: 'Option 7: Cyberpunk Neon Monogram',
    slogan: "NEXT-GEN FINTECH & SUVIDHA PLATFORM",
    image: '/opt7.png',
    desc: 'Neon Cyan & Electric Violet U+P monogram with QR matrix waves.'
  },
  {
    id: 8,
    title: 'Option 8: Peacock Wing & Indian Heritage',
    slogan: "Bharat Ka Apna Digital Wallet",
    image: '/opt8.png',
    desc: 'Indian Peacock wing folded into a royal blue, emerald green & gold U emblem.'
  },
  {
    id: 9,
    title: 'Option 9: Origami Ribbon Coin',
    slogan: "One App, Infinite Possibilities",
    image: '/opt9.png',
    desc: '3D Folded geometric ribbon coin forming a U with lightning cutout.'
  }
];

export default function LogoShowcasePage() {
  const [selectedId, setSelectedId] = useState(10);
  const [isApplying, setIsApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleApplyLogo = async (opt) => {
    setIsApplying(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/set-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: opt.image }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`${opt.title} has been set as the official logo for UniPay!`);
      }
    } catch (e) {
      console.error(e);
    }
    setIsApplying(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B1120',
      color: '#F1F5F9',
      padding: '40px 24px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              UniPay Logo Gallery
            </h1>
            <p style={{ color: '#94A3B8', marginTop: 4 }}>Select any logo option below to instantly set it on the website &amp; dashboards!</p>
          </div>
          <Link href="/" style={{ padding: '10px 20px', borderRadius: 8, background: '#1E293B', color: '#fff', textDecoration: 'none', border: '1px solid #334155' }}>
            ← Back to Home
          </Link>
        </div>

        {successMsg && (
          <div style={{ padding: '14px 20px', borderRadius: 10, background: '#064E3B', color: '#34D399', fontWeight: 600, marginBottom: 30, textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {LOGO_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              style={{
                background: '#1E293B',
                border: selectedId === opt.id ? '2px solid #2563EB' : '1px solid #334155',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: selectedId === opt.id ? '0 0 20px rgba(37,99,235,0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '100%', height: 220, background: '#ffffff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, marginBottom: 16 }}>
                <img src={opt.image} alt={opt.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>{opt.title}</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38BDF8', marginBottom: 10 }}>&ldquo;{opt.slogan}&rdquo;</p>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 16 }}>{opt.desc}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyLogo(opt);
                }}
                disabled={isApplying}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 8,
                  background: selectedId === opt.id ? 'linear-gradient(135deg, #2563EB, #0EA5E9)' : '#334155',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Set As Active Logo
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
