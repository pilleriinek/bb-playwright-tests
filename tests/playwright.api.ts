import { test, expect } from '@playwright/test';
import { calculate } from '../requests/calculate-loan.requests';
import { calculateRequestPayloads } from '../payloads/requests/calculate-loan.requests';
import { calculateResponses } from '../payloads/responses/calculate-loan.responses';
import { timedRequest } from '../helpers/timedRequests';
import { maturityBoundaries } from '../testdata/calculate-loan.boundaries';
import { calculateLoanResponseSchema } from '../schemas/calculate-loan.schemas';

test('Calculate loan with valid payload for Small Loan (EE 01)', async ({ request }) => {
  const { response } = await timedRequest(
    () => calculate(request, calculateRequestPayloads.validSLEE01));

  const data = await response.json();
  expect(data).toEqual(calculateResponses.smallLoanEE01);
  calculateLoanResponseSchema.parse(data); // response schema validation
  expect(response.status()).toBe(200);
});


test('Calculate loan with missing payload', async ({ request }) => {
  const response = await calculate(request, calculateRequestPayloads.empty as any);
  const data = await response.json();
  expect(response.status()).toBe(400);
});


// Boundaries tests example for maturity
test.describe('Maturity boundary API tests', () => {
  maturityBoundaries.forEach(({ maturity, expectedStatus, description }) => {
    test(description, async ({ request }) => {
      const payload = {
        ...calculateRequestPayloads.validSLEE01,
        maturity: maturity as any
      };
      const response = await calculate(request, payload);
      expect(response.status()).toBe(expectedStatus);
    });
  });
});