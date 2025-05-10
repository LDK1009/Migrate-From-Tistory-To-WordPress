"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadTextShape } from "@tsparticles/shape-text";
import { loadBubblesPreset } from "@tsparticles/preset-bubbles";

// 텍스트 파티클 컴포넌트
const BubbleLayer = () => {
  // 파티클 초기화 상태
  const [init, setInit] = useState(false);

  // 마운트 시 파티클 초기화
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadTextShape(engine);
      await loadBubblesPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 입자 옵션 정의
  const particlesOptions = {
    shape: {
      type: "character",
      options: {
        character: [
          {
            value: ["🎉", "🎊", "🔥", "👍🏻", "💕", "❤", "🧡", "💛", "💚", "💙", "💜", "🤎"],
          },
        ],
      },
    },
    opacity: {
      value: { min: 0.5, max: 1 },
    },
    size: {
      value: { min: 10, max: 20 }, // 이모지 크기에 맞게 키우는 게 좋습니다
    },
    move: {
      speed: { min: 15, max: 30 }, // 속도를 더 빠르게 설정
    },
  };

  // 에미터 종류
  const emitterVariants = [
    {
      position: {
        x: 20,
        y: 100,
      },
    },
    {
      position: {
        x: 50,
        y: 100,
      },
    },
    {
      position: {
        x: 75,
        y: 100,
      },
    },
  ];

  // 에미터 옵션 정의
  const emittersOptions = emitterVariants.map((el) => {
    return {
      direction: "top",
      life: {
        count: 1,
        duration: 1.5, // 에미터 지속 시간
        delay: 0,
      },
      position: {
        x: el.position.x,
        y: el.position.y,
      },
      size: {
        width: 0,
        height: 0,
      },
      rate: {
        quantity: 1,
      },
    };
  });

  // 옵션 정의
  const customOptions = {
    preset: "bubbles",
    particles: particlesOptions,
    emitters: emittersOptions,
    background: {
      color: "transparent",
    },
  } as RecursivePartial<IOptions>;

  if (init) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
          pointerEvents: "none", // 이벤트 통과 설정
        }}
      >
        <Particles id="tsparticles" options={customOptions} />
      </div>
    );
  }

  return <></>;
};

export default BubbleLayer;
