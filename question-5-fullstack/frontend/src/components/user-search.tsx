"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";

interface UserSearchProps {
    defaultValue: string;
    onSearch: (query: string) => void;
}

export function UserSearch({defaultValue, onSearch}: UserSearchProps) {
    const [searchQuery, setSearchQuery] = useState(defaultValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <Input
                type="text"
                placeholder="ค้นหาด้วยชื่อหรืออีเมล"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit" variant="default">
                <Search className="mr-2 h-4 w-4"/>
                ค้นหา
            </Button>
        </form>
    );
}