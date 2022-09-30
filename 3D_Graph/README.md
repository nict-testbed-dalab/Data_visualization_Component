# 3D_Graph
### 概要

CSVファイル形式のデータを入力とする、立体グラフの表示機能についてのサンプルアプリ

------------

### 導入方法

iTowns

1. ./iTowns/map/js/3dBargraph.js を格納し、HTMLファイルへ組み込む。

2. 立体グラフの描画処理を実装する。  
     ./iTowns/map/js/index.js L.61 - L.77  
     L.67 config.url は表示したいCSVファイルを指定する。  
     L.66 config.jsonurl はCSVファイルのカラム名を指定するjsonファイルを指定する。

3. 地図の拡大縮小に応じた、立体グラフのサイズ調整を実装する。  
     ./iTowns/map/js/index.js L.80 - L.84  
     具体的なサイズ指定は 3dBargraph.js の L.358 - L.369 で実装している。

4. 時刻変更に合わせて表示データを変更する処理を実装する。  
     ./iTowns/js/main.js L.63  
     ./iTowns/js/STARScontroller.js L.112 - L.114  
     ./iTowns/map/js/index.js L.87 - L.99  
     ./iTowns/map/js/controller.js L.62 - L.74  
       CSVファイルのファイル名のフォーマットはYYYYMMDDhhmm.csv


Mapbox

1. ライブラリ d3js 及び turfjs を取り込む。  
     ./Mapbox/map/index.html L.11 - L.12

2. 立体グラフの描画処理を実装する。  
     ./Mapbox/map/js/index.js L.31 - L.130

3. 時刻変更に合わせて表示データを変更する処理を実装する。  
     ./Mapbox/js/main.js L.63  
     ./Mapbox/js/STARScontroller.js L.111 - L.113  
     ./Mapbox/map/js/index.js L.132 - L.160  
     ./Mapbox/map/js/controller.js L.24 - L.30  
       CSVファイルのファイル名のフォーマットはYYYYMMDDhhmm.csv

=======
