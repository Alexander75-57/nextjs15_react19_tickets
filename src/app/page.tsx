import Link from 'next/link';

export default function Home() {
    return (
        <div className="bg-[url(/images/home-img.jpg)] bg-cover bg-center bg-black">
            <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
                <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-110 mx-auto text-white sm:text-2xl">
                    <h1 className="text-4xl font-bold">
                        O&M&apos;s Computers
                        <br /> Repair Shop
                    </h1>
                    <address>
                        Nebesnoy Sotny
                        <br />
                        Odesa, Zip: 65101
                    </address>
                    <p>Open Daily: 9:30 am to 5:30 pm</p>
                    <Link href="tel:5555555555" className="hover:underline">
                        555-555-5555
                    </Link>
                </div>
                <div className="flex flex-col gap-6 p-12 rounded-xl w-4/5 sm:max-w-110 mx-auto">
                    <Link
                        href="/tickets"
                        className="text-4xl font-bold bg-white text-black p-4 rounded-xl hover:bg-gray-200 hover:underline"
                    >
                        Income
                    </Link>
                </div>
            </main>
        </div>
    );
}
