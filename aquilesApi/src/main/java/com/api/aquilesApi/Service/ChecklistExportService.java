package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Checklist;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class ChecklistExportService {

    public String exportPdfBase64(Checklist checklist) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.LETTER);
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);
            content.setFont(PDType1Font.HELVETICA_BOLD, 12);
            content.beginText();
            content.setLeading(14.5f);
            content.newLineAtOffset(50, 700);

            content.showText("Checklist #" + checklist.getId());
            content.newLine();
            content.showText("Estado: " + checklist.getState());
            content.newLine();
            content.showText("Observaciones: " + checklist.getRemarks());
            content.newLine();
            content.showText("Criterio Evaluación: " + checklist.isEvaluationCriteria());
            content.newLine();
            content.showText("Hojas de Estudio: " + checklist.getStudySheets());

            if (checklist.getEvaluation() != null) {
                content.newLine();
                content.showText("Evaluación:");
                content.newLine();
                content.showText(" - Juicio: " + checklist.getEvaluation().getValueJudgment());
                content.newLine();
                content.showText(" - Observaciones: " + checklist.getEvaluation().getObservations());
            }

            content.endText();
            content.close();

            document.save(out);
            return Base64.getEncoder().encodeToString(out.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF con PDFBox", e);
        }
    }

    public String exportExcelBase64(Checklist checklist) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Checklist");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Estado");
            header.createCell(2).setCellValue("Observaciones");
            header.createCell(3).setCellValue("Hojas Estudio");

            Row data = sheet.createRow(1);
            data.createCell(0).setCellValue(checklist.getId());
            data.createCell(1).setCellValue(String.valueOf(checklist.getState()));
            data.createCell(2).setCellValue(checklist.getRemarks());
            data.createCell(3).setCellValue(String.valueOf(checklist.getStudySheets()));

            workbook.write(out);
            return Base64.getEncoder().encodeToString(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el Excel", e);
        }
    }
}
