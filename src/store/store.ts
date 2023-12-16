import { create } from 'zustand';

interface BearState {
  designers: string[];
  addDesigner: (designer: string) => void;
  removeDesigner: (designer: string) => void;
}

export const useFilterStore = create<BearState>((set) => ({
  designers: [],
  addDesigner: (designer) => set((state) => ({ designers: [...state.designers, designer] })),
  removeDesigner: (designer) => {
    set((state) => ({ designers: state.designers.filter((i) => i !== designer) }));
  },
}));
