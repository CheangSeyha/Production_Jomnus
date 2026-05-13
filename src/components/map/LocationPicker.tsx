"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

// Dynamically import leaflet only on the client side
let L: any = null;

if (typeof window !== "undefined") {
  L = require("leaflet");

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

type Props = {
  onSelect: (lat: number, lng: number) => void;
};

function MapClickHandler({ setSelected, selected }: any) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setSelected(e.latlng);
    },
  });

  return selected ? <Marker position={selected} /> : null;
}

export default function LocationPicker({ onSelect }: Props) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="space-y-3">
      <MapContainer
        center={[11.5564, 104.9282]}
        zoom={13}
        className="h-[400px] w-full rounded-xl"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <MapClickHandler setSelected={setSelected} selected={selected} />
      </MapContainer>

      {/* ACTION BUTTON */}
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">
          {selected ? "Location selected" : "Click on map to select location"}
        </span>

        <button
          disabled={!selected}
          onClick={() => {
            onSelect(selected.lat, selected.lng);
          }}
          className={`px-4 py-2 rounded-lg text-white ${
            selected
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
