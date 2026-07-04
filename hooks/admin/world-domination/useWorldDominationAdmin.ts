"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { WDCountry } from "@/types";
import { toast } from "sonner";

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

  // تحديات الحكم ستصبح كائنات لتخزين الـ ID والـ Question
  const [wdChallengesDB, setWdChallengesDB] = useState<{ id: string; question: string }[]>([]);
  const [newWdChallenge, setNewWdChallenge] = useState<string>("");

  const formRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [supabase]);

  const loadData = async () => {
    setIsLoading(true);
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
            a: q.answer || ""
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
      setIsLoading(false);
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

  const addWdQuestion = async () => {
    if (!newWdQ.trim() || !wdOpt1.trim() || !wdOpt2.trim() || !wdOpt3.trim() || !managingQuestionsFor) {
      toast.error("الرجاء تعبئة السؤال والخيارات الثلاثة.");
      return;
    }

    const options = [wdOpt1.trim(), wdOpt2.trim(), wdOpt3.trim()];
    const answer = options[wdCorrectOpt - 1];

    const { error } = await supabase
      .from("wd_country_questions")
      .insert({
        country_id: managingQuestionsFor,
        question: newWdQ.trim(),
        options: options,
        answer: answer
      });

    if (error) {
      toast.error("تعذر إضافة السؤال: " + error.message);
      return;
    }

    await loadData();
    setNewWdQ(""); setWdOpt1(""); setWdOpt2(""); setWdOpt3(""); setWdCorrectOpt(1);
    toast.success("تمت إضافة السؤال بنجاح");
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

    await loadData();
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

  return {
    wdActiveSubTab, setWdActiveSubTab, isLoading,
    wdCountries, newWdCountryName, setNewWdCountryName,
    selectedGeoId, setSelectedGeoId, editingCountryId,
    managingQuestionsFor, setManagingQuestionsFor,
    newWdQ, setNewWdQ, wdOpt1, setWdOpt1, wdOpt2, setWdOpt2, wdOpt3, setWdOpt3, wdCorrectOpt, setWdCorrectOpt,
    wdChallengesDB, newWdChallenge, setNewWdChallenge,
    formRef, questionsRef,
    scrollToForm, scrollToQuestions, addWdCountry, startEditingWdCountry, cancelEditWdCountry, deleteWdCountry,
    addWdQuestion, deleteWdQuestion, addWdChallenge, deleteWdChallenge
  };
}