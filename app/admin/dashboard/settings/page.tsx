'use client'
import React, { useState } from 'react'

export default function SettingsPage() {
  const [commissionRate, setCommissionRate] = useState(15)
  const [siteName, setSiteName] = useState('Wedding App')
  const [siteEmail, setSiteEmail] = useState('admin@weddingapp.com')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#36463A] mb-2">Settings</h1>
        <p className="text-gray-600">Manage platform settings and configurations</p>
      </div>

      {/* Commission Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#36463A] mb-4">Commission Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="commissionRate" className="block text-sm font-semibold text-gray-700 mb-2">
              Designer Commission Rate (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent"
              />
              <span className="text-sm text-gray-600">
                Designers will receive {commissionRate}% of each sale. Company receives {100 - commissionRate}%.
              </span>
            </div>
          </div>
          <button className="px-6 py-2 bg-[#327442] text-white rounded-lg hover:bg-[#2d3a2f] transition-colors">
            Save Commission Settings
          </button>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#36463A] mb-4">Site Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-semibold text-gray-700 mb-2">
              Site Name
            </label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="siteEmail" className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              id="siteEmail"
              type="email"
              value={siteEmail}
              onChange={(e) => setSiteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#327442] focus:border-transparent"
            />
          </div>
          <button className="px-6 py-2 bg-[#327442] text-white rounded-lg hover:bg-[#2d3a2f] transition-colors">
            Save Site Settings
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#36463A] mb-4">Other Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-600">Send email notifications for new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#327442]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#327442]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-700">Auto-approve Themes</p>
              <p className="text-sm text-gray-600">Automatically approve themes from designers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#327442]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#327442]"></div>
            </label>
          </div>
          <button className="px-6 py-2 bg-[#327442] text-white rounded-lg hover:bg-[#2d3a2f] transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}



