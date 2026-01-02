import React from 'react';

export default function SlotTracker() {
  // You can later make these dynamic via props or API data
  const limitSlot = 100;
  const currentSlot = 10;
  const availableSlot = limitSlot - currentSlot;

  return (
    <section className="py-12 flex justify-center bg-gray-50 px-6">
      <div className="w-full max-w-3xl px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Event Slot Tracker
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Side: Limit + Current */}
          <div className="space-y-4">
            <div className="border-2 border-green-500 rounded-lg py-4">
              <p className="text-center text-green-600 text-sm font-medium mb-1">
                Limit Slot
              </p>
              <h2 className="text-center text-green-600 text-3xl font-bold">{limitSlot}</h2>
            </div>

            <div className="border-2 border-green-500 rounded-lg py-4">
              <p className="text-center text-green-600 text-sm font-medium mb-1">
                Current Slot
              </p>
              <h2 className="text-center text-green-600 text-3xl font-bold">{currentSlot}</h2>
            </div>
          </div>

          {/* Right Side: Available */}
          <div className="border-2 border-green-500 bg-green-50 rounded-lg flex flex-col justify-center items-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Available Slot</h4>
            <h2 className="text-4xl font-bold text-green-600">{availableSlot}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
