import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Variants define the visual style of a button.
 * Sizes control padding and font size.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

/**
 * Reusable Button component.
 *
 * Usage:
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Save Changes
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600",
      secondary:
        "bg-amber-600 text-white hover:bg-amber-500 focus:ring-amber-500",
      outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
      ghost:
        "text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            {/* Simple CSS spinner */}
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading…
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
