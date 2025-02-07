import type { Route } from "./+types/_index";

export const meta = ({}: Route.MetaArgs) => [{ title: "Homepage" }];

export default function Page() {
  return (
    <div>
      <h1>Homepage</h1>
    </div>
  );
}
