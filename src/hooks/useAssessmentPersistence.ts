import { useState, useEffect } from 'react';
import { Assessment } from '@/lib/db';

const STORAGE_KEY = 'assessment-builder-state';

export function useAssessmentPersistence(jobId: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${jobId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAssessment(parsed);
      }
    } catch (error) {
      console.error('Error loading assessment from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  // Save to localStorage whenever assessment changes
  useEffect(() => {
    if (assessment && !isLoading) {
      try {
        localStorage.setItem(`${STORAGE_KEY}-${jobId}`, JSON.stringify(assessment));
      } catch (error) {
        console.error('Error saving assessment to localStorage:', error);
      }
    }
  }, [assessment, jobId, isLoading]);

  const updateAssessment = (updates: Partial<Assessment>) => {
    setAssessment(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
  };

  const clearAssessment = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}-${jobId}`);
      setAssessment(null);
    } catch (error) {
      console.error('Error clearing assessment from localStorage:', error);
    }
  };

  return {
    assessment,
    setAssessment,
    updateAssessment,
    clearAssessment,
    isLoading
  };
}
