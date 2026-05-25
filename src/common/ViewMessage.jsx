import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";

export default function ViewMessage({ text }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col">
            <p className='gap-[10px] line-clamp-1 text-left  font-[manrope] font-[600] text-[17px] hover:text-[#727272] cursor-pointer' onClick={toggleModal}>
                {text ? text : "-"}
            </p>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9]">
                    <div className="relative bg-[#1B1B1B] rounded-lg p-[15px] lg:p-[20px] w-[96%] max-w-[500px]">
                        <div className='flex justify-between items-center gap-4'>
                            <h3 className="text-[24px] font-bold ">Message</h3>
                            <IoCloseSharp
                                size={24}
                                className='cursor-pointer text-white  '
                                onClick={toggleModal}
                            />
                        </div>

                        <h6 className="break-all mt-5  text-left whitespace-pre-wrap">
                            {text}
                        </h6>
                    </div>
                </div>
            )}
        </div>
    );
}