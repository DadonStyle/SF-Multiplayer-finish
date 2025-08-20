import { GamePage } from "./pages/game/GamePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <GamePage />
    </ErrorBoundary>
  );
}

export default App;
