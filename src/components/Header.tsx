import { HomeIcon, File, UsersRound, LogOut } from 'lucide-react';
import Link from 'next/link';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

import { NavButton } from '@/components/NavButton';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { NavButtonMenu } from '@/components/NavButtonMenu';

export function Header() {
    return (
        <header className="slideHeader animate-slide bg-background h-12 p-2 border-b stiky top-0 z-20">
            <div className="flex h-8 items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <NavButton href="/tickets" label="Home" icon={HomeIcon} />
                    <Link
                        href="/tickets"
                        className="flex justify-center items-center gap-2 ml-0"
                        title="Home"
                    >
                        <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
                            Computer Repair Shop
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center">
                    <NavButton href="/tickets" label="Tickets" icon={File} />
                    <NavButtonMenu
                        icon={UsersRound}
                        label="Customers Menu"
                        choices={[
                            { title: 'Customers', href: '/customers' },
                            { title: 'New Customer', href: '/customers/form' },
                        ]}
                    />
                    {/* <NavButton
                        href="/customers"
                        label="Customers"
                        icon={UsersRound}
                    /> */}
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="LogOut"
                        title="LogOut"
                        className="rounded-full"
                        asChild
                    >
                        <LogoutLink>
                            <LogOut />
                        </LogoutLink>
                    </Button>
                </div>
            </div>
        </header>
    );
}
