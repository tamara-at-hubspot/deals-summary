import React, { useState, useEffect } from 'react';
import {
  Alert,
  LoadingSpinner,
  Statistics,
  StatisticsItem,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';
import { calculateTotalAmount } from './utils';

// Define the extension to be run within the Hubspot CRM
hubspot.extend(() => <DealsSummary />);

// Define the Extension component, taking in runServerless prop
const DealsSummary = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [dealCount, setDealCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Request statistics data from serverless function
    hubspot
      .serverless('get-deals', {
        propertiesToSend: ['hs_object_id'],
      })
      .then((deals) => {
        setDealCount(deals.length);
        setTotalAmount(calculateTotalAmount(deals));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    // If loading, show a spinner
    return <LoadingSpinner label="loading" />;
  }
  if (errorMessage) {
    // If there's an error, show an alert
    return (
      <Alert title="Unable to get deals data" variant="error">
        {errorMessage}
      </Alert>
    );
  }
  return (
    <Statistics>
      <StatisticsItem label="Total deals" number={dealCount} />
      <StatisticsItem label="Total amount" number={totalAmount} />
    </Statistics>
  );
};
