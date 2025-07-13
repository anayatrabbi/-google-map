"use client";
import React, { use, useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
  useMap,
  AdvancedMarker,
  Marker,
} from "@vis.gl/react-google-maps";
import {
  useDrawingManager,
  useDrawingManagerEvent,
} from "../hooks/use-drawing-manager";

const PLACE_TYPES = [
  { label: "Train Stations", keyword: "train station" },
  { label: "Nursery", keyword: "nursery school" },
  { label: "Primary", keyword: "primary school" },
  { label: "Secondary", keyword: "secondary school" },
  { label: "Sixth Form", keyword: "sixth form" },
  { label: "University", keyword: "university" },
];

export default function MapDrawing() {
  const drawingManager = useDrawingManager();
  const { enableEditing, polyline } = useDrawingManagerEvent(drawingManager);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  console.log(polyline, "polyline");

  return (
    <>
      <Map
        style={{ width: "100vw", height: "50vh" }}
        defaultCenter={{ lat: 51.5074, lng: -0.1278 }}
        defaultZoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <MapLogic places={places} setPlaces={setPlaces} />
      </Map>

      {polyline && (
        <button className="" onClick={enableEditing}>
          Edit
        </button>
      )}
    </>
  );
}

function MapLogic({
  places,
  setPlaces,
}: {
  places: google.maps.places.PlaceResult[];
  setPlaces: React.Dispatch<
    React.SetStateAction<google.maps.places.PlaceResult[]>
  >;
}) {
  const map = useMap(); // this gives you the Google Map instance
  const [currentKeyword, setCurrentKeywords] = useState("");

  const handleSearch = (keyword: string) => {
    if (!map) return;
    debugger;
    setPlaces([]);
    const service = new google.maps.places.PlacesService(map);
    const center = map.getCenter();
    if (!center) return;
    service.nearbySearch(
      {
        location: center,
        radius: 50000,
        keyword: keyword, // keyword should come from button/filter selection
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces((places) => {
            return [...places, ...results];
          });
        }
      }
    );
    setCurrentKeywords(keyword);
  };

  //   useEffect(() => {
  //     if (!map || !google.maps.places) return;

  //     const service = new google.maps.places.PlacesService(map);

  //     const listener = google.maps.event.addListener(map, "idle", () => {
  //       const center = map.getCenter();
  //       if (!center) return;

  //       service.nearbySearch(
  //         {
  //           location: center,
  //           radius: 50000,
  //           keyword: currentKeyword, // keyword should come from button/filter selection
  //         },
  //         (results, status) => {
  //           if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //             setPlaces((places) => {
  //               return [...places, ...results];
  //             });
  //           }
  //         }
  //       );
  //     });

  //     return () => {
  //       google.maps.event.removeListener(listener);
  //     };
  //   }, [map, currentKeyword]);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    console.log(currentKeyword, "curent keywork");
  }),
    [currentKeyword];

  return (
    <>
      {/* Search buttons */}
      <div className="absolute z-10 top-4 left-4 bg-white p-2 rounded shadow">
        {PLACE_TYPES.map(({ label, keyword }) => (
          <button
            key={keyword}
            onClick={() => handleSearch(keyword)}
            className="m-1 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Render markers */}
      {places.map(
        (place, index) =>
          place.geometry?.location && (
            <Marker
              key={`${place.place_id}-${index}`}
              position={place.geometry.location}
            />
          )
      )}
    </>
  );
}
