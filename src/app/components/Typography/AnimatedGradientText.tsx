import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export const AnimatedGradientText = ({
  className,
  children,
  ...props
}: DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>) => {
  return (
    <p
      {...props}
      className={twMerge(
        "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-3xl font-semibold text-transparent",
        className,
      )}
    >
      {children}
    </p>
  );
};
