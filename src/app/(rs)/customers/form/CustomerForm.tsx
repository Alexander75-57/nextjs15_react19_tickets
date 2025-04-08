// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { InputWithLabel } from '@/components/inputs/InputWthLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAriaWithLabel';
import { SelectWithLabel } from '@/components/inputs/SelectWithInput';
import { CheckBoxWithLabel } from '@/components/inputs/CheckBoxWithLabel';

import { StatesArray } from '@/constans/StatesArray';

/* import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'; */

import {
    insertCustomerSchema,
    type insertCustomerSchemaType,
    type selectCustomerSchemaType,
} from '@/zod-schemas/customer';

// for send data to server
import { useAction } from 'next-safe-action/hooks';
import { saveCustomerAction } from '@/actions/saveCustomerAction';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
    customer?: selectCustomerSchemaType;
    isManager?: boolean | undefined;
};

export default function CustomerForm({ customer, isManager = false }: Props) {
    /* const { getPermission, isLoading } =
        useKindeBrowserClient(); // for who manager, admin or user
    const isManager = !isLoading && getPermission('manager')?.isGranted; */
    /* 
    const permObj = getPermissions();
    const isAuthorized =
        !isLoading &&
        permObj.permissions.some(
            (perm) => perm === 'manager' || perm === 'admin'
        ) 
    */

    const searchParams = useSearchParams(); //для обновления страницы с выбранного клиента на пустую форму
    const hasCustomerId = searchParams.has('customerId');
    const emptyValues: insertCustomerSchemaType = {
        id: 0,
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        notes: '',
        active: true,
    };

    const defaultValuesOfCustomer: insertCustomerSchemaType = hasCustomerId
        ? {
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
              active: customer?.active ?? true,
          }
        : emptyValues;

    const form = useForm<insertCustomerSchemaType>({
        mode: 'onBlur', // подсветка поля если не коректные данные
        resolver: zodResolver(insertCustomerSchema),
        defaultValues: defaultValuesOfCustomer,
    });

    useEffect(() => {
        form.reset(hasCustomerId ? defaultValuesOfCustomer : emptyValues);
    }, [searchParams.get('customerId')]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        execute: executeSave,
        result: saveResult,
        isExecuting: isSaving,
        reset: resetSaveAction,
    } = useAction(saveCustomerAction, {
        onSuccess({ data }) {
            // toast (shadcn) user
            if (data?.message) {
                toast(`Success ! ${data.message}`);
            }
        },
        onError({ error }) {
            toast('Error! Save Failed');
        },
    });

    // отправляем форму
    async function submitForm(data: insertCustomerSchemaType) {
        //console.log(data);
        /* executeSave({ ...data, firstName: '', phone: '' }); */
        executeSave(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? 'Edit' : 'Add'} Customer{' '}
                    {customer?.id ? `#${customer.id}` : 'Form'}
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
                        {
                            /* isLoading ? (
                            <p>Loading ...</p>
                        ) : */ isManager && customer?.id ? (
                                <CheckBoxWithLabel<insertCustomerSchemaType>
                                    fieldTitle="Active"
                                    nameInShema="active"
                                    message="Yes"
                                />
                            ) : null
                        }

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoaderCircle className="anomate-spin" />{' '}
                                        Saving
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset(defaultValuesOfCustomer);
                                    resetSaveAction();
                                }}
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
