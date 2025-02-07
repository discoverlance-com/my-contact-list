import type { Route } from "./+types/contacts.create";

export const meta = ({}: Route.MetaArgs) => [{ title: "Create Contact" }];

export default function Page() {
  return (
    <div>
      <h1>Create Contact</h1>
    </div>
  );
}
