import React from 'react';

export default function BottomNavigation() {
  return (
    <div className="bottom-navigation fixed bottom-0 left-0 right-0 bg-white shadow-md">
      {/* Navigation Menu */}
      <div className="menu flex justify-around items-center py-3 border-t border-gray-200">
        {/* Calendar */}
        <span
          className="link flex flex-col items-center cursor-pointer hover:text-pink-500 transition"
          data-target="calendar"
        >
          <svg className="w-6 h-6 fill-current text-gray-600 mb-1">
            <use xlinkHref="#icon-calendar" />
          </svg>
          <p className="text-xs font-medium text-gray-700" id="text-calendar">
            CALENDAR
          </p>
        </span>

        {/* Call */}
        <span
          className="link flex flex-col items-center cursor-pointer hover:text-pink-500 transition"
          data-target="call"
        >
          <svg className="w-6 h-6 fill-current text-gray-600 mb-1">
            <use xlinkHref="#icon-call" />
          </svg>
          <p className="text-xs font-medium text-gray-700" id="text-call">
            CALL
          </p>
        </span>

        {/* Gifts */}
        <span
          className="link flex flex-col items-center cursor-pointer hover:text-pink-500 transition"
          data-target="gifts"
        >
          <svg className="w-6 h-6 fill-current text-gray-600 mb-1">
            <use xlinkHref="#icon-gifts" />
          </svg>
          <p className="text-xs font-medium text-gray-700" id="text-gifts">
            GIFTS
          </p>
        </span>

        {/* Map */}
        <span
          className="link flex flex-col items-center cursor-pointer hover:text-pink-500 transition"
          data-target="map"
        >
          <svg className="w-6 h-6 fill-current text-gray-600 mb-1">
            <use xlinkHref="#icon-map" />
          </svg>
          <p className="text-xs font-medium text-gray-700" id="text-map">
            MAP
          </p>
        </span>
      </div>

      {/* Footer Text */}
      <div className="company-motto bg-gray-50 py-2 text-center text-sm text-gray-600">
        <p>
          Create e-invite with&nbsp;
          <a
            href="https://nikahsatu.com/digitalcard/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            nikahsatu.com
          </a>
        </p>
      </div>
    </div>
  );
}
