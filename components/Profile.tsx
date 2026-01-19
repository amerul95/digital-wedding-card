'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function Profile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favourites'>('profile')
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'MY'
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/client/profile")
        if (response.ok) {
          const data = await response.json()
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            country: 'MY' // Default country
          })
        } else {
          toast.error("Failed to load profile data")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/client/logout", { method: "POST" })
      router.push("/")
      // Force a page reload to clear any client-side state
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if API call fails
      router.push("/")
      window.location.href = "/"
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const response = await fetch("/api/client/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Profile updated successfully")
        // Refresh profile data
        const refreshResponse = await fetch("/api/client/profile")
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json()
          setProfileData({
            name: refreshedData.name || '',
            email: refreshedData.email || '',
            phone: refreshedData.phone || '',
            country: profileData.country
          })
        }
        // Refresh page to update NavBar with new name
        router.refresh()
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred while updating profile")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const response = await fetch("/api/client/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Password updated successfully")
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(data.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("An error occurred while updating password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className='max-w-7xl mx-auto min-h-screen flex px-10'>
      {/* Left Sidebar Navigation */}
      <div className='w-64 bg-white flex flex-col py-8'>
        {/* Navigation Items */}
        <div className='flex-1'>
          {/* MY PROFILE */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'profile'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 relative flex items-center justify-center'>
              <Image 
                src="/profile/profile.png" 
                alt="Profile" 
                width={20} 
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className='font-semibold uppercase text-sm'>MY PROFILE</span>
          </button>

          {/* ORDERS */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'orders'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 relative flex items-center justify-center'>
              <Image 
                src="/profile/orders.png" 
                alt="Orders" 
                width={20} 
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className='font-semibold uppercase text-sm'>ORDERS</span>
          </button>

          {/* FAVOURITES */}
          <button
            onClick={() => setActiveTab('favourites')}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-[10px] my-[5px] ${
              activeTab === 'favourites'
                ? 'bg-[#327442] text-white border border-[#327442]'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#CFCFCF]'
            }`}
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 relative flex items-center justify-center'>
              <Image 
                src="/profile/favourites.png" 
                alt="Favourites" 
                width={20} 
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className='font-semibold uppercase text-sm'>FAVOURITES</span>
          </button>
        </div>

        {/* LOG OUT */}
        <div className='px-6 py-4'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <div className='w-5 h-5 relative flex items-center justify-center'>
              <Image 
                src="/profile/logout.png" 
                alt="Logout" 
                width={20} 
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className='font-semibold uppercase text-sm'>LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Right Main Content Area */}
      <div className='flex-1 bg-white py-8 px-8 border border-[#CFCFCF] my-[29px] mx-[22px] rounded-[15px]'>
        {activeTab === 'profile' && (
          <>
            {/* MY PROFILE Title */}
            <h1 
              className='text-2xl font-bold text-gray-900 mb-8 uppercase'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              MY PROFILE
            </h1>

            {/* Personal Information Form */}
            <form onSubmit={handleProfileUpdate} className='mb-12'>
              <div className='space-y-4 max-w-2xl'>
                {/* Name Field */}
                <div>
                  <label 
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    placeholder="Enter your full name"
                    disabled={isLoadingProfile}
                  />
                </div>

                {/* Email Address Field */}
                <div>
                  <label 
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={profileData.email}
                    disabled
                    className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label 
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Phone Number
                  </label>
                  <div className='w-full border border-gray-300 rounded-lg bg-white flex items-center focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent transition-all overflow-hidden'>
                    <PhoneInput
                      international
                      defaultCountry="MY"
                      value={profileData.phone}
                      onChange={(value) => setProfileData({ ...profileData, phone: value || "" })}
                      disabled={isLoadingProfile}
                      className="w-full flex items-center [&_.PhoneInputCountry]:border-0 [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountry]:ml-2 [&_.PhoneInputCountry]:flex-shrink-0 [&_select.PhoneInputCountrySelect]:border-0 [&_select.PhoneInputCountrySelect]:bg-transparent [&_select.PhoneInputCountrySelect]:text-gray-900 [&_select.PhoneInputCountrySelect]:text-sm [&_select.PhoneInputCountrySelect]:cursor-pointer [&_select.PhoneInputCountrySelect]:focus:outline-none [&_input.PhoneInputInput]:border-0 [&_input.PhoneInputInput]:flex-1 [&_input.PhoneInputInput]:px-2 [&_input.PhoneInputInput]:py-2.5 [&_input.PhoneInputInput]:bg-transparent [&_input.PhoneInputInput]:text-gray-900 [&_input.PhoneInputInput]:focus:outline-none [&_input.PhoneInputInput]:focus:ring-0"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className='pt-4'>
                  <button
                    type='submit'
                    disabled={isUpdatingProfile || isLoadingProfile}
                    className='w-full px-6 py-3 rounded-lg bg-[#327442] text-white font-semibold uppercase hover:bg-[#285a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {isUpdatingProfile ? 'UPDATING...' : 'UPDATE'}
                  </button>
                </div>
              </div>
            </form>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordUpdate}>
              <div className='space-y-4 max-w-2xl'>
                {/* Current Password Field */}
                <div>
                  <label 
                    htmlFor='currentPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Current Password
                  </label>
                  <input
                    type='password'
                    id='currentPassword'
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    required
                  />
                </div>

                {/* New Password Field */}
                <div>
                  <label 
                    htmlFor='newPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    New Password
                  </label>
                  <input
                    type='password'
                    id='newPassword'
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    minLength={6}
                    required
                  />
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label 
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    id='confirmPassword'
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    minLength={6}
                    required
                  />
                </div>

                {/* Update Button */}
                <div className='pt-4'>
                  <button
                    type='submit'
                    disabled={isUpdatingPassword}
                    className='w-full px-6 py-3 rounded-lg bg-[#327442] text-white font-semibold uppercase hover:bg-[#285a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {isUpdatingPassword ? 'UPDATING...' : 'UPDATE'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 
              className='text-2xl font-bold text-gray-900 mb-8 uppercase'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              ORDERS
            </h1>
            <p className='text-gray-600' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Your orders will appear here.
            </p>
          </div>
        )}

        {activeTab === 'favourites' && (
          <div>
            <h1 
              className='text-2xl font-bold text-gray-900 mb-8 uppercase'
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              FAVOURITES
            </h1>
            <p className='text-gray-600' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Your favourites will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
