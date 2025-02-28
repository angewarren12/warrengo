
import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { 
  Menu, X, ChevronDown, LogOut, LayoutDashboard, 
  Users, CreditCard, BarChart2, Settings, HelpCircle, AlertTriangle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/admin");
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté du panel administrateur"
    });
  };

  // Sections du menu d'administration
  const menuSections = [
    {
      title: "Principal",
      items: [
        { name: "Tableau de bord", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard" },
        { name: "Utilisateurs", icon: <Users size={18} />, path: "/admin/users" },
        { name: "Transactions", icon: <CreditCard size={18} />, path: "/admin/transactions" },
      ]
    },
    {
      title: "Rapports",
      items: [
        { name: "Statistiques", icon: <BarChart2 size={18} />, path: "/admin/statistics" },
        { name: "Alertes", icon: <AlertTriangle size={18} />, path: "/admin/alerts" },
      ]
    },
    {
      title: "Administration",
      items: [
        { name: "Paramètres", icon: <Settings size={18} />, path: "/admin/settings" },
        { name: "Support", icon: <HelpCircle size={18} />, path: "/admin/support" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop) */}
      <aside className={`fixed inset-y-0 z-50 flex-shrink-0 w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>
        {/* En-tête du Sidebar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <h1 className="font-semibold text-lg">WarrenGo Admin</h1>
          </div>
          <button 
            className="md:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenu du Sidebar */}
        <div className="py-4 px-2 overflow-y-auto">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="mb-2 px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={item.path}
                      className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3 text-sidebar-foreground/70">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer du Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-semibold">{user?.phoneNumber?.substring(0, 2) || "AD"}</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.phoneNumber || "Admin"}</p>
                <p className="text-xs text-sidebar-foreground/60">Administrateur</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="h-8 w-8 rounded-full hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* En-tête du contenu */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-30">
          <button 
            className="md:hidden" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center ml-auto space-x-4">
            {/* User Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors">
                {user?.phoneNumber || "Admin"}
                <ChevronDown size={16} />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-md shadow-lg hidden group-hover:block z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium">Profil d'administrateur</p>
                  <p className="text-xs text-muted-foreground">Accès complet</p>
                </div>
                <Link 
                  to="/admin/settings" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  Paramètres
                </Link>
                <Link 
                  to="/" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  App Client
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay pour fermer le menu sur mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
