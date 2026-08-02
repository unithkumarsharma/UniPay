'use client';
import { useState } from 'react';
import { serviceCategories } from '@/data/services';

const billCategory = serviceCategories.find(c => c.name === 'Bill Payment');

export default function BillPaymentPage() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <div className="page-header">
        <h1>Bill Payment</h1>
        <p>Pay electricity, gas, water, broadband and more via BBPS</p>
      </div>

      {!selectedService ? (
        <>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 14 }}>Select Bill Category</h3>
          <div className="services-grid">
            {billCategory?.services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ maxWidth: 500 }}>
          <button className="btn btn-secondary btn-sm mb-lg" onClick={() => setSelectedService(null)}>
            ← Back to Categories
          </button>

          <div className="card">
            <div className="flex gap-md mb-md" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '2rem' }}>{selectedService.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedService.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay your {selectedService.name.toLowerCase()} bill</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Provider</label>
              <select className="form-select">
                <option>Select Provider</option>
                <option>Provider 1</option>
                <option>Provider 2</option>
                <option>Provider 3</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Consumer Number / Account ID</label>
              <input type="text" className="form-input" placeholder="Enter consumer number" />
            </div>
            <button className="btn btn-primary w-full">Fetch Bill</button>

            <div className="card mt-lg" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Bill Amount</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>₹ --</span>
              </div>
              <div className="flex-between mt-sm">
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Due Date</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>--</span>
              </div>
              <button className="btn btn-primary w-full mt-md" disabled>Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
