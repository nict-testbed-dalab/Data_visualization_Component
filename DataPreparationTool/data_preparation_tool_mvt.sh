#!/bin/bash

# 地理空間情報データ変換ツール(GeoJSON形式のデータをMVTに変換)
# usage:
# data_preparation_tool_mvt.sh [出力先のフォルダ] [最大ズームレベルの数値] [GeoJSON形式のファイルへのパス]
#

if [ $# != 3 ]; then
    echo Usage: Usage: data_preparation_tool_mvt.sh dst_dir max_zoom_level src_geojson
else
    # echo tippecanoe -e "$1" -pC -z$2 -aS "$3"
    tippecanoe -e "$1" -pC -z$2 -aS "$3"
fi