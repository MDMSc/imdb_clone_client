import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import FormComponent from "./components/FormComponent";
import LoginForm from "./components/LoginForm";
import { useSelector } from "react-redux";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/home" /> : <LoginForm />}
          exact
        />
        <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/add-movie"
          element={isAuth ? <FormComponent type="add" /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-movie/:_id"
          element={isAuth ? <FormComponent type="edit" /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
