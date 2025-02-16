'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamischer Import der Map-Komponente (Pfad passt, da components im app-Ordner liegt)
const MapLeaflet = dynamic(() => import('./MapLeaflet'), { ssr: false });

// Wiederholungsoptionen
export type RepetitionOption =
  | 'once'
  | 'daily'
  | 'werktags'
  | 'wochenende'
  | 'weekly'
  | 'biweekly'
  | 'monthly';

export interface GeolocationConfig {
  repetition: RepetitionOption;
  isAllDay: boolean;
  startDate?: string;
  endDate?: string;
  time?: string;
  selectedDays?: string[];
  position: [number, number];
  radius: number;
  duration: number;
}

const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function GeolocationModule() {
  // States für Wiederholungsmodus und Ganztägigkeit
  const [repetition, setRepetition] = useState<RepetitionOption>('once');
  const [isAllDay, setIsAllDay] = useState(true);

  // Für einmalige Termine: Datumseingaben
  const [startDate, setStartDate] = useState('2025-02-16');
  const [endDate, setEndDate] = useState('2025-02-16');
  // Für alle, bei denen eine definierte Uhrzeit benötigt wird
  const [time, setTime] = useState('15:00');

  // Dauer in Minuten (Standard 0)
  const [duration, setDuration] = useState(0);

  // Für manuelle Wochentagsauswahl (bei daily, weekly, biweekly, monthly)
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Map-bezogene States
  const [position, setPosition] = useState<[number, number]>([51.0, 7.0]);
  const [radius, setRadius] = useState(100); // Standard: 100m

  // Gespeicherte Konfigurationen
  const [savedConfigs, setSavedConfigs] = useState<GeolocationConfig[]>([]);

  const handleRepetitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value as RepetitionOption;
    setRepetition(newVal);
    if (newVal === 'werktags') {
      setSelectedDays(['Mo', 'Di', 'Mi', 'Do', 'Fr']);
    } else if (newVal === 'wochenende') {
      setSelectedDays(['Sa', 'So']);
    } else if (
      newVal === 'daily' ||
      newVal === 'weekly' ||
      newVal === 'biweekly' ||
      newVal === 'monthly'
    ) {
      setSelectedDays([]);
    } else {
      setSelectedDays([]);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const config: GeolocationConfig = {
      repetition,
      isAllDay,
      position,
      radius,
      duration,
      ...(repetition === 'once' ? { startDate, endDate } : {}),
      ...(!isAllDay ? { time } : {}),
      ...(
        (repetition === 'daily' ||
          repetition === 'weekly' ||
          repetition === 'biweekly' ||
          repetition === 'monthly') && { selectedDays }
      ),
    };
    setSavedConfigs((prev) => [...prev, config]);
  };

  const handleRemove = (index: number) => {
    setSavedConfigs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-800 p-4 rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">Geolocation Modul</h2>

      {/* Oberer Bereich in zwei Spalten */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Linke Spalte: Wiederholungsmodus und Ganztägigkeit */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Wiederholung</label>
            <select
              value={repetition}
              onChange={handleRepetitionChange}
              className="p-2 bg-gray-700 border border-gray-600 rounded"
            >
              <option value="once">Einmalig</option>
              <option value="daily">Täglich</option>
              <option value="werktags">Werktags (Mo-Fr)</option>
              <option value="wochenende">Wochenende (Sa-So)</option>
              <option value="weekly">Wöchentlich</option>
              <option value="biweekly">Alle 2 Wochen</option>
              <option value="monthly">Monatlich</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm">Ganztägig</label>
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="mr-4"
            />
            
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dauer (Minuten)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="p-2 bg-gray-700 border border-gray-600 rounded w-full"
              min={0}
            />
          </div>
        </div>

        {/* Rechte Spalte: Eingaben */}
        <div>
          {repetition === 'once' ? (
            // Bei einmaligen Events: Datumsauswahl
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div>
                  <label className="text-sm">Start Datum</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                {!isAllDay && (
                  <div>
                    <label className="text-sm">Start Zeit</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                  </div>
                )}
              </div>
              {!isAllDay && (
                <div className="flex space-x-4">
                  <div>
                    <label className="text-sm">End Datum</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm">End Zeit</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Bei allen anderen Wiederholungsmodi: Wochentagsauswahl (falls manuell)
            <div className="mb-4">
              {!(repetition === 'werktags' || repetition === 'wochenende') && (
                <>
                  <p className="text-sm text-gray-400 mb-2">
                    Wähle die Wochentage, an denen der Ort besucht werden soll:
                  </p>
                  <div className="flex space-x-2">
                    {weekdays.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          selectedDays.includes(day)
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'bg-gray-700 border-gray-600'
                        } text-sm`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Kartenbereich */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Ort festlegen</h2>
        <p className="text-sm text-gray-400 mb-2">
          Klicke auf die Karte, um den Marker zu setzen.
        </p>
        <div className="mb-4" style={{ minHeight: 300 }}>
          <MapLeaflet
            position={position}
            radius={radius}
            onPositionChange={(newPos) => setPosition([newPos.lat, newPos.lng])}
          />
        </div>
        {/* Slider für den Radius */}
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm">Radius: {radius} m</label>
          <span className="text-sm text-gray-400">15 m – 200 m</span>
        </div>
        <input
          type="range"
          min={15}
          max={200}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Button zum Speichern */}
      <button
        onClick={handleSave}
        className="mb-4 px-6 py-2 bg-green-600 rounded hover:bg-green-500 font-semibold"
      >
        Einstellungen speichern
      </button>

      {/* Liste der gespeicherten Konfigurationen mit Entfernen-Button */}
      {savedConfigs.length > 0 && (
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Gespeicherte Termine</h3>
          <ul className="space-y-2">
            {savedConfigs.map((config, idx) => (
              <li
                key={idx}
                className="p-2 border border-gray-600 rounded flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>Wiederholung:</strong> {config.repetition}
                  </p>
                  <p>
                    <strong>Ganztägig:</strong> {config.isAllDay ? 'Ja' : 'Nein'}
                  </p>
                  {config.repetition === 'once' ? (
                    <p>
                      <strong>Start:</strong> {config.startDate}{' '}
                      {!config.isAllDay && config.time ? `um ${config.time}` : ''}
                    </p>
                  ) : (
                    <p>
                      <strong>Wochentage:</strong>{' '}
                      {config.selectedDays && config.selectedDays.length > 0
                        ? config.selectedDays.join(', ')
                        : 'Alle'}
                    </p>
                  )}
                  {config.repetition === 'once' && !config.isAllDay && config.endDate && (
                    <p>
                      <strong>Ende:</strong> {config.endDate}{' '}
                      {config.time ? `um ${config.time}` : ''}
                    </p>
                  )}
                  <p>
                    <strong>Dauer:</strong> {config.duration} min
                  </p>
                  <p>
                    <strong>Position:</strong> [{config.position[0].toFixed(2)},{' '}
                    {config.position[1].toFixed(2)}]
                  </p>
                  <p>
                    <strong>Radius:</strong> {config.radius} m
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(idx)}
                  className="ml-4 px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
