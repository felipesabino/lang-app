import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="selection:bg-highlight">
      <Outlet />
    </div>
  );
};
