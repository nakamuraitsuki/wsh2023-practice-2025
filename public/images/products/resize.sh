#!/bin/bash

# 引数で入力ディレクトリと出力ディレクトリを指定
input_dir="$1"
output_dir="$2"

# 入力ディレクトリと出力ディレクトリが指定されているか確認
if [ -z "$input_dir" ] || [ -z "$output_dir" ]; then
  echo "Usage: $0 <input_directory> <output_directory>"
  exit 1
fi

# 入力ディレクトリ内のすべての.webpファイルを対象に処理
for original_file in "$input_dir"/*.webp; do
  # ファイルが存在しない場合はスキップ
  if [ ! -f "$original_file" ]; then
    continue
  fi

  # リサイズされたファイル（例: xxx-420w.webp, xxx-240w.webp）の場合はスキップ
  if [[ "$(basename "$original_file")" =~ -[0-9]+w\.webp$ ]]; then
    echo "Skipping already resized file: $(basename "$original_file")"
  else
    # 縮小版のファイル名（元ファイル名に-240wを追加）
    resized_file="$output_dir/$(basename "${original_file%.webp}-240w.webp")"

    # 画像を240pxにリサイズして保存
    cwebp -resize 240 0 "$original_file" -o "$resized_file"
    echo "Resized image created: $resized_file"
  fi
done
