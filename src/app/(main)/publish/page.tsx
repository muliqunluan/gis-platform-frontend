'use client';

import { useState } from 'react';
import { PublishFormProvider, usePublishForm } from '@/context/PublishFormContext';
import MapTypeSelection from '@/components/map-create/map-type-selection/map-type-selection';
import MapInfoForm from '@/components/map-create/map-info-form/MapInfoForm';
import StandardMapConfig from '@/components/map-create/map-config/StandardMapConfig';
import MapPublishConfirm from '@/components/map-create/map-preview/MapPublishConfirm';
import { useRouter } from 'next/navigation';

type PublishStep = 'type' | 'info' | 'config' | 'confirm';

function PublishContent() {
  const [step, setStep] = useState<PublishStep>('type');
  const { updateInfoForm, updatePreviewForm, resetForm } = usePublishForm();
  const router = useRouter();

  const handleNextStep = (nextStep: PublishStep) => {
    setStep(nextStep);
  };

  const handleBackStep = (prevStep: PublishStep) => {
    setStep(prevStep);
  };

  switch (step) {
    case 'type':
      return <MapTypeSelection onSelect={() => handleNextStep('info')} />;
    case 'info':
      return (
        <MapInfoForm
          onSubmit={(data) => {
            updateInfoForm(data);
            handleNextStep('config');
          }}
          onBack={() => handleBackStep('type')}
        />
      );
    case 'config':
      return (
        <StandardMapConfig
          onBack={() => handleBackStep('info')}
          onSubmit={() => handleNextStep('confirm')}
        />
      );
    case 'confirm':
      return (
        <MapPublishConfirm
          onBack={() => handleBackStep('config')}
          onPublish={() => {
            updatePreviewForm({ confirmed: true });
            resetForm();
            // Navigate to the main map or a success page
            router.push('/');
          }}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
}

export default function PublishPage() {
  return (
    <PublishFormProvider>
      <PublishContent />
    </PublishFormProvider>
  );
}