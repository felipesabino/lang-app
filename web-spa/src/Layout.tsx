import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="selection:bg-highlight">
      Layout
      <div>
        <Outlet />
      </div>
    </div>
  );
};
