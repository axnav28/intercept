export function getMapboxToken() {
  return import.meta.env.VITE_MAPBOX_TOKEN ?? "";
}

export async function loadMapbox() {
  await import("mapbox-gl/dist/mapbox-gl.css");
  const module = await import("mapbox-gl");
  return module.default;
}

export function configureMapboxAccess() {
  const token = getMapboxToken();
  return token;
}
