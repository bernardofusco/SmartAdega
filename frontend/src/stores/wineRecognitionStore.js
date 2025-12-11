import { create } from 'zustand'

export const useWineRecognitionStore = create((set) => ({
  recognizedData: null,
  imageFile: null,
  imagePreview: null,
  
  setRecognizedData: (data) => set({ recognizedData: data }),
  
  setImageData: (file, preview) => set({ 
    imageFile: file, 
    imagePreview: preview 
  }),
  
  clearRecognitionData: () => set({ 
    recognizedData: null, 
    imageFile: null, 
    imagePreview: null 
  })
}))
