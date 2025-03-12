import {
  data,
  isRouteErrorResponse,
  Link,
  Outlet,
  href,
  useFetcher,
  useSearchParams,
  Form,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/contacts";
import { db, ilike } from "~/db/index.server";
import { Star, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { contactsTable } from "~/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { Input } from "~/components/ui/input";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);

  const q = url.searchParams.get("q") ?? "";

  const contacts = await db.query.contactsTable.findMany({
    where: (fields) => ilike(fields.name, `%${q}%`),
  });

  return data({ contacts });
};

const FormActionsSchema = z
  .object({
    intent: z.enum(["delete", "favorite"]),
    id: z.coerce.number(),
    is_favorite: z.enum(["yes", "no"]).optional(),
  })
  .refine((data) => {
    return !(data.intent === "delete" && !data.is_favorite);
  }, "Favorite should be yes or no");

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const { success, data: values } = await FormActionsSchema.safeParseAsync(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    throw data("Action is not permitted", { status: 400 });
  }

  const { intent, id, is_favorite } = values;

  if (intent === "delete") {
    // delete data
    await db.delete(contactsTable).where(eq(contactsTable.id, id));
  }

  if (intent === "favorite") {
    await db
      .update(contactsTable)
      .set({
        updated_at: new Date(),
        is_favorite: is_favorite === "yes" ? true : false,
      })
      .where(eq(contactsTable.id, Number(id)));
  }

  return data({});
};

export default function Page({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const submit = useSubmit();

  const handleSearchSubmit = useDebounceCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      submit(event.target.form);
    },
    500
  );

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-row gap-8 items-center mb-6">
        <h1 className="text-2xl font-bold">
          <Link to={href("/contacts")}>Contacts</Link>
        </h1>
        <Button asChild>
          <Link to={href("/contacts/create")}>Create contact</Link>
        </Button>
      </div>

      <div className="flex flex-row gap-8 items-center mb-6">
        <Form method="get" role="search" id="search-form">
          <Input
            name="q"
            defaultValue={q ?? ""}
            type="search"
            maxLength={55}
            placeholder="Search contacts..."
            onChange={(event) => {
              handleSearchSubmit(event);
            }}
          />
        </Form>
      </div>

      <div className="grid md:grid-cols-5 gap-6 border rounded-lg overflow-hidden shadow-sm">
        {/* Contact list - spans 2 columns */}
        <div className="md:col-span-2 border-r">
          <div className="p-4 bg-muted">
            <h2 className="font-semibold">All Contacts</h2>
          </div>
          <ul className="divide-y">
            {loaderData.contacts
              .filter((c) => {
                const isDeleting =
                  fetcher.formData?.get("intent") === "delete" &&
                  c.id === Number(fetcher.formData?.get("id"));

                if (isDeleting) {
                  return false;
                }
                return true;
              })
              .map((contact) => (
                <li
                  key={contact.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={href("/contacts/:id/edit", {
                        id: String(contact.id),
                      })}
                      className="flex flex-col gap-2"
                    >
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {contact.email}
                      </span>
                    </Link>
                    <div>
                      <fetcher.Form
                        method="post"
                        className="flex flex-row gap-4 items-center"
                      >
                        <input type="hidden" name="id" value={contact.id} />
                        <Button
                          variant="ghost"
                          type="submit"
                          name="intent"
                          value="favorite"
                          disabled={
                            fetcher.state === "submitting" &&
                            contact.id ===
                              Number(fetcher.formData?.get("id")) &&
                            fetcher.formData?.get("intent") === "favorite"
                          }
                        >
                          {contact.is_favorite ||
                          (fetcher.formData?.get("intent") === "favorite" &&
                            fetcher.formData?.get("is_favorite") === "yes" &&
                            contact.id ===
                              Number(fetcher.formData?.get("id"))) ? (
                            <Star
                              className={`h-4 w-4 fill-yellow-400 text-yellow-400 ${
                                fetcher.state === "submitting" &&
                                contact.id ===
                                  Number(fetcher.formData?.get("id")) &&
                                fetcher.formData?.get("intent") === "favorite"
                                  ? "opacity-40"
                                  : "opacity-100"
                              }`}
                            />
                          ) : (
                            <Star
                              className={`h-4 w-4 fill-white text-gray-600 ${
                                fetcher.state === "submitting" &&
                                contact.id ===
                                  Number(fetcher.formData?.get("id")) &&
                                fetcher.formData?.get("intent") === "favorite"
                                  ? "opacity-40"
                                  : "opacity-100"
                              }`}
                            />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          type="submit"
                          name="intent"
                          value="delete"
                          disabled={
                            fetcher.state === "submitting" &&
                            contact.id ===
                              Number(fetcher.formData?.get("id")) &&
                            fetcher.formData?.get("intent") === "delete"
                          }
                        >
                          <Trash
                            className={`h-4 w-4 fill-red-400 text-red-400 ${
                              fetcher.state === "submitting" &&
                              contact.id ===
                                Number(fetcher.formData?.get("id")) &&
                              fetcher.formData?.get("intent") === "delete"
                                ? "opacity-40"
                                : "opacity-100"
                            }`}
                          />
                        </Button>
                        <input
                          type="hidden"
                          name="is_favorite"
                          value={contact.is_favorite ? "no" : "yes"}
                        />
                      </fetcher.Form>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Right panel - spans 3 columns */}
        <div className="md:col-span-3 flex items-center justify-center p-12 bg-muted/20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? error.data ?? "The requested page could not be found"
        : error.data || error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>

      <div className="grid md:grid-cols-5 gap-6 border rounded-lg overflow-hidden shadow-sm">
        {/* Contact list - spans 2 columns */}
        <div className="md:col-span-2 border-r">
          <div className="p-4 bg-muted">
            <h2 className="font-semibold">All Contacts</h2>
          </div>
          <ul className="divide-y">
            {loaderData?.contacts.map((contact) => (
              <li
                key={contact.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <Link
                  to={href("/contacts/:id/edit", { id: String(contact.id) })}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {contact.email}
                    </span>
                  </div>
                  {contact.is_favorite && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel - spans 3 columns */}
        <div className="md:col-span-3 flex items-center justify-center p-12 bg-muted/20">
          <div className="text-center">
            <h2 className="font-bold text-2xl">{message}</h2>
            <p>{details}</p>
            {stack && (
              <pre className="w-full p-4 overflow-x-auto">
                <code>{stack}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
