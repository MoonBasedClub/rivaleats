import "../globals.css";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-cream min-h-screen">{children}</div>;
}
