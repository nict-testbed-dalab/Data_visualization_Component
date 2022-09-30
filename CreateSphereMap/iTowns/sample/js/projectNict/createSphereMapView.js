

class CreateSphereMapView {
  constructor(view, initBackGroundLayersFunc, GUITools = null) {
    // ライブラリ読み込み
    this.createSphereMap = new CreateSphereMap(view, initBackGroundLayersFunc, GUITools)

    //domの作成
    this.createDom();

    this.view = view;
    //イベントの登録
    this.setEvent(this.view);
  }

  //private
  //HTMLの作成
  createDom() {
    let body = document.body;

    let createSphereMapDom = document.createElement("div");
    createSphereMapDom.id = "createSphereMapDom";
    {
      //ボタン配置エリア
      let createSphereMapDom_buttonArea = document.createElement("div");
      createSphereMapDom_buttonArea.id = "createSphereMapDom_buttonArea";
      {
        let createSphereMapDom_ToggleShowBackGroundViewButton = document.createElement("a");
        createSphereMapDom_ToggleShowBackGroundViewButton.id = "createSphereMapDom_ToggleShowBackGroundViewButton";
        createSphereMapDom_ToggleShowBackGroundViewButton.classList.add("button");
        createSphereMapDom_ToggleShowBackGroundViewButton.innerHTML = "サブビュー表示/非表示"
        {

        }
        createSphereMapDom_buttonArea.appendChild(createSphereMapDom_ToggleShowBackGroundViewButton)

        let createSphereMapDom_CreateSphereMapButton = document.createElement("a");
        createSphereMapDom_CreateSphereMapButton.id = "createSphereMapDom_CreateSphereMapButton";
        createSphereMapDom_CreateSphereMapButton.classList.add("button");
        createSphereMapDom_CreateSphereMapButton.innerHTML = "スフィアマップ作製"
        {

        }
        createSphereMapDom_buttonArea.appendChild(createSphereMapDom_CreateSphereMapButton)

        let createSphereMapDom_SetCubeMapImageSizeButton = document.createElement("a");
        createSphereMapDom_SetCubeMapImageSizeButton.id = "createSphereMapDom_SetCubeMapImageSizeButton";
        createSphereMapDom_SetCubeMapImageSizeButton.classList.add("button")
        createSphereMapDom_SetCubeMapImageSizeButton.innerHTML = "キューブマップ画像サイズ"
        {
          let createSphereMapDom_CubeMapImageSizeInput = document.createElement("input");
          createSphereMapDom_CubeMapImageSizeInput.id = "createSphereMapDom_CubeMapImageSizeInput";
          createSphereMapDom_CubeMapImageSizeInput.classList.add("inputNum")
          {

          }
          createSphereMapDom_SetCubeMapImageSizeButton.appendChild(createSphereMapDom_CubeMapImageSizeInput)
        }
        createSphereMapDom_buttonArea.appendChild(createSphereMapDom_SetCubeMapImageSizeButton)

        let createSphereMapDom_DelayTimeButton = document.createElement("a");
        createSphereMapDom_DelayTimeButton.id = "createSphereMapDom_DelayTimeButton";
        createSphereMapDom_DelayTimeButton.classList.add("button")
        createSphereMapDom_DelayTimeButton.innerHTML = "次の処理への待ち時間(秒)"
        {
          let createSphereMapDom_DelayTimeInput = document.createElement("input");
          createSphereMapDom_DelayTimeInput.id = "createSphereMapDom_DelayTimeInput";
          createSphereMapDom_DelayTimeInput.classList.add("inputNum")
          createSphereMapDom_DelayTimeInput.value = 2;
          {

          }
          createSphereMapDom_DelayTimeButton.appendChild(createSphereMapDom_DelayTimeInput)
        }
        createSphereMapDom_buttonArea.appendChild(createSphereMapDom_DelayTimeButton)
      }
      createSphereMapDom.appendChild(createSphereMapDom_buttonArea)
    }
    body.appendChild(createSphereMapDom);
  }

  /////イベントの登録/////
  setEvent(view) {
    this.setToggleShowBackGroundView();
    this.setSizeChangeEvent();
    this.setCreateSphereMapEvent(view);
    this.setDelayTimeInputEvent();
  };


  setToggleShowBackGroundView() {
    let toggleButton = document.getElementById("createSphereMapDom_ToggleShowBackGroundViewButton");

    this.showBackGroundViewFlag = false;
    toggleButton.addEventListener("click", () => {
      this.createSphereMap.toggleShowBackGroundView();
    })
  };

  //画像サイズ変更時のイベント
  setSizeChangeEvent() {
    let sizeInput = document.getElementById("createSphereMapDom_CubeMapImageSizeInput");
    sizeInput.value = 512;
    sizeInput.onchange = () => {
      console.log("sizeChange")
      this.createSphereMap.setDisplaySize(sizeInput.value)
    };
  }

  //画像サイズ変更時のイベント
  setDelayTimeInputEvent() {
    let time = document.getElementById("createSphereMapDom_DelayTimeInput");
    time.value = 2;
    
    time.onchange = () => {
      console.log("setTimeOut")
      this.createSphereMap.setTimeOut(Number(time.value))
    };
  }

  //パノラマ画像の作成イベント
  setCreateSphereMapEvent(mainView) {
    let createSphereMapButton = document.getElementById("createSphereMapDom_CreateSphereMapButton");
    createSphereMapButton.addEventListener("click", () => {
      console.log("createSphereMap")
      this.createSphereMap.downloadSphereMap(mainView)
    });
  };
}
