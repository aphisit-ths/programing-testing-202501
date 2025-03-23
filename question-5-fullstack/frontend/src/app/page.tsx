"use client";

import React, {useState, useEffect, Suspense} from "react";
import {useRouter} from "next/navigation";
import {UserTable} from "@/components/user-table";
import {UserSearch} from "@/components/user-search";
import {Pagination} from "@/components/pagination";
import {UserDialog} from "@/components/user-dialog";
import {Loading} from "@/components/loading";
import {Button} from "@/components/ui/button";
import {getUsers} from "@/lib/api";
import {User} from "@/types";
import {PlusCircle} from "lucide-react";
import {Toaster} from "@/components/ui/sonner";
import {toast} from "sonner";

function UserContent() {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search);
        }
        return new URLSearchParams();
    });

    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "id";
    const order = searchParams.get("order") || "asc";

    const start = (page - 1) * limit;

    const updateURL = (newParams: Record<string, string>) => {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);

        Object.entries(newParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        setSearchParams(url.searchParams);

        window.history.pushState({}, '', url);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const {data, total} = await getUsers({
                search,
                start,
                limit,
                sortBy,
                order
            });
            setUsers(data);
            setTotalUsers(total);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("เกิดข้อผิดพลาด", {
                description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, start, limit, sortBy, order]);

    useEffect(() => {
        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleSearch = (searchQuery: string) => {
        updateURL({
            search: searchQuery,
            page: "1"
        });
    };

    const handlePageChange = (newPage: number) => {
        updateURL({
            page: newPage.toString()
        });
    };

    const handleSortChange = (column: string) => {
        // ถ้าคลิกที่คอลัมน์เดิม ให้สลับการเรียงลำดับ
        if (sortBy === column) {
            updateURL({
                order: order === "asc" ? "desc" : "asc"
            });
        } else {
            updateURL({
                sortBy: column,
                order: "asc"
            });
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Button onClick={() => setIsAddUserOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    เพิ่มผู้ใช้ใหม่
                </Button>
            </div>

            <UserSearch defaultValue={search} onSearch={handleSearch}/>

            {loading && users.length === 0 ? (
                <Loading size={32} text="กำลังโหลดข้อมูลผู้ใช้..." className="h-[40vh]"/>
            ) : (
                <>
                    <UserTable
                        users={users}
                        loading={loading}
                        sortBy={sortBy}
                        sortOrder={order}
                        onSortChange={handleSortChange}
                        onRefresh={fetchUsers}
                    />

                    <Pagination
                        currentPage={page}
                        totalItems={totalUsers}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <UserDialog
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading size={32} text="กำลังโหลด..." className="h-[60vh]"/>}>
            <UserContent/>
            <Toaster richColors/>
        </Suspense>
    );
}