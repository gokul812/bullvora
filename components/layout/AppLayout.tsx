import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen hero-gradient">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-5">
          {children}
        </div>
      </main>
    </div>
  );
}
