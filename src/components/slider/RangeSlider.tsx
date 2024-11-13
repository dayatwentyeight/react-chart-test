import { ChangeEvent } from "react";
import styles from "./RangeSlider.module.css";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  multi?: boolean;
}

const RangeSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  multi,
}: RangeSliderProps) => {
  const [minValue, maxValue] = value;
  const thumbRadius = 8;

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMinValue = Math.min(Number(event.target.value), maxValue);
    onChange([newMinValue, maxValue]);
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMaxValue = Math.max(Number(event.target.value), minValue);
    onChange([minValue, newMaxValue]);
  };

  return (
    <div className={styles.container}>
      {multi && (
        <input
          type="range"
          className={styles.inputRange}
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
        />
      )}
      <input
        type="range"
        className={styles.inputRange}
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
      />
      <div className={styles.slider}>
        <div className={styles.track} />
        <div
          className={styles.range}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        ></div>

        {/* Left Thumb */}
        {multi && (
          <div
            className={styles.thumb}
            style={{
              left: `calc(${
                ((minValue - min) / (max - min)) * 100
              }% - ${thumbRadius}px)`,
            }}
          ></div>
        )}

        {/* Right Thumb */}
        <div
          className={styles.thumb}
          style={{
            left: `calc(${
              ((maxValue - min) / (max - min)) * 100
            }% - ${thumbRadius}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RangeSlider;
