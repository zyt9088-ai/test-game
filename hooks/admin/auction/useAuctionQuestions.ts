"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface AuctionQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  answer: string;
}

export function useAuctionQuestions() {
  const supabase = getSupabaseBrowser();

  const [questions, setQuestions] = useState<AuctionQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const defaultCategories = ["تاريخ", "دين", "رياضة", "علوم", "جغرافيا"];
  const uniqueCategories = Array.from(new Set([...defaultCategories, ...questions.map(q => q.category)]));
  
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const categoryRef = useRef<HTMLDivElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    category: string; question: string; opt1: string; opt2: string; opt3: string; correctOption: 1 | 2 | 3;
  }>({
    category: "", question: "", opt1: "", opt2: "", opt3: "", correctOption: 1,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      const localData = localStorage.getItem("admin_aw_questions_db");
      if (localData) {
        setQuestions(JSON.parse(localData));
      }

      const { data, error } = await supabase
        .from("aw_settings")
        .select("*")
        .eq("id", "admin_aw_questions_db")
        .single();

      if (data && data.data) {
        setQuestions(data.data);
        localStorage.setItem("admin_aw_questions_db", JSON.stringify(data.data));
      }
      setIsLoading(false);
    };
    loadQuestions();
  }, [supabase]);

  const handleSaveDB = async (updatedQuestions: AuctionQuestion[]) => {
    setIsSaving(true);
    setQuestions(updatedQuestions);
    localStorage.setItem("admin_aw_questions_db", JSON.stringify(updatedQuestions));

    await supabase.from("aw_settings").upsert({
      id: "admin_aw_questions_db",
      data: updatedQuestions,
      updated_at: new Date().toISOString(),
    });
    setIsSaving(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.question || !formData.opt1 || !formData.opt2 || !formData.opt3) {
      toast.error("الرجاء تعبئة جميع الحقول!");
      return;
    }

    const answerString = 
      formData.correctOption === 1 ? formData.opt1 : 
      formData.correctOption === 2 ? formData.opt2 : 
      formData.opt3;

    const newQuestion: AuctionQuestion = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      category: formData.category,
      question: formData.question,
      options: [formData.opt1, formData.opt2, formData.opt3],
      answer: answerString,
    };

    let updatedQs = [];
    if (editingId) {
      updatedQs = questions.map((q) => (q.id === editingId ? newQuestion : q));
      setEditingId(null);
    } else {
      updatedQs = [...questions, newQuestion];
    }

    setFormData({
      category: formData.category,
      question: "", opt1: "", opt2: "", opt3: "", correctOption: 1,
    });
    await handleSaveDB(updatedQs);
  };

  const handleEdit = (q: AuctionQuestion) => {
    setEditingId(q.id);
    let correctOpt: 1 | 2 | 3 = 1;
    if (q.answer === q.options[1]) correctOpt = 2;
    if (q.answer === q.options[2]) correctOpt = 3;

    setFormData({
      category: q.category, question: q.question,
      opt1: q.options[0] || "", opt2: q.options[1] || "", opt3: q.options[2] || "",
      correctOption: correctOpt,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("متأكد أنك تبي تحذف هالسؤال؟")) {
      const updatedQs = questions.filter((q) => q.id !== id);
      await handleSaveDB(updatedQs);
    }
  };

  return {
    questions, isLoading, isSaving, uniqueCategories,
    isCategoryDropdownOpen, setIsCategoryDropdownOpen,
    isAddingCategory, setIsAddingCategory,
    newCategory, setNewCategory, categoryRef,
    editingId, setEditingId, formData, setFormData,
    handleSubmit, handleEdit, handleDelete
  };
}