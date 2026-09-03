import { Outlet } from "react-router";
import { useApplyTheme } from "./hooks/useApplyTheme";
import "./style/sidebar.css";
function App() {
  useApplyTheme();
  return (
    <div>
      <Outlet />
      
    </div>
  );
}

export default App;
