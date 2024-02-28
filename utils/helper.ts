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

interface Intervals {
  year: number;
  month: number;
  week: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  [key: string]: number; // Index signature allowing any string as key
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

  const formatTimeAgo = (timestamp: string): string => {
    const currentTime = new Date();
    const timeOfEvent = new Date(timestamp);
    const timeDifferenceInSeconds = Math.floor(
      (currentTime.getTime() - timeOfEvent.getTime()) / 1000
    );

    // Define time intervals in seconds
    const intervals: Intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    // Iterate through intervals to find the largest one that fits the time difference
    for (const interval in intervals) {
      if (timeDifferenceInSeconds >= intervals[interval]) {
        const count = Math.floor(timeDifferenceInSeconds / intervals[interval]);
        return count === 1
          ? `${count} ${interval} ago`
          : `${count} ${interval}s ago`;
      }
    }

    return "Just now";
  };

  return {
    truncateText,
    formatTimestamp,
    formatTimeAgo,
  };
};

export default helper;
