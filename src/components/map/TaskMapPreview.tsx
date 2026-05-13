"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


type Props = {
  lat?: number;
  lng?: number;
};

export default function TaskMapPreview({ lat, lng }: Props) {
  if (!lat || !lng) return null;

  return (
    <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-200">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}