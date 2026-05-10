type TopAlertStripProps = {
  title: string;
  level: "critical" | "info";
};

export function TopAlertStrip({ title, level }: TopAlertStripProps) {
  return (
    <div
      className={`border-b px-5 py-3 text-sm font-medium sm:px-7 ${
        level === "critical"
          ? "border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
          : "border-sky-200/70 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200"
      }`}
    >
      {title}
    </div>
  );
}
