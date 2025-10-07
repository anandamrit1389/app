interface IProps {
  fill?: string;
  stroke?: string;
}

const Arrow = ({
  fill,
  stroke,
}: IProps) => {
  return (
    <svg viewBox="0 0 336 13" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6.33398H329.302" stroke={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M329.305 1L334.638 6.33333L329.305 11.6667" stroke={stroke} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Arrow;
