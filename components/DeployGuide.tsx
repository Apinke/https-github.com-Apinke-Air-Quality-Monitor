import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ContainerizationVisual } from './deployment-visuals/ContainerizationVisual';
import { PushToRegistryVisual } from './deployment-visuals/PushToRegistryVisual';
import { CloudRunVisual } from './deployment-visuals/CloudRunVisual';
import { ApiKeyVisual } from './deployment-visuals/ApiKeyVisual';
import { SuccessVisual } from './deployment-visuals/SuccessVisual';

const ProgressBar: React.FC<{ duration: number, onFinished: () => void }> = ({ duration, onFinished }) => {
    useEffect(() => {
        const timer = setTimeout(onFinished, duration);
        return () => clearTimeout(timer);
    }, [duration, onFinished]);
    
    return (
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
                className="bg-sky-500 h-1.5 rounded-full animate-progress"
                style={{ animationDuration: `${duration}ms` }}
            ></div>
        </div>
    );
};

const steps = [
  { 
    title: 'Step 1: Containerization', 
    description: 'The application is packaged into a standardized, portable Docker container.',
    visual: <ContainerizationVisual />, 
    duration: 3500 
  },
  { 
    title: 'Step 2: Push to Registry', 
    description: 'The container is uploaded to Google Artifact Registry for secure storage.',
    visual: <PushToRegistryVisual />, 
    duration: 3500 
  },
  { 
    title: 'Step 3: Deploy Service', 
    description: 'A new Cloud Run service is provisioned to run the container.',
    visual: <CloudRunVisual />, 
    duration: 4000 
  },
  { 
    title: 'Step 4: Secure API Key', 
    description: 'The Gemini API key is securely injected as an environment variable.',
    visual: <ApiKeyVisual />, 
    duration: 3000 
  },
  { 
    title: 'Step 5: Deployment Complete', 
    description: 'Your Air Quality Monitor is now live and accessible on the web.',
    visual: <SuccessVisual />, 
    duration: 999999, // Stays on this step
    final: true 
  },
];

export const DeployGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const stepData = steps[currentStep];

    return (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="deploy-guide-title"
        >
            <div 
              className="relative bg-slate-800/90 border border-slate-700 rounded-lg shadow-2xl p-6 pt-12 md:p-8 md:pt-14 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close deployment guide"
                >
                    <CloseIcon />
                </button>
                
                <div className="flex flex-col text-center">
                    <div className="flex justify-center space-x-2 mb-4">
                        {steps.map((_, index) => (
                             <div key={index} className={`h-1.5 rounded-full flex-1 ${index <= currentStep ? 'bg-sky-500' : 'bg-slate-600'} transition-colors`}></div>
                        ))}
                    </div>

                    <div key={currentStep} className="animate-fade-in">
                        <div className="h-48 flex items-center justify-center text-slate-400 my-4">
                            {stepData.visual}
                        </div>
                        <h2 id="deploy-guide-title" className="text-xl font-bold text-white mb-2">
                            {stepData.title}
                        </h2>
                        <p className="text-slate-300 mb-6 min-h-[40px]">{stepData.description}</p>
                    </div>

                    {!stepData.final ? (
                       <ProgressBar duration={stepData.duration} onFinished={handleNextStep} />
                    ) : (
                         <button onClick={onClose} className="mt-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};