"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import ListAllFilms from "./components/listAllFilms";
import Navbar from "./components/navbar";


export default function Home() {
  const { data: session} = useSession()
  if (session)
    console.log(session)

  return (
    <>
      <Navbar />
      <div className="mx-auto flex justify-center items-center flex-col gap-2">
        { session ? <><p className="m-4">Vous êtes connecté en tant que : {session.user?.name}</p><button onClick={async () => await signOut()}>Déconnexion</button></> : <p className="mb-4">Déconnecté</p>}
        <div className="flex items-center gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 rounded-md p-3" onClick={async () => await signIn("google")}>
            Se connecter avec Google
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 rounded-md p-3" onClick={async () => await signIn("github")}>
            Se connecter avec GitHub
          </button>
        </div>
        <ListAllFilms />
      </div>
    </>
  );
}
