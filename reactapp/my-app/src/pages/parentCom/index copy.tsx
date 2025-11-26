import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "antd";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #00aaff;
  background-size: cover;
  background-position: center;
`;

interface BarProps {
  isPlaying: boolean;
  targetBottom: string;
}

const Bar = styled.div<BarProps>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  background: rgba(186, 185, 185, 1);
  bottom: ${({ targetBottom }) => targetBottom + "%"}; /* 动态底部位置 */
  top: 20%;
  transition: bottom 2s linear; /* 使用 transition 动画 */
`;

const ButtonBar = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
`;

const Btn = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`;

const AnimatedBarPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [targetPosition, setTargetPosition] = useState<string>("40"); // 默认目标位置 40%

  // 更新目标位置
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("输入input", e.target.value);
    setTargetPosition(e.target.value);
  };

  const handlePlay = () => {
    setIsPlaying(true); // 设置为播放
  };

  const handleReplay = () => {
    setIsPlaying(false); // 停止动画
    setAnimationKey((k) => k + 1); // 重新触发组件渲染
    setTimeout(() => setIsPlaying(true), 50); // 立即播放动画
  };

  const handleReset = () => {
    setIsPlaying(false); // 停止动画
    setAnimationKey((k) => k + 1); // 强制重新渲染组件
  };

  return (
    <PageWrapper>
      <Bar
        key={animationKey}
        isPlaying={isPlaying}
        targetBottom={targetPosition} // 动态传递目标位置
      />

      <ButtonBar>
        <Btn onClick={handlePlay}>播放</Btn>
        <Btn onClick={handleReplay}>重新播放</Btn>
        <Btn onClick={handleReset}>复位</Btn>
      </ButtonBar>

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <label>目标位置: </label>
        <Input
          type="number"
          value={targetPosition}
          onChange={handlePositionChange}
          min="0"
          max="100"
        />
        <span>%</span>
      </div>
    </PageWrapper>
  );
};

export default AnimatedBarPage;
