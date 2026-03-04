package com.api.aquilesApi.Service;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Collection;
import java.util.Map;

@Service
public class JasperReportService {

    public enum ExportType { PDF, XLSX }

    /**
     * Servicio genérico para generar reportes Jasper a partir de una plantilla (.jasper o .jrxml).
     *
     * @param templateName nombre del archivo .jasper o .jrxml dentro de /resources/reports/
     * @param parameters   mapa de parámetros
     * @param data         colección opcional (puede ser vacía)
     * @param type         tipo de exportación (PDF o XLSX)
     * @return bytes del archivo exportado
     */
    public byte[] generate(String templateName, Map<String, Object> parameters, Collection<?> data, ExportType type)
            throws Exception {

        JasperReport jasperReport = loadOrCompileReport(templateName);
        JRDataSource jrDataSource = (data != null && !data.isEmpty())
                ? new JRBeanCollectionDataSource(data)
                : new JREmptyDataSource();

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, jrDataSource);

        return exportReport(jasperPrint, type);
    }

    private JasperReport loadOrCompileReport(String templateName) throws Exception {
        JasperReport jasperReport;

        try {
            // Intenta cargar el .jasper directamente
            InputStream jasperStream = new ClassPathResource("Reports/" + templateName).getInputStream();
            jasperReport = (JasperReport) JRLoader.loadObject(jasperStream);
        } catch (Exception e) {
            // Si no se encuentra el .jasper, intenta compilar el .jrxml equivalente
            String jrxmlName = templateName.replace(".jasper", ".jrxml");
            ClassPathResource jrxmlResource = new ClassPathResource("Reports/" + jrxmlName);

            if (!jrxmlResource.exists()) {
                throw new RuntimeException("❌ No se encontró ni el archivo .jasper ni el .jrxml: " + templateName);
            }

            try (InputStream jrxmlStream = jrxmlResource.getInputStream()) {
                jasperReport = JasperCompileManager.compileReport(jrxmlStream);
                System.out.println("⚙️ Compilado automáticamente: " + jrxmlName);
            }
        }

        return jasperReport;
    }

    /**
     * Exporta el JasperPrint al formato deseado (PDF o XLSX).
     */
    private byte[] exportReport(JasperPrint jasperPrint, ExportType type) throws JRException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        switch (type) {
            case PDF -> {
                JRPdfExporter exporter = new JRPdfExporter();
                exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                exporter.exportReport();
            }

            case XLSX -> {
                JRXlsxExporter exporter = new JRXlsxExporter();
                exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));

                SimpleXlsxReportConfiguration config = new SimpleXlsxReportConfiguration();
                config.setDetectCellType(true);
                config.setWhitePageBackground(false);
                config.setCollapseRowSpan(false);
                exporter.setConfiguration(config);

                exporter.exportReport();
            }
        }

        return out.toByteArray();
    }
}
