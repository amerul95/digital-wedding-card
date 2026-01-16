import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClientData {
    groomName: string;
    brideName: string;
    ceremonyTitle: string;
    welcomingSpeech: string;
    ceremonyDate: string;
    ceremonyStartTime: string;
    ceremonyEndTime: string;
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

export const defaultClientData: ClientData = {
    groomName: "Groom Name",
    brideName: "Bride Name",
    ceremonyTitle: "Wedding Ceremony",
    welcomingSpeech: "We invite you to celebrate our wedding...",
    ceremonyDate: "2026-02-12",
    ceremonyStartTime: "10:00",
    ceremonyEndTime: "14:00",
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
