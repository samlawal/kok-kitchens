// getAddress.io address lookup — turns a UK postcode into a list of full
// addresses. Pure parsing kept here (testable); the keyed HTTP call lives in
// the /api/address route so the API key never reaches the browser.

export interface AddressSuggestion {
  line1: string; // street/number (+ second line if present)
  city: string;
  label: string; // display text for the dropdown
}

export function isGetAddressConfigured(): boolean {
  return !!process.env.GETADDRESS_API_KEY;
}

// Shape of one entry from getAddress.io `find/{postcode}?expand=true`.
export interface ExpandedAddress {
  line_1?: string;
  line_2?: string;
  town_or_city?: string;
  county?: string;
  formatted_address?: string[];
}

export function parseGetAddress(data: {
  addresses?: ExpandedAddress[];
}): AddressSuggestion[] {
  if (!data || !Array.isArray(data.addresses)) return [];
  return data.addresses
    .map((a) => {
      const line1 = [a.line_1, a.line_2].filter(Boolean).join(", ").trim();
      const city = (a.town_or_city || "").trim();
      const label =
        (a.formatted_address || [a.line_1, a.town_or_city])
          .map((s) => (s || "").trim())
          .filter(Boolean)
          .join(", ") || line1;
      return { line1, city, label };
    })
    .filter((a) => a.line1.length > 0);
}
