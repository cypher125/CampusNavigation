import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  rounded?: "default" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
}

export function Button({
  className,
  children,
  variant = "default",
  size = "default",
  rounded = "default",
  shadow = "none",
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  // Variant styles
  const variantStyles = {
    default: "bg-[var(--yabatech-green)] text-white hover:bg-[var(--yabatech-green)]/90",
    outline: "border border-gray-200 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    link: "text-[var(--yabatech-green)] underline-offset-4 hover:underline",
  };

  // Size styles
  const sizeStyles = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  // Rounded styles
  const roundedStyles = {
    default: "rounded-md",
    full: "rounded-full",
  };

  // Shadow styles
  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        shadowStyles[shadow],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
