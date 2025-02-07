import { Outlet } from "react-router";

export default function Page() {
  return (
    <div>
      <h1>Contacts</h1>

      <Outlet />
    </div>
  );
}
