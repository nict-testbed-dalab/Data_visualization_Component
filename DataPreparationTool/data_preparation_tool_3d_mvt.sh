#!/bin/bash

# 地理空間情報データ変換ツール(GeoJSON形式のデータをMVTに変換)
# usage:
# data_preparation_tool_3d_mvt.sh [最大ズームレベルの数値] [MVTを出力したいフォルダ名のパス] [レイヤ名] [MVTファイルに変更したいGeoJSONデータのパス]
#

if [ $# != 4 ]; then
    echo Usage: data_preparation_tool_3d_mvt.sh max_zoom_level dst_dir layer_name src_geojson
else
    # echo tippecanoe -pC -ad -an -ps -z$1 -e "$2" -l "$3" -ai "$4"
    tippecanoe -pC -ad -an -ps -z$1 -e "$2" -l "$3" -ai "$4"
fi