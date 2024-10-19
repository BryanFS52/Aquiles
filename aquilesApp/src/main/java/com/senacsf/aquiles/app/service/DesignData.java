package com.senacsf.aquiles.app.service;

import org.w3c.dom.css.CSS2Properties;

import java.util.List;

public class DesignData {
    private TableStyles tableStyles;
    private List<TableRow> tableData;

    public CSS2Properties getTableStyles() {
        return null;
    }

    // Getters and Setters

    public static class TableStyles {
        private String borderColor;
        private String headerBgColor;
        private String cellPadding;
        // Otros estilos

        // Getters and Setters
    }

    public static class TableRow {
        // Datos de las filas
    }
}
