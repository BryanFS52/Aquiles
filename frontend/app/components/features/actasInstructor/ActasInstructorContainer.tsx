"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { toast } from "react-toastify";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { useLoader } from "@context/LoaderContext";
import {
  addFinalReport as addFinalReportAction,
  fetchFinalReport as fetchFinalReportsAction,
} from "@/redux/slices/finalReportSlice";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  FileText,
  Search,
  ShieldAlert,
  Signature,
  Upload,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Card as BaseCard } from "@components/UI/Card";
import { Input, Label, Select, TextArea } from "./Primitives";
import { Stepper } from "./Stepper";
import {
  FinalReportForm,
  Step,
  StudySheetItem,
  TeacherStudySheetItem,
} from "./types";
import { filesToBase64Joined, formatDateES } from "./utils";
import { FileDropzoneMulti, FileDropzoneSingle } from "./FilePicker";
import PageTitle from "@components/UI/pageTitle";

const steps: Step[] = [
  { key: 1, label: "Seleccionar ficha", icon: Search },
  { key: 2, label: "Datos generales", icon: FileText },
  { key: 3, label: "Disciplina y conclusiones", icon: ShieldAlert },
  { key: 4, label: "Adjuntar archivos", icon: Upload },
  { key: 5, label: "Estado y competencia", icon: CalendarClock },
  { key: 6, label: "Confirmación", icon: CheckCircle2 },
];

const initialForm: FinalReportForm = {
  fileNumber: "",
  objectives: "",
  disciplinaryOffenses: "",
  conclusions: "",
  annexesFiles: [],
  signatureFile: null,
  state: true,
  competenceQuarterId: null,
};

export const ActasInstructorContainer: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [now] = useState<Date>(new Date());
  const { showLoader, hideLoader } = useLoader();

  // Step 1 - ficha selection
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { data: studySheets, loading: loadingSheets } = useSelector(
    (s: RootState) => s.studySheet
  );
  const { data: finalReports = [], loading: loadingReports } = useSelector(
    (s: RootState) => s.finalReport
  );
  const [selectedSheet, setSelectedSheet] = useState<StudySheetItem | null>(
    null
  );
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Competences for selected sheet
  const [competences, setCompetences] = useState<TeacherStudySheetItem[]>([]);

  // Form
  const [form, setForm] = useState<FinalReportForm>(initialForm);
  const [saving, setSaving] = useState<boolean>(false);

  // Fetch final reports when a ficha is selected (to show existing actas)
  useEffect(() => {
    if (selectedSheet) {
      dispatch(fetchFinalReportsAction({ page: 0, size: 5 }));
    }
  }, [dispatch, selectedSheet]);

  // Filtered lists for UI
  const reportsForSelectedSheet = useMemo(() => {
    if (!selectedSheet || !(finalReports as any[])?.length) return [] as any[];
    return (finalReports as any[]).filter(
      (fr) =>
        String(fr?.competenceQuarter?.studySheet?.number ?? "") ===
        String(selectedSheet.number)
    );
  }, [finalReports, selectedSheet]);

  const selectedCompetenceName = useMemo(() => {
    return (
      competences.find((c) => c.id === form.competenceQuarterId)?.competence
        ?.name || null
    );
  }, [competences, form.competenceQuarterId]);

  const reportsForSelectedCompetence = useMemo(() => {
    if (!selectedCompetenceName) return [] as any[];
    return reportsForSelectedSheet.filter(
      (fr) =>
        (fr?.competenceQuarter?.competence?.name || "") ===
        selectedCompetenceName
    );
  }, [reportsForSelectedSheet, selectedCompetenceName]);

  const canGoNext = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedSheet;
      case 2:
        return (
          form.fileNumber.trim().length > 0 && form.objectives.trim().length > 0
        );
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return form.competenceQuarterId !== null;
      case 6:
        return true;
      default:
        return false;
    }
  }, [step, selectedSheet, form]);

  useEffect(() => {
    dispatch(
      fetchStudySheetByTeacher({
        idTeacher: TEMPORAL_INSTRUCTOR_ID,
        page: 0,
        size: 20,
      })
    );
  }, [dispatch]);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setSearch(v.trim()), 300);
  };

  const selectSheet = (s: StudySheetItem) => {
    setSelectedSheet(s);
    setForm((f) => ({ ...f, competenceQuarterId: null }));
    setCompetences(s.teacherStudySheets || []);
  };

  const next = () => setStep((s) => Math.min(6, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!selectedSheet) {
      toast.error("Selecciona una ficha antes de guardar");
      setStep(1);
      return;
    }
    if (!form.competenceQuarterId) {
      toast.error("Selecciona la competencia o trimestre asociado");
      setStep(5);
      return;
    }
    if (!form.fileNumber || !form.objectives) {
      toast.error("Completa los datos generales requeridos");
      setStep(2);
      return;
    }

    setSaving(true);
    showLoader();
    try {

      let annexes: string | undefined = undefined;
      if (form.annexesFiles.length > 0) {
        const base64 = await filesToBase64Joined(form.annexesFiles);
        if (base64 && typeof base64 === 'string' && base64.trim() !== '') {
          annexes = base64;
        }
      }
      const signature = form.signatureFile
        ? await filesToBase64Joined([form.signatureFile])
        : undefined;

      const variables = {
        input: {
          fileNumber: form.fileNumber,
          objectives: form.objectives,
          disciplinaryOffenses: form.disciplinaryOffenses || undefined,
          conclusions: form.conclusions || undefined,
          annexes,
          signature,
          state: Boolean(form.state),
          competenceQuarter: Number(form.competenceQuarterId),
        },
      } as const;

      const result = await dispatch(addFinalReportAction(variables.input));
      if (addFinalReportAction.fulfilled.match(result)) {
        toast.success("Acta guardada correctamente", { autoClose: 2500 });
        // Refresh list so the new acta appears
        dispatch(fetchFinalReportsAction({ page: 0, size: 5 }));
        setStep(6);
      } else {
        const payload: any = (result as any).payload;
        toast.warn(payload?.message || "No se pudo guardar el acta");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el acta");
    } finally {
      setSaving(false);
      hideLoader();
    }
  };

  return (
    <div className="p-4 md:p-6 pb-28 overflow-visible">
      <PageTitle>Actas de Cierre de Trimestre</PageTitle>
      <div className="mb-6">
        <BaseCard
          header={
            <div className="flex items-center justify-between pb-3">
              <p className="text-sm text-darkGray">
                Registra y gestiona el Acta de Cierre para una ficha y
                competencia asignada.
              </p>
              <div className="hidden md:flex items-center gap-2 text-secondary">
                <CalendarClock size={18} />
                <span className="text-sm">{formatDateES(now)}</span>
              </div>
            </div>
          }
          body={
            <div className="pt-4 pb-8">
              <Stepper steps={steps} current={step} />
            </div>
          }
        />
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <BaseCard
            className="lg:col-span-8"
            header={
              <div className="flex items-center gap-3">
                <Search className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">Buscar ficha</h3>
              </div>
            }
            body={
              <>
                <div className="relative">
                  <Input
                    placeholder="Buscar por número o programa..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <ChevronRight
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-darkGray"
                    size={18}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-auto scrollbar-thin">
                  {loadingSheets && (
                    <p className="text-sm text-darkGray">Cargando fichas...</p>
                  )}
                  {!loadingSheets && (studySheets?.length ?? 0) === 0 && (
                    <p className="text-sm text-darkGray">
                      No hay fichas disponibles.
                    </p>
                  )}
                  {(studySheets || [])
                    .map((it: any) => ({
                      id: Number(it.id),
                      number: String(it.number ?? ""),
                      journey: it.journey || null,
                      trainingProject: it.trainingProject || null,
                      teacherStudySheets: (it.teacherStudySheets || []).map(
                        (t: any) => ({
                          id: Number(t.id),
                          competence: t.competence || null,
                        })
                      ),
                    }))
                    .filter((s: StudySheetItem) => {
                      const q = search.toLowerCase();
                      return (
                        s.number.toLowerCase().includes(q) ||
                        (s.trainingProject?.program?.name || "")
                          .toLowerCase()
                          .includes(q)
                      );
                    })
                    .map((s: StudySheetItem) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => selectSheet(s)}
                        className={`group text-left rounded-2xl border p-4 transition shadow-sm hover:shadow-md ${
                          selectedSheet?.id === s.id
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "border-lightGray bg-white hover:border-primary/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-secondary">
                              Ficha {s.number}
                            </p>
                            <p className="text-xs text-darkGray">
                              {s.trainingProject?.program?.name ||
                                "Sin programa"}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-lg bg-secondary/10 text-secondary">
                            {s.journey?.name || "—"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-lightGray/60 px-2 py-1 text-darkGray">
                            {(s.teacherStudySheets || []).length} competencias
                          </span>
                          <span className="text-secondary/70 group-hover:text-secondary">
                            Ver detalles
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </>
            }
          />

          <BaseCard
            className="lg:col-span-4"
            header={
              <div className="flex items-center gap-3">
                <BookOpen className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">Detalle</h3>
              </div>
            }
            body={
              !selectedSheet ? (
                <p className="text-sm text-darkGray">
                  Selecciona una ficha para ver su información.
                </p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-darkGray">Programa:</span>{" "}
                    {selectedSheet.trainingProject?.program?.name || "—"}
                  </p>
                  <p>
                    <span className="text-darkGray">Jornada:</span>{" "}
                    {selectedSheet.journey?.name || "—"}
                  </p>
                  <p>
                    <span className="text-darkGray">Competencias:</span>{" "}
                    {(selectedSheet.teacherStudySheets || []).length}
                  </p>
                  {/* Existing actas for this ficha */}
                  <div className="mt-3 pt-3 border-t border-lightGray/60">
                    <div className="flex items-center justify-between">
                      <span className="text-darkGray">
                        Actas generadas (ficha)
                      </span>
                      <span className="text-secondary font-medium">
                        {reportsForSelectedSheet.length}
                      </span>
                    </div>
                    <div className="mt-2 max-h-40 overflow-auto space-y-2 scrollbar-thin">
                      {loadingReports && (
                        <p className="text-xs text-darkGray">Cargando actas…</p>
                      )}
                      {!loadingReports &&
                        reportsForSelectedSheet.length === 0 && (
                          <p className="text-xs text-darkGray">
                            No hay actas registradas para esta ficha.
                          </p>
                        )}
                      {reportsForSelectedSheet.slice(0, 5).map((fr: any) => (
                        <div
                          key={fr.id}
                          className="flex items-start gap-2 p-2 rounded-lg bg-lightGray/40"
                        >
                          <FileText
                            size={14}
                            className="text-secondary mt-0.5"
                          />
                          <div className="leading-tight">
                            <p className="text-xs font-medium text-secondary">
                              {fr.fileNumber || "—"}
                            </p>
                            <p className="text-[11px] text-darkGray">
                              {fr?.competenceQuarter?.competence?.name || "—"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
          />
        </div>
      )}

      {step === 2 && (
        <BaseCard
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">
                  Datos generales
                </h3>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <CalendarClock size={16} />
                <span className="text-xs">{formatDateES(now)}</span>
              </div>
            </div>
          }
          body={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fileNumber">Número del acta</Label>
                <Input
                  id="fileNumber"
                  placeholder="Ej: ACTA-2025-001"
                  value={form.fileNumber}
                  onChange={(e) =>
                    setForm({ ...form, fileNumber: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="objectives">Objetivos del cierre</Label>
                <TextArea
                  id="objectives"
                  rows={4}
                  placeholder="Describe los objetivos alcanzados durante el trimestre…"
                  value={form.objectives}
                  onChange={(e) =>
                    setForm({ ...form, objectives: e.target.value })
                  }
                />
              </div>
            </div>
          }
        />
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BaseCard
            header={
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">
                  Aspectos disciplinarios
                </h3>
              </div>
            }
            body={
              <TextArea
                rows={6}
                placeholder="Describe las faltas disciplinarias relevantes…"
                value={form.disciplinaryOffenses}
                onChange={(e) =>
                  setForm({ ...form, disciplinaryOffenses: e.target.value })
                }
              />
            }
          />

          <BaseCard
            header={
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">Conclusiones</h3>
              </div>
            }
            body={
              <TextArea
                rows={6}
                placeholder="Conclusiones del cierre de trimestre…"
                value={form.conclusions}
                onChange={(e) =>
                  setForm({ ...form, conclusions: e.target.value })
                }
              />
            }
          />
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BaseCard
            header={
              <div className="flex items-center gap-3">
                <Upload className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">
                  Adjuntar anexos
                </h3>
              </div>
            }
            body={
              <FileDropzoneMulti
                label="Archivos anexos"
                description="Puedes subir PDF o imágenes relacionadas con el acta."
                accept=".pdf,image/*"
                maxSizeMB={10}
                files={form.annexesFiles}
                onFilesChange={(files) =>
                  setForm({ ...form, annexesFiles: files })
                }
              />
            }
          />

          <BaseCard
            header={
              <div className="flex items-center gap-3">
                <Signature className="text-secondary" size={18} />
                <h3 className="text-secondary font-semibold">Firma digital</h3>
              </div>
            }
            body={
              <FileDropzoneSingle
                label="Imagen de la firma"
                description="Carga una imagen nítida de la firma (PNG o JPG)."
                accept="image/*"
                maxSizeMB={5}
                file={form.signatureFile}
                onFileChange={(file) =>
                  setForm({ ...form, signatureFile: file })
                }
              />
            }
          />
        </div>
      )}

      {step === 5 && (
        <BaseCard
          header={
            <div className="flex items-center gap-3">
              <CalendarClock className="text-secondary" size={18} />
              <h3 className="text-secondary font-semibold">
                Estado y competencia
              </h3>
            </div>
          }
          body={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <div className="mb-3">
                  <Label>Estado del acta</Label>
                </div>
                <div className="inline-flex rounded-xl overflow-hidden border border-lightGray">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, state: true })}
                    className={`px-4 py-2 text-sm transition ${
                      form.state
                        ? "bg-primary text-white"
                        : "bg-white text-secondary hover:bg-lightGray"
                    }`}
                    aria-pressed={form.state}
                  >
                    Aprobada
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, state: false })}
                    className={`px-4 py-2 text-sm border-l border-lightGray transition ${
                      !form.state
                        ? "bg-secondary text-white"
                        : "bg-white text-secondary hover:bg-lightGray"
                    }`}
                    aria-pressed={!form.state}
                  >
                    No aprobada
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <Label>Competencia</Label>
                </div>
                <Select
                  value={form.competenceQuarterId ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      competenceQuarterId: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                >
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {competences.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.competence?.name || `Competencia ${c.id}`}
                    </option>
                  ))}
                </Select>
                {selectedSheet && (
                  <p className="text-xs text-darkGray mt-2">
                    Ficha {selectedSheet.number} •{" "}
                    {selectedSheet.trainingProject?.program?.name || "—"}
                  </p>
                )}

                {/* Existing actas for this ficha + selected competencia */}
                <div className="mt-4 p-3 rounded-xl border border-lightGray/70 bg-white/60 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-darkGray">
                      Actas de esta ficha en este trimestre
                    </p>
                    <span className="text-secondary text-sm font-semibold">
                      {reportsForSelectedCompetence.length}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-48 overflow-auto scrollbar-thin">
                    {loadingReports && (
                      <p className="text-xs text-darkGray">Cargando actas…</p>
                    )}
                    {!loadingReports &&
                      reportsForSelectedCompetence.length === 0 && (
                        <p className="text-xs text-darkGray">
                          No hay actas registradas en esta competencia.
                        </p>
                      )}
                    {reportsForSelectedCompetence.map((fr: any) => (
                      <div
                        key={fr.id}
                        className="flex items-start gap-2 p-2 rounded-lg bg-lightGray/50"
                      >
                        <CheckCircle2
                          size={14}
                          className={`mt-0.5 ${
                            fr.state ? "text-green-600" : "text-yellow-600"
                          }`}
                        />
                        <div className="leading-tight">
                          <p className="text-xs font-medium text-secondary">
                            {fr.fileNumber || "—"}
                          </p>
                          <p className="text-[11px] text-darkGray">
                            {fr?.competenceQuarter?.competence?.name || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {step === 6 && (
        <BaseCard
          className="animate-pulse-gentle"
          header={
            <h3 className="text-secondary font-semibold flex items-center gap-2">
              <CheckCircle2 className="text-primary" size={18} /> Resumen del
              acta
            </h3>
          }
          body={
            <>
              {/* Success banner */}
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-700 px-3 py-2">
                El acta se ha guardado correctamente. Puedes ver el detalle y
                las actas existentes abajo.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <span className="text-darkGray">Número acta:</span>{" "}
                    {form.fileNumber}
                  </p>
                  <p>
                    <span className="text-darkGray">Ficha:</span>{" "}
                    {selectedSheet?.number}
                  </p>
                  <p>
                    <span className="text-darkGray">Programa:</span>{" "}
                    {selectedSheet?.trainingProject?.program?.name || "—"}
                  </p>
                  <p>
                    <span className="text-darkGray">Estado:</span>{" "}
                    {form.state ? "Aprobada" : "No aprobada"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="text-darkGray">Competencia:</span>{" "}
                    {competences.find((c) => c.id === form.competenceQuarterId)
                      ?.competence?.name || "—"}
                  </p>
                  <p>
                    <span className="text-darkGray">Objetivos:</span>{" "}
                    {form.objectives?.slice(0, 80)}
                    {form.objectives.length > 80 ? "…" : ""}
                  </p>
                  <p>
                    <span className="text-darkGray">Anexos:</span>{" "}
                    {form.annexesFiles.length} archivo(s)
                  </p>
                  <p>
                    <span className="text-darkGray">Firma:</span>{" "}
                    {form.signatureFile ? "Adjunta" : "No adjunta"}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Aspectos disciplinarios</Label>
                  <div className="mt-1 text-sm bg-lightGray/50 rounded-xl p-3 min-h-[72px]">
                    {form.disciplinaryOffenses || "—"}
                  </div>
                </div>
                <div>
                  <Label>Conclusiones</Label>
                  <div className="mt-1 text-sm bg-lightGray/50 rounded-xl p-3 min-h-[72px]">
                    {form.conclusions || "—"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label>Objetivos del cierre</Label>
                  <div className="mt-1 text-sm bg-lightGray/50 rounded-xl p-3 min-h-[72px]">
                    {form.objectives || "—"}
                  </div>
                </div>
              </div>

              {/* List of actas for ficha + trimestre */}
              <div className="mt-6">
                <h4 className="text-secondary font-semibold mb-2">
                  Actas de esta ficha en este trimestre
                </h4>
                <div className="space-y-2 max-h-60 overflow-auto scrollbar-thin">
                  {loadingReports && (
                    <p className="text-sm text-darkGray">Cargando actas…</p>
                  )}
                  {!loadingReports &&
                    reportsForSelectedCompetence.length === 0 && (
                      <p className="text-sm text-darkGray">
                        Aún no hay actas para esta ficha en este trimestre.
                      </p>
                    )}
                  {reportsForSelectedCompetence.map((fr: any) => (
                    <div
                      key={fr.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-lightGray/70 bg-white/60 dark:bg-slate-900/40"
                    >
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="text-secondary mt-0.5" />
                        <div className="leading-tight">
                          <p className="text-sm font-medium text-secondary">
                            {fr.fileNumber || "—"}
                          </p>
                          <p className="text-xs text-darkGray">
                            {fr?.competenceQuarter?.competence?.name || "—"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          fr.state ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {fr.state ? "Aprobada" : "No aprobada"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Sticky bottom actions to prevent being cut off */}
      <div className="sticky bottom-0 left-0 right-0 mt-6 -mx-4 md:-mx-6 bg-white/80 dark:bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-lightGray px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 border ${
              step === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-lightGray"
            } border-lightGray text-secondary`}
          >
            <ArrowLeft size={16} /> Atrás
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={() =>
                canGoNext
                  ? next()
                  : toast.warn("Completa los campos requeridos")
              }
              className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-white bg-gradient-to-r from-secondary to-darkBlue hover:from-darkBlue hover:to-secondary transition ${
                !canGoNext ? "opacity-60" : ""
              }`}
            >
              Siguiente <ArrowRight size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-lightGray text-secondary hover:bg-lightGray"
              >
                Reiniciar
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-white bg-gradient-to-r from-primary to-green-700 hover:from-green-700 hover:to-primary transition ${
                  saving ? "opacity-60" : ""
                }`}
              >
                {saving ? "Guardando…" : "Guardar acta"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActasInstructorContainer;
