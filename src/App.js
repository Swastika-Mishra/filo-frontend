import "./App.css";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import PersistLogin from "./componenets/PersistLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<PersistLogin />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
