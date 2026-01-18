"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useClientStore } from '@/components/studio/clientStore';
import { RichTextEditorClient } from '@/components/RichTextEditorClient';
import { StudioPreview } from '@/components/studio/StudioPreview';
import NavBar from '@/components/NavBar';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Gift, 
  FileText,
  Heart,
  Clock,
  Building2,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type TabType = 'couple' | 'event' | 'venue' | 'details' | 'gift';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'couple', label: 'Couple Details', icon: <Users className="w-4 h-4" /> },
  { id: 'event', label: 'Event Info', icon: <Calendar className="w-4 h-4" /> },
  { id: 'venue', label: 'Venue & Organizers', icon: <MapPin className="w-4 h-4" /> },
  { id: 'details', label: 'Event Details', icon: <FileText className="w-4 h-4" /> },
  { id: 'gift', label: 'Gift Information', icon: <Gift className="w-4 h-4" /> },
];

function StudioContent() {
  const [activeTab, setActiveTab] = useState<TabType>('couple');
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clientData, updateClientData } = useClientStore();

  // Load template from query params
  useEffect(() => {
    const loadTemplate = async () => {
      const id = searchParams.get('templateId');
      if (!id) {
        setLoading(false);
        return;
      }

      setTemplateId(id);
      try {
        const response = await axios.get(`/api/catalog/templates/${id}`);
        const template = response.data;

        // Load template editor data into store
        if (template.editorData) {
          const { useEditorStore } = await import('@/components/editor/store');
          useEditorStore.setState({
            nodes: template.editorData.nodes || {},
            rootId: template.editorData.rootId || 'root',
            selectedId: null,
            globalSettings: template.editorData.globalSettings || {},
            viewOptions: template.editorData.viewOptions || {},
          });

          // Also save to localStorage for preview
          localStorage.setItem('wedding-card-preview-data', JSON.stringify({
            nodes: template.editorData.nodes || {},
            rootId: template.editorData.rootId || 'root',
            globalSettings: template.editorData.globalSettings || {},
            viewOptions: template.editorData.viewOptions || {},
          }));
        }
      } catch (error) {
        console.error('Error loading template:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [searchParams]);

  const handleChange = (key: string, value: any) => {
    updateClientData({ [key]: value });
  };

  const handleGiftChange = (key: string, value: any) => {
    updateClientData({ giftDetails: { ...clientData.giftDetails, [key]: value } });
  };

  const handleCheckout = async () => {
    // Check if user is logged in
    try {
      const response = await axios.get('/api/auth/client/check-session');
      if (response.data.authenticated) {
        // User is logged in, proceed to checkout
        router.push(`/checkout?templateId=${templateId}`);
      } else {
        // User not logged in, redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(`/checkout?templateId=${templateId}`)}`);
      }
    } catch (error) {
      // Not logged in, redirect to login
      router.push(`/login?redirect=${encodeURIComponent(`/checkout?templateId=${templateId}`)}`);
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading template...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex max-w-7xl mx-auto">
      {/* Left Sidebar - Input Sections */}
      <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Your Wedding Studio</h1>
          <p className="text-sm text-gray-600 mt-1">Customize your wedding card details</p>
          {templateId && (
            <Button
              onClick={handleCheckout}
              className="w-full mt-4 bg-[#2d5016] hover:bg-[#1f350f] text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-col border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 text-left transition-colors",
                "hover:bg-gray-50 border-l-4",
                activeTab === tab.id
                  ? "bg-[#f0f4ed] border-[#2d5016] text-[#2d5016] font-medium"
                  : "border-transparent text-gray-700"
              )}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Couple Details Tab */}
            {activeTab === 'couple' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  Couple Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bride Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bride Short Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.brideShort}
                    onChange={(e) => handleChange('brideShort', e.target.value)}
                    placeholder="e.g., Sarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groom Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groom Short Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.groomShort}
                    onChange={(e) => handleChange('groomShort', e.target.value)}
                    placeholder="e.g., John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcoming Speech</label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    rows={4}
                    value={clientData.welcomingSpeech}
                    onChange={(e) => handleChange('welcomingSpeech', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Event Info Tab */}
            {activeTab === 'event' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2d5016]" />
                  Ceremony Details
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.ceremonyTitle}
                    onChange={(e) => handleChange('ceremonyTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.ceremonyDate}
                    onChange={(e) => handleChange('ceremonyDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Style</label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.dateStyle}
                    onChange={(e) => handleChange('dateStyle', e.target.value)}
                  >
                    <option value="Day, Date">Day, Date</option>
                    <option value="Date, Day">Date, Day</option>
                    <option value="Day short, Date">Day short, Date</option>
                    <option value="Date, Day short">Date, Day short</option>
                    <option value="Day">Day</option>
                    <option value="Day short">Day short</option>
                    <option value="Date">Date only</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-3 h-3" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                      value={clientData.ceremonyStartTime}
                      onChange={(e) => handleChange('ceremonyStartTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-3 h-3" />
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                      value={clientData.ceremonyEndTime}
                      onChange={(e) => handleChange('ceremonyEndTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Venue & Organizers Tab */}
            {activeTab === 'venue' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2d5016]" />
                  Venue & Organizers
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer 1</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.organizer1}
                    onChange={(e) => handleChange('organizer1', e.target.value)}
                    placeholder="First organizer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer 2</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.organizer2}
                    onChange={(e) => handleChange('organizer2', e.target.value)}
                    placeholder="Second organizer name"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Building2 className="w-3 h-3" />
                    Main Venue
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.mainVenue}
                    onChange={(e) => handleChange('mainVenue', e.target.value)}
                    placeholder="e.g., Glass House Glenmarie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Venue Address</label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    rows={4}
                    value={clientData.fullVenue}
                    onChange={(e) => handleChange('fullVenue', e.target.value)}
                    placeholder="Full address (without main venue name)"
                  />
                </div>
              </div>
            )}

            {/* Event Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-600" />
                  Event Details
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Tentative Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.eventTentativeTitle}
                    onChange={(e) => handleChange('eventTentativeTitle', e.target.value)}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Tentative Activity</label>
                  <RichTextEditorClient
                    content={clientData.eventTentativeActivity}
                    onChange={(html) => handleChange('eventTentativeActivity', html)}
                    placeholder="Write event activities (press Enter for line breaks)..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pray Text</label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    rows={3}
                    value={clientData.pray}
                    onChange={(e) => handleChange('pray', e.target.value)}
                    placeholder="Prayer text"
                  />
                </div>
              </div>
            )}

            {/* Gift Information Tab */}
            {activeTab === 'gift' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#2d5016]" />
                  Gift Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.giftDetails.bankName}
                    onChange={(e) => handleGiftChange('bankName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.giftDetails.accountNumber}
                    onChange={(e) => handleGiftChange('accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Owner</label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                    value={clientData.giftDetails.accountName}
                    onChange={(e) => handleGiftChange('accountName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QR Image (Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#f0f4ed] file:text-[#2d5016]
                                hover:file:bg-[#e0e8db]"
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
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <StudioPreview />
      </div>
    </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading studio...</p>
        </div>
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
