import { z } from "zod";

export const calculateLoanPayloadSchema = z.object({
  currency: z.string().optional(), 
  productType: z.string(),
  maturity: z.number(), 
  administrationFee: z.number(), 
  conclusionFee: z.number(), 
  amount: z.number(), 
  monthlyPaymentDay: z.number(), 
  interestRate: z.number(),
});

export type CalculateLoanPayload = z.infer<typeof calculateLoanPayloadSchema>; // autogenerates TypeScript type

export const calculateLoanResponseSchema = z.object({
  totalRepayableAmount: z.number(),
  monthlyPayment: z.number(),
  apr: z.number()
});

export type CalculateLoanResponse = z.infer<typeof calculateLoanResponseSchema>;