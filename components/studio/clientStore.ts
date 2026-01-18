import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClientData {
    groomName: string;
    brideName: string;
    groomShort: string;
    brideShort: string;
    ceremonyTitle: string;
    welcomingSpeech: string;
    ceremonyDate: string;
    ceremonyStartTime: string;
    ceremonyEndTime: string;
    organizer1: string;
    organizer2: string;
    mainVenue: string;
    fullVenue: string;
    dateStyle: string; // Format style for date placeholder (e.g., "Day, Date", "Date, Day", etc.)
    eventTentativeTitle: string;
    eventTentativeActivity: string; // Rich text with line breaks
    pray: string;
    contacts: Array<{ name: string; phone: string }>;
    giftDetails: {
        bankName: string;
        accountNumber: string;
        accountName: string;
        qrImage?: string;
    };
    galleryImages: string[];
    hiddenSectionIds: string[];
    hiddenNavbarItemIds: string[];
    speeches: Array<{ author: string; content: string; timestamp: number }>; // Congratulation speeches from visitors
    // We can add more fields as needed
}

interface ClientStore {
    clientData: ClientData;
    updateClientData: (data: Partial<ClientData>) => void;
    toggleSectionVisibility: (sectionId: string) => void;
    toggleNavbarItemVisibility: (itemId: string) => void;
}

// Helper function to calculate date 28 days ahead from today
const getDefaultDate = (): string => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 28); // Add 28 days
    
    // Format as YYYY-MM-DD for date input
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

export const defaultClientData: ClientData = {
    groomName: "Adam", // Default value for %groom% placeholder - shows in preview/studio when no client input
    brideName: "Hawa", // Default value for %bride% placeholder - shows in preview/studio when no client input
    groomShort: "Adam Bin Abu", // Default value for %groomshort% placeholder
    brideShort: "Hawa binti Ali", // Default value for %brideshort% placeholder
    ceremonyTitle: "Majlis Walimatul Urus", // Default value for %title% placeholder
    welcomingSpeech: "Dengan penuh kesyukuran, kami mempersilakan\nDato' | Datin | Tuan | Puan | Encik | Cik\nseisi keluarga hadir ke majlis perkahwinan anakanda kami", // Default value for %speech% placeholder
    ceremonyDate: getDefaultDate(), // Default value for %date% placeholder (28 days ahead from today, formatted as "Day, Date")
    ceremonyStartTime: "10:00", // Default value for %starttime% placeholder
    ceremonyEndTime: "14:00", // Default value for %endtime% placeholder
    organizer1: "Ahmad Bin Abdullah", // Default value for %organizer1% placeholder
    organizer2: "Fatimah Binti Abu", // Default value for %organizer2% placeholder
    mainVenue: "Glass House Glenmarie", // Default value for %mainvenue% placeholder
    fullVenue: "LOT 16859, 3 Stone Park, Jalan Penyair U1/44,\n\nHicom-Glenmarie Industrial Park,\n\n40150 Shah Alam, Selangor", // Default value for %fullvenue% placeholder
    dateStyle: "Day, Date", // Default format for date placeholder
    eventTentativeTitle: "ATUR CARA MAJLIS", // Default value for %eventtentativetitle% placeholder
    eventTentativeActivity: "Kehadiran Tetamu:\n11:30 pagi\n\nKetibaan Pengantin:\n12:30 tengah hari\n\nMakan Beradab:\n1:30 petang\n\nMajlis Berakhir:\n5:00 petang", // Default value for %eventtentiveactivity% placeholder (supports HTML/rich text)
    pray: "Ya Allah Ya Rahman Ya Rahim,\nberkatilah majlis perkahwinan ini.\nLimpahkanlah baraqah dan rahmatMu kepada kedua mempelai ini. Kurniakanlah mereka kelak zuriat yang soleh dan solehah. Kekalkanlah jodoh mereka hingga ke jannah.\n\n\n#AdamHawa", // Default value for %pray% placeholder
    contacts: [],
    giftDetails: {
        bankName: "",
        accountNumber: "",
        accountName: ""
    },
    galleryImages: [],
    hiddenSectionIds: [],
    hiddenNavbarItemIds: [],
    speeches: [] // Array of { author, content, timestamp }
};

export const useClientStore = create<ClientStore>()(
    persist(
        (set) => ({
            clientData: defaultClientData,
            updateClientData: (data) => set((state) => ({
                clientData: { ...state.clientData, ...data }
            })),
            toggleSectionVisibility: (sectionId) => set((state) => {
                const hidden = state.clientData.hiddenSectionIds;
                const newHidden = hidden.includes(sectionId)
                    ? hidden.filter(id => id !== sectionId)
                    : [...hidden, sectionId];
                return { clientData: { ...state.clientData, hiddenSectionIds: newHidden } };
            }),
            toggleNavbarItemVisibility: (itemId) => set((state) => {
                const hidden = state.clientData.hiddenNavbarItemIds;
                const newHidden = hidden.includes(itemId)
                    ? hidden.filter(id => id !== itemId)
                    : [...hidden, itemId];
                return { clientData: { ...state.clientData, hiddenNavbarItemIds: newHidden } };
            })
        }),
        {
            name: 'wedding-client-storage', // unique name
        }
    )
);
