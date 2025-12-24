
"use client"

import React, { useEffect, useState } from "react"
import Lottie from "lottie-react"

export function GlowLoader() {
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        fetch("/Glow loading.json")
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Failed to load Lottie animation", err))
    }, [])

    if (!animationData) return null

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32">
                <Lottie animationData={animationData} loop={true} />
            </div>
            <p className="text-sm text-slate-400 font-medium animate-pulse mt-2">Loading...</p>
        </div>
    )
}
