import { Outlet } from "react-router";
import { useApplyTheme } from "./hooks/useApplyTheme";
import "./style/sidebar.css";
import "./style/ui-polish.css";
function App() {
  useApplyTheme();
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
