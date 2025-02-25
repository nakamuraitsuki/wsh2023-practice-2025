import { useEffect, useState, type ReactNode } from "react";

export const DeviceType = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

type Props = {
  children: ({ deviceType }: { deviceType: DeviceType }) => ReactNode;
};

export const GetDeviceType = ({ children }: Props) => {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    window.innerWidth >= 1024 ? DeviceType.DESKTOP : DeviceType.MOBILE
  );

  useEffect(() => {
    const updateDeviceType = () => {
      setDeviceType(window.innerWidth >= 1024 ? DeviceType.DESKTOP : DeviceType.MOBILE);
    };

    window.addEventListener("resize", updateDeviceType);
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  return children({ deviceType });
};
