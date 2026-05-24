"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect } from "react";

type Props = {
  lat?: number;
  lng?: number;
};

export default function MiniTaskMap({ lat, lng }: Props) {
  useEffect(() => {
    const L = require("leaflet");

    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  if (!lat || !lng) {
    return (
      <div className="h-[130px] w-full bg-slate-100 animate-pulse" />
    );
  }

  return (
    <div className="relative h-[130px] w-full overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <Marker position={[lat, lng]} />
      </MapContainer>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
    </div>
  );
}