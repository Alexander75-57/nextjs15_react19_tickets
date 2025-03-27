// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { InputWithLabel } from '@/components/inputs/InputWthLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAriaWithLabel';
import { SelectWithLabel } from '@/components/inputs/SelectWithInput';
import { StatesArray } from '@/constans/StatesArray';

//import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

import {
    insertCustomerSchema,
    type insertCustomerSchemaType,
    type selectCustomerSchemaType,
} from '@/zod-schemas/customer';

type Props = {
    customer?: selectCustomerSchemaType;
};

export default function CustomerForm({ customer }: Props) {
    /*     const { getPermission, isLoading } =
        useKindeBrowserClient(); // for who manager, admin or user
    const isManager = !isLoading && getPermission('manager')?.isGranted; */

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
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col md:flex-row gap-4 md:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="First name"
                            nameInShema="firstName"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Last name"
                            nameInShema="lastName"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Addrees 1"
                            nameInShema="address1"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Addrees 2"
                            nameInShema="address2"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="City"
                            nameInShema="city"
                        />
                        <SelectWithLabel<insertCustomerSchemaType>
                            fieldTitle="State"
                            nameInShema="state"
                            data={StatesArray}
                        />
                    </div>
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="ZIP Code"
                            nameInShema="zip"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Email"
                            nameInShema="email"
                        />
                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Phone"
                            nameInShema="phone"
                        />
                        <TextAreaWithLabel<insertCustomerSchemaType>
                            fieldTitle="Notes"
                            nameInShema="notes"
                            className="h-40"
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
                                    form.reset(defaultValuesOfCustomer)
                                }
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
