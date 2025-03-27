'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type DataObj = {
    id: string;
    description: string;
};

type Props<S> = {
    fieldTitle: string;
    nameInShema: keyof S & string;
    data: DataObj[]; // массив данных - названия штатов и тереторий
    className?: string;
};

export function SelectWithLabel<S>({
    fieldTitle,
    nameInShema,
    data,
    className,
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
                    <Select {...field} onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger
                                id={nameInShema}
                                className={`w-full max-w-xs ${className}`}
                            >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {data.map((item) => (
                                <SelectItem
                                    key={`${nameInShema}_${item.id}`}
                                    value={item.id}
                                >
                                    {item.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
