'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '@/components/ui/input';
import { InputHTMLAttributes } from 'react';

type Props<S> = {
    fieldTitle: string;
    nameInShema: keyof S & string;
    className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
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
                    <FormLabel className="text-base" htmlFor={nameInShema}>
                        {fieldTitle}
                    </FormLabel>
                    <FormControl>
                        {/* // <FormControl> - for input */}
                        <Input
                            id={nameInShema}
                            className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-green-500 disabled:opacity-75 ${className}`}
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
