"use client"

import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <>
      <div className="max-w-[1000px] h-screen mx-auto flex justify-center items-center flex-col gap-2">
        <h1 className="text-8pxl uppercase font-black text-center mb-4">NEXT AUTH</h1>
        <div className="flex items-center gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 rounded-md p-3" onClick={() => signIn("google")}>
            Se connecter avec Google
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 rounded-md p-3" onClick={() => signIn("github")}>
            Se connecter avec GitHub
          </button>
        </div>
      </div>
    </>
  );
}
