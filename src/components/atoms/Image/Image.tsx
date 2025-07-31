'use client'

import { ImgHTMLAttributes } from "react"

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Image ({ className = '', ...props }: ImageProps) {
    return <img className={`px-4 ${className}`} {...props} />
}