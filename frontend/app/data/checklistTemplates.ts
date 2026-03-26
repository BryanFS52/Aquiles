export interface ChecklistTemplate {
    id: string
    name: string
    description: string
    trimester: string
    competence: string
    technicalIndicators: string[]
    attitudeIndicators: string[]
}

// ===== MODO LOCAL (PLANTILLAS QUEMADAS) =====
// Puedes reemplazar este archivo por datos del backend cuando el servicio esté disponible.
// Idea futura:
// export const fetchChecklistTemplates = async () => checklistTemplateService.getAll()
export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
    {
        id: 'tpl-1',
        name: 'Plantilla desarrollo de software',
        description: 'Base para seguimiento de evidencias técnicas y actitudinales en desarrollo.',
        trimester: '1',
        competence: 'Analizar requerimientos y participar en la construcción de soluciones de software de acuerdo con la necesidad planteada.',
        technicalIndicators: [
            'Identifica correctamente los requerimientos funcionales planteados.',
            'Aplica buenas prácticas en la construcción de soluciones propuestas.',
            'Relaciona la solución desarrollada con la necesidad del proyecto formativo.'
        ],
        attitudeIndicators: [
            'Participa activamente en las actividades propuestas.',
            'Demuestra responsabilidad en la entrega de evidencias.',
            'Mantiene una comunicación asertiva con el equipo de trabajo.'
        ]
    },
    {
        id: 'tpl-2',
        name: 'Plantilla infraestructura y redes',
        description: 'Enfocada en configuración, diagnóstico y trabajo colaborativo.',
        trimester: '2',
        competence: 'Implementar y verificar componentes de infraestructura tecnológica cumpliendo criterios técnicos y de calidad.',
        technicalIndicators: [
            'Configura los recursos tecnológicos según especificaciones definidas.',
            'Verifica el funcionamiento de la infraestructura implementada.',
            'Documenta incidencias y acciones de mejora sobre el entorno configurado.'
        ],
        attitudeIndicators: [
            'Cumple los protocolos de seguridad establecidos.',
            'Trabaja de forma ordenada y metódica en ambientes técnicos.',
            'Asume una actitud propositiva frente a la resolución de problemas.'
        ]
    },
    {
        id: 'tpl-3',
        name: 'Plantilla analítica de datos',
        description: 'Plantilla para seguimiento de procesos de análisis e interpretación de datos.',
        trimester: '3',
        competence: 'Procesar e interpretar conjuntos de datos para apoyar la toma de decisiones en el proyecto formativo.',
        technicalIndicators: [
            'Organiza y depura los datos requeridos para el análisis.',
            'Selecciona herramientas adecuadas para el procesamiento de información.',
            'Presenta hallazgos con coherencia y soporte técnico.'
        ],
        attitudeIndicators: [
            'Demuestra criterio ético en el manejo de la información.',
            'Sustenta sus conclusiones con claridad y respeto.',
            'Gestiona adecuadamente el tiempo asignado a las actividades.'
        ]
    }
]
