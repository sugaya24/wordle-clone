import { css } from '@emotion/react';

export const inputStyle = css`
  border-color: #888;
  @keyframes inputLetter {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  animation: inputLetter 0.1s linear;
`;

export const correctStyle = css`
  background-color: #538d4e;
  border: none;
  color: #fff;
  @keyframes correctLetter {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(180deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }
  animation: correctLetter 0.5s ease-out;
`;

export const presentStyle = css`
  background-color: #c9b458;
  border: none;
  color: #fff;
  @keyframes absentLetter {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(180deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }
  animation: absentLetter 0.5s ease-out;
`;

export const absentStyle = css`
  background-color: #565758;
  border: none;
  color: #fff;
  @keyframes absentLetter {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(180deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }
  animation: absentLetter 0.5s ease-out;
`;

export const jiggleStyle = css`
  animation: jiggle 0.3s linear;
  @keyframes jiggle {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-0.5rem, 0);
    }
    50% {
      transform: translate(0.5rem, 0);
    }
    75% {
      transform: translate(-0.5rem, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
}`;
