export type FulfillmentOption = "delivery" | "pickup";

export type OrderPayload = {
  fullName: string;
  email: string;
  phone?: string;
  contactPreference: "email" | "phone" | "either";
  smsConsent: boolean;
  fulfillment: FulfillmentOption;
  deliveryDay: "sunday" | "monday";
  timeWindow: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  county?: string;
  allergies?: string;
  dietaryPreferences?: string;
  notes?: string;
  basePrice: number;
  deliveryFee: number;
  outsideZoneFee: number;
  outsideZoneAccepted: boolean;
  afterCutoff: boolean;
  scheduleNextWindow: boolean;
  submissionSource?: string;
};
