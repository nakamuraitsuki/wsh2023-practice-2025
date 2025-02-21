const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/products/tomato';
const outputDir = './public/images/products/tomato';

// 生成する画像の幅（px）
const sizes = [480, 960, 1440];

// `outputDir` が存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// すべての画像を処理
fs.readdirSync(inputDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return; // 指定拡張子以外はスキップ

  const baseName = path.basename(file, ext);

  sizes.forEach(async (size) => {
    const outputFile = path.join(outputDir, `${baseName}-${size}w.webp`);

    // すでに生成済みならスキップ
    if (fs.existsSync(outputFile)) {
      console.log(`✔ Skipped (exists): ${outputFile}`);
      return;
    }

    try {
      await sharp(path.join(inputDir, file))
        .resize(size) // リサイズ
        .webp({ quality: 80 }) // WebP に変換（画質 80 に設定）
        .toFile(outputFile);
      console.log(`✅ Created: ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  });
});
