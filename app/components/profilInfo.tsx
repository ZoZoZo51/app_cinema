"use client";

import { useEffect, useState } from "react";

const ProfileInfo = (props: TabProps) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/info-user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateProfile = async () => {
    if (!user) return;

    const res = await fetch("/api/user/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage("✅ Profil mis à jour !");
      props.setRefresh(!props.refresh);
    } else {
      alert(data.error || "Erreur inconnue");
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Chargement du profil...</p>;
  }

  if (!user) {
    return <p className="p-4 text-red-500">Impossible de charger le profil.</p>;
  }

  return (
    <div className={`max-w-md mx-auto mt-16 p-6 bg-white rounded shadow ${props.hidden ? "hidden" : ""}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Mon profil</h1>

      <label className="block mb-2 text-sm font-medium text-gray-700">Nom d&apos;Utilisateur</label>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 border rounded"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="w-full mb-6 px-4 py-2 border rounded bg-gray-200 text-gray-500 cursor-not-allowed"
        value={user.email}
        readOnly
      />

      <button
        onClick={updateProfile}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Enregistrer
      </button>

      {successMessage && <p className="mt-4 text-green-600 text-sm text-center">{successMessage}</p>}
    </div>
  );
}
export default ProfileInfo;
