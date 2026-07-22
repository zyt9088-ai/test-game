"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { WDCountry } from "@/types";
import { toast } from "sonner";
import { exportToCSV, parseCSV } from "@/lib/csvHelper";

export function useWorldDominationAdmin() {
  const supabase = getSupabaseBrowser();

  const [wdActiveSubTab, setWdActiveSubTab] = useState<"map" | "challenges">("map");
  const [isLoading, setIsLoading] = useState(true);
  const [wdCountries, setWdCountries] = useState<WDCountry[]>([]);
  const [newWdCountryName, setNewWdCountryName] = useState<string>("");
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [managingQuestionsFor, setManagingQuestionsFor] = useState<string | null>(null);

  const [newWdQ, setNewWdQ] = useState<string>("");
  const [wdOpt1, setWdOpt1] = useState<string>("");
  const [wdOpt2, setWdOpt2] = useState<string>("");
  const [wdOpt3, setWdOpt3] = useState<string>("");
  const [wdCorrectOpt, setWdCorrectOpt] = useState<number>(1);
  const [wdDifficulty, setWdDifficulty] = useState<"سهل" | "متوسط" | "صعب">("متوسط");

  // إضافة فئات أسئلة السيطرة على العالم
  const [wdCategory, setWdCategory] = useState<string>("معلومات عامة");
  const [customWdCategories, setCustomWdCategories] = useState<string[]>([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [targetQuestionForCategory, setTargetQuestionForCategory] = useState<string | null>(null);
  const [newCategoryModalInput, setNewCategoryModalInput] = useState<string>("");

  const defaultWdCategories = ["رياضة", "دين", "تاريخ", "علوم", "جغرافيا", "معلومات عامة"];

  // دمج كل الفئات الافتراضية مع المخصصة والموجودة في الأسئلة
  const allWdCategories = Array.from(
    new Set([
      ...defaultWdCategories,
      ...customWdCategories,
      ...wdCountries.flatMap((c) => (c.questions || []).map((q: any) => q.category)).filter(Boolean)
    ])
  );

  const openAddCategoryModal = (questionDbId: string | null = null) => {
    setTargetQuestionForCategory(questionDbId);
    setNewCategoryModalInput("");
    setIsAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
    setTargetQuestionForCategory(null);
    setNewCategoryModalInput("");
  };

  const handleAddNewWdCategory = (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return;

    if (!customWdCategories.includes(trimmed)) {
      setCustomWdCategories((prev) => [...prev, trimmed]);
    }

    if (targetQuestionForCategory) {
      updateWdQuestionCategory(targetQuestionForCategory, trimmed);
    } else {
      setWdCategory(trimmed);
    }

    toast.success(`تمت إضافة فئة "${trimmed}" للقائمة بنجاح!`);
    closeAddCategoryModal();
  };

  // تحديات الحكم ستصبح كائنات لتخزين الـ ID والـ Question
  const [wdChallengesDB, setWdChallengesDB] = useState<{ id: string; question: string }[]>([]);
  const [newWdChallenge, setNewWdChallenge] = useState<string>("");

  const formRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [supabase]);

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      // 1. جلب الدول
      const { data: countriesData, error: countriesError } = await supabase
        .from("wd_countries")
        .select("*");

      if (countriesError) throw countriesError;

      // 2. جلب الأسئلة
      const { data: questionsData, error: questionsError } = await supabase
        .from("wd_country_questions")
        .select("*");

      if (questionsError) throw questionsError;

      // 3. جلب التحديات
      const { data: challengesData, error: challengesError } = await supabase
        .from("wd_challenges")
        .select("*");

      if (challengesError) throw challengesError;

      // دمج الدول مع أسئلتها بالصيغة القديمة التي تستخدمها الواجهة
      const formattedCountries: WDCountry[] = (countriesData || []).map((country) => {
        const countryQuestions = (questionsData || [])
          .filter((q) => q.country_id === country.id)
          .map((q) => ({
            dbId: q.id, // نحفظ الآيدي للحذف لاحقاً
            q: q.question,
            options: q.options || [],
            a: q.answer || "",
            difficulty: q.difficulty || "متوسط",
            category: q.category || "معلومات عامة"
          }));

        return {
          id: country.id,
          geoId: country.geo_id,
          name: country.name,
          questions: countryQuestions,
          value: 0,
          isActive: true,
          isChallenge: false,
          owner: null,
          lastOwner: null,
          originalValue: 0
        };
      });

      setWdCountries(formattedCountries);
      setWdChallengesDB(challengesData || []);

    } catch (e: any) {
      console.error("Error loading WD data:", e);
      toast.error("حدث خطأ أثناء جلب البيانات!");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const scrollToQuestions = () => {
    setTimeout(() => {
      questionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const addWdCountry = async () => {
    if (!selectedGeoId || !newWdCountryName.trim()) {
      toast.error("الرجاء اختيار دولة من الخريطة وكتابة اسمها أولاً.");
      return;
    }

    if (editingCountryId) {
      const { error } = await supabase
        .from("wd_countries")
        .update({ name: newWdCountryName.trim(), geo_id: selectedGeoId })
        .eq("id", editingCountryId);

      if (error) {
        toast.error("تعذر التعديل: " + error.message);
        return;
      }

      setEditingCountryId(null);
      await loadData();
      toast.success("تم التعديل بنجاح");
    } else {
      const newId = `c_${Date.now()}`;
      const { error } = await supabase
        .from("wd_countries")
        .insert({ id: newId, geo_id: selectedGeoId, name: newWdCountryName.trim() });

      if (error) {
        toast.error("تعذر الإضافة: " + error.message);
        return;
      }

      await loadData();
      setManagingQuestionsFor(newId);
      scrollToQuestions();
      toast.success("تمت الإضافة بنجاح");
    }
    setNewWdCountryName("");
    setSelectedGeoId(null);
  };

  const startEditingWdCountry = (c: WDCountry) => {
    setEditingCountryId(c.id);
    setNewWdCountryName(c.name);
    setSelectedGeoId(c.geoId);
    scrollToForm();
  };

  const cancelEditWdCountry = () => {
    setEditingCountryId(null);
    setNewWdCountryName("");
    setSelectedGeoId(null);
  };

  const deleteWdCountry = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدولة بالكامل (مع أسئلتها)؟")) {
      const { error } = await supabase
        .from("wd_countries")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("تعذر الحذف: " + error.message);
        return;
      }

      await loadData();
      if (editingCountryId === id) cancelEditWdCountry();
      if (managingQuestionsFor === id) setManagingQuestionsFor(null);
      toast.success("تم الحذف بنجاح");
    }
  };

  const [editingWdQuestionDbId, setEditingWdQuestionDbId] = useState<string | null>(null);

  const startEditingWdQuestion = (q: any) => {
    setEditingWdQuestionDbId(q.dbId);
    setNewWdQ(q.q || "");
    setWdOpt1(q.options[0] || "");
    setWdOpt2(q.options[1] || "");
    setWdOpt3(q.options[2] || "");
    let correctIndex = 1;
    if (q.a === q.options[1]) correctIndex = 2;
    if (q.a === q.options[2]) correctIndex = 3;
    setWdCorrectOpt(correctIndex);
    setWdDifficulty(q.difficulty || "متوسط");
    setWdCategory(q.category || "معلومات عامة");

    setTimeout(() => {
      questionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const cancelEditWdQuestion = () => {
    setEditingWdQuestionDbId(null);
    setNewWdQ("");
    setWdOpt1("");
    setWdOpt2("");
    setWdOpt3("");
    setWdCorrectOpt(1);
    setWdDifficulty("متوسط");
  };

  const addWdQuestion = async () => {
    if (!newWdQ.trim() || !wdOpt1.trim() || !wdOpt2.trim() || !wdOpt3.trim() || !managingQuestionsFor) {
      toast.error("الرجاء تعبئة السؤال والخيارات الثلاثة.");
      return;
    }

    const options = [wdOpt1.trim(), wdOpt2.trim(), wdOpt3.trim()];
    const answer = options[wdCorrectOpt - 1];

    if (editingWdQuestionDbId) {
      let { error } = await supabase
        .from("wd_country_questions")
        .update({
          question: newWdQ.trim(),
          options: options,
          answer: answer,
          difficulty: wdDifficulty,
          category: wdCategory || "معلومات عامة"
        })
        .eq("id", editingWdQuestionDbId);

      if (error && (error.message.includes("category") || error.message.includes("schema cache"))) {
        const res = await supabase
          .from("wd_country_questions")
          .update({
            question: newWdQ.trim(),
            options: options,
            answer: answer,
            difficulty: wdDifficulty
          })
          .eq("id", editingWdQuestionDbId);
        error = res.error;
      }

      if (error) {
        toast.error("تعذر تحديث السؤال: " + error.message);
        return;
      }

      setEditingWdQuestionDbId(null);
      toast.success("تم تحديث السؤال بنجاح");
    } else {
      let { error } = await supabase
        .from("wd_country_questions")
        .insert({
          country_id: managingQuestionsFor,
          question: newWdQ.trim(),
          options: options,
          answer: answer,
          difficulty: wdDifficulty,
          category: wdCategory || "معلومات عامة"
        });

      if (error && (error.message.includes("category") || error.message.includes("schema cache"))) {
        const res = await supabase
          .from("wd_country_questions")
          .insert({
            country_id: managingQuestionsFor,
            question: newWdQ.trim(),
            options: options,
            answer: answer,
            difficulty: wdDifficulty
          });
        error = res.error;
      }

      if (error) {
        toast.error("تعذر إضافة السؤال: " + error.message);
        return;
      }

      toast.success("تمت إضافة السؤال بنجاح");
    }

    await loadData(true);
    setNewWdQ(""); setWdOpt1(""); setWdOpt2(""); setWdOpt3(""); setWdCorrectOpt(1); setWdDifficulty("متوسط");
  };

  const updateWdQuestionDifficulty = async (questionDbId: string, difficulty: "سهل" | "متوسط" | "صعب") => {
    if (!questionDbId) return;

    // تحديث فوري محلياً بدون إغلاق الواجهة أو إعادة الشاشة
    setWdCountries((prev) =>
      prev.map((country) => ({
        ...country,
        questions: country.questions?.map((q: any) =>
          q.dbId === questionDbId ? { ...q, difficulty } : q
        ),
      }))
    );

    const { error } = await supabase
      .from("wd_country_questions")
      .update({ difficulty })
      .eq("id", questionDbId);

    if (error) {
      toast.error("تعذر تحديث التصنيف: " + error.message);
      await loadData(true);
      return;
    }

    toast.success("تم تحديث مستوى صعوبة السؤال بنجاح");
  };

  const updateWdQuestionCategory = async (questionDbId: string, category: string) => {
    if (!questionDbId || !category) return;

    setWdCountries((prev) =>
      prev.map((country) => ({
        ...country,
        questions: country.questions?.map((q: any) =>
          q.dbId === questionDbId ? { ...q, category } : q
        ),
      }))
    );

    const { error } = await supabase
      .from("wd_country_questions")
      .update({ category })
      .eq("id", questionDbId);

    if (error) {
      if (error.message.includes("category") || error.message.includes("schema cache")) {
        toast.error("يرجى إضافة عامود category في قاعدة البيانات أولاً بالـ SQL المرفق!");
      } else {
        toast.error("تعذر تحديث الفئة: " + error.message);
      }
      return;
    }

    toast.success("تم تحديث فئة السؤال بنجاح");
  };

  const updateWdQuestionAnswer = async (questionDbId: string, newAnswer: string) => {
    if (!questionDbId || !newAnswer) return;

    setWdCountries((prev) =>
      prev.map((country) => ({
        ...country,
        questions: country.questions?.map((q: any) =>
          q.dbId === questionDbId ? { ...q, a: newAnswer } : q
        ),
      }))
    );

    const { error } = await supabase
      .from("wd_country_questions")
      .update({ answer: newAnswer })
      .eq("id", questionDbId);

    if (error) {
      toast.error("تعذر تحديث الإجابة: " + error.message);
      await loadData(true);
      return;
    }

    toast.success("تم تحديد الإجابة الصحيحة بنجاح");
  };

  const deleteWdQuestion = async (qIndex: number) => {
    const country = wdCountries.find(c => c.id === managingQuestionsFor);
    if (!country || !country.questions) return;

    // @ts-ignore
    const questionDbId = country.questions[qIndex].dbId;
    if (!questionDbId) {
      toast.error("لا يمكن حذف السؤال (معرّف مفقود)");
      return;
    }

    const { error } = await supabase
      .from("wd_country_questions")
      .delete()
      .eq("id", questionDbId);

    if (error) {
      toast.error("تعذر الحذف: " + error.message);
      return;
    }

    await loadData(true);
    toast.success("تم حذف السؤال بنجاح");
  };

  const addWdChallenge = async () => {
    if (!newWdChallenge.trim()) return;

    const { error } = await supabase
      .from("wd_challenges")
      .insert({ question: newWdChallenge.trim() });

    if (error) {
      toast.error("تعذر إضافة التحدي: " + error.message);
      return;
    }

    await loadData();
    setNewWdChallenge("");
    toast.success("تمت إضافة التحدي بنجاح");
  };

  const deleteWdChallenge = async (id: string) => {
    const { error } = await supabase
      .from("wd_challenges")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("تعذر حذف التحدي: " + error.message);
      return;
    }

    await loadData();
    toast.success("تم حذف التحدي بنجاح");
  };

  const exportCSV = () => {
    const headers = ["الدولة", "الفئة", "السؤال", "الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الإجابة الصحيحة", "الصعوبة"];
    const rows: string[][] = [];

    wdCountries.forEach((country) => {
      country.questions?.forEach((q: any) => {
        rows.push([
          country.name,
          q.category || "معلومات عامة",
          q.q || "",
          q.options[0] || "",
          q.options[1] || "",
          q.options[2] || "",
          q.a || "",
          q.difficulty || "متوسط"
        ]);
      });
    });

    exportToCSV("اسئلة_السيطرة_على_العالم", headers, rows);
    toast.success("تم تصدير ملف CSV بنجاح مع الفئات والمستويات!");
  };

  const importCSV = async (file: File) => {
    try {
      const text = await file.text();
      const data = parseCSV(text);
      if (data.length <= 1) {
        toast.error("الملف فارغ أو صيغته غير صحيحة!");
        return;
      }

      const rows = data.slice(1);
      let count = 0;

      for (const row of rows) {
        if (row.length < 2) continue;

        let countryName = "";
        let category = "معلومات عامة";
        let question = "";
        let opt1 = "";
        let opt2 = "";
        let opt3 = "";
        let answer = "";
        let difficulty = "متوسط";

        if (row.length >= 8) {
          [countryName, category, question, opt1, opt2, opt3, answer, difficulty] = row;
        } else {
          [countryName, question, opt1, opt2, opt3, answer, difficulty] = row;
        }

        if (!question || !countryName) continue;

        let country = wdCountries.find(c => c.name.trim() === countryName.trim());
        let countryId = country?.id;

        if (!countryId) {
          countryId = `c_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const { error: cErr } = await supabase
            .from("wd_countries")
            .insert({ id: countryId, geo_id: "US", name: countryName.trim() });
          if (cErr) continue;
        }

        const options = [opt1 || "", opt2 || "", opt3 || ""].filter(Boolean);
        const correctAnswer = answer || options[0] || "";
        const catVal = (category || "معلومات عامة").trim();

        let { error } = await supabase.from("wd_country_questions").insert({
          country_id: countryId,
          question: question.trim(),
          category: catVal,
          options: options.length > 0 ? options : [correctAnswer],
          answer: correctAnswer,
          difficulty: (difficulty === "سهل" || difficulty === "صعب") ? difficulty : "متوسط"
        });

        if (error && (error.message.includes("category") || error.message.includes("schema cache"))) {
          const res = await supabase.from("wd_country_questions").insert({
            country_id: countryId,
            question: question.trim(),
            options: options.length > 0 ? options : [correctAnswer],
            answer: correctAnswer,
            difficulty: (difficulty === "سهل" || difficulty === "صعب") ? difficulty : "متوسط"
          });
          error = res.error;
        }

        if (!error) count++;
      }

      await loadData();
      toast.success(`تم استيراد ${count} سؤال بنجاح!`);
    } catch (e: any) {
      console.error("Error importing CSV:", e);
      toast.error("حدث خطأ أثناء استيراد الملف!");
    }
  };

  return {
    wdActiveSubTab, setWdActiveSubTab, isLoading,
    wdCountries, newWdCountryName, setNewWdCountryName,
    selectedGeoId, setSelectedGeoId, editingCountryId,
    managingQuestionsFor, setManagingQuestionsFor,
    newWdQ, setNewWdQ, wdOpt1, setWdOpt1, wdOpt2, setWdOpt2, wdOpt3, setWdOpt3, wdCorrectOpt, setWdCorrectOpt,
    wdDifficulty, setWdDifficulty, updateWdQuestionDifficulty, updateWdQuestionAnswer,
    wdCategory, setWdCategory, defaultWdCategories, customWdCategories, allWdCategories, updateWdQuestionCategory,
    isAddCategoryModalOpen, newCategoryModalInput, setNewCategoryModalInput, openAddCategoryModal, closeAddCategoryModal, handleAddNewWdCategory,
    wdChallengesDB, newWdChallenge, setNewWdChallenge,
    formRef, questionsRef,
    scrollToForm, scrollToQuestions, addWdCountry, startEditingWdCountry, cancelEditWdCountry, deleteWdCountry,
    editingWdQuestionDbId, startEditingWdQuestion, cancelEditWdQuestion,
    addWdQuestion, deleteWdQuestion, addWdChallenge, deleteWdChallenge,
    exportCSV, importCSV
  };
}