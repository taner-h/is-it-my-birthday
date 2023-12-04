import React from "react";
import { Tooltip } from "@nextui-org/react";
import slugify from "slugify";

const Result = ({ planet, dayDiff, isBigScreen }) => {
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
          className={`${isBigScreen ? "text-3xl" : "text-2xl"} font-semibold`}
        >
          Today <i>is</i> your birthday!
          <p className="inline text-sky-500">*</p>
          🥳
        </h2>
      </Tooltip>
      <div>
        <p
          className={`${
            isBigScreen ? "text-2xl" : "text-xl"
          } inline font-semibold`}
        >
          You turned {yearsOld} year{yearsOld > 1 ? "s" : ""} old on&nbsp;
          {!isBigScreen && <br />}
        </p>
        <p
          className={`${
            isBigScreen ? "text-2xl" : "text-xl"
          } inline font-semibold underline hover:text-sky-500 decoration-wavy decoration-sky-500`}
        >
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {planet.planet_name}
          </a>
        </p>
      </div>
      <p
        className={`${
          isBigScreen ? "text-lg" : "text-base"
        } font-medium text-white/50`}
      >
        (A year on &quot;{planet.planet_name}&quot; is equal to&nbsp;
        {!isBigScreen && <br />}
        {planet.orbital_period} Earth days)
      </p>
    </div>
  );
};

export default Result;
