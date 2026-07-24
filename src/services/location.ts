export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return data.display_name ?? "Unknown Location";
  } catch (error) {
    console.error("Reverse Geocoding Failed:", error);

    return "Unknown Location";
  }
}