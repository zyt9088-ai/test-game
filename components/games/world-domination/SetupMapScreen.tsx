"use client";

import React from "react";
import { Globe, Shuffle, CheckCircle2 } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface SetupMapScreenProps {
  countries: any[];
  countriesLimit: number;
  challengesCount: number;
  mapPosition: { center: [number, number]; zoom: number; name: string };
  setMapPosition: (pos: { center: [number, number]; zoom: number; name: string }) => void;
  randomizeMap: () => void;
  confirmMap: () => void;
  handleCountryClick: (geoId: string) => void;
}

export default function SetupMapScreen({
  countries,
  countriesLimit,
  challengesCount,
  mapPosition,
  setMapPosition,
  randomizeMap,
  confirmMap,
  handleCountryClick,
}: SetupMapScreenProps) {
  return (
    <div className="m-auto p-4 lg:p-10 bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] border-4 border-cyan-500 text-center shadow-2xl w-full max-w-6xl flex flex-col h-[85vh] lg:h-[85vh]">
      <div className="flex items-center justify-center gap-3 lg:gap-4 mb-4 lg:mb-6 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-3 lg:pb-4">
        <Globe className="text-cyan-500 w-8 h-8 lg:w-12 lg:h-12 animate-spin-slow shrink-0" />
        <h2 className="text-xl lg:text-4xl font-black dark:text-white shrink-0">
          تصفية دول الخريطة
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1 min-h-0 w-full">
        {/* اليمين: أدوات التحكم */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:gap-4 overflow-y-auto pr-1 lg:pr-2 order-2 lg:order-1 custom-scroll">
          <p className="text-slate-500 font-bold text-xs lg:text-lg bg-slate-50 dark:bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed text-right">
            الدول المحددة باللون الأزرق هي التي ستدخل المعركة. اضغط على أي
            دولة في الخريطة للتبديل.
          </p>

          <div className="flex flex-col bg-cyan-50 dark:bg-cyan-900/20 p-4 lg:p-5 rounded-2xl border border-cyan-200 dark:border-cyan-800 gap-3 lg:gap-4">
            <div className="font-black text-lg lg:text-2xl text-cyan-700 dark:text-cyan-300">
              المفعلة: {countries.filter((c) => c.isActive).length} من{" "}
              {Math.min(
                countriesLimit + challengesCount + 2,
                countries.length
              )}
            </div>
            <button
              onClick={randomizeMap}
              className="w-full py-2.5 lg:py-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2 text-sm lg:text-lg"
            >
              <Shuffle size={16} className="lg:w-[20px] lg:h-[20px]" />{" "}
              توزيع عشوائي جديد
            </button>
            {countries.filter((c) => c.isActive).length ===
              Math.min(
                countriesLimit + challengesCount + 2,
                countries.length
              ) && (
              <button
                onClick={confirmMap}
                className="w-full py-2.5 lg:py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-black shadow-md transition-colors flex items-center justify-center gap-2 text-sm lg:text-lg"
              >
                <CheckCircle2
                  size={16}
                  className="lg:w-[20px] lg:h-[20px]"
                />{" "}
                اعتماد الخريطة
              </button>
            )}
          </div>
        </div>

        {/* اليسار: الخريطة الميدانية */}
        <div className="w-full lg:w-2/3 bg-[#7bc3f5] dark:bg-[#287cb5] rounded-3xl lg:rounded-[2rem] border-4 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner h-[40vh] lg:h-full relative order-1 lg:order-2 shrink-0">
          <ComposableMap
            projectionConfig={{ scale: 200 }}
            className="w-full h-full absolute inset-0"
          >
            <ZoomableGroup
              center={mapPosition.center}
              zoom={mapPosition.zoom}
              onMoveEnd={(pos) =>
                setMapPosition({
                  center: pos.coordinates as [number, number],
                  zoom: pos.zoom,
                  name: mapPosition.name,
                })
              }
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => (
                  <>
                    {geographies.map((geo) => {
                      const country = countries.find(
                        (c) => c.geoId === geo.id
                      );
                      let fillColor = "#cbd5e1";
                      if (country && country.isActive) {
                        fillColor = "#0ea5e9";
                      }
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountryClick(geo.id)}
                          style={{
                            default: {
                              fill: fillColor,
                              outline: "none",
                              stroke: "#334155",
                              strokeWidth: country?.isActive ? 1.5 : 0.5,
                            },
                            hover: {
                              fill: country
                                ? country.isActive
                                  ? "#0284c7"
                                  : "#94a3b8"
                                : fillColor,
                              cursor: country ? "pointer" : "default",
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })}
                    {geographies.map((geo) => {
                      const c = countries.find((c) => c.geoId === geo.id);
                      if (!c) return null;

                      const centroid = geoCentroid(geo);
                      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1]))
                        return null;

                      // إزاحة مخصصة لفرنسا عشان تنفصل عن إسبانيا بشكل كامل
                      let dx = 0;
                      let dy = 3; // هذا النزول الافتراضي لباقي الدول
                      
                      // استخدمنا includes عشان يصيدها حتى لو فيها مسافات بالغلط
                      if (c.name && c.name.includes("فرنسا")) {
                        dx = 12;   // دزيناها يمين بزيادة
                        dy = -10;  // رفعناها فوق بزيادة
                      }

                      return (
                        <Marker
                          key={`m-${c.id}`}
                          coordinates={centroid as [number, number]}
                        >
                          <text
                            textAnchor="middle"
                            dx={dx}
                            dy={dy}
                            fill={c.isActive ? "#fff" : "#64748b"}
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
                              opacity: c.isActive ? 1 : 0.6,
                            }}
                          >
                            {c.name}
                          </text>
                        </Marker>
                      );
                    })}
                  </>
                )}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}