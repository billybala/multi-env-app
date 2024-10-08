import ConnectionSection from "./components/ConnectionSection/ConnectionSection";
import './App.css';
import ButtonsSection from "./components/SectionButtons/ButtonsSection";
import { ContextProvider } from "./Context/ContextProvider";
import MoviesList from "./components/MoviesList/MoviesList";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <ConnectionSection />
        <ButtonsSection />
        <MoviesList />
      </ContextProvider>
    </div>
  );
}

export default App;
