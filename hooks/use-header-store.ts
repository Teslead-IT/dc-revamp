import { create } from 'zustand'

export interface HeaderTab {
    label: string;
    value: string;
    onClick?: () => void;
}

interface HeaderState {
    title: string;
    tabs: HeaderTab[];
    activeTab: string;
    setTitle: (title: string) => void;
    setTabs: (tabs: HeaderTab[], activeTab?: string) => void;
    setActiveTab: (tab: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    title: "",
    tabs: [],
    activeTab: "",
    setTitle: (title) => set({ title }),
    setTabs: (tabs, activeTab) => set({ tabs, activeTab: activeTab || tabs[0]?.value || "" }),
    setActiveTab: (activeTab) => set({ activeTab }),
}))
