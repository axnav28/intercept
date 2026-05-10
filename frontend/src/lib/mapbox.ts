import mapboxgl from "mapbox-gl";

export function getMapboxToken() {
  return import.meta.env.VITE_MAPBOX_TOKEN ?? "";
}

export function configureMapbox() {
  const token = getMapboxToken();
  if (token) {
    mapboxgl.accessToken = token;
  }
  return token;
}

export { mapboxgl };
