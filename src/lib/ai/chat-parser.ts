export interface ParsedChatIntent {
  primaryText?: string;
  secondaryText?: string;
  initials?: string[];
  assetType?: string;
  weddingStyle?: string;
  layout?: string;
}

export function parseChatIntent(userPrompt: string): ParsedChatIntent {
  const text = userPrompt.trim();
  const lower = text.toLowerCase();

  const intent: ParsedChatIntent = {};

  // 1. Try to extract explicit full names e.g. "Jack & Jill" or "Jack and Jill" or "for Jack & Jill"
  const fullNamesMatch = text.match(/\b([A-Z][a-z]{1,12})\s*(?:&|and|\+)\s*([A-Z][a-z]{1,12})\b/);
  if (fullNamesMatch) {
    intent.primaryText = fullNamesMatch[1];
    intent.secondaryText = fullNamesMatch[2];
    intent.initials = [fullNamesMatch[1][0].toUpperCase(), fullNamesMatch[2][0].toUpperCase()];
  } else {
    // 2. Try to extract explicit initials e.g. "E & V" or "E and V" or "for E & V"
    const initialsMatch = text.match(/\b([A-Z])\s*(?:&|and|\+)\s*([A-Z])\b/);
    if (initialsMatch) {
      intent.primaryText = initialsMatch[1].toUpperCase();
      intent.secondaryText = initialsMatch[2].toUpperCase();
      intent.initials = [initialsMatch[1].toUpperCase(), initialsMatch[2].toUpperCase()];
    }
  }

  // 3. Extract Asset Type
  if (lower.includes("crest") || lower.includes("shield")) {
    intent.assetType = "wedding_crest";
  } else if (lower.includes("monogram")) {
    intent.assetType = "two_initial_monogram";
  } else if (lower.includes("divider") || lower.includes("rule")) {
    intent.assetType = "invitation_divider";
  } else if (lower.includes("border") || lower.includes("frame")) {
    intent.assetType = "invitation_border";
  } else {
    intent.assetType = "couple_logo";
  }

  // 4. Extract Wedding Style
  if (lower.includes("estate") || lower.includes("chateau") || lower.includes("heraldic")) {
    intent.weddingStyle = "european_estate";
  } else if (lower.includes("editorial") || lower.includes("vogue") || lower.includes("fashion")) {
    intent.weddingStyle = "editorial_luxury";
  } else if (lower.includes("minimal") || lower.includes("clean") || lower.includes("modern")) {
    intent.weddingStyle = "modern_minimalist";
  }

  // 5. Extract Layout
  if (lower.includes("horizontal") || lower.includes("line")) {
    intent.layout = "horizontal";
  } else if (lower.includes("interlock") || lower.includes("woven")) {
    intent.layout = "interlocking";
  } else {
    intent.layout = "stacked";
  }

  return intent;
}
