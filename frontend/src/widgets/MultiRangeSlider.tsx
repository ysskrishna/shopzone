import { ChangeEvent, FC, useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: Function;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({ min, max, onChange }) => {
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
        const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number
  
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
  
    // Get min and max values when their state changes
    useEffect(() => {
      onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

  return (
    <div className="w-full my-2">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames(
          "pointer-events-none absolute h-0 w-[200px] outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:mt-1 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative",
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
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="pointer-events-none absolute h-0 w-[200px] outline-none z-[4] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gray-50 [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:mt-1 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-gray-50 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_1px_1px_#ced4da] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:mt-1 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative"
      />

      <div className="relative w-[200px]">
        <div className="absolute rounded-[3px] h-[5px] bg-gray-300 w-full z-[1]"></div>
        <div ref={range} className="absolute rounded-[3px] h-[5px] bg-[#9fe5e1] z-[2]"></div>
        <div className="absolute text-gray-300 text-xs mt-5 left-[6px]">{minVal}</div>
        <div className="absolute text-gray-300 text-xs mt-5 right-[-4px]">{maxVal}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;