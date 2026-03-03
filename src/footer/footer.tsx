import type { FooterProps } from "./footer";

import headerMobileIcon from "../assets/headerMobile.svg";

export default function Footer({ title = "Movie" }: FooterProps) {
  return (
    <footer className="mt-0 h-[120px] w-full overflow-y-hidden pb-6">
      <div className="w-full border-t border-[color:var(--Neutral-800,_#252B37)]" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mt-[25.5px] flex items-start gap-4">
          <img
            src={headerMobileIcon}
            alt=""
            aria-hidden="true"
            className="block h-7 w-7"
          />

          <span className="text-center text-[19.91px] font-semibold leading-[24.89px] tracking-[-0.04em] text-(--Neutral-25) [font-family:var(--font-family-display)]">
            {title}
          </span>
        </div>

        <p className="mt-[21.5px] mb-0 text-xs font-normal leading-4 tracking-normal text-[#535862] [font-family:var(--font-family-body)]">
          Copyright ©2025 Movie Explorer
        </p>
      </div>
    </footer>
  );
}
