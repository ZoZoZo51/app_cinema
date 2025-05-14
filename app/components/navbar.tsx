import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ConnectionButton from "./connexionButton";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  tabsList: Tab[];
  selectedTab: number | string;
  setSelectedTab: (tabId: number | string) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

interface User {
  name: string;
  email: string;
}

const Navbar = (props: Props) => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/info-user");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Erreur de récupération de l'utilisateur :", error);
    }
  };

  useEffect(() => {
    setIsConnected(!!session);
    if (session) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [session, props.refresh]);

  return (
    <nav className="bg-gray-800 fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {props.tabsList.map((tab) => {
                  if (tab.userOnly && !isConnected) return null;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => props.setSelectedTab(tab.id)}
                      className={`rounded-md ${props.selectedTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 text-lg font-medium`}
                    >
                      {tab.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className="relative ml-3">
              {isConnected && user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => props.setSelectedTab("profil")}
                    className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                  >
                    <FaUserCircle className="w-6 h-6 text-white" />
                    <span>{user.name}</span>
                  </button>

                  <button
                    onClick={() => signOut()}
                    className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div>
                  <ConnectionButton type="google" title="Connexion Google" />
                  <ConnectionButton type="github" title="Connexion GitHub" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
