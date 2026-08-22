import React from 'react'
import { useRouter } from "next/router";
import Image from 'next/image';
import Link from 'next/link';

export default function EmptyState({ Heading, content, classNameName }) {
    const router = useRouter();
    return (
        <div className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <h1 className="mt-4 w-full text-5xl font-semibold tracking-tight text-white-900" > No Data found</h1>
                <p className="mt-3 text-lg font-medium text-pretty text-white-500 sm:text-xl/8">There is no data on this page at the moment. Please come again later.</p>
                <div className="mt-6 flex items-center justify-center gap-x-6 button-bg">
                    <Link href="/" className="rounded-md  px-3.5 py-2.5 text-sm font-semibold shadow-xs ">Go back home</Link>
                </div>
            </div>
        </div>

    )
}
