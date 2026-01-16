"use client";

import React from "react";
import { Copy } from "lucide-react";

interface ModalStyles {
    title?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
        fontWeight?: string;
    };
    bankName?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
    };
    accountNumber?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
    };
    accountName?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
    };
    description?: {
        fontSize?: string | number;
        color?: string;
        fontFamily?: string;
    };
}

interface GiftModalProps {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    qrImage?: string;
    styles?: ModalStyles;
}

export function GiftModal({ bankName, accountName, accountNumber, qrImage, styles = {} }: GiftModalProps) {
    const handleCopy = () => {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            alert("Account number copied!");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 text-center p-2">
            <h3 
                className="text-lg font-semibold text-rose-700 mb-2"
                style={{
                    fontSize: styles.title?.fontSize || undefined,
                    color: styles.title?.color || undefined,
                    fontFamily: styles.title?.fontFamily || undefined,
                    fontWeight: styles.title?.fontWeight || undefined,
                }}
            >
                Wedding Gift
            </h3>

            {qrImage && (
                <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border border-rose-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrImage} alt="QR Code" className="w-full h-full object-cover" />
                </div>
            )}

            {(bankName || accountNumber || accountName) && (
                <div className="w-full bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                    {bankName && (
                        <p 
                            className="font-semibold text-rose-800 mb-1"
                            style={{
                                fontSize: styles.bankName?.fontSize || undefined,
                                color: styles.bankName?.color || undefined,
                                fontFamily: styles.bankName?.fontFamily || undefined,
                            }}
                        >
                            {bankName}
                        </p>
                    )}
                    {accountNumber && (
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span 
                                className="text-lg font-mono text-gray-700"
                                style={{
                                    fontSize: styles.accountNumber?.fontSize || undefined,
                                    color: styles.accountNumber?.color || undefined,
                                    fontFamily: styles.accountNumber?.fontFamily || undefined,
                                }}
                            >
                                {accountNumber}
                            </span>
                            <button onClick={handleCopy} className="text-rose-500 hover:text-rose-700 p-1">
                                <Copy size={16} />
                            </button>
                        </div>
                    )}
                    {accountName && (
                        <p 
                            className="text-sm text-gray-500"
                            style={{
                                fontSize: styles.accountName?.fontSize || undefined,
                                color: styles.accountName?.color || undefined,
                                fontFamily: styles.accountName?.fontFamily || undefined,
                            }}
                        >
                            {accountName}
                        </p>
                    )}
                </div>
            )}

            <p 
                className="text-xs text-center text-gray-400 mt-2"
                style={{
                    fontSize: styles.description?.fontSize || undefined,
                    color: styles.description?.color || undefined,
                    fontFamily: styles.description?.fontFamily || undefined,
                }}
            >
                Your presence is the greatest gift of all. However, if you wish to honor us with a gift, a contribution would be warmly appreciated.
            </p>
        </div>
    );
}
