import React, { useState, useEffect } from 'react';
import {
  Alert,
  Flex,
  LoadingSpinner,
  MultiSelect,
  type MultiSelectProps,
  Statistics,
  StatisticsItem,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';
import {
  calculateTotalAmount,
  constructStageOptions,
  calculatePreselectedStages,
} from './utils';

type Options = MultiSelectProps['options'];

// Define the extension to be run within the Hubspot CRM
hubspot.extend(() => <DealsSummary />);

// Define the Extension component, taking in runServerless prop
const DealsSummary = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deals, setDeals] = useState<any[]>([]);
  const [dealCount, setDealCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [stageOptions, setStageOptions] = useState<Options>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  useEffect(() => {
    // Request statistics data from serverless function
    for (let i = 0; i < 75; i++) {
      hubspot
        .serverless('get-deals', {
          propertiesToSend: ['hs_object_id'],
        })
        .then((deals) => {
          setDeals(deals);
          // deal stages available, all selected initially
          setStageOptions(constructStageOptions(deals));
          setSelectedStages(calculatePreselectedStages(deals));
          // calculate stats
          setDealCount(deals.length);
          setTotalAmount(calculateTotalAmount(deals));
        })
        .catch((error) => {
          setErrorMessage(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const updateSelectedStages = (dealstages) => {
    const filteredDeals = deals.filter((deal) =>
      dealstages.includes(deal.properties.dealstage)
    );
    setDealCount(filteredDeals.length);
    setTotalAmount(calculateTotalAmount(filteredDeals));
    setSelectedStages(dealstages);
  };

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
    <Flex direction="column" gap="medium">
      <MultiSelect
        value={selectedStages}
        label="Select deal stages"
        name="dealStages"
        onChange={updateSelectedStages}
        options={stageOptions}
      />
      <Statistics>
        <StatisticsItem label="Total deals" number={dealCount} />
        <StatisticsItem label="Total amount" number={totalAmount} />
      </Statistics>
    </Flex>
  );
};
