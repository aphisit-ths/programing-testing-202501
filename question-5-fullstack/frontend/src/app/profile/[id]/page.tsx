"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Loading} from "@/components/loading";
import {UserDialog} from "@/components/user-dialog";
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
import {getUser, deleteUser} from "@/lib/api";
import {User} from "@/types";
import {ArrowLeft, Calendar, Mail, Pencil, Trash, User as UserIcon} from "lucide-react";
import {toast} from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUserData = async () => {
        if (!userId) {
            setError("ไม่พบ ID ผู้ใช้");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const userData = await getUser(userId);
            if (!userData) {
                setError("ไม่พบข้อมูลผู้ใช้");
            } else {
                setUser(userData);
                setError(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setError(error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!userId || !user) {
            toast.error("ไม่สามารถลบผู้ใช้ได้", {
                description: "ไม่พบข้อมูลผู้ใช้",
            });
            return;
        }

        setIsDeleting(true);

        try {
            await deleteUser(userId);
            toast.success("ลบผู้ใช้สำเร็จ", {
                description: `ผู้ใช้ ${user.name} ถูกลบออกจากระบบแล้ว`,
            });
            router.push("/");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด", {
                description: error instanceof Error ? error.message : "ไม่สามารถลบผู้ใช้ได้",
            });
            setIsDeleteDialogOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "ไม่ระบุ";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <Loading size={32} text="กำลังโหลดข้อมูลผู้ใช้..." className="h-[60vh]"/>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">เกิดข้อผิดพลาด</h1>
                <p className="text-gray-600 mb-6">{error || "ไม่พบข้อมูลผู้ใช้"}</p>
                <Button variant="outline" onClick={() => router.push("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    กลับหน้าหลัก
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <Button variant="outline" onClick={() => router.push("/")} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                กลับหน้าหลัก
            </Button>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="relative">
                    <div className="absolute right-4 top-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            แก้ไข
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash className="mr-2 h-4 w-4"/>
                            ลบ
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-4xl">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription>ID: {user.id}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">ข้อมูลส่วนตัว</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">อายุ</p>
                                    <p className="font-medium">{user.age} ปี</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">อีเมล</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">ข้อมูลระบบ</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">สร้างเมื่อ</p>
                                    <p className="font-medium">{formatDate(user.createdAt.toString())}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">อัปเดตล่าสุด</p>
                                    <p className="font-medium">{formatDate(user.updatedAt.toString())}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            {isEditDialogOpen && (
                <UserDialog
                    user={user}
                    isOpen={true}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSuccess={fetchUserData}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ &quot;{user.name}&quot;? การกระทำนี้ไม่สามารถเปลี่ยนได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "กำลังลบ..." : "ยืนยัน"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}