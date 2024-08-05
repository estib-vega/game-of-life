import Canvas from "./components/Canvas";

const CANVAS_SIZE = 600;
const NUM_OF_CELLS = 10;

function App() {
  return (
    <div className="dark w-full h-dvh bg-background fixed overflow-hidden">
      <div className="container h-full overflow-hidden flex flex-col">
        <header className="py-4">
          <h1 className="text-2xl text-primary">game of life 🌳</h1>
        </header>
        <main className="box-border h-full flex flex-col justify-center items-center">
          <Canvas size={CANVAS_SIZE} numberOfCells={NUM_OF_CELLS} />
        </main>
        <div>
          <footer className="py-4 text-center text-primary">hello</footer>
        </div>
      </div>
    </div>
  );
}

export default App;
