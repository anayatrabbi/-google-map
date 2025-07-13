"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";

export default function GoogleProvider({ children }: PropsWithChildren<{}>) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      {children}
    </APIProvider>
  );
}
