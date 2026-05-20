"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export default function TaskMapClient({ lat, lng }: Props) {
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

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-[350px] w-full"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
