/* eslint-disable react-hooks/exhaustive-deps */
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { timesIntervals } from "@/constants";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [selectedInterval, setSelectedInterval] = useState<TimesIntervals | undefined>(undefined);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);
  const audioRef = useRef<any>(null);

  useEffect(() => {
    if (remainingTime === 0 && isRunning) {
      audioRef?.current?.play(); // Play beep sound
      if(!selectedInterval) return
      setRemainingTime(
        selectedInterval?.h * 3600 + selectedInterval?.m * 60 + selectedInterval?.s
      );
    }
  }, [remainingTime, isRunning]);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef?.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, remainingTime]);

  const handleSelectTime = (title: string) => {
    const res = timesIntervals.find((interval) => interval.title === title);
    setSelectedInterval(res);
    if(!res) return
    setRemainingTime(res?.h * 3600 + res?.m * 60 + res?.s);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSelectedInterval(undefined);
    setRemainingTime(0);
  };

  const formatTime = (timeInSeconds: any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours > 0 ? hours + ":" : ""}${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center">
      <h1 className="text-lg font-semibold text-white mb-2">
        {selectedInterval
          ? `Selected Time Interval: ${selectedInterval?.title}`
          : "Select Any Time Interval"}
      </h1>

      <div className="flex justify-center items-center gap-2">
        {timesIntervals.map((data) => (
          <h1
            key={data?.title}
            className={`text-xl select-none font-semibold text-white ${
              selectedInterval?.title == data?.title
                ? "bg-cyan-500 hover:bg-cyan-700"
                : "bg-slate-800 hover:bg-slate-900"
            } cursor-pointer rounded-lg px-5 py-2 w-[150px] text-center`}
            onClick={() => handleSelectTime(data?.title)}
          >
            {data?.title}
          </h1>
        ))}
      </div>

      {selectedInterval && (
        <h1 className="text-white font-bold text-2xl mt-5">
          {formatTime(remainingTime)}
        </h1>
      )}

      {selectedInterval && !isRunning && (
        <h1
          className="bg-cyan-700 hover:bg-cyan-800 px-5 py-2 w-[200px] rounded-lg text-center font-bold text-2xl mt-3 select-none cursor-pointer"
          onClick={handleStart}
        >
          START
        </h1>
      )}

      {isRunning && (
        <h1
          className="bg-red-700 hover:bg-red-800 px-5 py-2 w-[200px] rounded-lg text-center font-bold text-2xl mt-3 select-none cursor-pointer"
          onClick={handleStop}
        >
          STOP
        </h1>
      )}

      {/* Beep sound */}
      <audio ref={audioRef}>
        <source src="/music/beep1.mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
