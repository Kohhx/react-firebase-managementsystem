import "./App.css";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Main from "./pages/Main";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Create from "./pages/Create";
import Project from "./pages/Project";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import PhotoList from "./pages/PhotoList";
import SidebarLayout from "./layout/SidebarLayout";
import CalendarPage from "./pages/CalendarPage";
import Quiz from "./pages/Quiz";
import EditorPage from "./pages/EditorPage";

function App() {
  const { authReady, user } = useAuthContext();
  console.log(user);
  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {authReady && (
        <Router>
          {/* <Navbar /> */}
          {/* {user && <Sidebar />} */}
          {/* <Navbar /> */}
          <div className="">
            <Routes>
              <Route
                path="/"
                element={
                  !user ? (
                    <Navigate to="/Login" />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
               <Route
                  path="/signup"
                  element={user ? <Navigate to="/dashboard" /> : <Signup />}
                />

              <Route element={<SidebarLayout />}>
                <Route path="/xxx" element={<Dashboard />} />
                <Route
                  path="/gallery"
                  element={user ? <PhotoList /> : <Navigate to="/Login" />}
                />
                <Route
                  path="/calendar"
                  element={user ? <CalendarPage /> : <Navigate to="/Login" />}
                />

                <Route
                  path="/dashboard"
                  element={user ? <Dashboard /> : <Navigate to="/Login" />}
                />
                  <Route
                  path="/quiz"
                  element={user ? <Quiz /> : <Navigate to="/Login" />}
                />
                  <Route
                  path="/editor"
                  element={user ? <EditorPage /> : <Navigate to="/Login" />}
                />
                <Route
                  path="/create"
                  element={user ? <Create /> : <Navigate to="/Login" />}
                />
                <Route
                  path="/project/:id"
                  element={user ? <Project /> : <Navigate to="/Login" />}
                />
              </Route>
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
