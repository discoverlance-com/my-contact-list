import type { Route } from "./+types/contacts._index";

export const meta = ({}: Route.MetaArgs) => [{ title: "List Contacts" }];

export default function Page() {
  return (
    <div>
      <h2>List of contacts</h2>
    </div>
  );
}
