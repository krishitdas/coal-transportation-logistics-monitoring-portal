export const APP_NAME = 'CIL Transport Portal';
export const APP_DESCRIPTION = 'Coal Transportation & Logistics Monitoring Portal';

export const COLLIERIES = [
  'Rajrappa Colliery',
  'Kathara Colliery',
  'Dakra Colliery',
  'Kedla Colliery',
  'Ashoka Colliery',
  'Piparwar Colliery',
  'Magadh Colliery',
  'Amrapali Colliery',
  'Jharkhand Colliery',
  'North Urimari Colliery',
] as const;

export const DESTINATIONS = [
  'NTPC Kahalgaon',
  'NTPC Barh',
  'DVC Chandrapura',
  'SAIL Bokaro',
  'TATA Steel Jamshedpur',
  'Hindalco Renukoot',
  'NSPCL Bhilai',
  'Adani Power Tiroda',
  'DPL Durgapur',
  'CESC Budge Budge',
] as const;

export const ROUTES = [
  'Rajrappa → NTPC Kahalgaon',
  'Kathara → DVC Chandrapura',
  'Dakra → SAIL Bokaro',
  'Piparwar → NTPC Barh',
  'Ashoka → TATA Steel Jamshedpur',
  'Magadh → Hindalco Renukoot',
  'Amrapali → NSPCL Bhilai',
  'Kedla → DPL Durgapur',
] as const;

export const CHECKPOINTS = [
  'Source Gate Exit',
  'NH-33 Junction',
  'Ramgarh Toll Plaza',
  'Hazaribagh Bypass',
  'Koderma Check Post',
  'State Border Checkpoint',
  'Destination District Entry',
  'Destination Gate Entry',
] as const;

export const TRANSPORTERS = [
  'Jharkhand Transport Co.',
  'Eastern Carriers Pvt. Ltd.',
  'CCL Fleet Services',
  'Bihar Roadways Ltd.',
  'Ranchi Freight Corp.',
  'Dhanbad Logistics',
  'Coal Movers India',
  'National Bulk Carriers',
] as const;

export const ITEMS_PER_PAGE = 10;

export const ROLE_LABELS: Record<string, string> = {
  Admin: 'Administrator',
  AreaManager: 'Area Manager',
  DispatchOfficer: 'Dispatch Officer',
  TransportOfficer: 'Transport Officer',
  WeighbridgeOperator: 'Weighbridge Operator',
  Auditor: 'Auditor',
};

export const STATUS_LABELS: Record<string, string> = {
  Loading: 'Loading',
  InTransit: 'In Transit',
  Delivered: 'Delivered',
  Delayed: 'Delayed',
  Flagged: 'Flagged',
};

export const SEVERITY_COLORS: Record<string, string> = {
  Low: 'bg-blue-500/10 text-blue-400',
  Medium: 'bg-yellow-500/10 text-yellow-400',
  High: 'bg-orange-500/10 text-orange-400',
  Critical: 'bg-red-500/10 text-red-400',
};
