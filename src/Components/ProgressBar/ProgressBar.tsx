import { useLayoutEffect, useRef, useState } from "react";

import classes from "./ProgressBar.module.css";

export type ProgressBarProps = {
  style?: React.CSSProperties;
  animationClass?: string;
  progress: number;
};

const ProgressBar = (props: ProgressBarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current?.offsetWidth ?? 0);
  }, []);

  return (
    <div ref={ref} className={classes.base} style={props.style}>
      <div
        className={`${classes.progress} ${props.animationClass}`}
        style={{ transform: `translate(-${width * (1 - props.progress)}px)` }}
      ></div>
    </div>
  );
};

// ProgressBar.propsTypes = {
//     style: PropTypes.object,
//     progress: PropTypes.number, // 0.0 - 1
//     animationClass: PropTypes.string,
// };

export default ProgressBar;
