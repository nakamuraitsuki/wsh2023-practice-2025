import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import * as styles from "./AspectRatio.styles";

type Props = {
  ratioWidth: number;
  ratioHeight: number;
  children: ReactNode;
};

export const AspectRatio: FC<Props> = ({ children, ratioHeight, ratioWidth }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState<number>(0);

  useEffect(() => {
    const updateClientHeight = throttle(1000, () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      const height = (width * ratioHeight) / ratioWidth;
      setClientHeight(height);
    });

    // 初回実行
    updateClientHeight();

    // リサイズ時に高さを再計算
    window.addEventListener("resize", updateClientHeight);

    return () => {
      window.removeEventListener("resize", updateClientHeight);
    };
  }, [ratioHeight, ratioWidth]);

  return (
    <div ref={containerRef} className={styles.container({ clientHeight })}>
      {children}
    </div>
  );
};
