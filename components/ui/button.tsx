import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const styles = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 shadow-soft",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100",
  outline:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        styles[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
