/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
type ButtonProps = {
  contend: string;
  onclick: () => void;
};
export function AppButton(props: ButtonProps) {
  const { contend, onclick } = props;
  return (
    <div role="button" className="primary-button" onClick={onclick}>
      <span className="small-dot button-inner-dot"></span>
      <span className="small-dot button-inner-dot"></span>
      <span className="small-dot button-inner-dot"></span>
      <span
        css={css`
          padding: 0 20px;
        `}
      >
        {contend}
      </span>
      <span className="small-dot button-inner-dot"></span>
      <span className="small-dot button-inner-dot"></span>
      <span className="small-dot button-inner-dot"></span>
    </div>
  );
}
