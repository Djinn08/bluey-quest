export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-violet-50 via-sky-50 to-orange-50">
      {children}
    </div>
  );
}
