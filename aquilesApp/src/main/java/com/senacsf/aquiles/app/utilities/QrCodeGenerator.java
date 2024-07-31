package com.senacsf.aquiles.app.utilities;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Component
public class QrCodeGenerator {
    public byte[] generateQRCodeImage(String text, InputStream logoStream) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 350, 350);
        BufferedImage qrImage = new BufferedImage(350, 350, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < 350; x++) {
            for (int y = 0; y < 350; y++) {
                qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }

        // Add logo to the center

        if (logoStream != null) {
            BufferedImage logo = ImageIO.read(logoStream);
            int logoWidth = 80;
            int logoHeight = 80;
            Image scaledLogo = logo.getScaledInstance(logoWidth, logoHeight, Image.SCALE_SMOOTH);
            BufferedImage logoImage = new BufferedImage(logoWidth, logoHeight, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = logoImage.createGraphics();
            g.drawImage(scaledLogo, 0, 0, null);
            g.dispose();

            int centerX = (qrImage.getWidth() - logoImage.getWidth()) / 2;
            int centerY = (qrImage.getHeight() - logoImage.getHeight()) / 2;
            Graphics2D g2 = qrImage.createGraphics();
            g2.drawImage(logoImage, centerX, centerY, null);
            g2.dispose();
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", baos);
        return baos.toByteArray();
    }
}