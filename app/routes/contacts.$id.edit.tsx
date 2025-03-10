import { data } from "react-router";
import type { Route } from "./+types/contacts.$id.edit";
import { db } from "~/db/index.server";
import { eq } from "drizzle-orm";
import { contactsTable } from "~/db/schema";
import { invariantResponse } from "@epic-web/invariant";

function checkIfNumber(value: unknown) {
  const number = Number(value);
  if (isNaN(number)) {
    return false;
  }
  return true;
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { id } = params;

  invariantResponse(checkIfNumber(id), "Contact Not found", {
    status: 404,
  });

  const contact = await db.query.contactsTable.findFirst({
    where: eq(contactsTable.id, Number(id)),
  });

  if (!contact) {
    throw data("Contact not found", { status: 404 });
  }

  return data({ contact });
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: `Edit ${data.contact.name}` }];
};

export default function Page() {
  return <div></div>;
}
