
import React from "react";
import { Link } from "react-router-dom";
import { TranslateText } from "../translation/TranslateText";

interface TagButtonProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  path: string;
  currentLanguage: string;
  desc?: string;
  "data-testid"?: string;
}

export function TagButton({
  name,
  isActive,
  onClick,
  path,
  currentLanguage,
  desc,
  "data-testid": dataTestId,
}: TagButtonProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`
        inline-flex flex-col items-center justify-center px-2 xs:px-3 py-1.5
        rounded-2xl min-w-[58px] flex-shrink-0
        border-[2.5px] border-solid
        ${isActive
          ? "bg-[#347EFF] border-[#347EFF] text-white font-extrabold shadow-md hover:bg-[#2056AA] hover:border-[#2056AA]"
          : "bg-gray-50 border-gray-200 text-gray-800 hover:text-[#347EFF] hover:border-[#347EFF] hover:bg-blue-50"}
        transition-all duration-200 text-xs sm:text-base
        shadow-sm font-medium tracking-tight text-center
        mb-0.5
      `}
      data-testid={dataTestId}
      style={{ fontFamily: `Pretendard, Noto Sans KR, Inter, sans-serif`, letterSpacing: '-0.01em' }}
    >
      <TranslateText text={name} language={currentLanguage} />
      {desc && (
        <span className="text-[10px] hidden xs:inline-block text-gray-400 mt-0.5 font-normal">
          {desc}
        </span>
      )}
    </Link>
  );
}
