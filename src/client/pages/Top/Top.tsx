import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Layout } from '../../components/application/Layout';
import { ProductList } from '../../components/feature/ProductList';
import { ProductHeroImage } from '../../components/product/ProductHeroImage';
import { useFeatures } from '../../hooks/useFeatures';
import { useRecommendation } from '../../hooks/useRecommendation';

import * as styles from './Top.styles';

export const Top: FC = () => {
  const { recommendation } = useRecommendation();
  const { features } = useFeatures();
  const [isHeroImageVisible, setIsHeroImageVisible] = useState(false);

  useEffect(() => {
    document.title = '買えるオーガニック';
  }, []); // コンポーネントが初めてレンダリングされるときにタイトルを変更

  useEffect(() => {
    // recommendation が取得できた時点で HeroImage を表示する
    if (recommendation) {
      setIsHeroImageVisible(true);
    }
  }, [recommendation]); // recommendation が変わったタイミングで実行

  if (recommendation === undefined || features === undefined) {
    return null; // recommendation や features がまだ取得されていない場合は何も表示しない
  }

  return (
    <Layout>
      <div>
        {/* HeroImage は recommendation が取得できたときだけ表示 */}
        {isHeroImageVisible && (
          <ProductHeroImage product={recommendation.product} title="今週のオススメ" />
        )}

        {/* 他のコンテンツは recommendation と features が両方揃ったときに表示 */}
        {features && (
          <div className={styles.featureList()}>
            {features.map((featureSection) => (
              <div key={featureSection.id} className={styles.feature()}>
                <h2 className={styles.featureHeading()}>{featureSection.title}</h2>
                <ProductList featureSection={featureSection} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
