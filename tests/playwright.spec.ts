import { test, expect } from '@playwright/test';
import { loanApplicationPage } from '../pages/loan-application.page';
import { calculate } from '../requests/calculate-loan.requests';
import { calculateRequestPayloads } from '../payloads/requests/calculate-loan.requests';
import { CalculateLoanPayload, CalculateLoanResponse } from '../schemas/calculate-loan.schemas';

test.describe('Loan calculator modal tests', () => {
  
  test.beforeEach(async ({ page, request }) => {
    // Save response from POST /loan/calculate
    const response = await calculate(request, calculateRequestPayloads.validSLEE01);
    expect(response.status()).toBe(200);
    const data: CalculateLoanResponse = await response.json();

    // Load page
    const loanPage = new loanApplicationPage(page);
    await loanPage.goto();
    await expect(page.getByText('Vali sobiv summa ja periood')).toBeVisible();

    // Verify fields "Laenusumma" and "Periood"
    const amountField = page.locator('#header-calculator-amount').locator('input');
    //const amountField = amountContainer.locator('input');
    await expect(amountField).toHaveValue('5,000');
    await expect(amountField).toBeEnabled();

    const periodField = page.locator('#header-calculator-period').locator('input');
    await expect(periodField).toHaveValue('60');
    await expect(periodField).toBeEnabled();

    // Verify slider - TODO

    // Verify for "Kuumakse" that data is from POST /loan/endpoint response
    const monthlyPayment = page.locator('.bb-labeled-value__value');
    await expect(monthlyPayment).toHaveText('€' + data.monthlyPayment.toFixed(2));

    // "Jätka" button
    await expect(page.getByRole('button', { name: 'Jätka' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Jätka' })).toBeEnabled();
  });

  test('User inserts loan information and saves it successfully', async ({ page, request }) => {
    const newAmount = 6000;
    const newPeriod = 12;

    const modifiedPayload: CalculateLoanPayload = { // modifying the original payload by overriding some values
      ...calculateRequestPayloads.validSLEE01,
      amount: newAmount,
      maturity: newPeriod
    };

    const response = await calculate(request, modifiedPayload);
    expect(response.status()).toBe(200);
    const data: CalculateLoanResponse = await response.json();

    const amountField = page.locator('#header-calculator-amount').locator('input');
    await amountField.fill(newAmount.toString());
    await page.locator('h2').click();
    await expect(amountField).toHaveValue(newAmount.toLocaleString('en-US'));

    const periodField = page.locator('#header-calculator-period').locator('input');
    await periodField.fill(newPeriod.toString());
    await page.locator('h2').click();
    await expect(periodField).toHaveValue(newPeriod.toString());

    // Verify for "Kuumakse" that data is from POST /loan/endpoint response
    const monthlyPayment = page.locator('.bb-labeled-value__value');
    await expect(monthlyPayment).toHaveText('€' + data.monthlyPayment.toFixed(2));

    // Verify that loan sum is displayed in the loan application header after saving the modal
    await page.getByRole('button', { name: 'Jätka' }).click();
    const definedLoanSum = page.locator('.bb-edit-amount__amount');
    await expect(definedLoanSum).toHaveText(newAmount + " €")
  });

  /*
    test('Loan calculator modal calculates new monthly payment after user changed the input via slider', async ({ page }) => {
      // TODO
    });
  */

  test('Loan calculator modal calculates monthly payment using the min and max values', async ({ page, request }) => {
    const minAmount = 500; // maybe a better way would be to return the min/max/vase values from POST /pricing-conditions?
    const newMinAmount = 499;
    const maxAmount = 30000; 
    const newMaxAmount = 300001;

    const minPeriod = 6; 
    const newMinPeriod = 5;
    const maxPeriod = 120; 
    const newMaxPeriod = 121;

    // min values
    let modifiedPayload: CalculateLoanPayload = {
      ...calculateRequestPayloads.validSLEE01,
      amount: minAmount,
      maturity: minPeriod
    };
    let response = await calculate(request, modifiedPayload);
    expect(response.status()).toBe(200);
    let data: CalculateLoanResponse = await response.json();

    const amountField = page.locator('#header-calculator-amount').locator('input');
    await amountField.fill(newMinAmount.toString());
    await page.locator('h2').click();
    await expect(amountField).toHaveValue(minAmount.toLocaleString('en-US'));

    const periodField = page.locator('#header-calculator-period').locator('input');
    await periodField.fill(newMinPeriod.toString());
    await page.locator('h2').click();
    await expect(periodField).toHaveValue(minPeriod.toString());

    let monthlyPayment = page.locator('.bb-labeled-value__value');
    await expect(monthlyPayment).toHaveText('€' + data.monthlyPayment.toFixed(2));

    // max values
    modifiedPayload = {
      ...calculateRequestPayloads.validSLEE01,
      amount: maxAmount,
      maturity: maxPeriod
    };
    response = await calculate(request, modifiedPayload);
    expect(response.status()).toBe(200);
    data = await response.json();

    await amountField.fill(newMaxAmount.toString());
    await page.locator('h2').click();
    await expect(amountField).toHaveValue(maxAmount.toLocaleString('en-US'));

    await periodField.fill(newMaxPeriod.toString());
    await page.locator('h2').click();
    await expect(periodField).toHaveValue(maxPeriod.toString());

    monthlyPayment = page.locator('.bb-labeled-value__value');
    await expect(monthlyPayment).toHaveText('€' + data.monthlyPayment.toFixed(2));

  });

  /*
  test('Loan calculator modal fields handle not valid inserts', async ({ page }) => {
    //TODO
  });
*/

})