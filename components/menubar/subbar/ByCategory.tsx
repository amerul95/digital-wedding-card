import React from "react";

export default function ByCategory() {
  const categories = [
    "Be Different",
    "Be Creative",
    "Be Simple",
    "Be Elegant",
    "Be Modern",
    "Be Minimal",
    "Be Classic",
  ];

  return (
    <div className="relative inline-block group ">
      {/* Top trigger */}
      <div className="cursor-pointer text-lg font-semibold px-4 py-2">
        By Category
      </div>

      {/* Dropdown content */}
      <div
        className="
    absolute left-0 mt-1 w-48 rounded-lg bg-white shadow-lg border
    opacity-0 invisible
    group-hover:visible group-hover:opacity-100
    transition-all duration-200
        "
      >
        <p className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">
          BY CATEGORY
        </p>
        <div className="flex flex-col ">
          {categories.map((item, i) => (
            <a
              key={i}
              href="#"
              className="
                px-4 py-2 text-gray-700
                hover:bg-gray-100 hover:text-pink-500
              "
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
