import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
    icon: LucideIcon;
    label: string;
    choice: {
        title: string;
        href: string;
    }[];
};

export function NavButtonMenu({ icon: Icon, label, choice }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Icon classname="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{label}</span>
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    );
}
