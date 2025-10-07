export enum CreditAction {
  GENERATE_PRESENTATION = 'Generate Presentation',
  PRETTIFY_PRESENTATION = 'Prettify Presentation',
  GENERATE_CARD = 'Generate Slide',
  CHANGE_CARD_LAYOUT = 'Update Slide layout',
  REROLL_IMAGE = 'Re-roll Image',
  ADJUST_TEXT = 'Adjust Text',
  CREDITS_FOR_INVITE = 'Add Credits for Invite',
  CREDITS_FOR_PRO_SUBSCRIPTION = 'Add Credits for Pro Subscription',
  ADD_PRESENTATION_LANGUAGE = 'Add Presentation Language',
}

export enum TransactionType {
  ADD = 'ADD',
  DEDUCT = 'DEDUCT',
}

export interface CreditActionConfig {
  cost: number;
  type: TransactionType;
}

export interface PricingConfig {
  [key: string]: CreditActionConfig;
}
