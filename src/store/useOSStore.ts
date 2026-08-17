import { create } from 'zustand';

export interface AppConfig {
  id: string;
  title: string;
  iconName: string;
  component: string;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface OSStore {
  isLauncherOpen: boolean;
  isQuickSettingsOpen: boolean;
  openWindows: WindowState[];
  activeZIndex: number;
  toggleLauncher: () => void;
  toggleQuickSettings: () => void;
  openApp: (app: AppConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useOSStore = create<OSStore>((set, get) => ({
  isLauncherOpen: false,
  isQuickSettingsOpen: false,
  openWindows: [],
  activeZIndex: 10,

  toggleLauncher: () => set((state) => ({ isLauncherOpen: !state.isLauncherOpen, isQuickSettingsOpen: false })),
  toggleQuickSettings: () => set((state) => ({ isQuickSettingsOpen: !state.isQuickSettingsOpen, isLauncherOpen: false })),

  openApp: (app) => {
    const { openWindows, activeZIndex } = get();
    const existing = openWindows.find((w) => w.appId === app.id);
    
    if (existing) {
      set({
        openWindows: openWindows.map((w) =>
          w.appId === app.id ? { ...w, isMinimized: false, zIndex: activeZIndex + 1 } : w
        ),
        activeZIndex: activeZIndex + 1,
        isLauncherOpen: false,
      });
    } else {
      const newWin: WindowState = {
        id: `win-${Date.now()}`,
        appId: app.id,
        title: app.title,
        isMinimized: false,
        isMaximized: false,
        zIndex: activeZIndex + 1,
      };
      set({
        openWindows: [...openWindows, newWin],
        activeZIndex: activeZIndex + 1,
        isLauncherOpen: false,
      });
    }
  },

  closeWindow: (id) =>
    set((state) => ({
      openWindows: state.openWindows.filter((w) => w.id !== id),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      openWindows: state.openWindows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    })),

  focusWindow: (id) => {
    const { activeZIndex } = get();
    set((state) => ({
      openWindows: state.openWindows.map((w) => (w.id === id ? { ...w, zIndex: activeZIndex + 1 } : w)),
      activeZIndex: activeZIndex + 1,
    }));
  },
}));
