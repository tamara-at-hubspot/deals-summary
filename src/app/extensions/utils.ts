export function calculateTotalAmount(deals) {
  const amounts = deals.map((deal) => parseFloat(deal.properties.amount));
  return amounts.reduce((sum, amount) => sum + amount, 0);
}
