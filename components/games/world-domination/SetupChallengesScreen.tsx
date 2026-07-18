"use client";

import React from "react";
import { Star } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface SetupChallengesScreenProps {
  countries: any[];
  challengesCount: number;
  mapPosition: { center: [number, number]; zoom: number; name: string };
  setMapPosition: (pos: { center: [number, number]; zoom: number; name: string }) => void;
  confirmChallenges: () => void;
  handleCountryClick: (geoId: string) => void;
}

export default function SetupChallengesScreen({
  countries,
  challengesCount,
  mapPosition,
  setMapPosition,
  confirmChallenges,
  handleCountryClick,
}: SetupChallengesScreenProps) {
  return (
    <div className="m-auto p-4 lg:p-10 bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] border-4 border-purple-500 text-center shadow-2xl w-full max-w-6xl flex flex-col h-[85vh] lg:h-[85vh]">
      <div className="flex items-center justify-center gap-3 lg:gap-4 mb-4 lg:mb-6 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-3 lg:pb-4">
        <Star className="text-purple-500 w-8 h-8 lg:w-12 lg:h-12 animate-pulse shrink-0" />
        <h2 className="text-xl lg:text-4xl font-black dark:text-white shrink-0">
          تحديد دول تحدي الحكم
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1 min-h-0 w-full">
        {/* اليمين: أدوات التحكم */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:gap-4 overflow-y-auto pr-1 lg:pr-2 order-2 lg:order-1 custom-scroll">
          <p className="text-slate-500 font-bold text-xs lg:text-lg bg-slate-50 dark:bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed text-right">
            يا حكم، حدد بالخريطة{" "}
            <span className="text-purple-500 font-black">
              {challengesCount}
            </span>{" "}
            دول لتكون تحديات مباشرة (2000 نقطة).
          </p>

          {challengesCount > 0 && (
            <div className="flex flex-col bg-purple-50 dark:bg-purple-900/20 p-4 lg:p-5 rounded-2xl border border-purple-200 dark:border-purple-800 gap-3 lg:gap-4">
              <div className="font-black text-lg lg:text-2xl text-purple-700 dark:text-purple-300">
                المحددة: {countries.filter((c) => c.isChallenge).length}{" "}
                من {challengesCount}
              </div>
              {countries.filter((c) => c.isChallenge).length ===
                challengesCount && (
                <button
                  onClick={confirmChallenges}
                  className="w-full py-2.5 lg:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md transition-colors text-sm lg:text-lg"
                >
                  اعتماد التحديات والمتابعة
                </button>
              )}
            </div>
          )}
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
                      let fillColor = "#f1f5f9";
                      if (country) {
                        fillColor = country.isChallenge
                          ? "#a855f7"
                          : "#cbd5e1";
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
                              strokeWidth: 0.8,
                            },
                            hover: {
                              fill: country ? "#9333ea" : fillColor,
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

                      // إزاحة مخصصة لفرنسا
                      let dx = 0;
                      let dy = 3;
                      if (c.name && c.name.includes("فرنسا")) {
                        dx = 12;
                        dy = -10;
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
                            fill="#1e293b"
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
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