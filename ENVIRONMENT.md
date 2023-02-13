# 時系列・地理空間情報に関するデータ分析・可視化システムの試作と実装 システム構築説明書

## サーバ環境構築
### データベース
#### 本システムで利用するデータベース
本システムでは、データベース(RDBMS)としてPostgreSQL 12を利用し、PostgreSQL データベースで地理空間情報を扱うための拡張であるPostGISも併せて導入します。

#### PostgreSQL 12 のインストール
PostgreSQL はDB兼ストレージサーバ(tb-gis-db.jgn-x.jp)へインストールします。次の2つのコマンドを実行して下さい。

1. パッケージインデックスを更新
```
sudo apt -y update
```

パッケージインデックスについて、PostgreSQL以外の構築で直前に更新している場合は実行不要です。

2. PostgreSQLをインストール
```
sudo apt -y install postgresql-12 postgresql-client-12 postgresql-client-common postgresql-common postgresql-contrib pgadmin3 postgresql-12-postgis-3 postgresql-server-dev-12 postgresql-plpython3-12 libpq-dev
```

PostgreSQL本体、及び必要な関連パッケージをインストールします。このコマンドでPostGIS(“… postgresql-12-postgis-3 …” と記述してある部分が該当箇所)も同時にインストールします。

#### パスワードの設定
PostgreSQLのインストール時に作成されるpostgresユーザにパスワードを設定します。次のコマンドを入力し、パスワードを設定して下さい。以降ではここで設定するパスワードを” postgres”として記述します。実際のパスワードはセキュリティ確保のため、適切な強度を持ったものを設定して下さい。

1. パスワードの設定
```
sudo passwd postgres
```

#### psqlを使ったPostgreSQLへの接続
インストール、パスワード設定の確認として、次の2つのコマンドを実行してPostgreSQLへの接続を確認して下さい。

1. ユーザ切り替え
```
sudo -i -u postgres
```

2. PostgreSQLへの接続
```
psql
```

プロンプトの表示が”posgres=#”となっていれば接続は成功です。次のコマンドを実行してPostgreSQLから切断して下さい。

3. PostgreSQLから切断
```
\\q
```

#### 設定ファイルの適用とサービスの起動
設定ファイルの編集は以下のコマンドで開始することができます。成果物一式に格納されているpg_hba.confを参考に設定を変更して下さい。

1. 設定ファイルを変更
```
sudo nano /etc/postgresql/12/main/pg_hba.conf
```

サービスの起動、再起動、停止は以下のそれぞれのコマンドで行うことができます。上の設定ファイル変更を適用するため、サービスを再起動して下さい。再起動後、改めて2.5.4の手順でPostgreSQLへの接続を確認できれば、データベースの構築は完了です。

1. 起動
```
sudo service postgresql start
```

2. 再起動
```
sudo service postgresql restart
```

3. 停止
```
sudo service postgresql stop
```

## WebAPI
### GeoServer
#### GeoServer及び依存パッケージについて
GeoServerはWebブラウザなどが利用する地理情報を配信するJavaアプリケーションです。ここでは、GeoServerインストールおよび併せて必要なOpenJDK、Tomcatのインストールについて説明します。

#### パッケージインデックスの更新
GeoServer及び依存パッケージはWebサーバ(tb-gis-db.jgn-x.jp)へインストールします。次のコマンドを実行して下さい。

1. パッケージインデックスを更新
```
sudo apt -y update
```

パッケージインデックスについて、GeoServer以外の構築で直前に更新している場合は実行不要です。

#### OpenJDKのインストール
次のコマンドを実行して下さい。

1. OpenJDKをインストール
```
sudo apt install default-jre
```

#### Tomcatのインストール
次のコマンドを実行して下さい。

1. Tomcatをインストール
```
sudo apt install tomcat9 tomcat9-admin
```

2. サービスを有効にします。
```
sudo systemctl enable tomcat9
```

#### Tomcatの設定変更
設定ファイルの編集は以下のコマンドで開始することができます。

1. 設定ファイルを変更
```
sudo nano /etc/tomcat9/tomcat-users.xml
```

成果物一式に格納されているtomcat-users.xmlを参考に設定を変更して下さい。以下の内容を追記します。

```
<role rolename="admin-gui"/>
<role rolename="manager-gui"/>
<user username="tomcat" password="pass" roles="admin-gui,manager-gui"/>
```

#### Tomcatの開始
次のコマンドを実行して下さい。

1. 起動
```
sudo service tomcat9 start
```

#### GeoServerのインストール
以下の4つのコマンドを実行し、GeoServerのインストールを行います。

1. GeoServerパッケージ(ZIPファイル)の取得
```
sudo wget https://sourceforge.net/projects/geoserver/files/GeoServer/2.20.1/geoserver-2.20.1-war.zip
```

2. GeoServerパッケージ(ZIPファイル)の配置
```
sudo mv geoserver-2.20.1-war.zip /var/lib/tomcat9/webapps
```

3. 配置ディレクトリへ移動
```
cd /var/lib/tomcat9/webapps
```

4. GeoServerパッケージ(ZIPファイル)の展開
```
sudo unzip geoserver-2.20.1-war.zip
```

#### GeoServerのポート設定(Apacheの設定変更)
GeoServerがデフォルトで利用するポートは8080ですが、本システムでは8085を使用します。Apacheの設定ファイル(/etc/apache2/sites-enabled/default.conf)を編集します。
設定ファイルの編集は以下のコマンドで開始することができます。

1. 設定ファイルを変更
```
sudo nano /etc/apache2/sites-enabled/default.conf
```

成果物一式に格納されているdefault.confを参考に設定を変更して下さい。以下の内容を追記します。

```
ProxyPass /geoserver http://localhost:8085/geoserver
ProxyPassReverse /geoserver http://localhost:8085/geoserver
```

ここまでの設定を反映するため、一度Tomcat 、Apacheを再起動します。以下の2つのコマンドを実行して下さい。

1. Tomcatの再起動
```
sudo systemctl restart tomcat9
```

2. Apacheの再起動
```
sudo systemctl restart apache2
```

#### SSL対応(証明書の作成と設定)
SSL対応(https対応)を行うため、証明書の作成と設定を行います。以下の2つのコマンドを実行して下さい。

1. Tomcatの設定ディレクトリへ移動
```
cd  /var/lib/tomcat9/conf
```

2. 証明書の作成
```
sudo keytool -genkey -alias tomcat -keyalg RSA -keystore tomcat.keystore -validity 3650
```

次に、作成した証明書の情報をTomcat設定に追記します。設定ファイルの編集は以下のコマンドで開始することができます。

1. 設定ファイルを変更
```
sudo nano /etc/apache2/sites-enabled/default.conf
```

成果物一式に格納されているserver.xml を参考に設定を変更して下さい。以下の内容を追記します。既存の8443ポート設定がある場合はコメントアウトが必要です。

```
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"
     maxThreads="150" SSLEnabled="true" >
<SSLHostConfig>
    <Certificate certificateKeystoreFile="conf/tomcat.keystore"
                 certificateKeystorePassword="P@ssw0rd"
                 certificateKeyAlias="tomcat"
                 certificateKeystoreProvider="SUN"
                 certificateKeystoreType="JKS"
                 type="RSA" />
</SSLHostConfig>
</Connector>
```

#### GeoServerの名前解決設定
GeoServerの名前解決を行うため、以下の情報をGeoServerの設定に追記します。設定ファイルの編集は以下のコマンドで開始することができます。

1. 設定ファイルを変更
```
sudo nano /var/lib/tomcat9/webapps/geoserver/WEB-INF/web.xml
```

成果物一式に格納されているweb.xmlを参考に設定を変更して下さい。以下の内容を追記します。

```
<context-param>
  <param-name>PROXY_BASE_URL</param-name>
  <param-value>https://tb-gis-web-dev.jgn-x.jp/geoserver</param-value>
</context-param>

<context-param>
  <param-name>GEOSERVER_CSRF_WHITELIST</param-name>
  <param-value>tb-gis-web-dev.jgn-x.jp</param-value>
</context-param>
```

ここまでの設定を反映するため、Tomcatを再起動します。以下のコマンドを実行して下さい。

1. Tomcatの再起動
```
sudo systemctl restart tomcat9
```

以下のコマンドを実行して正常なレスポンスが返れば、構築は成功です。Webブラウザから [https://localhost:8443/](https://localhost:8443/) へアクセスして、GeoServerの管理を行うことができます(図 31、図 32)。
Geoserverはデフォルトではユーザ名：admin、パスワード：geoserverとなっているため、適切な強度を持ったものを設定して下さい。

1. GeoServer管理インターフェースへのアクセス
```
curl -k https://localhost:8443/
```

![](media/ENVIRONMENT/image1.png)

図 31 GeoServerの管理インターフェース(ログイン前)

![](media/ENVIRONMENT/image2.png)

図 32 GeoServerの管理インターフェース(ログイン後)


### KrakenD
#### インストール
次のコマンドを実行して下さい。
1. KrakenDをインストール （１，２行目：krakendのキーの登録、３行目：パッケージリストの更新）
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 5DE6FD698AD6FDD2
sudo echo "deb https://repo.krakend.io/apt stable main" | sudo tee /etc/apt/sources.list.d/krakend.list
sudo apt-get update
sudo apt-get install -y krakend
```

2. ディレクトリ作成
```
cd （ユーザディレクトリなど）
mkdir krakend
```

3. 設定ファイルの確認

設定ファイルkrakend.jsonを確認します。
```
cd ./krakend
view krakend.json
```

#### 起動
次のコマンドを実行し、バックグラウンドで起動させます。
1. 起動
```
nohup krakend run --config krakend.json &amp;
```

#### 停止
次のコマンドを実行します。
1. 実行プロセスを表示
```
ps aux | grep krakend
```

2. 一覧の「krakend run」のプロセスIDを指定し、プロセスを終了します。
（プロセスIDは起動ごとに異なります。）

```
kill 123456
```

### FastAPI
#### インストール
次のコマンドを実行します。

1. pip3のインストール（インストールされていない場合のみ）
```
sudo apt update
sudo apt install python3-pip
```

確認メッセージでは「Y」を入力します。

2. 各種フレームワークのインストール（関連パッケージも自動的にインストールされます）
```
pip3 install fastapi
pip3 install db
pip3 install databases
pip3 install sqlalchemy
pip3 install starlette
pip3 install uvicorn
pip3 install python-dotenv
```

3. インストールされたことを確認します。成功したフレームワーク名が表示されます。
```
pip3 list
```

#### mainファイルの配置
次のコマンドを実行します。
1. ディレクトリ作成
``` 
cd （ユーザディレクトリなど）
mkdir api
```

このapiディレクトリ配下に、main.pyを配置します。


#### 起動
次のコマンドを実行します。

1. バックグラウンドで実行させます。
（リロードモードでの実行で、ソース修正時は自動的に反映されます。）
```
cd ./api
nohup python3 -m uvicorn main:app --reload --port 5000 &amp;
```

#### 停止
次のコマンドを実行します。

1. 実行プロセスを表示
```
ps aux | grep uvicorn
```

2. 一覧の「python3 -m uvcorn」のプロセスIDを指定し、プロセスを終了します。
（プロセスIDは起動ごとに異なります 。）

```
kill 123456
```

## データ取得変換ツール
### 前提条件および概要
データ取得変換ツールでは、収集したデータを必要に応じてデータ分析・可視化システムで利用可能な形に変換します。変換したファイルをWebサーバに配置する、又は直接Webサーバを出力先として変換配置することでWebGISから参照可能となり、本システムにデータを追加できます。本システムからのデータ削除は、配置又は変換配置したファイルの削除により可能です。ただし、収集データうちGeoServerへ登録して配信するものについては、GeoServerへの登録/削除により本システムへの追加/削除を行います。


#### データ取得変換ツールの実行場所
データ取得変換ツールは、予めデータ取得変換ツールの依存パッケージを導入した上で、任意のディレクトリ（以下「対象ディレクトリ」）にツールを設置し、実行します。取得または変換データは対象ディレクトリ下に保存されます。以下の説明に従ってデータ取得変換ツールを使用する場合は、初めに対象ディレクトリに移動して下さい。


### データ取得変換ツールの構成について
データ取得変換ツールは、表 1の2つの個別ツールで構成されます。

表 1　個別ツール一覧
|                            |                                                                          |
|----------------------------|--------------------------------------------------------------------------|
|個別ツール名                |用途                                                                      |
|地理空間情報データ変換ツール|国土数値情報(シェープファイル)のバイナリベクトルタイル形式への変換        |
|3次元建物データ変換ツール   |国土交通省PLATEAUによる3次元建物データのバイナリベクトルタイル形式への変換|




### データ取得変換ツール依存パッケージのインストール
#### unzipのインストール手順
データ取得変換ツールに必要なunzipのインストールについて記述します。
次のコマンドを実行して下さい。

1. unzipインストール
```
sudo apt install unzip
```

#### gdalのインストール手順
データ取得変換ツールに必要なgdalのインストールについて記述します。
次のコマンドを実行して下さい。

1. gdalインストール
```
sudo apt install gdal-bin
```

2. gdalのバージョン確認
```
ogr2ogr --version
```

「GDAL 3.0.4, released 2020/01/28」が表示されていれば成功です。

3. gdal更新用のリポジトリ追加
```
sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable
```

画面の指示に従ってエンターキーを押し、追加を完了します。

4. パッケージの更新
```
sudo apt upgrade
```

5. gdalのバージョン確認
```
ogr2ogr --version
```

「GDAL 3.4.0, released 2021/11/04」以降が表示されていれば成功です。


#### makeのインストール手順
4.3.1のインストール手順で必要なmake及び関連パッケージのインストールについて記述します。

次のコマンドを実行して下さい。

1. make及び関連パッケージのインストール
```
sudo apt install make g++ sqlite3 libsqlite3-dev zlib1g-dev
```

#### tippecanoeのインストール手順
地理空間情報データ変換ツール及び3次元建物データ変換ツールの動作にはtippecanoeのインストールが必要です。ここでは、tippecanoeのインストールについて記述します。

次の3つのコマンドを実行して下さい。

1. tippecanoeを取得
```
git clone https://github.com/mapbox/tippecanoe.git
```

2. tippecanoeのビルド場所へ移動
```
cd tippecanoe
```

3. tippecanoeのビルド
```
make
```

4. tippecanoeのインストール
```
sudo make install
```


### データ取得変換ツールのインストール
本リポジトリから

- data_preparation_tool_mvt.sh
- data_preparation_tool_3d_mvt.sh

を取得し、対象ディレクトリに配置して下さい。ファイルは

```
Data_visualization_Component/DataPreparationTool/
```

から取得できます。対象ディレクトリに

- data_preparation_tool_mvt.sh
- data_preparation_tool_3d_mvt.sh

が配置されていれば構築は成功です。 


### 運用
本システムでは、標準で[DataCatalog.pdf](/DataCatalog.pdf)の対象データを運用できるようになっています。また、形式が同一のデータであれば利用者が独自にデータを追加して運用することが可能です。

#### データ収集
[DataCatalog.pdf](/DataCatalog.pdf)に記載されているデータ取得元から、本システムで運用したデータを収集して下さい。対象となるデータには年度更新(数年に一度の更新も含む)のあるものもあり、更新があった場合には最新のデータを追加して本システムを運用することが可能です。

##### 国土地理院が提供するダウンロードツールによる地理院タイルの収集
国土地理院は、国土地理院が公開する地理院タイルについてダウンロードツールを公開しています。

地理院タイルダウンロードツール
[https://github.com/gsi-cyberjapan/tdlmn](https://github.com/gsi-cyberjapan/tdlmn)

導入手順書及び使用マニュアル
[https://github.com/gsi-cyberjapan/tdlmn/blob/main/docs/導入手順書及び使用マニュアル.pdf](https://github.com/gsi-cyberjapan/tdlmn/blob/main/docs/%E5%B0%8E%E5%85%A5%E6%89%8B%E9%A0%86%E6%9B%B8%E5%8F%8A%E3%81%B3%E4%BD%BF%E7%94%A8%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB.pdf)

この導入手順に従って、ツールで推奨されているWindow10+Ruby環境で

```
ruby tdlmn.rb -mn -dt -merge
```

を実行することにより、タイルのダウンロードが可能です。


本システムに標準で収集、公開されているデータは、表 2のとおりです。program.iniのTILE_ID、ZOOM_LEVEL、TILE_FOLDERを都度変更してコマンドを実行し、タイルをダウンロードして下さい。

表 2　使用タイル一覧
|                |                  |                                    |                                                  |
|----------------|------------------|------------------------------------|--------------------------------------------------|
|タイル名        |TILE_ID           |ZOOM_LEVEL                          |TILE_FOLDERについて                               |
|航空写真        |seamlessphoto     |2,3,4,5,6,7,8,9,10,11,12,13,14,15,16|任意の作業ディレクトリを指定して実行し、「」へ設置|
|淡色地図        |pale              |5,6,7,8,9,10,11,12,13,14,15,16,17,18|任意の作業ディレクトリを指定して実行し、「」へ設置|
|標準地図        |std               |5,6,7,8,9,10,11,12,13,14,15,16      |任意の作業ディレクトリを指定して実行し、「」へ設置|
|地理院地図Vector|experimental_bvmap|5,6,7,8,9,10,11,12,13,14,15,16      |任意の作業ディレクトリを指定して実行し、「」へ設置|

※ZOOM_LEVEL指定は改行なしで指定

国土地理院の推奨環境はWindows10 + Ruby3.0.0だが、Linux（Ubuntu）でも実行可能です（未確認）。

##### 3D都市モデル（Project PLATEAU）の収集
本システムでは、国土交通省のProject PLATEAU

[https://www.mlit.go.jp/plateau/](https://www.mlit.go.jp/plateau/)

(3D都市モデル（Project PLATEAU）ポータルサイト)
[https://www.geospatial.jp/ckan/dataset/plateau](https://www.geospatial.jp/ckan/dataset/plateau)

により整備、公開されているMVT 形式の3D都市モデルを表示することが可能です。また、CityGMLとしてしか公開されていないものについても、収集時にQIGSでGeoJSONファイルに変換して保存することにより、データ取得変換ツールでGeoJSON からMVT形式に変換して利用することができます。以降では、この方法について記述します。CityGMLがzipファイルに圧縮されている場合は、4.5.1.1の手順で展開して下さい。


1. QGISのバージョン確認
QGISは3.16以降、かつQGISに同梱のGDALのバージョンは3.4以降で利用して下さい。JVN上(CUI)でのQGIS操作となるため、QGISが利用できるPythonコンソールで作業します。以下の説明で、日本語込みの[](例：[レイヤ名])はPython配列ではなく、コマンド実行時に置き換える箇所を示します。

(参考)
対応するQGISがインストールされていない場合は、

```
sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable
sudo apt upgrade
sudo apt install qgis
```

でインストールが可能です。インストールするタイミングにより公開場所が変わっている可能性もあるため、確認の上導入して下さい。



2. QGIS (Pythonコンソールから使用)の起動
次のコマンドを順に実行して、QGIS を起動して下さい。はじめに、Processingを利用できるよう設定します。

```
export QT_QPA_PLATFORM=offscreen
python3
import sys
from qgis.core import (QgsApplication, QgsVectorLayer)

QgsApplication.setPrefixPath('/usr', True)
qgs = QgsApplication([], False)
qgs.initQgis()

sys.path.append('/usr/share/qgis/python/plugins')

import processing
from processing.core.Processing import Processing
Processing.initialize()
```

3. CityGMLの読み込み
次のコマンドを実行して、CityGMLをQGISのレイヤとして読み込んで下さい。

```
[レイヤ] = QgsVectorLayer([CityGMLファイルのパス], [レイヤ名], 'ogr')

(例) samplelayer = QgsVectorLayer('sample.gml', 'sample', 'ogr')
```


4. GeoJSONの保存設定
次のコマンドを実行して、CityGMLをQGISのレイヤとして読み込んで下さい。

```
params = { 
    'LAYERS' : [レイヤ],
    'CRS' : 'EPSG:4326',
    'OUTPUT' : [保存するGeoJSONファイルのパス]
}

(例)
params = { 
    'LAYERS' : samplelayer,
    'CRS' : 'EPSG:4326',
    'OUTPUT' : 'sample.geojson'
}
```

5. GeoJSONの保存
次のコマンドを実行して、GeoJSONファイルを保存して下さい。
```
processing.run('native:mergevectorlayers', params)
```

[保存するGeoJSONファイルのパス]で指定したディレクトリにGeoJSONファイルが保存されていれば、GeoJSON形式での保存は完了です。


6. QGIS (Pythonコンソールから使用)の終了
次のコマンドを実行して、QGIS (Pythonコンソールから使用)を終了して下さい。
```
exit()
```

同等の操作は、Ubuntuをデスクトップモードで起動した場合やWindows10にインストールしたQGISで行う場合にはGUI操作で行うことが可能です。また、QGISのGUIに用意された専用のPythonコンソールから行うことも可能です。


#### 地理空間情報データ変換ツールの利用
##### GMLからGeoJSONへの変換

1. 収集したzipファイル(GML)を展開します。
```
unzip -d [展開先の指定フォルダへのパス] [展開したいzipフォルダへのパス]
```

2. 展開したフォルダにはシェープファイルが格納されています。このファイルをGeoJSONへ変換します。
```
ogr2ogr -f GeoJSON [出力先のフォルダ] [変換したいshp形式のファイルへのパス]
```

##### GeoJSONからMVTへの変換

data_preparation_tool_mvt.shを実行して、GeoJSON形式のデータをMVTに変換します。

利用方法は

```
data_preparation_tool_mvt.sh [MVTを出力したいフォルダ名のパス] [作成したい最大のズームレベル] [MVTファイルに変更したいGeoJSONデータのパス]
```

です。

```
(利用例)
data_preparation_tool_mvt.sh ./output 13 ./input.geojson
```

(参考) 直接tippecanoeを実行する場合
tippecanoeでGeoJSON形式のデータをMVTに変換します。

```
tippecanoe -e [MVTを出力したいフォルダ名のパス] -pC -z[作成したい最大のズームレベル] -aN [MVTファイルに変更したいGeoJSONデータのパス]
```

#### 3次元建物データ変換ツールの利用
##### GeoJSONからMVTへの変換

data_preparation_tool_3d_mvt.shを実行して、GeoJSON形式のデータをMVTに変換します。

利用方法は

```
data_preparation_tool_3d_mvt.sh [作成したい最大のズームレベル] [MVTを出力したいフォルダ名のパス] [レイヤ名] [MVTファイルに変更したいGeoJSONデータのパス]
```

です。

```
(利用例)
data_preparation_tool_mvt.sh 13 ./output samplelayer ./input.json
```

(参考) 直接tippecanoeを実行する場合
tippecanoeでGeoJSON形式のデータをMVTに変換します。

```
tippecanoe -pC -ad -an -ps -z[作成したい最大のズームレベル] -e [MVTを出力したいフォルダ名のパス] -l [レイヤ名] -ai [MVTファイルに変更したいGeoJSONデータのパス]
```

※オプションpsをつけないと、建物が合成され、形が崩れて表示される箇所が発生するため、このオプションは必ず指定して下さい。

＜オプション一覧＞
- -e：出力フォルダの指定
- --no-tile-compression：ファイル圧縮の抑制
- -z：出力するズームレベルの指定
- -l：出力に使用するレイヤ名の指定
- -ai：IDの自動付番
- -ad：各ズームレベルから機能の一部を動的にドロップして、大きなタイルを500Kのサイズ制限未満に保ちます。
- -an：各ズームレベルから最小のフィーチャ（物理的に最小：最短の線または最小のポリゴン）を動的にドロップして、大きなタイルを500Kのサイズ制限未満に保ちます。
- -ps：線と多角形を単純化しないでください

オプションは下記のサイトを参考にして下さい。
[https://github.com/mapbox/tippecanoe#line-and-polygon-simplification](https://github.com/mapbox/tippecanoe)
[https://qiita.com/frogcat/items/dae6492c1fae17a9bc0d](https://qiita.com/frogcat/items/dae6492c1fae17a9bc0d)


#### GeoServerへのGeoTiffの登録
##### ワークスペースの準備
本システムで利用するワークスペースが未作成の場合は、予めワークスペースの作成を行います(図 41)。

![](media/ENVIRONMENT/image3.png)

図 41　ワークスペース作成

サイドメニューの「ワークスペース」から、「新規ワークスペース追加」でも同様にワークスペースを作成できます。

NameとネームスペースURIを設定し、送信をクリックします。NAMEとネームスペースURIは自由に設定してください(図 42)。

![](media/ENVIRONMENT/image4.png)

図 42　ワークスペース作成(入力)

サイドメニューの「ワークスペース」をクリックすると、ワークスペースの一覧が表示されるので、先ほど作成したワークスペースをクリックしてください。
ワークスペース編集のページに遷移するので、「WMTS」にチェックをつけて保存してください(図 43)。

![](media/ENVIRONMENT/image5.png)

図 43　ワークスペース作成(設定)


##### GeoTiffデータの登録
サイドメニューの「ストア」をクリックし、「ストア新規追加」をクリックしてください。
![](media/ENVIRONMENT/image6.png)

図 44　ワークスペース作成(設定)


新規データソースのページに遷移するので、ラスターデータソースに内にある「GeoTIFF」をクリックします。

![](media/ENVIRONMENT/image7.png)

図 45　ワークスペース作成(設定)


「GeoTIFF」をクリックすると、ラスターデータの追加のページに遷移します。「ワークスペース」を事前に作成したものを選択し、「データソース名」は任意に設定してください。「URL」には、tifデータが置いてあるディレクトリを指定し、保存してください。

例）file:/ファイルパス/\~.tif

![](media/ENVIRONMENT/image8.png)

図 46　ワークスペース作成(設定)


保存をクリックすると、新規レイヤの画面に遷移するので、「公開」をクリックしてください。

![](media/ENVIRONMENT/image9.png)

図 47　ワークスペース作成(設定)


「公開」をクリックすると、レイヤ編集ページに移動します。設定を変更せずに画面下の「保存」をクリックしてください。

![](media/ENVIRONMENT/image10.png)

図 48　ワークスペース作成(設定)


サイドメニューの「レイヤ」に移動すると、先ほど作成したレイヤが追加されています。

サイドメニューの「レイヤプレビュー」から作成されたレイヤの「OpenLayers」をクリックすると、以下のように追加したレイヤがWMTSで配信されているのが確認できます。

![](media/ENVIRONMENT/image11.png)

図 49　ワークスペース作成(設定)



##### レイヤのグループ化
複数のレイヤをひとつにまとめる場合は、サイドメニューの「レイヤグループ」をクリックし、「レイヤグループの新規追加」を選択してください。

![](media/ENVIRONMENT/image12.png)

図 410　ワークスペース作成(設定)


「レイヤグループの新規追加」をクリックすると、レイヤグループの画面に遷移するので、「ユーザ名」と「タイトル名」を任意で設定し、「ワークスペース」を先ほど作成したものを選択します。
![](media/ENVIRONMENT/image13.png)

図 411　ワークスペース作成(設定)


「レイヤ追加」をクリックすると、ポップアップが表示されるので、追加したレイヤを全て選択してください。

![](media/ENVIRONMENT/image14.png)

図 412　ワークスペース作成(設定)


「短径を生成」をクリックすると、追加されたレイヤの範囲を自動で読み取り、最小Xなどの項目にバウンディングボックスが生成されるので、一番下の保存をクリックし、設定を保存します。

![](media/ENVIRONMENT/image15.png)

図 413　ワークスペース作成(設定)


設定が完了したら、サイドメニューの「レイヤグループ」のレイヤグループ一覧に先ほどグループ化したレイヤがあるか確認します。

確認後、サイドメニューの「レイヤプレビュー」からグループ化したレイヤの「OpenLayers」をクリックすると、以下のように追加したレイヤがWMTSで配信されているのが確認できます。
![](media/ENVIRONMENT/image16.png)

図 414　ワークスペース作成(設定)



#### style.jsonの記述によるベクトルタイル地図のデザイン
タイルに対してstyle.jsonを記述して、ベクトルタイル地図のデザインを行います。サンプル記述や既存のベクトルタイルを参考にして、style.jsonを作成して下さい。また詳細については

[https://docs.mapbox.com/mapbox-gl-js/style-spec/](https://docs.mapbox.com/mapbox-gl-js/style-spec/)

を参考にして下さい。


##### style.jsonサンプル

```
{
    "version": 8,
"type": "overlay",
"format": "pbf",
    "glyphs":"https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    "sources": {
        "mvt": {
            "type": "vector",
            "tiles": [
                "https://tb-gis-web-dev.jgn-x.jp/storage/data/vectortile/1_a_3_2_tochi/style.json"
            ]
        }
    },

"layers": [
    {
        "id": "Lineex",
        "source": "mvt",
        "source-layer": "1_a_4_1_hinansisetu",
        "minzoom": "0",
        "maxzoom": "14",
        "type": "line",
        "paint": {
          "line-color": "#000000",
            "line-width": 1,
            "line-opacity": 1.0
        }
    },
        {
            "id": "line-1",
            "source": "mvt",
            "source-layer":"kaigansen",         
            "filter": ["==","C23_003","1"],
            "type":"symbol",
            "layout":
                {           
                    "symbol-placement": "point",
                    "text-allow-overlap": false,
                    "text-field":["literal","都道府県知事"],
                    "text-font":["NotoSansCJKjp-Regular"],
                    "text-anchor": "top",             
                    "text-rotation-alignment":"auto",
                    "text-pitch-alignment": "auto"
                },
            "paint": 
                {
                    "text-color":"rgba(0,0,0,1)",
                    "text-halo-color":"rgba(255,255,255,1)",
                    "text-halo-width":1
                }
        },
}
```

(サンプルの記述について)
「tiles」にstyle.jsonの場所を設定します
※サンプルにはラインとラベルの表示設定があります。

「layers」に表示用の設定を記述します
- id・・・任意の名称
- source-layer・・・geojsonのファイル名（拡張子抜き）
- type・・・主にline,polygon,circleなど種類があります。元データの形式に合わせます。
- filter・・・項目を追加すると、一定の条件の地物にのみスタイルが適用されます。サンプルの場合だと、地物の属性で、C23_005の値が1の地物にのみスタイルを適用することができます。

・ラベル
- symbol-placement・・・地物に対してラベルが表示される位置。
- text-allow-over-lap・・・他のラベルに重ねて表示させるかどうか。
- text-field・・・ラベルとして表示させる文字。
  - [“literal”, 愛知]・・愛知が表示される。
  - [“get”, C23_003]・・C23_003の値が表示される。
- text-rotation-alignment・・・ラベルの表示向き


作成したstyle.jsonはpbfフォルダとmetadata.jsonのある場所に保存しておきます。

## WebGISアプリケーション
### Mapbox
別途記載

### iTowns
#### テンプレートアプリケーションの設置
[TemplateWebGIS_iTowns](https://github.com/nict-testbed-dalab/TemplateWebGIS_iTowns)からdata、js、layers、test_itw、auth_config.json、index.htmlを取得し、

/var/www/html/itowns_template

へ配置して下さい。このディレクトリの内容が
![](media/ENVIRONMENT/image17.png)
となっていれば、正しく配置できています。この状態で、対応Webブラウザにより

[https://tb-gis-web.jgn-x.jp/itowns_template/](https://tb-gis-web.jgn-x.jp/itowns_template/)

へアクセスして、図 51のように地理情報が表示できれば設置は成功です。表示が成功しない場合は、環境構築の状況を確認して下さい。

![](media/ENVIRONMENT/image18.png)

図 51　テンプレートアプリケーションの初期画面


#### サンプルアプリケーションの設置
[UseCase_Examples/itowns_sample](https://github.com/nict-testbed-dalab/UseCase_Examples/tree/main/itowns_sample)を取得し、

/var/www/html/itowns_sample

へ配置して下さい。このディレクトリの内容が
![](media/ENVIRONMENT/image17.png)
となっていれば、正しく配置できています。この状態で、対応Webブラウザにより

[https://tb-gis-web.jgn-x.jp/itwons_sample/](https://tb-gis-web.jgn-x.jp/itwons_sample/)

へアクセスして、図 52のように地理情報が表示できれば設置は成功です。表示が成功しない場合は、環境構築の状況を確認して下さい。

![](media/ENVIRONMENT/image19.png)

図 52 サンプルアプリケーションの初期画面

#### (参考)iTownsのビルド環境も併せて構築する場合
テンプレートアプリケーションやサンプルアプリケーションを参考に独自のアプリケーションを開発する際、ベースとなっているiTownsのビルド環境も併せて構築すると、iTownsの公式サンプルによる学習を行いながら開発を進めることができます。

iTownsのビルド環境を構築する場合は下のURLを参考にして下さい。

iTownsリポジトリ
[https://github.com/iTowns/itowns](https://github.com/iTowns/itowns)

iTownsコーディングガイド
[https://github.com/iTowns/itowns/blob/master/CODING.md](https://github.com/iTowns/itowns/blob/master/CODING.md)

また、iTownsのバグ情報や開発の状況を知りたい場合は、次のURLを参考にして下さい。

iTowns issues
[https://github.com/iTowns/itowns/issues](https://github.com/iTowns/itowns/issues)

iTowns pull requests
[https://github.com/iTowns/itowns/pulls](https://github.com/iTowns/itowns/pulls)


