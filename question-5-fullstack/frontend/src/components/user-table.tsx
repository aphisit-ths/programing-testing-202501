"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {UserDialog} from "@/components/user-dialog";
import {User} from "@/types";
import {deleteUser} from "@/lib/api";
import {ArrowUpDown, MoreHorizontal, Pencil, Trash, ExternalLink} from "lucide-react";
import {toast} from "sonner";

interface UserTableProps {
    users: User[];
    loading: boolean;
    sortBy: string;
    sortOrder: string;
    onSortChange: (column: string) => void;
    onRefresh: () => void;
}

export function UserTable({
                              users,
                              loading,
                              sortBy,
                              sortOrder,
                              onSortChange,
                              onRefresh
                          }: UserTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleDelete = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            toast.success("ลบผู้ใช้สำเร็จ", {
                description: `ผู้ใช้ ${userToDelete.name} ถูกลบออกจากระบบแล้ว`,
            });

            // รีเฟรชข้อมูล
            onRefresh();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("เกิดข้อผิดพลาด", {
                description: error instanceof Error ? error.message : "ไม่สามารถลบผู้ใช้ได้",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy === column) {
            return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}/>;
        }
        return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50"/>;
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableCaption>รายการผู้ใช้ทั้งหมด</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Avatar</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSortChange("name")}>
                                <div className="flex items-center">
                                    ชื่อ
                                    {getSortIcon("name")}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSortChange("age")}>
                                <div className="flex items-center">
                                    อายุ
                                    {getSortIcon("age")}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => onSortChange("email")}>
                                <div className="flex items-center">
                                    อีเมล
                                    {getSortIcon("email")}
                                </div>
                            </TableHead>
                            <TableHead className="w-20 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    กำลังโหลดข้อมูล...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    ไม่พบข้อมูลผู้ใช้
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                            {user.avatarUrl ? (
                                                <Image
                                                    src={user.avatarUrl}
                                                    alt={user.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/profile/${user.id}`}
                                            className="flex items-center hover:underline text-blue-600"
                                        >
                                            {user.name}
                                            <ExternalLink className="ml-1 h-3 w-3"/>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{user.age}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">เมนู</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/profile/${user.id}`}>
                                                        <ExternalLink className="mr-2 h-4 w-4"/>
                                                        <span>ดูโปรไฟล์</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Pencil className="mr-2 h-4 w-4"/>
                                                    <span>แก้ไข</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(user)}>
                                                    <Trash className="mr-2 h-4 w-4"/>
                                                    <span>ลบ</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {editingUser && (
                <UserDialog
                    user={editingUser}
                    isOpen={true}
                    onClose={() => setEditingUser(null)}
                    onSuccess={onRefresh}
                />
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ &quot;{userToDelete?.name}&quot;?
                            การกระทำนี้ไม่สามารถเปลี่ยนได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? "กำลังลบ..." : "ยืนยัน"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}