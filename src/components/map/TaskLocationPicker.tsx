"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import { useState } from "react";

let L: any = null;

if (typeof window !== "undefined") {
  L = require("leaflet");

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

type Props = {
  latitude?: number;
  longitude?: number;

  onChange: (
    lat: number,
    lng: number,
  ) => void;

  onConfirm?: () => void
};

function MapEvents({
  selected,
  setSelected,
}: any) {
  useMapEvents({
    click(e) {
      setSelected(e.latlng);
    },
  });

  return selected ? (
    <Marker
      draggable
      position={selected}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;

          setSelected(marker.getLatLng());
        },
      }}
    />
  ) : null;
}

export default function TaskLocationPicker({
  latitude,
  longitude,
  onChange,
  onConfirm
}: Props) {
  const [selected, setSelected] =
    useState<any>(
      latitude && longitude
        ? {
            lat: latitude,
            lng: longitude,
          }
        : null,
    );


  return (
    <div className="space-y-4">

      <div className="overflow-hidden rounded-3xl border border-sky-200 shadow-[0_14px_36px_rgba(14,165,233,0.14)]">

        <MapContainer
          center={
            selected
              ? [selected.lat, selected.lng]
              : [11.5564, 104.9282]
          }
          zoom={13}
          className="h-[420px] w-full"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

          <MapEvents
            selected={selected}
            setSelected={setSelected}
          />
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-bold text-slate-900">
            Task Location
          </p>

          <p className="text-xs font-medium text-slate-500">
            {selected
              ? `${selected.lat.toFixed(
                  5,
                )}, ${selected.lng.toFixed(5)}`
              : "Click map to select location"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setSelected({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                },
              );
            }}
            className="
              rounded-xl border border-sky-200 bg-sky-50
              px-4 py-2 text-sm font-bold
              text-sky-700 transition
              hover:bg-sky-100
            "
          >
            Current Location
          </button>

          <button
            type="button"
            disabled={!selected}
            onClick={() => {
              onChange(
                selected.lat,
                selected.lng,
              );
              onConfirm?.();
            }}
            className={`
              rounded-xl px-4 py-2
              text-sm font-bold text-white
              transition
              ${
                selected
                  ? "bg-sky-600 hover:bg-cyan-500 shadow-sm shadow-sky-200"
                  : "cursor-not-allowed bg-slate-300"
              }
            `}
          >
            Confirm Location
          </button>

        </div>
      </div>
    </div>
  );
}
