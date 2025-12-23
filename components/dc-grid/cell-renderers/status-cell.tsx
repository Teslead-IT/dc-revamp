
import React from 'react';

// Custom Status Badge Renderer (Dot + Text style)
export const StatusCellRenderer = (params: any) => {
    const status = params.value;

    let dotColor = "bg-slate-500";
    let textColor = "text-slate-400";
    let borderColor = "border-slate-800"; // Fallback

    switch (status) {
        case "Open":
            dotColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]";
            textColor = "text-blue-100";
            break;
        case "Closed":
            dotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
            textColor = "text-emerald-100";
            break;
        case "Cancelled":
            dotColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
            textColor = "text-red-100";
            break;
        case "Partial":
            dotColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
            textColor = "text-amber-100";
            break;
        case "Draft":
            dotColor = "bg-slate-400";
            textColor = "text-slate-300";
            break;
    }

    return (
        <div className="flex items-center gap-2 h-full">
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
            <span className={`text-[13px] font-medium leading-none ${textColor}`}>
                {status}
            </span>
        </div>
    );
};
