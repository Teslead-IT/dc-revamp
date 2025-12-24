
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const OwnerCellRenderer = (params: any) => {
    const owner = params.value;
    if (!owner) return null;

    return (
        <div className="flex items-center gap-2 h-full">
            <Avatar className="h-6 w-6">
                <AvatarImage src={owner.avatar} alt={owner.name} />
                <AvatarFallback className="text-[10px] bg-slate-700 text-slate-300">
                    {owner.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-300 truncate">{owner.name}</span>
        </div>
    );
};
