import { create } from 'zustand'

interface ThemeState {
    currentLineArt: string;
    setLineArt: (art: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    currentLineArt: '', // Default
    setLineArt: (art) => set({ currentLineArt: art }),
}))
