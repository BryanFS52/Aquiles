'use client'

interface PreviewItem {
    indicador: string
}

interface ChecklistPreviewProps {
    isOpen: boolean
    onClose: () => void
    trimester: string
    competence: string
    trainingProjectName: string
    studySheetLabel: string
    technicalIndicators: PreviewItem[]
    attitudeIndicators: PreviewItem[]
}

export default function ChecklistPreview({
    isOpen,
    onClose,
    trimester,
    competence,
    trainingProjectName,
    studySheetLabel,
    technicalIndicators,
    attitudeIndicators,
}: ChecklistPreviewProps) {
    if (!isOpen) return null

    const validTechnical = technicalIndicators.filter((item) => item.indicador.trim())
    const validAttitude = attitudeIndicators.filter((item) => item.indicador.trim())

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-blue-400 bg-clip-text text-transparent">
                            Vista previa de la lista de chequeo
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Así se verá la información antes de guardar.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-lime-500 dark:hover:border-shadowBlue transition-all"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl border border-lime-200 dark:border-shadowBlue/50 bg-lime-50 dark:bg-gray-700/60 p-4">
                        <p className="text-xs font-bold uppercase text-lime-700 dark:text-white">Trimestre</p>
                        <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {trimester ? `${trimester}° Trimestre` : 'Pendiente por seleccionar'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-lime-200 dark:border-shadowBlue/50 bg-lime-50 dark:bg-gray-700/60 p-4">
                        <p className="text-xs font-bold uppercase text-lime-700 dark:text-white">Proyecto formativo</p>
                        <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {trainingProjectName || 'Pendiente por seleccionar'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-lime-200 dark:border-shadowBlue/50 bg-lime-50 dark:bg-gray-700/60 p-4">
                        <p className="text-xs font-bold uppercase text-lime-700 dark:text-white">Ficha asociada</p>
                        <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {studySheetLabel || 'Pendiente por seleccionar'}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-xl font-bold text-white">
                                {trimester ? `${trimester}° Trimestre` : 'Lista sin trimestre definido'}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                                Activa
                            </span>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <p className="text-xs font-bold uppercase text-lime-700 dark:text-white">Competencia</p>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                {competence.trim() || 'Aún no se ha diligenciado la competencia.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase text-lime-700 dark:text-white mb-3">Indicadores técnicos</p>
                                <div className="space-y-2">
                                    {validTechnical.length > 0 ? validTechnical.map((item, index) => (
                                        <div key={`${item.indicador}-${index}`} className="rounded-xl border border-lime-200 dark:border-shadowBlue/50 bg-lime-50 dark:bg-gray-700/60 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                            {index + 1}. {item.indicador}
                                        </div>
                                    )) : (
                                        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            No hay indicadores técnicos cargados.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase text-lime-700 dark:text-white mb-3">Indicadores actitudinales</p>
                                <div className="space-y-2">
                                    {validAttitude.length > 0 ? validAttitude.map((item, index) => (
                                        <div key={`${item.indicador}-${index}`} className="rounded-xl border border-lime-200 dark:border-shadowBlue/50 bg-lime-50 dark:bg-gray-700/60 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                            {index + 1}. {item.indicador}
                                        </div>
                                    )) : (
                                        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            No hay indicadores actitudinales cargados.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
