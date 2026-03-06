import { motion, type SVGMotionProps } from "framer-motion";

interface MenuButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
  svgProps?: SVGMotionProps<SVGSVGElement>;
}

export function MenuButton(props: MenuButtonProps) {
  const { isOpen, setIsOpen, svgProps, className } = props;

  const { height = 12, width = 24, ...rest } = svgProps ?? {};

  const variant = isOpen ? "opened" : "closed";
  const top = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: 45, translateY: 2, originX: "50%", originY: "50%" },
  };
  const center = {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  };
  const bottom = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: -45, translateY: -2, originX: "50%", originY: "50%" },
  };

  const lineProps = {
    stroke: "currentColor",
    fill: "currentColor",
    strokeWidth: 2,
    vectorEffect: "non-scaling-stroke",
    initial: "closed",
    animate: variant,
  };

  const unitHeight = 4;
  const unitWidth = (unitHeight * (width as number)) / (height as number);

  return (
    <button
      className={className}
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <motion.svg
        height={height}
        overflow="visible"
        preserveAspectRatio="none"
        viewBox={`0 0 ${unitWidth} ${unitHeight}`}
        width={width}
        {...rest}
      >
        <motion.line variants={top} x1="0" x2={unitWidth} y1="0" y2="0" {...lineProps} />
        <motion.line variants={center} x1="0" x2={unitWidth} y1="2" y2="2" {...lineProps} />
        <motion.line variants={bottom} x1="0" x2={unitWidth} y1="4" y2="4" {...lineProps} />
      </motion.svg>
    </button>
  );
}
