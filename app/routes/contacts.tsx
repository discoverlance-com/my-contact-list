import { data, isRouteErrorResponse, Link, Outlet, href } from "react-router";
import type { Route } from "./+types/contacts";
import { db } from "~/db/index.server";
import { Star } from "lucide-react";

export const loader = async ({}: Route.LoaderArgs) => {
  const contacts = await db.query.contactsTable.findMany();

  return data({ contacts });
};

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        <Link to={href("/contacts")}>Contacts</Link>
      </h1>

      <div className="grid md:grid-cols-5 gap-6 border rounded-lg overflow-hidden shadow-sm">
        {/* Contact list - spans 2 columns */}
        <div className="md:col-span-2 border-r">
          <div className="p-4 bg-muted">
            <h2 className="font-semibold">All Contacts</h2>
          </div>
          <ul className="divide-y">
            {loaderData.contacts.map((contact) => (
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
