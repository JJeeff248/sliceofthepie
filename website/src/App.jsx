import "./App.css";
import Header from "./components/Header";
import Body from "./components/Body";
import { Account } from "./Account";

function App() {
    return (
        <Account>
            <Header />
            <Body />
        </Account>
    );
}

export default App;
