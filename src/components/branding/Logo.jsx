import "./Logo.css";

const markSources = {
  light: "/branding/forge-mark-light.svg",
  dark: "/branding/forge-mark-dark.svg",
};

function Logo({ variant = "horizontal", theme = "auto", size = "md", decorative = false, className = "" }) {
  const resolvedTheme = theme === "auto" ? "dark" : theme;
  const markSource = markSources[resolvedTheme] || "/branding/forge-mark.svg";
  const classes = ["bf-logo", `bf-logo--${variant}`, `bf-logo--${size}`, `bf-logo--${resolvedTheme}`, className].filter(Boolean).join(" ");

  if (variant === "mark") {
    return <img className={classes} src={markSource} alt={decorative ? "" : "BudgetForge"} aria-hidden={decorative || undefined} />;
  }

  if (resolvedTheme === "light") {
    return <img className={classes} src="/branding/budgetforge-horizontal.svg" alt={decorative ? "" : "BudgetForge"} aria-hidden={decorative || undefined} />;
  }

  return <span className={classes} aria-label={decorative ? undefined : "BudgetForge"} aria-hidden={decorative || undefined}><img src={markSource} alt="" aria-hidden="true" /><span className="bf-logo__wordmark" aria-hidden="true">BudgetForge</span></span>;
}

export default Logo;
