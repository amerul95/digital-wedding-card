"use client";

import React from "react";
import { Copy } from "lucide-react";

interface GiftModalProps {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    qrImage?: string;
}

export function GiftModal({ bankName, accountName, accountNumber, qrImage }: GiftModalProps) {
    const handleCopy = () => {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            alert("Account number copied!");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 text-center p-2">
            <h3 className="text-lg font-semibold text-rose-700 mb-2">Wedding Gift</h3>

            {qrImage && (
                <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border border-rose-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrImage} alt="QR Code" className="w-full h-full object-cover" />
                </div>
            )}

            {(bankName || accountNumber || accountName) && (
                <div className="w-full bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                    {bankName && <p className="font-semibold text-rose-800 mb-1">{bankName}</p>}
                    {accountNumber && (
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg font-mono text-gray-700">{accountNumber}</span>
                            <button onClick={handleCopy} className="text-rose-500 hover:text-rose-700 p-1">
                                <Copy size={16} />
                            </button>
                        </div>
                    )}
                    {accountName && <p className="text-sm text-gray-500">{accountName}</p>}
                </div>
            )}

            <p className="text-xs text-center text-gray-400 mt-2">
                Your presence is the greatest gift of all. However, if you wish to honor us with a gift, a contribution would be warmly appreciated.
            </p>
        </div>
    );
}
