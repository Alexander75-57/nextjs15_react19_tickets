// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { InputWithLabel } from '@/components/inputs/InputWthLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAriaWithLabel';
import { CheckBoxWithLabel } from '@/components/inputs/CheckBoxWithLabel';

import {
    insertTicketSchema,
    type insertTicketSchemaType,
    type selectTicketSchemaType,
} from '@/zod-schemas/ticket';
import { type selectCustomerSchemaType } from '@/zod-schemas/customer';

type Props = {
    customer: selectCustomerSchemaType;
    ticket?: selectTicketSchemaType;
};

export default function TicketForm({ customer, ticket }: Props) {
    const defaultValuesOfTicket: insertTicketSchemaType = {
        id: ticket?.id ?? '(New)', // ?? - оператор означает принимаем первое истенное значение;
        customerId: ticket?.customerId ?? customer.id,
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        tech: ticket?.tech ?? 'new-ticket@example.com',
        completed: ticket?.completed ?? false,
    };

    const form = useForm<insertTicketSchemaType>({
        mode: 'onBlur', // подсветка поля если не коректные данные
        resolver: zodResolver(insertTicketSchema),
        defaultValues: defaultValuesOfTicket,
    });

    // отправляем форму
    async function submitForm(data: insertTicketSchemaType) {
        console.log(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div>
                <h2 className="text-2xl font-bold">
                    {ticket?.id ? 'Edit' : 'Add'} Ticket{' '}
                    {ticket?.id ? `# ${ticket.id}` : 'New Form'}
                </h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submitForm)}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                    >
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <InputWithLabel<insertTicketSchemaType>
                                fieldTitle="Title"
                                nameInShema="title"
                            />
                            <InputWithLabel<insertTicketSchemaType>
                                fieldTitle="Tech"
                                nameInShema="tech"
                                disabled={true}
                            />

                            <CheckBoxWithLabel<insertTicketSchemaType>
                                fieldTitle="Completed"
                                nameInShema="completed"
                                message="Yes"
                            />

                            <div className="mt-4 space-y-2">
                                <h3 className="text-lg">Customer Info</h3>
                                <hr className="w-4/5" />
                                <p>
                                    {customer.firstName} {customer.lastName}
                                </p>
                                <p>{customer.address1}</p>
                                {customer.address2 ? (
                                    <p>{customer.address2}</p>
                                ) : null}
                                <p>
                                    {customer.city}, {customer.state},
                                    {customer.zip}
                                </p>
                                <hr className="w-4/5" />
                                <p>{customer.email}</p>
                                <p>Phone: {customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <TextAreaWithLabel<insertTicketSchemaType>
                                fieldTitle="Description"
                                nameInShema="description"
                                className="h-96"
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="w-3/4"
                                    variant="default"
                                    title="Save"
                                >
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    title="Reset"
                                    onClick={() =>
                                        form.reset(defaultValuesOfTicket)
                                    }
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
