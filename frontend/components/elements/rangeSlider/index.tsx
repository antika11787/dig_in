import React, { useState } from "react";
import ReactSlider from "react-slider";
import "./index.scss";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  onChange: (newRange: number[]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, onChange }) => {
  const handleRangeChange = (newRange: number[]) => {
    onChange(newRange);
  };

  return (
    <ReactSlider
      defaultValue={[min, max]}
      ariaLabel={["Lower thumb", "Upper thumb"]}
      ariaValuetext={(state: { valueNow: any; }) => `Thumb value ${state.valueNow}`}
      renderThumb={(props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, state: { valueNow: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }) => <div {...props}>{state.valueNow}</div>}
      minDistance={10}
      withTracks
      max={max}
      min={min}
      step={step}
      onAfterChange={handleRangeChange}
    />
  );
};

export default RangeSlider;
