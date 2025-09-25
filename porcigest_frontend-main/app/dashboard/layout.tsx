import Header from "../ui/dashboard/Header";
import NavBar from "../ui/dashboard/NavBar"
import NavBarMobile from '../ui/dashboard/NavBarMobile';
import ProtectedRoute from "../../src/components/ProtectedRoute";

export default function LayoutDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Header />
      <NavBar/>
      <main className="md:max-w-(--widthApp) mx-auto">{children}</main>
    </ProtectedRoute>
  );
}