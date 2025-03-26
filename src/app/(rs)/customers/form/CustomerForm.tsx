// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import {
    insertCustomerSchema,
    type insertCustomerSchemaType,
    type selectCustomerSchemaType,
} from '@/zod-schemas/customer';

type Props = {
    customer?: selectCustomerSchemaType;
};

export default function CustomerForm({ customer }: Props) {
    const defaultValuesOfCustomer: insertCustomerSchemaType = {
        id: customer?.id ?? 0, // ||- оператор означает принимаем первое или следуещее значение;
        firstName: customer?.firstName ?? '', // ?? - оператор означает принимаем первое истенное значение;
        lastName: customer?.lastName ?? '',
        address1: customer?.address1 ?? '',
        address2: customer?.address2 ?? '',
        city: customer?.city ?? '',
        state: customer?.state ?? '',
        zip: customer?.zip ?? '',
        phone: customer?.phone ?? '',
        email: customer?.email ?? '',
        notes: customer?.notes ?? '',
    };

    const form = useForm<insertCustomerSchemaType>({
        mode: 'onBlur', // подсветка поля если не коректные данные
        resolver: zodResolver(insertCustomerSchema),
        defaultValues: defaultValuesOfCustomer,
    });

    // отправляем форму
    async function submitForm(data: insertCustomerSchemaType) {
        console.log(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? 'Edit' : 'Add'} Customer Form
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
