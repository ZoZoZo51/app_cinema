"use client"

import { useState } from "react";
import ListAllFilms from "./components/listAllFilms";
import Navbar from "./components/navbar";
import ListWatchedFilms from "./components/listWatchedFilms";
import ListToSeeFilms from "./components/listToSeeFilms";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [refresh, setRefresh] = useState(false);
  const tabList: Tab[] =[
    { id: 0, title: 'Tout les films'},
    { id: 1, title: 'Films "Vus"', userOnly: true},
    { id: 2, title: 'Films "À Voir"', userOnly: true},
  ];

  return (
    <>
      <Navbar tabsList={tabList} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="py-16">
        <ListAllFilms hidden={selectedTab !== 0} refresh={refresh} setRefresh={setRefresh} />
        <ListWatchedFilms hidden={selectedTab !== 1} refresh={refresh} setRefresh={setRefresh} />
        <ListToSeeFilms hidden={selectedTab !== 2} refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
}
