import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/_index";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export const meta = ({}: Route.MetaArgs) => [{ title: "Homepage" }];

export default function Page() {
  return (
    <div className="flex items-center justify-center h-svh">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>

        <CardContent>
          <Button asChild>
            <Link to="/contacts">Go to Contacts</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
