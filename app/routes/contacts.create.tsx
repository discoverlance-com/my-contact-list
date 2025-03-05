import type { Route } from "./+types/contacts.create";

export const meta = ({}: Route.MetaArgs) => [{ title: "Create Contact" }];

export default function Page() {
  return (
    <div>
      <h2>Create Contact</h2>
    </div>
  );
}
