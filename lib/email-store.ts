import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_DOMAINS = [
  "mail.hassanai.xyz",
  "secure.hassanai.xyz",
  "vault.hassanai.xyz",
  "ghost.hassanai.xyz",
  "relay.hassanai.xyz",
  "nova.hassanai.xyz",
  "nexus.hassanai.xyz",
  "swift.hassanai.xyz",
  "prime.hassanai.xyz",
  "pulse.hassanai.xyz",
];

const EXPIRY_SECONDS = 10 * 60; // 10 minutes

function generateUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  // Increased from 6 to 10 for more professional random look
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function generateEmail(preferredDomain?: string, domainsList?: string[]): string {
  const username = generateUsername();
  const list = (domainsList && domainsList.length > 0) ? domainsList : DEFAULT_DOMAINS;
  const domain = preferredDomain || list[Math.floor(Math.random() * list.length)];
  return `${username}@${domain}`;
}

interface EmailStore {
  currentEmail: string;
  expiresAt: number;
  isGenerating: boolean;
  gmailAddress: string;
  activeMode: "temp" | "gmail";
  domainsList: string[];

  generateNewEmail: () => void;
  generateGmailAlias: () => Promise<void>;
  extendTime: () => void;
  deleteInbox: () => void;
  setGmailAddress: (email: string) => void;
  setActiveMode: (mode: "temp" | "gmail") => void;
  initEmail: () => void;
  setCurrentEmail: (email: string) => void;
  fetchDomains: () => Promise<void>;
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set, get) => ({
      currentEmail: "", // Empty to trigger generation on first load
      expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
      isGenerating: false,
      gmailAddress: "",
      activeMode: "temp",
      domainsList: DEFAULT_DOMAINS,

      fetchDomains: async () => {
        try {
          const res = await fetch("/api/domains");
          if (res.ok) {
            const data = await res.json();
            if (data.domains && data.domains.length > 0) {
              set({ domainsList: data.domains });
            }
          }
        } catch (err) {
          console.error("Failed to load domains", err);
        }
      },

      initEmail: () => {
        const { currentEmail, domainsList } = get();
        if (!currentEmail || currentEmail.startsWith("x8fk2q@") || currentEmail.includes("x8fk2q")) {
          const newEmail = generateEmail(undefined, domainsList);
          set({
            currentEmail: newEmail,
            expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
          });
          // Track initial email generation
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generate", email: newEmail })
          }).catch(() => {});
        }
      },

      generateNewEmail: () => {
        set({ isGenerating: true });
        const { currentEmail, domainsList } = get();
        const currentDomain = currentEmail ? currentEmail.split("@")[1] : undefined;
        const validDomain = domainsList.includes(currentDomain || "") ? currentDomain : undefined;
        setTimeout(() => {
          const newEmail = generateEmail(validDomain, domainsList);
          set({
            currentEmail: newEmail,
            expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
            isGenerating: false,
            activeMode: "temp",
          });
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generate", email: newEmail })
          }).catch(() => {});
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
        const { currentEmail, domainsList } = get();
        const currentDomain = currentEmail ? currentEmail.split("@")[1] : undefined;
        const validDomain = domainsList.includes(currentDomain || "") ? currentDomain : undefined;
        const newEmail = generateEmail(validDomain, domainsList);
        set({
          currentEmail: newEmail,
          expiresAt: Date.now() + EXPIRY_SECONDS * 1000,
          activeMode: "temp",
        });
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate", email: newEmail })
        }).catch(() => {});
      },

      setGmailAddress: (email: string) => set({ gmailAddress: email }),
      setActiveMode: (mode: "temp" | "gmail") => set({ activeMode: mode }),
      setCurrentEmail: (email: string) => set({ currentEmail: email }),
    }),
    {
      name: "temp-mail-storage",
      partialize: (state) => ({
        currentEmail: state.currentEmail,
        expiresAt: state.expiresAt,
        activeMode: state.activeMode,
        // We do NOT persist domainsList so it always fetches fresh
      }),
    }
  )
);
