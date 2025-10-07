interface IProps {
  fill?: string;
  stroke?: string;
}

const ArrowTwoSide = ({
  fill,
  stroke,
}: IProps) => {
  return (
    <svg viewBox="0 0 336 14" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d="M6.33594 1.66602L1.0026 6.99935L6.33594 12.3327" stroke={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.33594 7H329.304" stroke={stroke} strokeOpacity="0.4" stroke-width="2" stroke-linecap="round" strokeLinejoin="round"/>
      <path d="M329.305 1.66602L334.638 6.99935L329.305 12.3327" stroke={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default ArrowTwoSide;
