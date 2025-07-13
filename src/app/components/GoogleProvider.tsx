"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";

export default function GoogleProvider({ children }: PropsWithChildren<{}>) {
  const API_KEY = "AIzaSyCbxwEdUEEJ-W7fEHkPf1TDs9VrRGKOIIs";

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      {children}
    </APIProvider>
  );
}
