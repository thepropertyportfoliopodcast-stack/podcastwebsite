import React from 'react'

export default function SectionHeading({ title, content, subtitle, className, headingLevel = 'h2' }) {
    const Heading = headingLevel

    return (
        <div className={`${className}`}>
            <Heading className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] mb-[15px]">
                <span className="text-white">{title}</span>
                <span className="text-theme"> {subtitle}</span>
            </Heading>
            <p className="font-[600] text-[18px] md:text-[20px]  mb-[40px] text-white">
                {content}
            </p>
        </div>
    )
}