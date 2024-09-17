package com.senacsf.aquiles.app.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public ByteArrayOutputStream createPdf() throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Draw table here
                drawTable(contentStream);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);

            return outputStream;
        }
    }

    private void drawTable(PDPageContentStream contentStream) throws IOException {
        final float margin = 50;
        final float yStart = 750;
        final float tableWidth = 500;
        final float tableHeight = 200;
        final int rows = 5;
        final int cols = 5;
        final float rowHeight = tableHeight / (float) rows;
        final float tableWidthCol = tableWidth / (float) cols;
        final float headerHeight = rowHeight * 1.5f;

        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);

        // Draw header
        contentStream.beginText();
        contentStream.newLineAtOffset(margin, yStart);
        contentStream.showText("Item");
        contentStream.newLineAtOffset(tableWidthCol, 0);
        contentStream.showText("Indicadores y/o Variables");
        contentStream.newLineAtOffset(tableWidthCol, 0);
        contentStream.showText("Si");
        contentStream.newLineAtOffset(tableWidthCol, 0);
        contentStream.showText("No");
        contentStream.newLineAtOffset(tableWidthCol, 0);
        contentStream.showText("Observaciones");
        contentStream.endText();

        contentStream.setLineWidth(1f);
        contentStream.moveTo(margin, yStart);
        contentStream.lineTo(margin + tableWidth, yStart);
        contentStream.stroke();

        // Draw rows
        for (int i = 0; i <= rows; i++) {
            contentStream.moveTo(margin, yStart - (i * rowHeight));
            contentStream.lineTo(margin + tableWidth, yStart - (i * rowHeight));
            contentStream.stroke();
        }

        // Draw columns
        for (int i = 0; i <= cols; i++) {
            contentStream.moveTo(margin + (i * tableWidthCol), yStart);
            contentStream.lineTo(margin + (i * tableWidthCol), yStart - tableHeight);
            contentStream.stroke();
        }
    }
}