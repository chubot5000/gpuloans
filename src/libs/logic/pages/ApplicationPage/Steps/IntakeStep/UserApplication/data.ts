import { Country, State } from "country-state-city";

// Server OEM Options
export const OEM_OPTIONS = [
  { label: "SuperMicro", value: "SuperMicro" },
  { label: "Gigabyte", value: "Gigabyte" },
  { label: "Dell", value: "Dell" },
  { label: "Lenovo", value: "Lenovo" },
  { label: "HP", value: "HP" },
  { label: "Other", value: "Other" },
];

// Chip/Server Type Options (GPU types)
export const CHIP_SERVER_TYPE_OPTIONS = [
  { label: "A100", value: "A100" },
  { label: "H100", value: "H100" },
  { label: "H200", value: "H200" },
  { label: "B200", value: "B200" },
  { label: "B300", value: "B300" },
  { label: "MI300", value: "MI300" },
  { label: "MI400", value: "MI400" },
  { label: "RTX 5090", value: "RTX 5090" },
  { label: "RTX 6000", value: "RTX 6000" },
  { label: "GB200", value: "GB200" },
  { label: "GB300", value: "GB300" },
  { label: "NVL GB200 72", value: "NVL GB200 72" },
  { label: "NVL GB300 72", value: "NVL GB300 72" },
];

// Default GPUs per server based on chip type
export const GPUS_PER_SERVER_BY_CHIP: Record<string, number> = {
  A100: 8,
  H100: 8,
  H200: 8,
  B200: 8,
  B300: 8,
  MI300: 8,
  MI400: 8,
  "RTX 5090": 8,
  "RTX 6000": 8,
  GB200: 8,
  GB300: 8,
  "NVL GB200 72": 72,
  "NVL GB300 72": 72,
};

// GPU Age Options
export const GPU_AGE_OPTIONS = [
  { label: "Brand New", value: "Brand New" },
  { label: "Less than 6 months", value: ">6 months" },
  { label: "6-12 months", value: "6-12 months" },
  { label: "1-2 years", value: "1-2 years" },
  { label: "More than 2 years", value: "2+ years" },
];

// Data Center Tier Options
export const DATA_CENTER_TIER_OPTIONS = [
  { label: "Tier IV", value: "Tier IV" },
  { label: "Tier III", value: "Tier III" },
  { label: "Tier II", value: "Tier II" },
  { label: "Tier I", value: "Tier I" },
  { label: "Not rated", value: "Not rated" },
];

// Yes/No Options
export const YES_NO_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// # GPUs
export const GPU_TYPE_OPTIONS = [
  { label: "A100", value: "A100" },
  { label: "H100", value: "H100" },
  { label: "H200", value: "H200" },
  { label: "B200", value: "B200" },
  { label: "B300", value: "B300" },
  { label: "MI300", value: "MI300" },
  { label: "MI400", value: "MI400" },
  { label: "RTX 5090", value: "RTX 5090" },
  { label: "RTX 6000", value: "RTX 6000" },
  { label: "GB200", value: "GB200" },
  { label: "GB300", value: "GB300" },
  { label: "NVL GB200 72", value: "NVL GB200 72" },
  { label: "NVL GB300 72", value: "NVL GB300 72" },
];

// Organization Types
export const ORGANIZATION_TYPE_OPTIONS = [
  { label: "AI Startup", value: "AI Startup" },
  { label: "Scaleup / Grow Stage", value: "Scaleup / Grow Stage" },
  { label: "Enterprise", value: "Enterprise" },
  { label: "Research / Academic", value: "Research / Academic" },
  { label: "Other", value: "Other" },
];

// Countries - lazy loaded to avoid parsing large JSON on module load
let _countries: Array<{ label: string; value: string }> | null = null;
export function getCountries() {
  if (!_countries) {
    _countries = Country.getAllCountries()
      .filter((country) => country.isoCode !== "EH")
      .map((country) => ({ label: country.name, value: country.name }));
  }
  return _countries;
}

// US States - lazy loaded to avoid parsing large JSON on module load
let _usStates: Array<{ label: string; value: string }> | null = null;
export function getUSStates() {
  if (!_usStates) {
    _usStates = State.getStatesOfCountry("US").map((state) => ({
      label: state.name,
      value: state.name,
    }));
  }
  return _usStates;
}
