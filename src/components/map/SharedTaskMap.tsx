"use client";

import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";


type Props = {
  lat?: number;
  lng?: number;
};

function FlyToLocation({
  lat,
  lng,
}: {
  lat?: number;
  lng?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, {
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);

  return null;
}

export default function SharedTaskMap({
  lat,
  lng,
}: Props) {
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
      center={[11.5564, 104.9282]}
      zoom={12}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      <FlyToLocation lat={lat} lng={lng} />

      {lat && lng && (
        <Marker position={[lat, lng]} />
      )}
    </MapContainer>
  );
}