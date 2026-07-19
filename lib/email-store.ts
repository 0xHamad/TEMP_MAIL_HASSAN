import { create } from "zustand";

const DOMAINS = [
  "mail.hassanai.xyz",
  "inbox.hassanai.xyz",
  "temp.hassanai.xyz",
  "relay.hassanai.xyz",
  "secure.hassanai.xyz",
  "vault.hassanai.xyz",
  "drop.hassanai.xyz",
  "ghost.hassanai.xyz",
  "cloud.hassanai.xyz",
  "swift.hassanai.xyz",
  "pulse.hassanai.xyz",
  "spark.hassanai.xyz",
  "nova.hassanai.xyz",
  "nexus.hassanai.xyz",
];

const EXPIRY_SECONDS = 10 * 60; // 10 minutes

function generateUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function generateEmail(): string {
  const username = generateUsername();
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
  return `${username}@${domain}`;
}

interface EmailStore {
  currentEmail: string;
  expiresAt: number;
  isGenerating: boolean;
  gmailAddress: string;
  activeMode: "temp" | "gmail";

  generateNewEmail: () => void;
  generateGmailAlias: () => Promise<void>;
  extendTime: () => void;
  deleteInbox: () => void;
  setGmailAddress: (email: string) => void;
  setActiveMode: (mode: "temp" | "gmail") => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  currentEmail: "x8fk2q@mail.hassanai.xyz",
  expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
  isGenerating: false,
  gmailAddress: "",
  activeMode: "temp",

  generateNewEmail: () => {
    set({ isGenerating: true });
    setTimeout(() => {
      set({
        currentEmail: generateEmail(),
        expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
        isGenerating: false,
        activeMode: "temp",
      });
    }, 500);
  },

  generateGmailAlias: async () => {
    set({ isGenerating: true });
    try {
      const res = await fetch("/api/gmail/generate");
      if (!res.ok) throw new Error("Failed to generate gmail alias");
      const data = await res.json();
      if (data.email) {
        set({ currentEmail: data.email, activeMode: "gmail" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isGenerating: false });
    }
  },

  extendTime: () => {
    set((state) => ({
      expiresAt: Math.max(state.expiresAt, Date.now()) + EXPIRY_SECONDS * 1000,
    }));
  },

  deleteInbox: () => {
    set({
      currentEmail: generateEmail(),
      expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
      activeMode: "temp",
    });
  },

  setGmailAddress: (email: string) => set({ gmailAddress: email }),
  setActiveMode: (mode: "temp" | "gmail") => set({ activeMode: mode }),
}));
