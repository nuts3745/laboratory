import { useState } from "react";
import "./App.css";
import { BinaryHeap } from "./BinaryHeap";
import { TopPage } from "./TopPage";
import { Footer } from "./components/ui/Footer";

function App() {
	const [isClicked, setIsClicked] = useState(false);
	return (
		<>
			{isClicked ? (
				<BinaryHeap isClicked={isClicked} setIsClicked={setIsClicked} />
			) : (
				<>
					<TopPage isClicked={isClicked} setIsClicked={setIsClicked} />
					<Footer />
				</>
			)}
		</>
	);
}

export default App;
