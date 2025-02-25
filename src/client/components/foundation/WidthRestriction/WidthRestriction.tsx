import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';

import * as styles from './WidthRestriction.styles';

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
      // 横幅を最大 1024px にする
      setClientWidth(Math.min(width, 1024));
    });

    const timer = setInterval(updateClientWidth, 1000); // 1000ミリ秒ごとに更新

    return () => {
      clearInterval(timer); // コンポーネントがアンマウントされる時にタイマーをクリア
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container()}>
      <div className={styles.inner({ width: clientWidth })}>{isReady ? children : null}</div>
    </div>
  );
};
