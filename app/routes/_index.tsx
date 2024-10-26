import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, json, redirect, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { Field } from '../components/forms';
import { Button } from '../components/ui/button';

const formSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/),
});

export function meta() {
  return [
    { title: 'Weathercat' },
    { name: 'description', content: 'Cats for all kinds of weather' },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: formSchema,
  });

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    );
  }

  const { zipCode } = submission.value;

  return redirect(`/weather/${zipCode}`);
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: 'weathercat',
    constraint: getZodConstraint(formSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: formSchema });
    },
    shouldValidate: 'onBlur',
  });

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <h1 className="mt-20 text-center text-4xl font-bold">
          Welcome to Weathercat!
        </h1>
        <p className="mt-4 text-center">
          To get started, please input your ZIP Code.
        </p>
        <div className="mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]">
          <Form method="POST" {...getFormProps(form)}>
            <Field
              labelProps={{
                children: 'ZIP Code',
              }}
              inputProps={{
                ...getInputProps(fields.zipCode, { type: 'text' }),
                autoComplete: 'postal-code',
              }}
              errors={fields.zipCode.errors}
            />

            <Button type="submit" size="lg" className="w-full">
              Get cats!
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
