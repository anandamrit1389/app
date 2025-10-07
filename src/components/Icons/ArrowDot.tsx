interface IProps {
  fill?: string;
  stroke?: string;
}

const ArrowDot = ({
  fill,
  stroke,
}: IProps) => {
  return (
    <svg viewBox="0 0 335 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="6.66797" r="4" fill={fill} fillOpacity="0.4"/>
      <path d="M10 6.66797H328.302" stroke={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M328.305 1.33398L333.638 6.66732L328.305 12.0007" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default ArrowDot;