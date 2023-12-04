"use client";
import Gradient from "@/components/Gradient";

import React, { useCallback, useRef, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { Input, NextUIProvider, Button, Card } from "@nextui-org/react";
import moment from "moment/moment";
import Result from "./Result";
import { CSSTransition } from "react-transition-group";

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

export default function Homepage({ data }) {
  const [date, setDate] = React.useState("");
  const [isFound, setIsFound] = React.useState(false);
  const [planet, setPlanet] = React.useState({});
  const [dayDiff, setDayDiff] = React.useState(null);
  const [lastFoundFor, setLastFoundFor] = React.useState("");
  const [invalidInput, setInvalidInput] = React.useState(false);

  const isDateChanged = date !== lastFoundFor;

  const refAnimationInstance = useRef(null);

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
            <h1 className="text-5xl mb-4 text-transparent leading-tight font-semibold bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Is it my birthday?
            </h1>

            {isFound && <Result planet={planet} dayDiff={dayDiff} />}

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
                  ? "Unless you're a time traveller, you might wanna change your input."
                  : null
              }
              max={today}
              fullWidth={false}
            ></Input>

            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
            <Button
              color="primary"
              variant="shadow"
              className="w-[300px]"
              onClick={handleClick}
            >
              Calculate
            </Button>
          </Gradient>
        </main>
      </div>
    </NextUIProvider>
  );
}
