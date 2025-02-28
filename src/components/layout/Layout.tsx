
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on these routes
  const hideNavRoutes = ["/", "/login"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);
  
  const isAuthenticated = user?.isAuthenticated;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-16 pb-16">
        {children}
      </main>
      
      {isAuthenticated && !shouldHideNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
