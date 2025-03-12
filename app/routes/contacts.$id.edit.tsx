import type { Route } from "./+types/contacts.$id.edit";
import { CreateContactSchema } from "./contacts.create/contacts-schema";

import { db } from "~/db/index.server";
import { eq } from "drizzle-orm";
import { contactsTable } from "~/db/schema";
import { invariantResponse } from "@epic-web/invariant";

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
import { data, Form, href, Link, redirect } from "react-router";
import {
  ErrorList,
  InputField,
  SwitchField,
  PhoneInputField,
  TextareaField,
} from "~/components/forms";
import { createToastHeaders } from "~/lib/cookies/toast.server";
import { StatusButton } from "~/components/status-button";
import { useIsPending } from "~/hooks/use-is-pending";
import React, { useState } from "react";

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

export const action = async ({ request, params }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { id } = params;

  const submission = await parseWithZod(formData, {
    schema: CreateContactSchema.superRefine(async (data: any, ctx: any) => {
      const emailExists = await db.query.contactsTable.findFirst({
        where: eq(contactsTable.email, data.email),
      });

      if (emailExists && emailExists.id !== Number(id)) {
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

      if (phoneExists && phoneExists.id !== Number(id)) {
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

  await db
    .update(contactsTable)
    .set({
      updated_at: new Date(),
      email: submission.value.email,
      name: submission.value.name,
      address: submission.value.address,
      phone_number: submission.value.phone_number,
      is_favorite: submission.value.is_favorite ? true : false,
    })
    .where(eq(contactsTable.id, Number(id)));

  const headers = await createToastHeaders({
    description: "Contact updated successfully",
  });

  return redirect(href("/contacts"), {
    headers: headers,
  });
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: `Edit ${data.contact.name}` }];
};

export default function Page({ loaderData }: Route.ComponentProps) {
  const contact = loaderData.contact;

  const [isChecked, setIsChecked] = useState(contact?.is_favorite ?? false);

  const [form, fields] = useForm({
    id: "edit-contact-form",
    constraint: getZodConstraint(CreateContactSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateContactSchema });
    },
    shouldRevalidate: "onBlur",
    shouldValidate: "onBlur",
    defaultValue: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone_number: contact?.phone_number || "",
      address: contact?.address || "",
      is_favorite: contact?.is_favorite || false,
    },
  });

  const isPending = useIsPending();

  return (
    <div className="w-full">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Contact</CardTitle>
          <CardDescription>Edit contact in your address book</CardDescription>
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
            <SwitchField
              labelProps={{ children: "Add to Favorites" }}
              switchProps={{
                checked: isChecked,
                onChange: (event) => setIsChecked(event.target.checked),
                name: "is_favorite",
              }}
              errors={fields.is_favorite.errors}
              helperText="Toggle this to add this contact to favorites."
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
