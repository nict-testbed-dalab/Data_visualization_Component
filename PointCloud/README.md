# PointCloud

### 概要

CSVファイル形式のデータを入力とする、点群データの表示機能についてのサンプルアプリ

------------

### 導入方法

Mapbox

1. ライブラリ D3.js 及び deck.gl を取り込む。  
     ./Mapbox/map/index.html L.11 - L.12

2. 点群の描画処理を実装する。  
     ./Mapbox/map/js/index.js L.37 - L.60

3. 時刻変更に合わせて表示データを変更する処理を実装する。  
     ./Mapbox/js/main.js L.63  
     ./Mapbox/js/STARScontroller.js L.111 - L.113  
     ./Mapbox/map/js/index.js L.62 - L.70  
     ./Mapbox/map/js/controller.js L.24 - L.30  
       CSVファイルのファイル名のフォーマットはYYYYMMDDhhmm.csv

