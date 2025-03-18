"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CommitCell } from "./types"

// Map of year to commit data
type YearCommitMap = {
  [year: string]: CommitCell[]
}

interface FormState {
  username: string
  token: string
  repository: string
  year: string
  customMessages: string
  rateLimit: number
  batchSize: number
  useCustomMessages: boolean
}

interface CommitStore {
  commitData: CommitCell[]
  selectedYear: number
  commitLogs: string[]
  formData: FormState
  yearDataMap: YearCommitMap
  setCommitData: (data: CommitCell[]) => void
  setSelectedYear: (year: number) => void
  addLog: (log: string) => void
  clearLogs: () => void
  updateFormData: (data: Partial<FormState>) => void
}

export const useCommitStore = create<CommitStore>()(
  persist(
    (set, get) => ({
      commitData: [],
      selectedYear: new Date().getFullYear(),
      commitLogs: [],
      formData: {
        username: "",
        token: "",
        repository: "github-matrix",
        year: new Date().getFullYear().toString(),
        customMessages: "",
        rateLimit: 100,
        batchSize: 10,
        useCustomMessages: false,
      },
      yearDataMap: {},
      
      setCommitData: (data) => {
        set((state) => {
          // Update the yearDataMap with the current data for the selected year
          const yearDataMap = {
            ...state.yearDataMap,
            [state.selectedYear]: data,
          }
          
          return { commitData: data, yearDataMap }
        })
      },
      
      setSelectedYear: (year) => {
        set((state) => {
          const yearData = state.yearDataMap[year] || []
          return { 
            selectedYear: year, 
            commitData: yearData,
          }
        })
      },
      
      addLog: (log) => set((state) => ({ 
        commitLogs: [...state.commitLogs, `[${new Date().toLocaleTimeString()}] ${log}`] 
      })),
      
      clearLogs: () => set({ commitLogs: [] }),
      
      updateFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),
    }),
    {
      name: "github-matrix-storage",
      partialize: (state) => ({ 
        yearDataMap: state.yearDataMap, 
        selectedYear: state.selectedYear,
        commitLogs: state.commitLogs,
        formData: state.formData
      }),
    }
  )
)

