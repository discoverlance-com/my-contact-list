import type { Route } from "./+types/contacts._index";

export const meta = ({}: Route.MetaArgs) => [{ title: "List Contacts" }];

export default function Page() {
  return (
    <div className="text-center">
      <p className="text-xl text-muted-foreground">
        Please select a contact to view details
      </p>
    </div>
  );
}
