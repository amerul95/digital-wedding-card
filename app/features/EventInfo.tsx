import React from 'react'


export default function EventInfo() {
  return (
    <section className="py-16 text-center bg-white text-[#745B37]">
      <p className="text-lg font-semibold mb-2">Walimatul Urus</p>
      <div className="flex justify-center gap-2">
        <p>Dato Sri Ismail Bin Muhashim</p>
        <p>&amp;</p>
        <p>Datin Hasnah Binti Maulid</p>
      </div>

      <p className="mt-4 max-w-xl mx-auto">
        Dengan segala hormatnya mempersilakan tuan/puan ke majlis perkahwinan anakanda kami
      </p>

      <div className="mt-6 text-lg font-medium">
        <p>Muhamad Faizal Bin Ismail &amp; Nur Adriana Binti Fakri</p>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <p className="font-semibold">Date</p>
          <p>Sunday, 31 December 2023</p>
        </div>
        <div>
          <p className="font-semibold">Time</p>
          <p>12:00 PM - 4:00 PM</p>
        </div>
        <div>
          <p className="font-semibold">Venue</p>
          <p>Putrajaya Lakeview Suites, Presint 16 Putrajaya Malaysia</p>
        </div>
      </div>
    </section>
  );
}
