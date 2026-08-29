$filePath = "c:\Users\javie\Desktop\Automatizaciones\Libros\Automatizar_Historias\Libro_Best-seller.md"
$content = Get-Content -Path $filePath -Raw -Encoding utf8

$replacements = @{
    "(?i)dron\b" = "ojo vigía"
    "(?i)drones\b" = "ojos vigía"
    "(?i)plasma\b" = "fuego biológico"
    "(?i)uranio\b" = "metal estelar"
    "(?i)hidráulico\b" = "de flujo"
    "(?i)hidráulicos\b" = "de flujo"
    "(?i)hidráulica\b" = "de flujo"
    "(?i)servomotor\b" = "tendón de flujo"
    "(?i)servomotores\b" = "tendones de flujo"
    "(?i)exoesqueleto\b" = "injerto quitinoso"
    "(?i)radio\b" = "resonancia"
    "(?i)escáner\b" = "resonador"
    "(?i)láser\b" = "proyección de flujo"
    "(?i)motor\b" = "impulsor de flujo"
    "(?i)motores\b" = "impulsores de flujo"
    "(?i) Rhyno\b" = " Baluarte"
    "(?i) Rhino\b" = " Baluarte"
    "(?i) TBA\b" = " Transporte de Asalto"
    "(?i)altavoces\b" = "membranas de sonido"
    "(?i)neón\b" = "bioluminiscencia"
    "(?i)halógeno\b" = "foco de flujo"
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace $key, $replacements[$key]
}

Set-Content -Path $filePath -Value $content -Encoding utf8
