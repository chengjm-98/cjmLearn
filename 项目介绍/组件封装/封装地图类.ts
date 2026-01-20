import {
  defaultMapOptions,
  MapDTEController,
  mapboxgl,
  MapDTEOptions,
} from "ys-dte";
import { Map_MarkerAddProp, Map_Perspective, MAP_HOVER_DIS_LEVEL } from ".";
import { action, makeObservable, observable } from "mobx";
import ReactDOM from "react-dom";
import { SimulationCloudLayer } from "../simulationcloud";
import { Map_Marker, Map_markersCache } from "./index.interface";
import MapboxDraw from "./draw/mapbox-gl-draw-esm.js";
import { MapDrawTool } from "./draw/MapDrawTool";

type MapDTEOptionsDraw = MapDTEOptions & {
  drawCk?: (e: any) => void;
};

export class CusMap extends MapDTEController {
  /**
   * 点位点击的popup
   */
  popUpClick: mapboxgl.Popup;
  /**
   * 点击事件的popup中存放的内容
   */
  popUpClickElement: JSX.Element | undefined;
  setPopupClickElement(e: JSX.Element | undefined) {
    this.popUpClickElement = e;
  }
  /**
   * 地图上所有的点位对象数组
   */
  markers: Map_markersCache[] = [];
  /**
   * 地图是否加载成功
   */
  isLoaded: boolean = false;
  /**
   * popUp的div挂载节点
   */
  popupNode: HTMLDivElement = document.createElement("div");

  /**
   * 地图当前的zoom层级
   */
  currZoom!: number;

  /**
   * 视角 2D|3D
   */
  perspective: Map_Perspective = "2D";
  setPerspective(e: Map_Perspective) {
    this.perspective = e;
  }

  /**
   * 正北偏角
   */
  bearing: number = 0;
  setBearing(e: number) {
    this.bearing = e;
  }

  /**
   * 倾斜角度
   */
  pitch: number = 0;
  setPitch(e: number) {
    this.pitch = e;
  }

  /**
   * 地图当前的zoom层级
   * @param e 层级
   */
  setCurrZoom(e: number) {
    this.currZoom = e;
  }
  /**
   * 关闭点击marker的弹窗
   */
  closePopupClick(): void {
    ReactDOM.unmountComponentAtNode(this.popupNode);
    this.popUpClick?.remove();
    this.popupNode?.remove();
    this.setPopupClickElement(undefined);
  }

  /**
   *  点击打点图片的位置
   */
  flyPoint: mapboxgl.Marker | undefined;
  setFlyPoint(e: mapboxgl.Marker) {
    this.flyPoint = e;
  }

  /**
   * 向地图中打点
   */
  addMarker2Map({ markerList }: Map_MarkerAddProp) {
    let _this = this;
    const needMark2Map = _this.getNeedMark2Map(markerList);
    console.log("needMark2Map", needMark2Map);
    needMark2Map.map((item) => {
      // marker点击、悬浮 事件对应的mapboxgl.popup对象
      let markerNode = document.createElement("div"),
        map_popup_click: mapboxgl.Popup,
        map_popup_hover: mapboxgl.Popup,
        popupNode_click = document.createElement("div"),
        popupNode_hover = document.createElement("div");
      // 渲染marker div 至地图上
      ReactDOM.render(item?.marker?.element, markerNode);
      const markerClick = (event) => {
        event.stopPropagation();
        event.preventDefault();

        _this.setFlyPoint(item);
        _this.fly2({
          center: [item.longitude, item.latitude],
          zoom: 16,
          pitch: 65,
          bearing: 0,
        });
        _this.closePopupClick();
        if (
          item?.clickPopupConf!.isPopupClick == undefined
            ? true
            : item?.clickPopupConf!.isPopupClick
        ) {
          map_popup_click.on("open", () => {
            // popup打开后去除当前hover产生的popup，并将其渲染在点击的node节点上
            map_popup_hover?.remove();
            ReactDOM.render(
              item?.clickPopupConf!.element as JSX.Element,
              popupNode_click,
            );
          });
          _this.popUpClick = map_popup_click
            .setLngLat([item.longitude, item.latitude])
            .setOffset(markerNode.offsetHeight)
            .addTo(_this);
          event.stopPropagation();
        } else {
          _this.setPopupClickElement(item?.clickPopupConf!.element);
        }
      };
      const markerMouseEnter = () => {
        if (map_popup_click?.isOpen() || _this.currZoom > MAP_HOVER_DIS_LEVEL) {
          // 如果当前的marker的点击事件触发了，就不再进行hover展示
          return;
        }
        map_popup_hover.on("open", () => {
          ReactDOM.render(item?.hoverElement as JSX.Element, popupNode_hover);
        });
        map_popup_hover
          .setLngLat([item.longitude, item.latitude])
          .setOffset(markerNode.offsetHeight)
          .addTo(_this);
      };
      const markerMouseleave = () => {
        map_popup_hover?.remove();
      };
      // 点击marker点位后的响应事件。渲染传入的弹窗
      if (item?.clickPopupConf) {
        map_popup_click = new mapboxgl.Popup({
          maxWidth: "none",
          closeButton: true,
        }).setDOMContent(popupNode_click);
        markerNode.addEventListener("click", markerClick, false);
      }
      // 鼠标浮动到maker后的响应事件
      if (item?.hoverElement) {
        map_popup_hover = new mapboxgl.Popup({
          maxWidth: "none",
        }).setDOMContent(popupNode_hover);
        markerNode.addEventListener("mouseenter", markerMouseEnter);
        markerNode.addEventListener("mouseleave", markerMouseleave);
      }
      const tmpMapMarker: mapboxgl.Marker = new mapboxgl.Marker({
        element: markerNode,
        anchor: "bottom",
      }).setLngLat([item.longitude, item.latitude]);
      tmpMapMarker.addTo(_this);
      // 清除当前点位占用dom 以及 时间监听
      const markerCleanUp = () => {
        tmpMapMarker.remove();
        markerNode.removeEventListener("click", markerClick);
        markerNode.removeEventListener("mouseenter", markerMouseEnter);
        markerNode.removeEventListener("mouseleave", markerMouseleave);
        popupNode_click.remove();
        popupNode_hover.remove();
        map_popup_hover?.remove();
        map_popup_click?.remove();
        ReactDOM.unmountComponentAtNode(markerNode);
        ReactDOM.unmountComponentAtNode(popupNode_hover);
        ReactDOM.unmountComponentAtNode(popupNode_click);
      };
      _this.markers.push({
        id: item?.id,
        node: markerNode,
        cleanUp: markerCleanUp,
        mapMarker: tmpMapMarker,
      });
    });
  }

  getNeedMark2Map(markerList: Map_Marker[]): Map_Marker[] {
    const _this = this;
    const needRemoveMarkers = _this.markers.filter(
      (marked) => !markerList.some((item) => item?.id === marked?.id),
    );
    for (let i = 0; i < _this.markers.length; i++) {
      // 检查是否在B中存在A[i]
      if (needRemoveMarkers.some((b) => b?.id === _this.markers[i]?.id)) {
        _this.markers[i].cleanUp();
        _this.markers.splice(i, 1); // 移除当前元素
        i--; // 调整索引，因为元素已被移除
      }
    }
    const needMark2Map = markerList.filter(
      (item) => !_this.markers.some((marked) => item?.id === marked?.id),
    );
    return needMark2Map;
  }
  _drawTool?: MapDrawTool;

  /**
   * 删除地图上的所有点位
   */
  removeAllMarker() {
    this.closePopupClick();
    this.markers.map((item) => item.cleanUp());
    this.markers = [];
  }

  /**
   * 地图是否加载成功_set
   * @param e
   */
  setIsLoaded(e: boolean) {
    this.isLoaded = e;
  }
  /**
   * 构造函数
   * @param mapDTEOptions
   */
  constructor(mapConf: MapDTEOptionsDraw) {
    super(
      Object.assign(defaultMapOptions, {
        ...mapConf,
        localFontFamily: "WeiRuanYaHei",
      }),
      (map) => {
        this._drawTool = new MapDrawTool({
          map: map as mapboxgl.Map,
          drawCk: mapConf.drawCk,
        });
        this.setIsLoaded(true);
        this.setCurrZoom((map as mapboxgl.Map).getZoom());
        (map as mapboxgl.Map)?.setTerrain({
          source: "mapbox-dem",
          exaggeration: 1,
        });
        // 指北 setBearing
        (map as mapboxgl.Map).on("bearing", (e) => {
          this.setBearing(e.target.getBearing());
        });
        (map as mapboxgl.Map).on("rotate", (e) => {
          this.setBearing(e.target.getBearing());
        });
        (map as mapboxgl.Map).on("pitch", (e) => {
          let currPitch = e.target.getPitch();
          this.setPitch(currPitch);
          this.setPerspective(currPitch > 5 ? "3D" : "2D");
        });
        (map as mapboxgl.Map).on("click", (e) => {
          let center = e.target.getCenter();
          let obj = {
            x: center.lng,
            y: center.lat,
            zoom: e.target.getZoom(),
            bearing: e.target.getBearing(),
            pitch: e.target.getPitch(),
          };
          console.log(
            "当前地图信息",
            e.target.getCenter(),
            "---",
            e.target.getZoom(),
            "---",
            e.target.getBearing(),
            "---",
            e.target.getPitch(),
          );
        });
        (map as mapboxgl.Map).on("zoomend", (e) => {
          this.setCurrZoom(e.target.getZoom());
        });
      },
    );
    makeObservable(this, {
      isLoaded: observable,
      currZoom: observable,
      setCurrZoom: action,
      setIsLoaded: action,
      popUpClickElement: observable,
      setPopupClickElement: action,
      perspective: observable,
      setPerspective: action,
      bearing: observable,
      pitch: observable,
    });
  }

  /**
   * 地图视角变化事件
   * @param options 视角变化选项
   */
  fly2(options: mapboxgl.FlyToOptions) {
    (this as mapboxgl.Map).flyTo({
      ...options, // 传递其他 flyTo 选项（如果有）
    });
  }
  /**
   * 销毁地图
   */
  dispose() {
    this.removeAllMarker();
    this.setIsLoaded(false);
    super.dispose();
  }

  removeLayerByIds(ids: string[]) {
    let _this = this as mapboxgl.Map;
    ids.map((id) => {
      if (_this.getLayer(id)) {
        _this.removeLayer(id);
      }
    });
  }
  isHaveLayerById(id): boolean {
    let _this = this as mapboxgl.Map;
    return _this.getLayer(id);
  }

  /**
   * 地图上添加结果云图
   * @param layer
   */
  addSimulationCloudLayer(layer: SimulationCloudLayer) {
    let _this = this as mapboxgl.Map;
    if (layer?.id && !_this.isHaveLayerById(layer.id)) {
      _this.addLayer(layer);
    }
  }

  /**
   * 控制地图图层显示隐藏
   */
  layerControlIsShow(layerId: string, isShow: boolean) {
    let _this = this as mapboxgl.Map;
    _this.getLayer(layerId) &&
      _this.setLayoutProperty(
        layerId,
        "visibility",
        isShow ? "visible" : "none",
      );
  }

  util_getMarkerScale(): number {
    if (!this) return 0;
    return 1 + (this.currZoom - 9) * 0.1; // Adjust this formula as needed
  }
}

export * from "./marker";
export * from "./index.interface";
export * from "./util";
export * from "./conf";
