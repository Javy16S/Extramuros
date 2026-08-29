$filePath = "c:\Users\javie\Desktop\Automatizaciones\Libros\Automatizar_Historias\Libro_Best-seller.md"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$content = $content -replace "(?i)lanzacables", "lanzador de arpeos"
$content = $content -replace "(?i)defcon \d", "alerta máxima"
$content = $content -replace "(?i)frecuencia(s)? fantasma", "ecos de resonancia"
$content = $content -replace "(?i)logotipo", "emblema"
$content = $content -replace "(?i)cable de acero", "cable de fibra antigua"
$content = $content -replace "(?i)cable trenzado", "cable de flujo"
$content = $content -replace "(?i)tungsteno", "metal estelar"
$content = $content -replace "(?i)titanio", "hueso de plata"
$content = $content -replace "(?i)pistola", "lanzador"
$content = $content -replace "(?i)guante(s)? táctico(s)?", "guantes de piel de bestia"
$content = $content -replace "(?i)kevlar", "fibra reforzada"
$content = $content -replace "(?i)oficinas de cristal", "estratos de cristal"
$content = $content -replace "(?i)edificio de oficinas", "torre de cristal"
$content = $content -replace "(?i)puente peatonal", "pasarela suspendida"
$content = $content -replace "(?i)sistema nuclear", "núcleo de resonancia"

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
