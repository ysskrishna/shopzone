'use client'

import React, { useCallback, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface MultiRangeSliderProps {
  min: number
  max: number
  onChange: (values: { min: number; max: number }) => void
  formatValue?: (value: number) => string
  step?: number
  className?: string
  onlyOnComplete?: boolean
}

export function MultiRangeSlider({
  min,
  max,
  onChange,
  formatValue = (value) => value.toString(),
  step = 1,
  className,
  onlyOnComplete = false
}: MultiRangeSliderProps) {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const rangeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`
      rangeRef.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (rangeRef.current) {
      rangeRef.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  // Get min and max values when their state changes
  useEffect(() => {
    if (!onlyOnComplete || !isDragging) {
      onChange({ min: minVal, max: maxVal })
    }
  }, [minVal, maxVal, onChange, isDragging, onlyOnComplete])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseUp])

  return (
    <div className={cn("relative h-7", className)}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - step)
          setMinVal(value)
          minValRef.current = value
        }}
        onMouseDown={() => setIsDragging(true)}
        className={cn(
          "pointer-events-none absolute h-1 w-full appearance-none bg-gray-200",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "[&::-webkit-slider-thumb]:pointer-events-auto",
          "[&::-webkit-slider-thumb]:h-5",
          "[&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-teal-600",
          "[&::-webkit-slider-thumb]:hover:bg-teal-700",
          "[&::-moz-range-thumb]:pointer-events-auto",
          "[&::-moz-range-thumb]:h-5",
          "[&::-moz-range-thumb]:w-5",
          "[&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0",
          "[&::-moz-range-thumb]:bg-teal-600",
          "[&::-moz-range-thumb]:hover:bg-teal-700"
        )}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + step)
          setMaxVal(value)
          maxValRef.current = value
        }}
        onMouseDown={() => setIsDragging(true)}
        className={cn(
          "pointer-events-none absolute h-1 w-full appearance-none bg-gray-200",
          "focus:outline-none focus:ring-0 focus:ring-offset-0",
          "[&::-webkit-slider-thumb]:pointer-events-auto",
          "[&::-webkit-slider-thumb]:h-5",
          "[&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-teal-600",
          "[&::-webkit-slider-thumb]:hover:bg-teal-700",
          "[&::-moz-range-thumb]:pointer-events-auto",
          "[&::-moz-range-thumb]:h-5",
          "[&::-moz-range-thumb]:w-5",
          "[&::-moz-range-thumb]:appearance-none",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0",
          "[&::-moz-range-thumb]:bg-teal-600",
          "[&::-moz-range-thumb]:hover:bg-teal-700"
        )}
      />
      <div className="absolute h-1 rounded bg-gray-200">
        <div
          ref={rangeRef}
          className="absolute h-full rounded bg-teal-600"
        />
      </div>
    </div>
  )
}

