"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import ListAllFilms from "./components/listAllFilms";
import Navbar from "./components/navbar";
import ListWatchedFilms from "./components/listWatchedFilms";
import ListToSeeFilms from "./components/listToSeeFilms";
import ProfilInfo from "./components/profilInfo";
import MovieInfo from "./components/movieInfo";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<number | string>(0);
  const [refresh, setRefresh] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);

  const { data: session } = useSession();

  const tabList: Tab[] = [
    { id: 0, title: "Tout les films" },
    { id: 1, title: 'Films "Vus"', userOnly: true },
    { id: 2, title: 'Films "À Voir"', userOnly: true },
  ];

  useEffect(() => {
    if (currentMovieId) {
      setSelectedTab("movie");
    }
  }, [currentMovieId]);

  useEffect(() => {
    if (selectedTab !== "movie") {
      setCurrentMovieId(null);
    }
  }, [selectedTab]);

  return (
    <>
      <Navbar
        tabsList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <div className="py-16">
        <ListAllFilms user={!!session?.user} hidden={selectedTab !== 0} refresh={refresh} setRefresh={setRefresh} currentMovieId={currentMovieId} setCurrentMovieId={setCurrentMovieId} />
        <ListWatchedFilms hidden={selectedTab !== 1} refresh={refresh} setRefresh={setRefresh} currentMovieId={currentMovieId} setCurrentMovieId={setCurrentMovieId} />
        <ListToSeeFilms hidden={selectedTab !== 2} refresh={refresh} setRefresh={setRefresh} currentMovieId={currentMovieId} setCurrentMovieId={setCurrentMovieId} />
        <ProfilInfo hidden={selectedTab !== "profil"} refresh={refresh} setRefresh={setRefresh} currentMovieId={currentMovieId} setCurrentMovieId={setCurrentMovieId} />
        <MovieInfo hidden={selectedTab !== "movie"} refresh={refresh} setRefresh={setRefresh} currentMovieId={currentMovieId} setCurrentMovieId={setCurrentMovieId} />
      </div>
    </>
  );
}
