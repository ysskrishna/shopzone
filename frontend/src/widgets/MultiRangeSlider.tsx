import { ChangeEvent, FC, useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onSubmit: (values: { min: number; max: number }) => void;
  step?: number;
  formatValue?: (value: number) => string;
}

const MultiRangeSlider: FC<MultiRangeSliderProps & { step?: number }> = ({ min, max, onSubmit, step = 1, formatValue = (value: number) => value.toString() }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);
  
    // Convert to percentage
    const getPercent = useCallback(
      (value: number) => Math.round(((value - min) / (max - min)) * 100),
      [min, max]
    );
  
    // Set width of the range to decrease from the left side
    useEffect(() => {
      if (maxValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(+maxValRef.current.value);
  
        if (range.current) {
          range.current.style.left = `${minPercent}%`;
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [minVal, getPercent]);
  
    // Set width of the range to decrease from the right side
    useEffect(() => {
      if (minValRef.current) {
        const minPercent = getPercent(+minValRef.current.value);
        const maxPercent = getPercent(maxVal);
  
        if (range.current) {
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [maxVal, getPercent]);
  
  return (
    <div className="flex flex-row gap-2 ">
      <div className="w-full pt-3 relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - step);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames(
          "pointer-events-none absolute h-0 w-full outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:mt-1 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative",
          {
            "z-[5]": minVal > max - 100,
            "z-[3]": minVal <= max - 100
          }
        )}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + step);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="pointer-events-none absolute h-0 w-full outline-none z-[4] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:mt-1 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative"
      />

      <div className="relative w-full h-8">
        <div className="absolute rounded-[3px] h-[5px] bg-gray-300 w-full z-[1]"></div>
        <div ref={range} className="absolute rounded-[3px] h-[5px] bg-primary z-[2]"></div>
        <div className="absolute text-xs mt-5 left-0">{formatValue(minVal)}</div>
        <div className="absolute text-xs mt-5 right-0">{formatValue(maxVal)}</div>
      </div>
    </div>
    <button 
      onClick={() => onSubmit({ min: minVal, max: maxVal })}
      className="h-min py-1.5 px-4 bg-white border border-gray-300 rounded-md text-sm text-black hover:bg-gray-50 transition-colors"
    >
      Go
    </button>
    </div>
  );
};

export default MultiRangeSlider;