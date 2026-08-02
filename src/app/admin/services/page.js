'use client';
import { useState } from 'react';
import { serviceCategories } from '@/data/services';

export default function AdminServicesPage() {
  const [serviceStatus, setServiceStatus] = useState(() => {
    const status = {};
    serviceCategories.forEach(cat => {
      cat.services.forEach(s => { status[s.id] = true; });
    });
    return status;
  });

  const toggleService = (id) => {
    setServiceStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="page-header">
        <h1>Service Management</h1>
        <p>Enable or disable services across the platform</p>
      </div>

      {serviceCategories.map((category) => (
        <div key={category.name} style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
            {category.name}
          </h3>
          <div className="services-grid">
            {category.services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                style={{
                  opacity: serviceStatus[service.id] ? 1 : 0.5,
                  border: serviceStatus[service.id] ? '1px solid var(--success)' : '1px solid var(--border-color)',
                }}
                onClick={() => toggleService(service.id)}
              >
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
                <div style={{
                  marginTop: 8,
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: serviceStatus[service.id] ? 'var(--success)' : 'var(--danger)',
                }}>
                  {serviceStatus[service.id] ? '● ACTIVE' : '● DISABLED'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
