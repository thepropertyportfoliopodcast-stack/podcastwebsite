import React from 'react'

export default function Heading({ title, content, subtitle, className }) {
    return (
        <div className={`${className}`}>
            <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase mb-[15px]">
                <span className="text-white">{title}</span>
                <span className="text-theme"> {subtitle}</span>
            </h2>
            <p className="font-[600] text-[18px] md:text-[20px]  mb-[40px] text-white">
                {content}
            </p>
        </div>
    )
}