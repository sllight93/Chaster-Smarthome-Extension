'use client';

import React from 'react';
import GeolocationModule from '../components/GeolocationModule';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Chaster Extension Konfiguration</h1>
      <GeolocationModule />
      {/* Weitere Module (z.B. AutomationModule) können hier modular eingebunden werden */}
    </div>
  );
}
