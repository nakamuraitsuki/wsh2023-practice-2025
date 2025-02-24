import fs from 'node:fs/promises';
import sqlite3 from 'sqlite3';

import { DATABASE_PATH, DATABASE_SEED_PATH } from './database_paths';

export const initializeDatabase = async () => {
  try {
    // データベースのコピー
    await fs.copyFile(DATABASE_SEED_PATH, DATABASE_PATH);

    const db = new sqlite3.Database(DATABASE_PATH);

    // トランザクション開始
    await new Promise<void>((resolve, reject) => {
      db.run('BEGIN TRANSACTION;', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // インデックス作成
    const queries = [
      `CREATE INDEX IF NOT EXISTS idx_feature_item_section ON feature_item(sectionId);`,
      `CREATE INDEX IF NOT EXISTS idx_feature_item_product ON feature_item(productId);`,
      `CREATE INDEX IF NOT EXISTS idx_limited_time_offer_product ON limited_time_offer(productId);`,
      `CREATE INDEX IF NOT EXISTS idx_limited_time_offer_price ON limited_time_offer(price);`,
      `CREATE INDEX IF NOT EXISTS idx_limited_time_offer_start_date ON limited_time_offer(startDate);`,
      `CREATE INDEX IF NOT EXISTS idx_limited_time_offer_end_date ON limited_time_offer(endDate);`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_media_file_filename ON media_file(filename);`,
      `CREATE INDEX IF NOT EXISTS idx_order_user ON "order"(userId);`,
      `CREATE INDEX IF NOT EXISTS idx_order_zip_code ON "order"(zipCode);`,
      `CREATE INDEX IF NOT EXISTS idx_order_address ON "order"(address);`,
      `CREATE INDEX IF NOT EXISTS idx_order_is_ordered ON "order"(isOrdered);`,
      `CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(productId);`,
      `CREATE INDEX IF NOT EXISTS idx_product_media_file ON product_media(fileId);`,
      `CREATE INDEX IF NOT EXISTS idx_product_media_is_thumbnail ON product_media(isThumbnail);`,
      `CREATE INDEX IF NOT EXISTS idx_profile_avatar ON profile(avatarId);`,
      `CREATE INDEX IF NOT EXISTS idx_review_product ON review(productId);`,
      `CREATE INDEX IF NOT EXISTS idx_review_user ON review(userId);`,
      `CREATE INDEX IF NOT EXISTS idx_review_posted_at ON review(postedAt);`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON user(email);`
    ];

    for (const query of queries) {
      await new Promise<void>((resolve, reject) => {
        db.run(query, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // トランザクションコミット
    await new Promise<void>((resolve, reject) => {
      db.run('COMMIT;', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    db.close();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};
