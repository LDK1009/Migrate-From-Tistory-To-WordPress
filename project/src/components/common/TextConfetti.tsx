"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadConfettiPreset } from "@tsparticles/preset-confetti";
import { loadTextShape } from "@tsparticles/shape-text";

type TsParticlePropsType = {
  particle: particleOptionsType;
  emitters: emitterOptionsType[];
};

// 파티클 옵션 타입
type particleOptionsType = {
  text: string;
  size: [number, number];
  speed: [number, number];
};

// 에미터 옵션 타입
type emitterOptionsType = {
  direction: "none" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left";
  position: "center" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left";
  repeatCount: number;
  duration: number | "infinity";
  delay: number;
  particleQuantity: number;
};

// 텍스트 파티클 컴포넌트
const TextConfetti = ({ particle, emitters }: TsParticlePropsType) => {
  // 파티클 초기화 상태
  const [init, setInit] = useState(false);

  // 마운트 시 파티클 초기화
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadTextShape(engine); // ✅ 문자(shape: character) 지원 추가
      await loadConfettiPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 에미터 포지션 프롭스 포맷 변환
  const formattedEmitterPosition = emitters.map((el) => {
    switch (el.position) {
      case "center":
        return { x: 50, y: 50 };
      case "top":
        return { x: 50, y: 0 };
      case "top-right":
        return { x: 100, y: 0 };
      case "right":
        return { x: 100, y: 50 };
      case "bottom-right":
        return { x: 100, y: 100 };
      case "bottom":
        return { x: 50, y: 100 };
      case "bottom-left":
        return { x: 0, y: 100 };
      case "left":
        return { x: 0, y: 50 };
      case "top-left":
        return { x: 0, y: 0 };
    }
  });

  // 입자 옵션 정의
  const particlesOptions = {
    shape: {
      type: "character",
      options: {
        character: [
          {
            value: particle.text,
          },
        ],
      },
    },
    size: {
      value: { min: particle.size[0], max: particle.size[1] }, // 이모지 크기에 맞게 키우는 게 좋습니다
    },
    move: {
      enable: true,
      direction: "top",
      speed: { min: particle.speed[0], max: particle.speed[1] },
    },
  };

  // 에미터 관련 설정
  const emittersOptions = emitters.map((el, index) => {
    return {
      direction: el.direction,
      life: {
        count: el.repeatCount, // 반복 횟수(0.1초 마다 생성 10번 반복)
        duration: el.duration === "infinity" ? 0 : el.duration, // 에미터 지속 시간
        delay: el.delay,
      },
      position: formattedEmitterPosition[index],
      size: {
        width: 0,
        height: 0,
      },
      rate: {
        quantity: el.particleQuantity,
      },
    };
  });

  // 옵션 정의
  const customOptions = {
    preset: "confetti",
    particles: particlesOptions,
    emitters: emittersOptions,
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

export default TextConfetti;
