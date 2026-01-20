/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-11-27 10:29:19
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-20 13:46:21
 * @FilePath: /frontend/src/components/layer/map/marker/marker.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { observer } from 'mobx-react-lite';
import GlobalStore from '@/store';
import { MAP_HOVER_DIS_LEVEL } from '../conf';
import styled from 'styled-components';
import { CustomRainStepModalContent } from '@/pages/YYFP/components';
import { useEffect } from 'react';
interface Marker_IMGProp {
  imgUrl: string;
  width?: number;
  height?: number;
  titleJsx?: JSX.Element;
  isAlwaysShowTitle?: boolean;
  isJump?: boolean;
  angle?: number;
  lineLength?: number;
  status?: number;
  ishavecover?: boolean;
  name?: string;
}

/**
 *
 */
const Marker_IMG: React.FC<Marker_IMGProp> = observer(
  ({
    imgUrl,
    width = 30,
    height = 30,
    isAlwaysShowTitle = false,
    titleJsx = undefined,
    isJump = false,
    angle = 90,
    lineLength = 40,
    status = 1,
    ishavecover,
    name = ''
  }) => {
    useEffect(() => {
      console.log('奇怪', name, ishavecover);
    }, [ishavecover, name]);
    return (
      <div
        className={[
          'cus-map-marker-outer animate__animated animate__bounceIn',
          isJump ? 'jump' : ''
        ].join(' ')}>
        {(GlobalStore.cusMap!.currZoom > MAP_HOVER_DIS_LEVEL ||
          isAlwaysShowTitle) &&
          titleJsx}
        {(GlobalStore.cusMap!.currZoom > MAP_HOVER_DIS_LEVEL ||
          isAlwaysShowTitle) &&
          ishavecover && <LineWrapper angle={angle} lineLength={lineLength} />}

        <img
          src={imgUrl}
          style={{
            width: `${width * GlobalStore.cusMap!.util_getMarkerScale()}rem`,
            height: `${
              height * GlobalStore.cusMap!.util_getMarkerScale() || 10
            }rem`,
            transform: `translateZ(${
              GlobalStore.cusMap!.util_getMarkerScale() - 1
            })`,
            transition: 'all 200ms',
            zIndex: 100
          }}
        />
      </div>
    );
  }
);

export { Marker_IMG };

const LineWrapper = styled.div<{
  angle: number;
  lineLength: number;
}>`
  position: absolute;
  left: 50%;
  top: ${({ lineLength }) => -lineLength}px;
  z-index: 10;
  width: 0;
  height: ${({ lineLength }) => lineLength}px;

  border-left: 1px dotted #fff;

  transform-origin: bottom center;
  transform: rotate(${({ angle }) => angle}deg);

  pointer-events: none;
`;

// 然后还可以封装一个hover组件，还可以通过计算角度来实现重合展示点位的label的展示