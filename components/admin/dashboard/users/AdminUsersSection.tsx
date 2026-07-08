"use client";
import React, { useState, useEffect } from "react";
import { Users, Trash2, Edit, Save, X, Loader2, Key } from "lucide-react";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "@/app/actions/admin-users";

type AdminUser = {
  id: string;
  email: string;
  phone: string;
  name: string;
  createdAt: string;
};

export default function AdminUsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsers();
      if (res.error) {
        setError(res.error);
      } else if (res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${userName}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء!`)) return;
    
    try {
      const res = await deleteAdminUser(userId);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        alert("فشل الحذف: " + res.error);
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
    setEditPassword(""); // Blank password implies no change
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const saveEdit = async () => {
    if (!editingUserId) return;
    setIsSaving(true);
    try {
      const res = await updateAdminUser(editingUserId, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        password: editPassword,
      });

      if (res.success) {
        setUsers(users.map(u => u.id === editingUserId ? { ...u, name: editName, email: editEmail, phone: editPhone } : u));
        setEditingUserId(null);
      } else {
        alert("فشل التحديث: " + res.error);
      }
    } catch (err) {
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-lg">
          <Users size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">إدارة المستخدمين المسجلين</h2>
        <div className="mr-auto bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300">
          العدد: {users.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-slate-100 dark:border-slate-800">
              <th className="py-3 px-4 text-sm font-black text-slate-500">الإسم</th>
              <th className="py-3 px-4 text-sm font-black text-slate-500">البريد الإلكتروني</th>
              <th className="py-3 px-4 text-sm font-black text-slate-500">رقم الجوال</th>
              <th className="py-3 px-4 text-sm font-black text-slate-500 text-center">تاريخ التسجيل</th>
              <th className="py-3 px-4 text-sm font-black text-slate-500 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                
                {editingUserId === user.id ? (
                  <td colSpan={5} className="py-4 px-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">الإسم</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">البريد الإلكتروني</label>
                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">رقم الجوال</label>
                        <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Key size={12}/> كلمة المرور (اتركه فارغاً إذا لم ترغب بتغييره)</label>
                        <input type="text" placeholder="كلمة المرور الجديدة" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500" />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        <button onClick={cancelEdit} className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1">
                          <X size={16} /> إلغاء
                        </button>
                        <button onClick={saveEdit} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50">
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} حفظ
                        </button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{user.name}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400" dir="ltr">{user.email || "—"}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400" dir="ltr">{user.phone || "—"}</td>
                    <td className="py-4 px-4 text-slate-500 text-sm text-center" dir="ltr">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => startEdit(user)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg transition-colors" title="تعديل المستخدم">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-lg transition-colors" title="حذف المستخدم">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 font-bold">لا يوجد مستخدمين مسجلين بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
