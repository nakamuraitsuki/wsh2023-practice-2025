import { css } from '@emotion/css';

export const container = () => css`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const inner = ({ width }: { width: number | undefined }) => css`
  margin: 0 auto;
  width: ${width}px;
`;
