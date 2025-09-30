import { Page } from '@playwright/test';

export class loanApplicationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://laenutaotlus.bigbank.ee/');
  }

  async editLoanAmount() {
    await this.page.getByRole('button', { name: 'Laenusumma' }).click(); // for editing the loan amount saved, currently not implemented TODO
  }
}
