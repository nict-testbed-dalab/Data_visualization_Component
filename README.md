# Data_visualization_Component
WebGISアプリ向けデータ可視化機能

## 概要
WebGISアプリ上で、主に時系列データを可視化するための機能及び、その機能を含むサンプルのWebGISアプリケーションです。

### 機能一覧
- 立体グラフ表示機能（3D_Graph）
- 3次元オブジェクト表示機能（3D_Object）
- 360度画像作成機能（CreateSphereMap）
- 画像キャプチャ機能（DisplayCapture）
- 面群表示機能（PlaneGroup）
- 点群表示機能（PointCloud）
- レイヤー間相対位置判定機能（RelativePosition）

## 画像キャプチャ機能
### 導入方法
- dalab_displaycapture.jsをダウンロードする。
- jQueryとダウンロードしたライブラリをHTMLファイルへ組み込む。

### API

#### singleCapture
  画像キャプチャを行う

  * 構文 <br>
  singleCapture(fileName)
  * 引数
    + fileName キャプチャ画像の保存名
  * 戻り値 <br>
  なし（ダウンロードフォルダにキャプチャ画像が格納される。）


#### multiCapture
  時系列データの画面表示を対象に、開始時刻から終了時刻まで一定時間を進めながら画像キャプチャを行う。

  * 構文 <br>
  multiCapture(currentTime, startTime, endTime, stepTime, pIsContinueCallback, pPreCaptureCallback, pNameFormatCallback )
  * 引数
    + currentTime  表示中の時系列データの時刻
    + startTime   画像キャプチャの開始時刻
    + endTime   画像キャプチャの終了時刻
    + stepTime   画像キャプチャ実施ごとに進める時間ステップ
    + pIsContinueCallback   画像キャプチャを継続するかをチェックするためのコールバック関数
    + pPreCaptureCallback   画像キャプチャの前処理のためのコールバック関数
    + pNameFormatCallback   キャプチャ画像の保存名を返却するコールバック関数
  * 戻り値 <br>
  なし（ダウンロードフォルダにキャプチャ画像が格納される。）


## Mapbox向けデータ可視化用ライブラリ
- dalab_visualization_lib.jsをダウンロードする。
- jQuery、Turf.js、D3.js、deck.gl、ダウンロードしたライブラリをHTMLファイルへ組み込む。

### API

#### addBargraphLayer
  3次元グラフのレイヤーを追加する。

  * 構文 <br>
  addBargraphLayer(map, filename, dataname, layerId, sourceId, color, radiusSize, elevationScale)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 3次元グラフの元データとなるファイル。読み取り可能なファイルはCSVファイル、GeoJsonファイルのいずれか。
    + dataname 可視化対象のデータ。CSVファイルの場合はカラム名、GeoJsonファイルの場合はfeatures.properties配下のキーを指定する。
    + layerId 追加するレイヤーごとに指定するID
    + sourceId 追加するレイヤーのsourceID
    + color 3次元グラフの色
    + radiusSize 3次元グラフの幅
    + elevationScale 3次元グラフの高さ（倍率）
  * 戻り値 <br>
  なし


#### updateBargraphLayer
  追加した3次元グラフのレイヤーを更新する。

  * 構文 <br>
  updateBargraphLayer(map, filename, dataname, layerId, sourceId, color, radiusSize, elevationScale)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 3次元グラフの元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、latカラムは必須)、GeoJsonファイルのいずれか。
    + dataname 可視化対象のデータ。CSVファイルの場合はカラム名、GeoJsonファイルの場合はfeatures.properties配下のキーを指定する。
    + layerId 追加したレイヤーのレイヤーID
    + sourceId 追加したレイヤーに含まれるsourceID
    + color 3次元グラフの色
    + radiusSize 3次元グラフの幅（メートル）
    + elevationScale 3次元グラフの高さ（倍率）
  * 戻り値 <br>
  なし


#### addMovingObjectLayer
  方向のある3次元オブジェクトのレイヤーを追加する。

  * 構文 <br>
  addMovingObjectLayer(map, filename, layerId, sourceId, color, size)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 3次元オブジェクトの元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、lat、directionカラムは必須)、GeoJsonファイル(features.properties.directionは必須)のいずれか。
    + layerId 追加するレイヤーごとに指定するID
    + sourceId 追加するレイヤーのsourceID
    + color 3次元グラフの色
    + size 3次元グラフの幅（メートル）
  * 戻り値 <br>
  なし


#### updateMovingObjectLayer
  追加した3次元オブジェクトのレイヤーを更新する。

  * 構文 <br>
  updateMovingObjectLayer(map, filename, layerId, sourceId, color, size)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 3次元オブジェクトの元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、lat、directionカラムは必須)、GeoJsonファイル(features.properties.directionは必須)のいずれか。
    + layerId 追加したレイヤーのレイヤーID
    + sourceId 追加したレイヤーに含まれるsourceID
    + color 3次元オブジェクトの色
    + size 3次元オブジェクトのサイズ（メートル）
  * 戻り値 <br>
  なし


#### addPlaneGroupLayer
  面群レイヤーを追加する。対象データは色で可視化する。

  * 構文 <br>
  addPlaneGroupLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 面群の元データとなるファイル。読み取り可能なファイルはGeoJsonファイル。
    + dataname 可視化対象のデータ。features.properties配下のキーを指定する。
    + layerId 追加するレイヤーごとに指定するID
  * 戻り値 <br>
  なし


#### updatePlaneGroupLayer
  追加した面群レイヤーを更新する。

  * 構文 <br>
  updatePlaneGroupLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 面群の元データとなるファイル。読み取り可能なファイルはGeoJsonファイル。
    + dataname 可視化対象のデータ。features.properties配下のキーを指定する。
    + layerId 追加したレイヤーのレイヤーID
  * 戻り値 <br>
  なし


#### addPointCloudLayer
  点群レイヤーを追加する。対象データは色で可視化する。

  * 構文 <br>
  addPlaneGroupLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 点群の元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、latカラムは必須)、GeoJsonファイルのいずれか。
    + dataname 可視化対象のデータ。CSVファイルの場合はカラム名、GeoJsonファイルの場合はfeatures.properties配下のキーを指定する。
    + layerId 追加するレイヤーごとに指定するID
  * 戻り値 <br>
  なし


#### updatePointCloudLayer
  追加した点群レイヤーを更新する。

  * 構文 <br>
  addPlaneGroupLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 点群の元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、latカラムは必須)、GeoJsonファイルのいずれか。
    + dataname 可視化対象のデータ。CSVファイルの場合はカラム名、GeoJsonファイルの場合はfeatures.properties配下のキーを指定する。
    + layerId 追加したレイヤーのレイヤーID
  * 戻り値 <br>
  なし


#### addRelativePositionPointLayer
  本ライブラリで追加した面群データとの位置関係を判別する点群レイヤーを追加する。面群内の点は赤、面群外の点は青で描画する。

  * 構文 <br>
  addPlaneGroupLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 点群の元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、latカラムは必須)、GeoJsonファイルのいずれか。
    + planeLayerId 事前にaddPlaneGroupLayerで追加した面群レイヤーのID
    + layerId 追加するレイヤーごとに指定するID
  * 戻り値 <br>
  なし

#### updateRelativePositionPointLayer
  面群データとの位置関係を判別する点群レイヤーを更新する。

  * 構文 <br>
  updateRelativePositionPointLayer(map, filename, dataname, layerId)
  * 引数
    + map Mapboxのmapオブジェクト
    + filename 点群の元データとなるファイル。読み取り可能なファイルはCSVファイル(lng、latカラムは必須)、GeoJsonファイルのいずれか。
    + planeLayerId 事前にaddPlaneGroupLayerで追加した面群レイヤーのID
    + layerId 追加したレイヤーのレイヤーID
  * 戻り値 <br>
  なし
