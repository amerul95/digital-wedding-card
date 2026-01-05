import React from "react";

export function Label({
  children,
  htmlFor,
  className
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`text-base font-bold block mb-1 text-gray-700 ${className || ""}`}
      style={{ fontSize: '16px', fontFamily: 'Helvetica World, Helvetica, Arial, sans-serif' }}
    >
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[#36463A] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#36463A] ${props.className || ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-[#36463A] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#36463A] ${props.className || ""}`}
    />
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
}

export function FooterButton({
  children,
  label,
  onClick,
  color,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-1 rounded-xl py-2 hover:bg-rose-50"
      style={{ color }}
    >
      <div className="h-6 w-6">{children}</div>
      <span
        className={`text-[10px] ${!color ? "text-rose-700/80" : ""}`}
        style={{ color: color }}
      >
        {label}
      </span>
    </button>
  );
}


