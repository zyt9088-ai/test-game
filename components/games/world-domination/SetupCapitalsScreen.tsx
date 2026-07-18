"use client";

import React from "react";
import { Crown, Shield, Swords } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface SetupCapitalsScreenProps {
  turn: 1 | 2;
  team1Name: string;
  team2Name: string;
  countries: any[];
  capitals: { team1: string | null; team2: string | null };
  protectedCountries: any;
  mapPosition: { center: [number, number]; zoom: number; name: string };
  setMapPosition: (pos: { center: [number, number]; zoom: number; name: string }) => void;
  handleCountryClick: (geoId: string) => void;
}

export default function SetupCapitalsScreen({
  turn,
  team1Name,
  team2Name,
  countries,
  capitals,
  protectedCountries,
  mapPosition,
  setMapPosition,
  handleCountryClick,
}: SetupCapitalsScreenProps) {
  return (
    <div className="m-auto p-4 lg:p-10 bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[2.5rem] border-4 border-amber-500 text-center shadow-2xl w-full max-w-6xl flex flex-col h-[85vh] lg:h-[85vh]">
      <div className="flex items-center justify-center gap-3 lg:gap-4 mb-4 lg:mb-6 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-3 lg:pb-4">
        <Crown className="text-amber-500 w-8 h-8 lg:w-12 lg:h-12 animate-bounce shrink-0" />
        <h2 className="text-xl lg:text-4xl font-black dark:text-white shrink-0">
          اختيار العواصم
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1 min-h-0 w-full">
        {/* اليمين: أدوات التحكم */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:gap-4 overflow-y-auto pr-1 lg:pr-2 order-2 lg:order-1 custom-scroll">
          <p className="text-slate-500 font-bold text-xs lg:text-lg bg-slate-50 dark:bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed text-right">
            دور{" "}
            <span
              className={
                turn === 1
                  ? "text-cyan-500 font-black"
                  : "text-rose-500 font-black"
              }
            >
              {turn === 1 ? team1Name : team2Name}
            </span>{" "}
            يختارون عاصمتهم الأساسية (التاج 👑) على الخريطة
          </p>
        </div>

        {/* اليسار: الخريطة המيدانية */}
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
                        if (country.owner === 1) fillColor = "#06b6d4";
                        else if (country.owner === 2)
                          fillColor = "#f43f5e";
                        else if (country.isChallenge)
                          fillColor = "#a855f7";
                        else fillColor = "#facc15";
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
                              strokeWidth: country?.owner ? 1.5 : 0.8,
                            },
                            hover: {
                              fill: country ? "#3b82f6" : fillColor,
                              cursor: "pointer",
                              outline: "none",
                              strokeWidth: 1.5,
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

                      const isProtected = protectedCountries[c.id];

                      let label = c.name;
                      if (c.id === capitals.team1 || c.id === capitals.team2) {
                        label += " 👑";
                      }

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
                          {isProtected && (
                            <g transform="translate(0, -14)">
                              <circle
                                r="8"
                                fill="#10b981"
                                stroke="#fff"
                                strokeWidth="1"
                              />
                              <Shield
                                width="10"
                                height="10"
                                x="-5"
                                y="-5"
                                color="white"
                                strokeWidth="2.5"
                              />
                            </g>
                          )}
                          {c.isStolen && (
                            <g transform="translate(0, -18)">
                              <Swords
                                width="18"
                                height="18"
                                x="-9"
                                y="-9"
                                color="black"
                                strokeWidth="3"
                              />
                            </g>
                          )}
                          <text
                            textAnchor="middle"
                            dx={dx}
                            dy={dy}
                            fill={c.owner ? "#fff" : "#1e293b"}
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
                            }}
                          >
                            {label}
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