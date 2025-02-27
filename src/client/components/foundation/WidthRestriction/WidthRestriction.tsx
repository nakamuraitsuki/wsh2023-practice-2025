import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import * as styles from "./WidthRestriction.styles";

type Props = {
  children: ReactNode;
};

export const WidthRestriction: FC<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState<number>(0);

  const isReady = clientWidth !== 0;

  useEffect(() => {
    const updateClientWidth = throttle(1000, () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      setClientWidth(Math.min(width, 1024)); // 最大 1024px に制限
    });

    // 初回実行
    updateClientWidth();

    // リサイズイベントで更新
    window.addEventListener("resize", updateClientWidth);

    return () => {
      window.removeEventListener("resize", updateClientWidth);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container()}
      style={{
        width: "100%", // 横幅100%
        height: isReady ? "auto" : "56.25vw", // aspect-ratio 16:9 => 9 / 16 = 0.5625 -> 高さに反映
      }}
    >
      <div className={styles.inner({ width: clientWidth })}>
        {isReady ? children : null}
      </div>
    </div>
  );
};
