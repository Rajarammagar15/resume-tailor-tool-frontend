import React from 'react';
import { Loader } from 'lucide-react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 24 }) {
  return (
    <Loader size={size} className="loading-spinner" />
  );
}

export default LoadingSpinner;
