import { Loader2 } from "lucide-react";

interface LoadingProps {
    size?: number;
    text?: string;
    className?: string;
}

export function Loading({ size = 24, text = "กำลังโหลด...", className = "" }: LoadingProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
            <Loader2 className="animate-spin mb-2" size={size} />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    );
}