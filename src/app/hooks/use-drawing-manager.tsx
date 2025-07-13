import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

export type OverlayGeometry =
  | google.maps.Marker
  | google.maps.Polygon
  | google.maps.Polyline
  | google.maps.Rectangle
  | google.maps.Circle;

export interface DrawResult {
  type: google.maps.drawing.OverlayType;
  overlay: OverlayGeometry;
}

export function useDrawingManager(
  initialValue: google.maps.drawing.DrawingManager | null = null
) {
  const map = useMap();
  const drawing = useMapsLibrary("drawing");

  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(initialValue);

  useEffect(() => {
    if (!map || !drawing) return;

    // https://developers.google.com/maps/documentation/javascript/reference/drawing
    const newDrawingManager = new drawing.DrawingManager({
      map,
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      //   drawingControlOptions: {
      //     position: google.maps.ControlPosition.TOP_LEFT,
      //     drawingModes: [
      //       google.maps.drawing.OverlayType.MARKER,
      //       google.maps.drawing.OverlayType.CIRCLE,
      //       google.maps.drawing.OverlayType.POLYGON,
      //       google.maps.drawing.OverlayType.POLYLINE,
      //     ],
      //   },
      markerOptions: {
        draggable: true,
      },
      circleOptions: {
        editable: true,
      },
      polygonOptions: {
        editable: true,
        draggable: true,
      },
      rectangleOptions: {
        editable: true,
        draggable: true,
      },
      polylineOptions: {
        editable: true,
        draggable: true,
      },
    });

    setDrawingManager(newDrawingManager);

    return () => {
      newDrawingManager.setMap(null);
    };
  }, [drawing, map]);

  return drawingManager;
}

export function useDrawingManagerEvent(
  drawingManager: google.maps.drawing.DrawingManager | null
) {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const eventListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!drawingManager) return;

    const listener = google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      function (event: DrawResult) {
        if (polyline) {
          alert("You can only draw one polyline.");
          event.overlay.setMap(null); // Remove newly drawn polyline
          return;
        }

        if (event.type === "polygon") {
          const newPolygon = event.overlay as google.maps.Polygon;
          setPolyline(newPolygon);

          // Disable further drawing
          drawingManager.setDrawingMode(null);
          drawingManager.setOptions({
            drawingControl: false,
          });

          console.log("Polyline drawn:", newPolygon.getPath().getArray());
        }
      }
    );

    eventListenerRef.current = listener;

    return () => {
      // Cleanup when component unmounts or drawingManager changes
      if (eventListenerRef.current) {
        google.maps.event.removeListener(eventListenerRef.current);
      }
    };
  }, [drawingManager, polyline]);

  // Optional method to enable editing
  const enableEditing = () => {
    if (polyline) {
      polyline.setEditable(true);
    }
  };

  return { polyline, enableEditing };
}
