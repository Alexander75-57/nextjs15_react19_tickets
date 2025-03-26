// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

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
                        <p>{JSON.stringify(form.getValues())}</p>
                    </form>
                </Form>
            </div>
        </div>
    );
}
