#!/bin/bash

# Script para regenerar los tipos GraphQL después de que el backend incluya
# los nuevos campos trainingProjectId y trainingProjectName

echo "🔄 Regenerando tipos GraphQL..."

# Ejecutar la generación de tipos
npm run graphql:generate || yarn graphql:generate

echo "✅ Tipos GraphQL regenerados"
echo "🔍 Verificar que los siguientes campos estén incluidos en la interfaz Checklist:"
echo "  - trainingProjectId?: number"
echo "  - trainingProjectName?: string"
echo ""
echo "💡 Si los campos no aparecen, verificar que el backend los haya incluido en el esquema GraphQL"
