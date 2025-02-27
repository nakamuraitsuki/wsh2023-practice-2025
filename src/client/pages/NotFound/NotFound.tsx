import type { FC } from 'react';
import { useEffect } from 'react';
import { Layout } from '../../components/application/Layout';
import * as styles from './NotFound.styles';

export const NotFound: FC = () => {
  useEffect(() => {
    // ページタイトルを設定
    document.title = 'ページが見つかりませんでした';

    // フォントを動的にロード
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Layout>
      <div className={styles.container()}>
        <div className={styles.inner()}>
          <p className={styles.mainParagraph()}>ページが存在しません</p>
          <p className={styles.subParagraph()}>Not Found</p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;