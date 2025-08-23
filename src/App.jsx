import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import SearchProfile from "./components/sections/SearchProfile";
import Watermark from "./components/Watermark";

function App() {
  const [hasResults, setHasResults] = useState(false);
  const [resetSearch, setResetSearch] = useState(0);

  const handleSearchAgain = () => {
    setHasResults(false);
    setResetSearch((prev) => prev + 1);
  };

  return (
    <Box>
      <Navbar hasResults={hasResults} onSearchAgain={handleSearchAgain} />
      <SearchProfile onResultsChange={setHasResults} resetTrigger={resetSearch} />
      <Watermark />
    </Box>
  );
}

export default App;
