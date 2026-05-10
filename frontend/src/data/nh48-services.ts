export type EmergencyService = {
  id: string;
  name: string;
  type: "hospital" | "trauma" | "ambulance" | "police" | "rescue";
  latitude: number;
  longitude: number;
  area: string;
  eta: string;
  capability: string;
};

export const districtCenter = {
  latitude: 28.4595,
  longitude: 77.0266,
  label: "Delhi NCR / NH-48"
};

export const emergencyServices: EmergencyService[] = [
  {
    id: "svc-1",
    name: "AIIMS Trauma Centre",
    type: "trauma",
    latitude: 28.5672,
    longitude: 77.2100,
    area: "South Delhi",
    eta: "19 min",
    capability: "Critical care and multi-trauma"
  },
  {
    id: "svc-2",
    name: "Safdarjung Hospital Emergency",
    type: "hospital",
    latitude: 28.5680,
    longitude: 77.1992,
    area: "South Delhi",
    eta: "17 min",
    capability: "Emergency and orthopaedic intake"
  },
  {
    id: "svc-3",
    name: "Gurugram ALS Ambulance Unit",
    type: "ambulance",
    latitude: 28.4634,
    longitude: 77.0370,
    area: "Gurugram",
    eta: "8 min",
    capability: "Advanced life support ambulance"
  },
  {
    id: "svc-4",
    name: "Tikri Border Police Post",
    type: "police",
    latitude: 28.6886,
    longitude: 76.9865,
    area: "Tikri",
    eta: "11 min",
    capability: "Highway police coordination"
  },
  {
    id: "svc-5",
    name: "NH-48 Rescue Crane Unit",
    type: "rescue",
    latitude: 28.4215,
    longitude: 76.9875,
    area: "Manesar corridor",
    eta: "14 min",
    capability: "Vehicle extraction and roadside rescue"
  },
  {
    id: "svc-6",
    name: "Bahadurgarh Trauma Support",
    type: "trauma",
    latitude: 28.6920,
    longitude: 76.9335,
    area: "Bahadurgarh",
    eta: "16 min",
    capability: "ALS-ready trauma stabilization"
  }
];
