export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className={`text-sm font-bold tracking-wide ${light ? "text-ember-300" : "text-ember-500"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-display text-3xl leading-tight md:text-4xl ${
          light ? "text-white" : "text-iron-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed md:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-ash-200" : "text-iron-700"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
