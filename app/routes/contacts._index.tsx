import { db } from "~/db/index.server";
import type { Route } from "./+types/contacts._index";
import { data } from "react-router";

export const meta = ({}: Route.MetaArgs) => [{ title: "List Contacts" }];

export const loader = async ({}: Route.LoaderArgs) => {
  const users = await db.query.contactsTable.findMany();

  return data({ users });
};

export default function Page() {
  return (
    <div>
      <h2>List of contacts</h2>
    </div>
  );
}
