export function CustomLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      {/* Your SVG paths here */}
      <path d="M2 22L12 2l10 20H2z" />
    </svg>
  );
}
