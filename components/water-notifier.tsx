"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Volume2 } from "lucide-react";
import WaterLevel from "./water-level";

export default function WaterNotifier() {
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [customMessage, setCustomMessage] = useState("Time to drink water!");
  const [isActive, setIsActive] = useState(false);
  const [glassesCount, setGlassesCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("--:--"); // To store the formatted time remaining
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Set next reminder time when timer starts
  useEffect(() => {
    if (isActive) {
      const next = new Date();
      next.setMinutes(next.getMinutes() + intervalMinutes);
      setNextReminderTime(next);
    } else {
      setNextReminderTime(null);
      setTimeRemaining("--:--");
    }
  }, [isActive, intervalMinutes]);

  // Update timer display every second
  useEffect(() => {
    if (isActive && nextReminderTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, nextReminderTime.getTime() - now.getTime());
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );

        if (now >= nextReminderTime) {
          playNotification();
          const next = new Date();
          next.setMinutes(next.getMinutes() + intervalMinutes);
          setNextReminderTime(next);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, nextReminderTime, intervalMinutes]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(customMessage);
      }
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const drinkWater = () => {
    if (glassesCount < 9) {
      setGlassesCount(glassesCount + 1);
      if (glassesCount + 1 === 9) {
        setIsCompleted(true);
        setIsActive(false);
      }
    }
  };

  const resetApp = () => {
    setGlassesCount(0);
    setIsCompleted(false);
    setIsActive(false);
    setTimeRemaining("--:--"); // Reset the timer display
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
      {isCompleted && (
        <div className="col-span-1 md:col-span-3 bg-green-100 p-4 rounded-lg border border-green-300 text-center">
          <h2 className="text-xl font-bold text-green-700">
            Great work! You're now hydrated.
          </h2>
          <Button onClick={resetApp} variant="outline" className="mt-2">
            Start Again
          </Button>
        </div>
      )}

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Water Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interval">
                Reminder Interval: {intervalMinutes} minutes
              </Label>
            </div>
            <Slider
              id="interval"
              min={1}
              max={120}
              step={1}
              value={[intervalMinutes]}
              onValueChange={(value) => setIntervalMinutes(value[0])}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Reminder Message</Label>
            <Input
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={isActive}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={toggleTimer}
              className={
                isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }
            >
              {isActive ? "Stop Reminders" : "Start Reminders"}
            </Button>

            <Button
              onClick={requestNotificationPermission}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Enable Notifications
            </Button>

            <Button
              onClick={playNotification}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Test Sound
            </Button>
          </div>

          {isActive && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-center text-blue-700">
                Next reminder in:{" "}
                <span className="font-mono font-bold">{timeRemaining}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Water Tracker</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <WaterLevel level={glassesCount} maxLevel={9} />

          <p className="text-center mt-4 mb-2">{glassesCount} of 9 glasses</p>

          <Button
            onClick={drinkWater}
            disabled={glassesCount >= 9 || !isActive}
            className="mt-4 w-full"
          >
            I Drank Water
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
