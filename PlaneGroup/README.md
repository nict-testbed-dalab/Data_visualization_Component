# PlaneGroup

### 概要

JSONファイル形式のデータを入力とする、面群データの表示機能についてのサンプルアプリ

------------

### 導入方法

iTowns

1. 面群の描画処理を実装する。  
     ./iTowns/map/js/index.js L.56 - L.70

2. 時刻変更に合わせて表示データを変更する処理を実装する。  
     ./iTowns/js/main.js L.63  
     ./iTowns/js/STARScontroller.js L.111 - L.113  
     ./iTowns/map/js/index.js L.72 - L.78  
     ./iTowns/map/js/controller.js L.56 - L.62  
       JSONファイルのファイル名のフォーマットはYYYYMMDDhhmm.json  
       サンプルのJSONファイルは ./iTowns/map/data/ に格納している。


Mapbox

1. ライブラリ D3.js 及び deck.gl を取り込む。  
     ./Mapbox/map/index.html L.11 - L.12

2. 面群の描画処理を実装する。  
     ./Mapbox/map/js/index.js L.37 - L.76

3. 時刻変更に合わせて表示データを変更する処理を実装する。  
     ./Mapbox/js/main.js L.63  
     ./Mapbox/js/STARScontroller.js L.111 - L.113  
     ./Mapbox/map/js/index.js L.62 - L.70  
     ./Mapbox/map/js/controller.js L.24 - L.30  
       JSONファイルのファイル名のフォーマットはYYYYMMDDhhmm.json  
       サンプルのJSONファイルは ./Mapbox/map/data/ に格納している。

