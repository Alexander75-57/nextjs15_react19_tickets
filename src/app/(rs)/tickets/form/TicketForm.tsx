// Use React Hook Form from shadcn - more quiqly work in server side tnen form fron Nextjs_15
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { InputWithLabel } from '@/components/inputs/InputWthLabel';
import { TextAreaWithLabel } from '@/components/inputs/TextAriaWithLabel';
import { CheckBoxWithLabel } from '@/components/inputs/CheckBoxWithLabel';
import { SelectWithLabel } from '@/components/inputs/SelectWithInput';

import {
    insertTicketSchema,
    type insertTicketSchemaType,
    type selectTicketSchemaType,
} from '@/zod-schemas/ticket';
import { type selectCustomerSchemaType } from '@/zod-schemas/customer';

// for send data to server
import { useAction } from 'next-safe-action/hooks';
import { saveTicketAction } from '@/actions/saveTicketAction';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse';

type Props = {
    customer: selectCustomerSchemaType;
    ticket?: selectTicketSchemaType;
    techs?: {
        id: string;
        description: string;
    }[];
    isEditable?: boolean;
};

export default function TicketForm({
    customer,
    ticket,
    techs,
    isEditable = true,
}: Props) {
    const isManager = Array.isArray(techs);

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

    const {
        execute: executeSave,
        result: saveResult,
        isExecuting: isSaving,
        reset: resetSaveAction,
    } = useAction(saveTicketAction, {
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
    async function submitForm(data: insertTicketSchemaType) {
        //console.log(data);
        executeSave(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {ticket?.id && isEditable
                        ? `Edit Ticket #${ticket.id}`
                        : ticket?.id
                        ? `View Ticket #${ticket.id}`
                        : 'New Ticket Form'}
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
                                disabled={
                                    !isEditable
                                } /* // in our code !isEditable is true and we can`t edit form */
                            />
                            {isManager ? (
                                <SelectWithLabel<insertTicketSchemaType>
                                    fieldTitle="Tech ID"
                                    nameInShema="tech"
                                    data={[
                                        {
                                            id: 'new-ticket@example.com',
                                            description:
                                                'new-ticket@example.com',
                                        },
                                        ...techs,
                                    ]}
                                />
                            ) : (
                                <InputWithLabel<insertTicketSchemaType>
                                    fieldTitle="Tech"
                                    nameInShema="tech"
                                    disabled={true}
                                />
                            )}
                            {ticket?.id ? (
                                <CheckBoxWithLabel<insertTicketSchemaType>
                                    fieldTitle="Completed"
                                    nameInShema="completed"
                                    message="Yes"
                                    disabled={!isEditable}
                                />
                            ) : null}
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
                                disabled={!isEditable}
                            />
                            {isEditable ? (
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
                                            form.reset(defaultValuesOfTicket);
                                            resetSaveAction();
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
