interface IProps {
  fill?: string;
  stroke?: string;
}

const ArrowTwoSideDot = ({
  fill,
  stroke,
}: IProps) => {
  return (
    <svg viewBox="0 0 334 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill={fill} fill-opacity="0.4"/>
      <path d="M10 4H323.635" stroke={stroke} stroke-opacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="329.633" cy="4" r="4" fill={fill} fillOpacity="0.4"/>
    </svg>
  )
}

export default ArrowTwoSideDot;
