export const copyTextToClipboard = (text: string): Promise<void> =>
  navigator.clipboard.writeText(text);
