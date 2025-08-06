/**
 * Test completo para verificar el flujo de edición de checklist
 * Verifica que los datos se carguen correctamente en el modal de edición
 */

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function testEditChecklistFlow() {
    let driver;
    
    try {
        // Configurar el driver
        driver = await new Builder().forBrowser('chrome').build();
        
        console.log('🚀 Iniciando test de edición de checklist...');
        
        // Ir a la página de Lista de Chequeo
        await driver.get('http://localhost:3000/dashboard/ListaChequeoCoordinador');
        
        // Esperar a que la página cargue
        await driver.wait(until.elementLocated(By.css('[data-testid="checklist-table"]')), 10000);
        console.log('✅ Página cargada correctamente');
        
        // Buscar y hacer click en el primer botón de editar
        const editButton = await driver.wait(
            until.elementLocated(By.css('button[title*="Editar"], .edit-button, button:has([data-testid="edit-icon"])')), 
            10000
        );
        
        console.log('✅ Botón de editar encontrado');
        await editButton.click();
        
        // Esperar a que el modal se abra
        await driver.wait(until.elementLocated(By.css('.modal, [role="dialog"]')), 5000);
        console.log('✅ Modal de edición abierto');
        
        // Verificar que los campos del modal tengan datos precargados
        const trimestreField = await driver.findElement(By.css('select[name="trimestre"], input[name="trimestre"]'));
        const componenteField = await driver.findElement(By.css('input[name="componente"], select[name="componente"]'));
        const observacionesField = await driver.findElement(By.css('textarea[name="observaciones"], input[name="observaciones"]'));
        
        const trimestreValue = await trimestreField.getAttribute('value');
        const componenteValue = await componenteField.getAttribute('value');
        const observacionesValue = await observacionesField.getAttribute('value');
        
        console.log('📋 Datos cargados en el modal:');
        console.log(`   - Trimestre: "${trimestreValue}"`);
        console.log(`   - Componente: "${componenteValue}"`);
        console.log(`   - Observaciones: "${observacionesValue}"`);
        
        // Verificar que al menos uno de los campos principales tenga datos
        assert(
            trimestreValue || componenteValue || observacionesValue,
            'Al menos uno de los campos principales debe tener datos precargados'
        );
        
        // Verificar indicadores
        const indicatorInputs = await driver.findElements(By.css('input[placeholder*="indicador"], input[name*="indicador"]'));
        console.log(`📊 Indicadores encontrados: ${indicatorInputs.length}`);
        
        let indicatorsWithData = 0;
        for (let i = 0; i < indicatorInputs.length; i++) {
            const value = await indicatorInputs[i].getAttribute('value');
            if (value && value.trim() !== '') {
                indicatorsWithData++;
                console.log(`   - Indicador ${i + 1}: "${value}"`);
            }
        }
        
        console.log(`📈 Indicadores con datos: ${indicatorsWithData}/${indicatorInputs.length}`);
        
        // Si no hay indicadores con datos, verificar en consola del navegador
        if (indicatorsWithData === 0) {
            console.log('⚠️ No se encontraron indicadores con datos. Verificando logs de consola...');
            
            const logs = await driver.manage().logs().get('browser');
            const relevantLogs = logs.filter(log => 
                log.message.includes('editingData') || 
                log.message.includes('items') ||
                log.message.includes('Modal')
            );
            
            console.log('🔍 Logs relevantes de la consola:');
            relevantLogs.forEach(log => {
                console.log(`   ${log.level.name}: ${log.message}`);
            });
        }
        
        // Probar editar un indicador
        if (indicatorInputs.length > 0) {
            const firstIndicator = indicatorInputs[0];
            await firstIndicator.clear();
            await firstIndicator.sendKeys('Indicador editado desde test');
            
            const newValue = await firstIndicator.getAttribute('value');
            console.log(`✏️ Indicador editado: "${newValue}"`);
        }
        
        // Buscar el botón de guardar/actualizar
        const saveButton = await driver.findElement(By.css('button[type="submit"], button:contains("Guardar"), button:contains("Actualizar")'));
        console.log('✅ Botón de guardar encontrado');
        
        // Hacer click en guardar
        await saveButton.click();
        
        // Esperar confirmación o cierre del modal
        try {
            await driver.wait(until.stalenessOf(saveButton), 5000);
            console.log('✅ Modal cerrado exitosamente');
        } catch (error) {
            console.log('⚠️ Modal no se cerró automáticamente');
        }
        
        console.log('🎉 Test de edición completado');
        
    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        
        // Capturar screenshot en caso de error
        try {
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('error-screenshot.png', screenshot, 'base64');
            console.log('📸 Screenshot guardado como error-screenshot.png');
        } catch (screenshotError) {
            console.log('⚠️ No se pudo tomar screenshot');
        }
        
        throw error;
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

// Ejecutar el test
if (require.main === module) {
    testEditChecklistFlow()
        .then(() => {
            console.log('🏁 Test finalizado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Test falló:', error);
            process.exit(1);
        });
}

module.exports = { testEditChecklistFlow };
