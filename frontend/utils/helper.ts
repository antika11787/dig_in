const helper = () => {
  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    } else {
      const truncatedText = text.substring(0, maxLength).trim();
      return `${truncatedText}...`;
    }
  }

  return {
    truncateText,
  };
};

export default helper;
