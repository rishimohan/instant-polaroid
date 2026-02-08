import { cn } from "@/lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm",
    outline:
      "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900",
    ghost: "hover:bg-neutral-100 text-neutral-700",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export { Button };
