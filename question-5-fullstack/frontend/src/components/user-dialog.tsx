"use client";

import {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {createUser, updateUser} from "@/lib/api";
import {User} from "@/types";
import {toast} from "sonner";
import Image from "next/image";

const predefinedAvatars = [
    "https://ui-avatars.com/api/?name=User+1&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User+2&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User+3&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User+4&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User+5&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User+6&background=random&color=fff",
];

interface UserDialogProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function UserDialog({user, isOpen, onClose, onSuccess}: UserDialogProps) {
    const [formData, setFormData] = useState<Partial<User>>(
        user || {
            name: "",
            age: undefined,
            email: "",
            avatarUrl: predefinedAvatars[0]
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // รีเซ็ตฟอร์มเมื่อ user หรือ isOpen เปลี่ยน
    useEffect(() => {
        if (isOpen) {
            setFormData(user || {
                name: "",
                age: undefined,
                email: "",
                avatarUrl: predefinedAvatars[0]
            });
            setErrors({});
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === "age" ? (value ? parseInt(value) : undefined) : value
        });

        // ลบข้อผิดพลาดเมื่อมีการแก้ไขข้อมูล
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const handleAvatarChange = (avatarUrl: string) => {
        setFormData({
            ...formData,
            avatarUrl
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // ตรวจสอบชื่อ
        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "กรุณากรอกชื่อ";
        } else if (formData.name.length < 1 || formData.name.length > 100) {
            newErrors.name = "กรุณากรอกชื่อความยาวไม่น้อยกว่า 1 ตัวอักษร และไม่เกิน 100 ตัวอักษร";
        }

        // ตรวจสอบอายุ
        if (!formData.age) {
            newErrors.age = "กรุณากรอกอายุ";
        } else if (formData.age < 1 || formData.age > 120) {
            newErrors.age = "อายุต้องอยู่ระหว่าง 1-120 ปี";
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // ตรวจสอบอีเมล
        if (!formData.email || formData.email.trim() === "") {
            newErrors.email = "กรุณากรอกอีเมล";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        } else if (formData.email.length < 1 || formData.email.length > 100) {
            newErrors.email = "กรุณากรอกอีเมลความยาวไม่น้อยกว่า 1 ตัวอักษร และไม่เกิน 100 ตัวอักษร";
        }


        // ตรวจสอบ avatar
        if (!formData.avatarUrl) {
            newErrors.avatarUrl = "กรุณาเลือกรูปโปรไฟล์";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (user?.id) {
                // อัปเดตผู้ใช้ที่มีอยู่
                await updateUser(user.id, formData);
                toast.success("อัปเดตข้อมูลสำเร็จ", {
                    description: `ข้อมูลของ ${formData.name} ถูกอัปเดตเรียบร้อยแล้ว`,
                });
            } else {
                // สร้างผู้ใช้ใหม่
                await createUser(formData);
                toast.success("เพิ่มผู้ใช้สำเร็จ", {
                    description: `ผู้ใช้ ${formData.name} ถูกเพิ่มเรียบร้อยแล้ว`,
                });
            }

            // แจ้งว่าบันทึกสำเร็จ
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Error saving user:", error);

            // จัดการกับข้อผิดพลาดจาก API
            if (error instanceof Error) {
                try {
                    // ลองตรวจสอบว่าข้อความ error อยู่ในรูปแบบ JSON หรือไม่
                    const errorData = JSON.parse(error.message);
                    if (errorData.errors) {
                        // กรณีที่ backend ส่ง validation errors มาให้แสดงในฟอร์ม
                        const backendErrors: Record<string, string> = {};

                        Object.entries(errorData.errors).forEach(([key, message]) => {
                            backendErrors[key] = message as string;
                        });

                        setErrors({...errors, ...backendErrors});
                        toast.error("ข้อมูลไม่ถูกต้อง", {
                            description: "กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง",
                        });

                        return; // ไม่ปิด dialog เพื่อให้ผู้ใช้แก้ไขข้อมูล
                    } else if (errorData.message) {
                        // กรณีที่ backend ส่ง error message ทั่วไปมา
                        toast.error("เกิดข้อผิดพลาด", {
                            description: errorData.message,
                        });
                    }
                } catch (e) {
                    // ไม่สามารถแปลง error message เป็น JSON ได้ ให้แสดงข้อความเดิม
                    toast.error("เกิดข้อผิดพลาด", {
                        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
                    });
                }
            } else {
                // กรณีไม่ใช่ Error object
                toast.error("เกิดข้อผิดพลาด", {
                    description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{user?.id ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลของผู้ใช้ด้านล่าง แล้วคลิกบันทึกเมื่อเสร็จสิ้น
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            ชื่อ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="age">
                            อายุ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="age"
                            name="age"
                            type="number"
                            value={formData.age || ""}
                            onChange={handleChange}
                            className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && (
                            <p className="text-red-500 text-sm">{errors.age}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            อีเมล <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            รูปโปรไฟล์ <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-6 gap-3">
                            {predefinedAvatars.map((avatar) => (
                                <div
                                    key={avatar}
                                    className={`relative cursor-pointer rounded-full aspect-square ${
                                        formData.avatarUrl === avatar ? "ring-2 ring-blue-500 ring-offset-2" : "hover:opacity-80"
                                    }`}
                                    onClick={() => handleAvatarChange(avatar)}
                                >
                                    <Image
                                        src={avatar}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        {errors.avatarUrl && (
                            <p className="text-red-500 text-sm">{errors.avatarUrl}</p>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังบันทึก..." : "บันทึก"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}