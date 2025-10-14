import React from 'react';

export default function SlotTracker() {
  // You can later make these dynamic via props or API data
  const limitSlot = 100;
  const currentSlot = 10;
  const availableSlot = limitSlot - currentSlot;

  return (
    <section className="flex justify-center items-center pb-12">
      <div className="w-full max-w-3xl px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Event Slot Tracker
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Side: Limit + Current */}
          <div className="space-y-4">
            <div className="border-2 border-[#25685B] rounded-lg py-4">
              <p className="text-center text-[#25685B] text-sm font-medium mb-1">
                Limit Slot
              </p>
              <h2 className="text-center text-[#25685B] text-3xl font-bold">{limitSlot}</h2>
            </div>

            <div className="border-2 border-[#25685B] rounded-lg py-4">
              <p className="text-center text-[#25685B] text-sm font-medium mb-1">
                Current Slot
              </p>
              <h2 className="text-center text-[#25685B] text-3xl font-bold">{currentSlot}</h2>
            </div>
          </div>

          {/* Right Side: Available */}
          <div className="border-2 border-[#25685B] bg-[#25685B] rounded-lg flex flex-col justify-center items-center">
            <h4 className="text-lg font-semibold text-white mb-2">Available Slot</h4>
            <h2 className="text-4xl font-bold text-[#25685B text-white">{availableSlot}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
