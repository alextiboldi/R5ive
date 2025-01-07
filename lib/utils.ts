import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatInTimeZone } from "date-fns-tz";
import { parse, isValid } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeConversionOptions {
  /**
   * Time string in 24-hour format (HH:mm)
   */
  time: string;
  /**
   * Server timezone (e.g., 'America/New_York')
   */
  serverTimezone: string;
  /**
   * User's timezone (e.g., 'Europe/London')
   */
  userTimezone: string;

  userLocale?: string;
  /**
   * Optional date string in 'yyyy-MM-dd' format. Defaults to current date
   */
  date?: string;
}

interface ConversionResult {
  success: boolean;
  userTime: string | null;
  error?: string;
}

/**
 * Converts a time from server timezone to user timezone
 * @param options TimeConversionOptions object
 * @returns ConversionResult object
 */
export function convertTimeToUserTimezone({
  time,
  serverTimezone,
  userTimezone,
  userLocale,
  date = format(new Date(), "yyyy-MM-dd"),
}: TimeConversionOptions): ConversionResult {
  try {
    // Combine date and time strings
    const dateTimeString = `${date} ${time}`;
    // const isAMPM = isAMPMPreferred(userLocale, userTimezone);
    // Parse the datetime string
    const parsedDate = parse(dateTimeString, "yyyy-MM-dd HH:mm", new Date());

    if (!isValid(parsedDate)) {
      return {
        success: false,
        userTime: null,
        error: "Invalid date or time format",
      };
    }

    // Convert from server timezone to user timezone directly
    const userTime = formatInTimeZone(parsedDate, userTimezone, "HH:mm", {
      timeZone: serverTimezone,
    });

    return {
      success: true,
      userTime,
    };
  } catch (error) {
    return {
      success: false,
      userTime: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

const isAMPMPreferred = (locale: string, timezone: string) => {
  // List of countries/regions that use AM/PM
  const ampmCountries = [
    "US", // United States
    "CA", // Canada (English-speaking regions)
    "AU", // Australia
    "NZ", // New Zealand
    "IN", // India
    "PK", // Pakistan
    "PH", // Philippines
    "JM", // Jamaica
    "TT", // Trinidad and Tobago
    "BD", // Bangladesh
    "SR", // Sri Lanka
  ];

  // Extract the country code from the locale (e.g., "en-US" => "US")
  const countryCode = locale.split("-")[1]?.toUpperCase();

  // Check if the country uses AM/PM
  if (countryCode && ampmCountries.includes(countryCode)) {
    return true;
  }

  // Fallback to timezone logic (e.g., America/New_York)
  return timezone.startsWith("America");
};

// Example usage:
const result = convertTimeToUserTimezone({
  time: "14:30", // 2:30 PM
  serverTimezone: "America/New_York",
  userTimezone: "Asia/Tokyo",
  date: "2024-01-05", // optional
});

if (result.success && result.userTime) {
  console.log(`User's local time: ${result.userTime}`);
} else {
  console.log(`Error: ${result.error}`);
}
