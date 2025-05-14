import Image from "next/image";
import { signOut, useSession } from "next-auth/react"

import ConnectionButton from "./connexionButton";
import { useEffect, useState } from "react";

interface Props {
  tabsList: Tab[]
  selectedTab: number | string
  setSelectedTab: (tabId: number | string) => void
}

const Navbar = (props: Props) => {
  const { data: session} = useSession()

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!session);
  }, [session]);

  return (
    <nav className="bg-gray-800 fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* Menu open icon */}
              <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* Menu close icon */}
              <svg className="hidden w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {
                  props.tabsList.map((tab) => {
                    if (tab.userOnly && !isConnected)
                      return;
                    return (<button
                      key={tab.id}
                      onClick={() => props.setSelectedTab(tab.id)}
                      className={`rounded-md ${props.selectedTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 text-lg font-medium text-white`}
                    >
                      {tab.title}
                    </button>)
                  })
                }
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile part */}
            <div className="relative ml-3">
              {isConnected ? <div className="flex flex-row items-center"  onClick={() => props.setSelectedTab("profil")}>
                <div className="text-gray-200 mx-4">{session?.user?.name}</div>
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                  id="user-menu-button"
                >
                  <Image
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    width={50}
                    height={50}
                    alt="profile picture"
                  />
                </button>
                <button onClick={() => signOut()} className="bg-red-300 hover:bg-red-500 rounded-md ml-8 p-3">
                  Déconnexion
                </button>
              </div>
              : <div>
                <ConnectionButton type="google" title="Connexion Google" />
                <ConnectionButton type="github" title="Connexion GitHub" />
              </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <a
            href="#"
            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
            aria-current="page"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Team
          </a>
          <a
            href="#"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Projects
          </a>
          <a
            href="#"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Calendar
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
