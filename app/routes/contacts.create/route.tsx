import { Button } from "~/components/ui/button";
import { z } from "zod";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Route } from "./+types/route";
import { data, Form, href, Link, redirect } from "react-router";
import { CreateContactSchema } from "./contacts-schema";
import {
  ErrorList,
  InputField,
  PhoneInputField,
  TextareaField,
} from "~/components/forms";
import { createToastHeaders } from "~/lib/cookies/toast.server";
import { StatusButton } from "~/components/status-button";
import { useIsPending } from "~/hooks/use-is-pending";
import { db } from "~/db/index.server";
import { contactsTable } from "~/db/schema";
import { eq } from "drizzle-orm";

export const meta = ({}: Route.MetaArgs) => [{ title: "Create Contact" }];

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: CreateContactSchema.superRefine(async (data, ctx) => {
      const emailExists = await db.query.contactsTable.findFirst({
        where: eq(contactsTable.email, data.email),
      });

      if (emailExists) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Contact already exists",
        });

        return;
      }

      const phoneExists = await db.query.contactsTable.findFirst({
        where: eq(contactsTable.phone_number, data.phone_number),
      });

      if (phoneExists) {
        ctx.addIssue({
          path: ["phone_number"],
          code: z.ZodIssueCode.custom,
          message: "Contact already exists",
        });

        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return data({ result: submission.reply() }, { status: 422 });
  }

  await db.insert(contactsTable).values({
    email: submission.value.email,
    name: submission.value.name,
    address: submission.value.address,
    phone_number: submission.value.phone_number,
  });

  const headers = await createToastHeaders({
    description: "Contact added successfully",
  });

  return redirect(href("/contacts"), {
    headers: headers,
  });
};

export default function Page({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    id: "create-contact-form",
    constraint: getZodConstraint(CreateContactSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateContactSchema });
    },
    shouldRevalidate: "onBlur",
    shouldValidate: "onBlur",
  });

  const isPending = useIsPending();

  return (
    <div className="w-full">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Contact</CardTitle>
          <CardDescription>
            Add a new contact to your address book
          </CardDescription>
        </CardHeader>
        <Form method="post" {...getFormProps(form)}>
          <CardContent className="space-y-4">
            <ErrorList errors={form.errors} id={form.id} />

            <InputField
              labelProps={{ children: "Name *" }}
              inputProps={{
                ...getInputProps(fields.name, { type: "text" }),
              }}
              errors={fields.name.errors}
            />

            <InputField
              labelProps={{ children: "Email *" }}
              inputProps={{
                ...getInputProps(fields.email, { type: "text" }),
              }}
              errors={fields.email.errors}
            />

            <div className="space-y-2">
              <PhoneInputField
                labelProps={{ children: "Phone Number *" }}
                inputProps={{
                  ...getInputProps(fields.phone_number, { type: "text" }),
                }}
                errors={fields.phone_number.errors}
                helperText="The phone number of the contact"
              />
            </div>

            <TextareaField
              labelProps={{ children: "Address" }}
              textareaProps={{
                ...getTextareaProps(fields.address),
              }}
              errors={fields.address.errors}
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" asChild>
              <Link to={href("/contacts")}>Cancel</Link>
            </Button>
            <StatusButton
              type="submit"
              status={isPending ? "pending" : form.status ?? "idle"}
            >
              Save Contact
            </StatusButton>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
