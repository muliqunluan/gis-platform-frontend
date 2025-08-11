'use client';

import React, { createContext, useContext, useState } from 'react';

interface InfoFormData {
  name: string;
  isPublic: boolean;
  groupName: string;
  description: string;
  image?: File;
}

interface ConfigFormData {
  extent?: [number, number, number, number];
  minZoom?: number;
  maxZoom?: number;
  projection?: string;
  enableDefaultControls?: boolean;
}

interface PreviewFormData {
  confirmed?: boolean;
}

interface PublishFormState {
  currentStep: number;
  formData: {
    info?: InfoFormData;
    config?: ConfigFormData;
    preview?: PreviewFormData;
  };
}

interface PublishFormContextType extends PublishFormState {
  setCurrentStep: (step: number) => void;
  updateInfoForm: (data: InfoFormData) => void;
  updateConfigForm: (data: ConfigFormData) => void;
  updatePreviewForm: (data: PreviewFormData) => void;
  resetForm: () => void;
}

const PublishFormContext = createContext<PublishFormContextType | undefined>(undefined);

export function PublishFormProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PublishFormState>({
    currentStep: 0,
    formData: {},
  });

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const updateInfoForm = (data: InfoFormData) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, info: data }
    }));
  };

  const updateConfigForm = (data: ConfigFormData) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, config: data }
    }));
  };

  const updatePreviewForm = (data: PreviewFormData) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, preview: data }
    }));
  };

  const resetForm = () => {
    setState({
      currentStep: 0,
      formData: {},
    });
  };

  return (
    <PublishFormContext.Provider
      value={{
        ...state,
        setCurrentStep,
        updateInfoForm,
        updateConfigForm,
        updatePreviewForm,
        resetForm,
      }}
    >
      {children}
    </PublishFormContext.Provider>
  );
}

export function usePublishForm() {
  const context = useContext(PublishFormContext);
  if (!context) {
    throw new Error('usePublishForm must be used within a PublishFormProvider');
  }
  return context;
}