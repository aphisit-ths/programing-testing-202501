"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    // สร้างตัวเลขหน้าที่จะแสดง
    const getPageNumbers = () => {
        const delta = 2; // จำนวนหน้าที่แสดงด้านซ้ายและขวาของหน้าปัจจุบัน
        const range: (number | string)[] = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        // เพิ่ม ellipsis ด้านซ้าย
        if (currentPage - delta > 2) {
            range.unshift("...");
        }

        // เพิ่ม ellipsis ด้านขวา
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        // เพิ่มหน้าแรกและหน้าสุดท้ายเสมอ
        if (totalPages > 1) {
            range.unshift(1);
            if (totalPages > 1) {
                range.push(totalPages);
            }
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
                แสดง {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} จากทั้งหมด {totalItems} รายการ
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPrevious}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">ก่อนหน้า</span>
                    </Button>

                    {pageNumbers.map((page, index) => (
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={currentPage === page ? "default" : "outline"}
                                onClick={() => onPageChange(Number(page))}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">ถัดไป</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}