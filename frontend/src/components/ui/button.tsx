import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-40 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-dark text-white hover:bg-primary shadow-xl shadow-dark/5 hover:shadow-primary/20",
        destructive: "bg-destructive text-white hover:opacity-90 shadow-lg shadow-destructive/10",
        outline: "border-2 border-dark/10 bg-transparent text-dark hover:bg-dark hover:text-white hover:border-dark",
        secondary: "bg-accent/20 text-dark hover:bg-accent/40",
        ghost: "hover:bg-dark/5 text-dark",
        link: "text-primary underline-offset-4 hover:underline lowercase tracking-normal font-bold",
      },
      size: {
        default: "h-14 px-10",
        sm: "h-10 px-6",
        lg: "h-16 px-12 text-xs tracking-[0.3em]",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
