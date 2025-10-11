import React from 'react'

export default function TryCard() {
  return (
    <div className='flex'>
      <div className='w-1/2'>
        <h3>NAK <span>TRY</span> KAD KAHWIN DIGITAL ?</h3>
        <p>Lihat contoh preview kad digital dengan nama anda sendiri. <br />Masukkan nama anda & pasangan.</p>
      </div>
      <div className='w-1/2 flex justify-center '>
         <CoupleForm/> 
      </div>
    </div>
  )
}



function CoupleForm() {
  return (
    <form className=" w-full p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">
        Maklumat Pasangan
      </h2>

      {/* Input 1: Nama Anda */}
      <div>
        <label
          htmlFor="nama-anda"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Nama Anda
        </label>
        <input
          id="nama-anda"
          type="text"
          placeholder="Nama anda"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Input 2: Nama Pasangan */}
      <div>
        <label
          htmlFor="nama-pasangan"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Nama Pasangan
        </label>
        <input
          id="nama-pasangan"
          type="text"
          placeholder="Nama pasangan"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
      >
        Hantar
      </button>
    </form>
  );
}
