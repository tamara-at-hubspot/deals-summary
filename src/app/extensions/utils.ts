export function calculateTotalAmount(deals) {
  const amounts = deals.map((deal) => parseFloat(deal.properties.amount));
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

export const STAGE_OPTIONS = Object.freeze([
  { label: 'Appointment Scheduled', value: 'appointmentscheduled' },
  { label: 'Qualified To Buy', value: 'qualifiedtobuy' },
  { label: 'Presentation Scheduled', value: 'presentationscheduled' },
  { label: 'Decision Maker Bought-In', value: 'decisionmakerboughtin' },
  { label: 'Contract Sent', value: 'contractsent' },
  { label: 'Closed Won', value: 'closedwon' },
  { label: 'Closed Lost', value: 'closedlost' },
]);

export function constructStageOptions(deals) {
  const valuesInUse = new Set(
    deals
      .map((deal) => deal.properties.dealstage)
      .filter((dealstage) => dealstage)
  );
  return [...STAGE_OPTIONS].filter((option) => valuesInUse.has(option.value));
}

export function calculatePreselectedStages(deals) {
  return constructStageOptions(deals).map((option) => option.value);
}
