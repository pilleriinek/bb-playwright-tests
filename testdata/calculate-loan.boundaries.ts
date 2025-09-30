// boundaries + invalid input
export const maturityBoundaries = [
  { maturity: 1, expectedStatus: 200, description: 'lower boundary valid' },
  { maturity: 0, expectedStatus: 500, description: 'below lower boundary, zero not allowed' },
  { maturity: -1, expectedStatus: 500, description: 'negative value' },
  { maturity: 'test', expectedStatus: 400, description: 'invalid string input' },
  { maturity: '6,1', expectedStatus: 400, description: 'decimal places not allowed' },
  { maturity: null, expectedStatus: 400, description: 'null value' },
];