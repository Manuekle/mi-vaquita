import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-full border-0 bg-accent/5 px-6 py-2 text-base font-black uppercase tracking-widest ring-1 ring-transparent transition-all duration-300 placeholder:text-dark/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
