'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TextareaHTMLAttributes } from 'react';

type Props<S> = {
    fieldTitle: string;
    nameInShema: keyof S & string;
    className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaWithLabel<S>({
    fieldTitle,
    nameInShema,
    className,
    ...props
}: Props<S>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={nameInShema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base mb-2" htmlFor={nameInShema}>
                        {fieldTitle}
                    </FormLabel>
                    <FormControl>
                        {/* // <FormControl> - for input */}
                        <Textarea
                            id={nameInShema}
                            className={className}
                            {...props}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
