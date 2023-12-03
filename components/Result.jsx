import React from "react";
import { Tooltip } from "@nextui-org/react";
import slugify from "slugify";

const Result = ({ planet, dayDiff }) => {
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

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
        isOpen={isTooltipOpen}
        onOpenChange={(open) => setIsTooltipOpen(open)}
        onClose={() => {
          setIsTooltipOpen(!isTooltipOpen);
        }}
        content="It always is. Somewhere. If you know where to look."
      >
        <h2
          onClick={(e) => {
            e.stopPropagation();
            setIsClicked(!isClicked);
            setIsTooltipOpen(!isClicked);
          }}
          className="text-3xl font-semibold"
        >
          Today <i>is</i> your birthday!
          <p className="inline text-sky-500">*</p>
          🥳
        </h2>
      </Tooltip>
      <div>
        <p className="inline text-2xl font-semibold">
          You turned {yearsOld} years old on&nbsp;
        </p>
        <p className="inline text-2xl font-semibold underline hover:text-sky-500 decoration-wavy decoration-sky-500">
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {planet.planet_name}
          </a>
        </p>
      </div>
      <p className="text-lg font-medium">
        (A year on &quot;{planet.planet_name}&quot; is equal to{" "}
        {planet.orbital_period} Earth days)
      </p>
    </div>
  );
};

export default Result;
