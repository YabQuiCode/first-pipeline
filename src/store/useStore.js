import { create } from 'zustand'

const useStore = create((set) => ({
  version: 'v1.0.0',
  isDeployed: false,
  deploySuccess: false,
  darkMode: false,

  setVersion: (version) => set({ version }),
  setDeployed: (isDeployed) => set({ isDeployed }),
  setDeploySuccess: (deploySuccess) => set({ deploySuccess }),

  triggerDeploy: () => {
    set({
      isDeployed: true,
      deploySuccess: true,
      version: 'v1.1.0',
      darkMode: true,
    })
  },
}))

export default useStore
