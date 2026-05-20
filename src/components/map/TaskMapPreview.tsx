"use client";

import dynamic from "next/dynamic";

const TaskMapClient = dynamic(
  () => import("./TaskMapClient"),
  { ssr: false },
);

type Props = {
  lat: number;
  lng: number;
};

export default function TaskMapPreview({ lat, lng }: Props) {
  return <TaskMapClient lat={lat} lng={lng} />;
}