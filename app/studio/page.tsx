"use client";

import React from 'react';
import { useClientStore } from '@/components/studio/clientStore';
import { Save, Eye, EyeOff } from 'lucide-react';

export default function StudioPage() {
  const { clientData, updateClientData } = useClientStore();

  const handleChange = (key: string, value: any) => {
    updateClientData({ [key]: value });
  };

  const handleGiftChange = (key: string, value: any) => {
    updateClientData({ giftDetails: { ...clientData.giftDetails, [key]: value } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wedding Studio</h1>
          <p className="text-gray-600">Customize your wedding card details.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-rose-600 border-b pb-2">Couple Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bride Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.brideName}
                onChange={(e) => handleChange('brideName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Groom Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.groomName}
                onChange={(e) => handleChange('groomName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Welcoming Speech</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                rows={4}
                value={clientData.welcomingSpeech}
                onChange={(e) => handleChange('welcomingSpeech', e.target.value)}
              />
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-rose-600 border-b pb-2">Ceremony Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.ceremonyTitle}
                onChange={(e) => handleChange('ceremonyTitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.ceremonyDate}
                onChange={(e) => handleChange('ceremonyDate', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={clientData.ceremonyStartTime}
                  onChange={(e) => handleChange('ceremonyStartTime', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  value={clientData.ceremonyEndTime}
                  onChange={(e) => handleChange('ceremonyEndTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Gift Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-rose-600 border-b pb-2">Gift Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.giftDetails.bankName}
                onChange={(e) => handleGiftChange('bankName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.giftDetails.accountNumber}
                onChange={(e) => handleGiftChange('accountNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Owner</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                value={clientData.giftDetails.accountName}
                onChange={(e) => handleGiftChange('accountName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">QR Image (Upload)</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-rose-50 file:text-rose-700
                                hover:file:bg-rose-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleGiftChange('qrImage', url);
                  }
                }}
              />
            </div>
          </div>

          {/* Preview / Instructions */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">How it works</h2>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Fill in your details here.</li>
              <li>The card will automatically update where the designer used placeholders:</li>
              <ul className="list-square list-inside ml-4 text-xs opacity-80">
                <li>%groom%, %bride%</li>
                <li>%title%, %date%</li>
                <li>%speech%</li>
              </ul>
              <li>Use the "Preview Card" button to see your live changes.</li>
            </ul>
            <a
              href="/preview"
              target="_blank"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Eye size={18} /> Preview Card
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
