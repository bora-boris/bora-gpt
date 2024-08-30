export const formatConversationPreview = (str: string): string => {
  const maxLength = 100;

  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
};
