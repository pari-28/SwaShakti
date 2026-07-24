import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { LocationData } from "../types/location";
import { useEffect } from "react";

interface LiveMapProps {
  location: LocationData;
}

function RecenterMap({ location }: LiveMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [location.latitude, location.longitude],
      map.getZoom(),
      {
        animate: true,
      }
    );
  }, [location, map]);

  return null;
}

export default function LiveMap({ location }: LiveMapProps) {
  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={16}
      style={{
        height: "380px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap location={location} />

      <Marker position={[location.latitude, location.longitude]}>
        <Popup>You are here 📍</Popup>
      </Marker>
    </MapContainer>
  );
}