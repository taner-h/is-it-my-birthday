import React from "react";
import { Tooltip } from "@nextui-org/react";
import slugify from "slugify";

const Result = ({ planet, dayDiff }) => {
  const yearsOld = Math.round(dayDiff / planet.orbital_period);
  const link = `https://exoplanets.nasa.gov/eyes-on-exoplanets/#/planet/${slugify(
    planet.planet_name,
    {
      replacement: "_",
    }
  )}/`;

  return (
    <div className="flex flex-col gap-3 items-center">
      <Tooltip
        showArrow={true}
        color="primary"
        content="It always is. Somewhere. If you know where to look."
      >
        <h2 className="text-3xl font-semibold">
          It <i>is</i> your birthday!*
        </h2>
      </Tooltip>
      <div>
        <p className="inline text-2xl font-semibold">
          You&apos;re {yearsOld} years old in&nbsp;
        </p>
        <p className="inline text-2xl font-semibold underline decoration-wavy decoration-sky-500">
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {planet.planet_name}
          </a>
        </p>
      </div>
      <p className="text-lg font-medium">
        (A {planet.planet_name} year is equal to {planet.orbital_period} Earth
        days)
      </p>
    </div>
  );
};

export default Result;
