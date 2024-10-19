// src/components/ReportComponent.js

import React, { useState } from 'react';
import { downloadReportPDF } from '../services/PDFService';

const ReportComponent = () => {
    const [error, setError] = useState(null);

    const handleDownloadReport = async () => {
        try {
            const blob = await downloadReportPDF();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte.pdf'); // El nombre del archivo descargado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            setError('Error al descargar el reporte PDF');
        }
    };

    return (
        <div>
            <h1>Descargar Reporte PDF</h1>
            <button onClick={handleDownloadReport}>Descargar PDF</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ReportComponent;
