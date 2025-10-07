interface IProps {
  fill?: string;
  stroke?: string;
}

const ArrowBig = ({
  fill,
  stroke,
}: IProps) => {
  return (
    <svg viewBox="0 0 38 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.1429 38.8571V19H3L19 3L35 19H25.8571V38.8571H12.1429Z" fill={fill} fillOpacity="0.4"/>
      <path d="M18.0537 1.83594C18.6429 1.35582 19.5115 1.39043 20.0605 1.93945L36.0605 17.9395C36.4895 18.3685 36.6179 19.0137 36.3857 19.5742C36.1535 20.1346 35.6066 20.5 35 20.5H27.3574V38.8574C27.3573 39.6856 26.6856 40.3573 25.8574 40.3574H12.1426C11.3144 40.3573 10.6427 39.6856 10.6426 38.8574V20.5H3C2.39338 20.5 1.84647 20.1346 1.61426 19.5742C1.38209 19.0137 1.51046 18.3685 1.93945 17.9395L17.9395 1.93945L18.0537 1.83594Z" stroke={stroke} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 46.8574H27.5" stroke={fill} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default ArrowBig;
