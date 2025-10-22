import { motion } from "framer-motion";
import { ChangeEvent, FormEvent, RefObject } from "react";
import { JustificationType } from "@graphql/generated";

interface Props {
    form: any;
    justificationTypesData: JustificationType[];
    loadingJustificationTypes: boolean;
    loadingJustification: boolean;
    handleSave: (e: FormEvent) => void;
    handleCancel: () => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleTextInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleNumericInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateJustificationTypeId: (value: string) => void;
    fileRef: RefObject<File> | { current: File | null };
    fileInputRefPrev: RefObject<HTMLInputElement>;
}

export default function JustificationFormComponent({
    form,
    justificationTypesData,
    loadingJustificationTypes,
    loadingJustification,
    handleSave,
    handleCancel,
    handleInputChange,
    handleTextInputChange,
    handleNumericInputChange,
    handleFileChange,
    updateJustificationTypeId,
    fileRef,
    fileInputRefPrev,
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="w-auto max-w-4xl bg-white dark:bg-[#002033] p-6 lg:p-8 rounded-xl shadow-sm border border-white dark:border-[#002033] h-auto"
        >
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-black dark:text-lightGray">
                            Número de Documento *
                        </label>
                        <input
                            disabled
                            type="text"
                            name="numeroDocumento"
                            value={form.formData.numeroDocumento}
                            onChange={handleNumericInputChange}
                            className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-[#002033] text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen"
                            placeholder="123456789"
                            required
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-black dark:text-lightGray">
                            Nombre Aprendiz *
                        </label>
                        <input
                            disabled
                            type="text"
                            name="nombreAprendiz"
                            value={form.formData.nombreAprendiz}
                            onChange={handleTextInputChange}
                            className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-[#002033] text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen"
                            placeholder="Juan Pérez"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black dark:text-lightGray">
                        Descripción *
                    </label>
                    <textarea
                        name="descripcion"
                        value={form.formData.descripcion}
                        onChange={handleInputChange}
                        className="min-h-24 border border-lightGray dark:border-darkGray rounded-lg p-4 bg-white dark:bg-[#002033] text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen resize-vertical"
                        placeholder="Motivo de la justificación"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="justificationTypeSelect"
                        className="text-sm font-medium text-black dark:text-lightGray"
                    >
                        Tipo De Novedad *
                    </label>
                    <select
                        id="justificationTypeSelect"
                        name="justificationType"
                        aria-label="Tipo De Novedad"
                        value={form.formData.justificationTypeId.id}
                        onChange={(e) => updateJustificationTypeId(e.target.value)}
                        className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-[#002033] text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen"
                        disabled={loadingJustificationTypes}
                        required
                    >
                        <option value="" disabled hidden>
                            {loadingJustificationTypes ? "Cargando tipos..." : "Seleccione el tipo"}
                        </option>
                        {justificationTypesData?.map(({ id, name }: JustificationType) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black dark:text-lightGray">
                        Justificación (Archivo) *
                    </label>
                    <button
                        type="button"
                        onClick={() => fileInputRefPrev.current?.click()}
                        className="bg-black dark:bg-lightGreen text-white h-11 rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors font-medium"
                    >
                        {fileRef.current?.name || "📎 Subir Archivo"}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRefPrev}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        placeholder="Adjuntar archivo de justificación"
                        title="Adjuntar archivo de justificación"
                    />
                    <small className="text-darkGray dark:text-grayText">
                        Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
                    </small>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-lightGray dark:border-darkGray">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-darkGray dark:bg-shadowBlue text-white rounded-lg hover:bg-black dark:hover:bg-lightGray dark:hover:text-black transition-colors font-medium"
                        disabled={form.isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-black dark:bg-lightGreen text-white rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        disabled={form.isSubmitting || loadingJustification}
                    >
                        {form.isSubmitting || loadingJustification ? "Enviando..." : "Enviar Justificación"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
