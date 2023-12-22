"use client";
import Gradient from "@/components/Gradient";

import React, { useCallback, useRef, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import {
  Input,
  NextUIProvider,
  Button,
  Card,
  Tooltip,
} from "@nextui-org/react";
import moment from "moment/moment";
import Result from "./Result";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkIcon } from "../app/link.svg";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  bottom: 72,
  left: 0,
};

function findBirthday(data, days) {
  for (const planet of data) {
    const years = days / planet.orbital_period;
    const diff = Math.abs(Math.round(years) - years);
    if (diff * planet.orbital_period < 1) {
      return planet;
    }
  }
}

const today = moment().format("YYYY-MM-DD");

function isDateValid(slug) {
  if (!slug) return false;
  return moment(slug, "YYYY-MM-DD").isValid();
}

export default function Homepage({ data }) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("q");
  const [date, setDate] = React.useState(isDateValid(slug) ? slug : "");
  const [isFound, setIsFound] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [planet, setPlanet] = React.useState({});
  const [dayDiff, setDayDiff] = React.useState(null);
  const [lastFoundFor, setLastFoundFor] = React.useState("");
  const [invalidInput, setInvalidInput] = React.useState(false);

  const router = useRouter();

  const createQueryString = (name, value) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  const isBigScreen = useMediaQuery({ query: "(min-width: 800px)" });

  const isDateChanged = date !== lastFoundFor;

  const refAnimationInstance = useRef(null);

  function handleCopyUrl() {
    navigator.clipboard.writeText(window.location.href);
    setIsTooltipOpen(true);
  }

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  function validateInput() {
    if (moment(date).isAfter()) {
      setInvalidInput(true);
      return false;
    }
    return true;
  }

  function handleClick() {
    if (!validateInput()) return;
    if ((date && !isFound) || (date && isDateChanged)) {
      router.push("/" + "?" + createQueryString("q", date));
      const diffInDays = moment().diff(moment(date), "days");
      const planet = findBirthday(data, diffInDays);
      fire();
      setIsFound(true);
      setInvalidInput(false);
      setLastFoundFor(date);
      setPlanet(planet);
      setDayDiff(diffInDays);
      console.log(planet);
    }
    if (isFound) fire();
  }

  return (
    <NextUIProvider>
      <div className="absolute inset-0">
        <main className="dark text-foreground bg-background flex min-h-[calc(100dvh)] flex-col items-center justify-between ">
          <Gradient
            className={
              "w-screen h-[calc(100dvh)] flex flex-col justify-center items-center p-8 text-center gap-8"
            }
          >
            <h1
              className={`${
                isBigScreen ? "text-5xl" : "text-4xl"
              } mb-4 text-transparent leading-tight font-semibold bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500`}
            >
              Is it my birthday?
            </h1>

            {isFound && (
              <Result
                planet={planet}
                dayDiff={dayDiff}
                isBigScreen={isBigScreen}
              />
            )}

            <Input
              size="lg"
              type="date"
              radius="medium"
              value={date}
              onValueChange={setDate}
              variant="bordered"
              label={
                <>
                  <p className="inline">Date of Birth</p>
                  <p className="text-slate-400/40 inline">&nbsp;(on Earth)</p>
                </>
              }
              placeholder="Enter your date of birth"
              className="w-[300px]"
              isInvalid={invalidInput}
              errorMessage={
                invalidInput
                  ? "Unless you're a time traveler, you might wanna change your input."
                  : null
              }
              max={today}
              fullWidth={false}
            ></Input>

            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
            <div style={{ width: "300px", display: "flex", gap: "16px" }}>
              <Button
                color="primary"
                variant="shadow"
                className="w-[300px]"
                onClick={handleClick}
              >
                Calculate
              </Button>
              {isFound && (
                <Tooltip
                  content="The link is copied to your clipboard."
                  onOpenChange={(open) => setIsTooltipOpen(false)}
                  closeDelay={1000}
                  isOpen={isTooltipOpen}
                  color="foreground"
                  placement="bottom"
                  offset={15}
                >
                  <Button isIconOnly onClick={handleCopyUrl}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="20"
                      viewBox="0 0 640 512"
                    >
                      <path
                        fill="white"
                        d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
                      />
                    </svg>
                  </Button>
                </Tooltip>
              )}
            </div>
          </Gradient>
        </main>
      </div>
    </NextUIProvider>
  );
}
