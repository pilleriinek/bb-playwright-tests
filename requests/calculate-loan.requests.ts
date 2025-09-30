import { test, expect } from '@playwright/test';


import { APIRequestContext, APIResponse } from '@playwright/test';
import { CalculateLoanPayload } from '../schemas/calculate-loan.schemas';

// POST /loan/calculate
export async function calculate(request: APIRequestContext, 
    payload: CalculateLoanPayload)
    
 {
  return request.post('loan/calculate', { data: payload });
}