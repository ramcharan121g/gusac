import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30",
        destructive:
          "bg-red-600 text-white shadow-md shadow-red-500/20 hover:bg-red-500 hover:shadow-red-500/30",
        outline:
          "border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:bg-slate-800 hover:text-white hover:border-slate-600",
        secondary:
          "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700",
        ghost:
          "text-slate-300 hover:bg-slate-800/80 hover:text-white",
        link:
          "text-blue-400 underline-offset-4 hover:underline",
        gold:
          "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/25 hover:from-yellow-300 hover:to-amber-300 hover:shadow-yellow-500/40",
        glow:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-indigo-500",
        danger:
          "bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/50 hover:text-red-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm font-semibold",
        xl: "h-12 rounded-xl px-8 text-base font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
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
