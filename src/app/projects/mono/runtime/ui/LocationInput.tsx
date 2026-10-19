"use client";

/* eslint react-hooks/set-state-in-effect: off -- mirrored controlled-form synchronization from Mono production. */

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Loader2, Info } from "lucide-react";
import type { TransactionLocation } from "../types";
import { FormInput } from "./FormControls";

const NOMINATIM_HEADERS = {
  "Accept-Language": "en;q=0.9",
  "User-Agent": "MonoFinance/1.0 (location)",
};

/** Nominatim 返回的 address 子对象；district 取州/省（用于国际格式 City, State, Country） */
function parseNominatimAddress(addr: Record<string, string> | undefined): Pick<TransactionLocation, "country" | "city" | "district"> {
  if (!addr || typeof addr !== "object") return { country: null, city: null, district: null };
  const country = (addr.country ?? addr.country_code ?? "").trim() || null;
  const city = (
    addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.state_district ?? addr.state ??
    ""
  ).trim() || null;
  const district = (addr.state ?? addr.state_district ?? addr.county ?? addr.province ?? "").trim() || null;
  return { country, city, district };
}

/** 国际格式：具体到城市，如 Milan, Italy; New York, NY, USA; Chengdu, Sichuan, China; Vancouver, BC, Canada */
export function formatInternationalLocation(loc: TransactionLocation | null): string {
  if (!loc?.country?.trim()) return "";
  const city = (loc.city ?? "").trim();
  const district = (loc.district ?? "").trim();
  const country = (loc.country ?? "").trim();
  if (city && district) return `${city}, ${district}, ${country}`;
  if (city) return `${city}, ${country}`;
  if (district) return `${district}, ${country}`;
  return country;
}

/** 反向地理编码：经纬度 → 结构化 TransactionLocation，address 存国际格式 */
async function reverseGeocodeToLocation(lat: number, lon: number): Promise<TransactionLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { headers: NOMINATIM_HEADERS }
    );
    const coordsStr = `${lat.toFixed(6)},${lon.toFixed(6)}`;
    const fallback = {
      country: null,
      city: null,
      district: null,
      address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      coordinates: coordsStr,
    } as TransactionLocation;
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      lat?: string;
      lon?: string;
    };
    const { country, city, district } = parseNominatimAddress(data.address ?? {});
    const loc: TransactionLocation = {
      country,
      city,
      district,
      address: formatInternationalLocation({ country, city, district, address: null, coordinates: null }),
      coordinates: coordsStr,
    };
    if (!loc.address) loc.address = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    return loc;
  } catch {
    return {
      country: null,
      city: null,
      district: null,
      address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      coordinates: `${lat.toFixed(6)},${lon.toFixed(6)}`,
    };
  }
}

/** 正向地理编码：用户输入 → 匹配到的结构化 TransactionLocation，address 存国际格式，无结果时返回 null */
async function forwardGeocode(query: string): Promise<TransactionLocation | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=1`,
      { headers: NOMINATIM_HEADERS }
    );
    if (!res.ok) return null;
    const arr = (await res.json()) as Array<{
      address?: Record<string, string>;
      lat?: string;
      lon?: string;
    }>;
    const first = arr?.[0];
    if (!first) return null;
    const { country, city, district } = parseNominatimAddress(first.address ?? {});
    const coordsStr =
      first.lat != null && first.lon != null
        ? `${Number(first.lat).toFixed(6)},${Number(first.lon).toFixed(6)}`
        : null;
    const loc: TransactionLocation = {
      country: country ?? null,
      city: city ?? null,
      district: district ?? null,
      address: formatInternationalLocation({
        country: country ?? null,
        city: city ?? null,
        district: district ?? null,
        address: null,
        coordinates: null,
      }),
      coordinates: coordsStr,
    };
    if (!loc.address) loc.address = trimmed;
    return loc;
  } catch {
    return null;
  }
}

/** 显示用国际格式（City, State, Country）；无结构时用 address 或 coordinates */
function toDisplayLine(loc: TransactionLocation | null): string {
  if (!loc) return "";
  const international = formatInternationalLocation(loc);
  if (international) return international;
  return (loc.address ?? loc.coordinates ?? "").trim() || "";
}

interface LocationInputProps {
  value: TransactionLocation | null;
  onChange: (loc: TransactionLocation) => void;
  className?: string;
  /** 打开时是否自动请求用户位置一次；若用户拒绝则仅允许手动输入 */
  autoRequestLocation?: boolean;
}

export default function LocationInput({
  value,
  onChange,
  className = "",
  autoRequestLocation = false,
}: LocationInputProps) {
  const [line, setLine] = useState(() => toDisplayLine(value));
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isMatchingOnBlur, setIsMatchingOnBlur] = useState(false);
  const [showLocationHint, setShowLocationHint] = useState(false);
  const autoRequestDoneRef = useRef(false);

  useEffect(() => {
    setLine(toDisplayLine(value));
  }, [value?.address, value?.coordinates, value?.country, value?.city, value?.district]);

  const handleLineChange = useCallback(
    (text: string) => {
      setLine(text);
      const trimmed = text.trim();
      onChange({
        country: value?.country ?? null,
        city: value?.city ?? null,
        district: value?.district ?? null,
        address: trimmed || null,
        coordinates: value?.coordinates ?? null,
      });
    },
    [onChange, value?.country, value?.city, value?.district, value?.coordinates]
  );

  /** 输入框失焦时根据输入匹配地址（正向地理编码），匹配成功则填入国际格式 */
  const handleBlur = useCallback(async () => {
    const trimmed = line.trim();
    if (!trimmed) return;
    setIsMatchingOnBlur(true);
    const loc = await forwardGeocode(trimmed);
    setIsMatchingOnBlur(false);
    if (loc) {
      setLine(toDisplayLine(loc));
      onChange(loc);
    }
  }, [line, onChange]);

  useEffect(() => {
    if (!autoRequestLocation || autoRequestDoneRef.current) return;
    const hasValue =
      value?.address?.trim() ||
      value?.coordinates?.trim() ||
      (value?.country?.trim() && value?.city?.trim());
    if (hasValue) return;
    if (!navigator.geolocation) return;
    autoRequestDoneRef.current = true;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const loc = await reverseGeocodeToLocation(lat, lon);
        setLine(toDisplayLine(loc));
        onChange(loc);
        setIsGettingLocation(false);
      },
      () => setIsGettingLocation(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [autoRequestLocation, value?.address, value?.coordinates, value?.country, value?.city, onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
          <MapPin size={12} />
          Location
        </label>
        {isGettingLocation && (
          <span className="flex items-center gap-1.5 text-[10px] text-text-secondary">
            <Loader2 size={10} className="animate-spin" />
            Getting…
          </span>
        )}
        <span
          className="relative flex cursor-help items-center text-text-secondary hover:text-text-primary"
          onMouseEnter={() => setShowLocationHint(true)}
          onMouseLeave={() => setShowLocationHint(false)}
          aria-label="Location permission hint"
        >
          <Info size={12} />
          {showLocationHint && (
            <span
              className="absolute left-0 top-full z-10 mt-1 px-2 py-1.5 text-[10px] leading-snug text-white bg-gray-800 rounded shadow-lg whitespace-normal w-48"
              role="tooltip"
            >
              Enable location permission in browser settings to automatically fill your location.
            </span>
          )}
        </span>
      </div>
      <FormInput
        type="text"
        value={line}
        onChange={(e) => handleLineChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={
          isMatchingOnBlur
            ? "Matching…"
            : "e.g. Milan, Italy; New York, NY, USA — or type address and blur to match"
        }
      />
    </div>
  );
}
