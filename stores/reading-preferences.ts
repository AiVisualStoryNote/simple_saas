import { create } from 'zustand';

interface ReadingPreferences {
  isDynamicVideoEnabled: boolean;
  toggleDynamicVideo: () => void;
  setDynamicVideo: (enabled: boolean) => void;
}

export const useReadingPreferences = create<ReadingPreferences>((set) => ({
  isDynamicVideoEnabled: true,
  toggleDynamicVideo: () => set((state) => ({
    isDynamicVideoEnabled: !state.isDynamicVideoEnabled
  })),
  setDynamicVideo: (enabled) => set({
    isDynamicVideoEnabled: enabled
  }),
}));
