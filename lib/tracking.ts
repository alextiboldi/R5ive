import { UAParser } from "ua-parser-js";
import { db } from "./db";

interface TrackingData {
  userAgent: string;
  ipAddress: string;
  language: string;
  userId: string;
}

export async function trackUserSession(data: TrackingData) {
  try {
    const parser = new UAParser(data.userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    // First, get or create the device record
    const deviceData = {
      userAgent: data.userAgent,
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      deviceType: device.type || "desktop",
    };

    // Upsert the device record
    const dbDevice = await db.userDevice.upsert({
      where: { userAgent: data.userAgent },
      update: { lastSeenAt: new Date() },
      create: deviceData,
    });

    // Create a new session record
    await db.userSession.create({
      data: {
        userId: data.userId,
        deviceId: dbDevice.id,
        ipAddress: data.ipAddress,
        language: data.language,
        // Note: country/region/city would typically come from
        // a geolocation service in production
      },
    });
  } catch (error) {
    console.error("[TRACK_USER_SESSION]", error);
  }
}
