interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLayer: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: (...args: any[]) => void;

  ttq: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (event: string, payload?: Record<string, any>) => void;
  };
}
