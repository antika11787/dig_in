import { DateTimeFormatOptions } from "@formatjs/intl-utils";

interface DateTimeFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZone?: string;
}

const helper = () => {
  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    } else {
      const truncatedText = text.substring(0, maxLength).trim();
      return `${truncatedText}...`;
    }
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const options: DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("en-US", options);
  }

  return {
    truncateText,
    formatTimestamp,
  };
};

export default helper;
