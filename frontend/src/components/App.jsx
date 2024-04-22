// App.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import ServerList from "./ServerList";
import Header from "./Header";
import Stats from "./Stats";

function App() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  return (
    <div>
      <Navbar />
      <Header onSearchChange={handleSearchChange} />
      <Stats />
      <ServerList searchValue={searchValue} />
    </div>
  );
}

export default App;
