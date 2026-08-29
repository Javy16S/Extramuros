$filePath = "c:\Users\javie\Desktop\Automatizaciones\Libros\Automatizar_Historias\Libro_Best-seller.md"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$caineScene = @"
---

Fue dos días después de visitar el Muro cuando Leo lo vio. No fue en un mapa, ni en una lección de Elena. Fue en la realidad cruda de Extramuros.

Elena lo había llevado a la Cresta del Titán, el punto más alto del cráneo fosilizado donde el Refugio se escondía. Desde allí, el mundo se abría en un tapiz infinito de verdes venenosos y nubes de esporas que flotaban como neblina baja. 

—Mira allí —susurró Elena, señalando hacia el pantano de la zona baja.

Algo se movía. No era un grupo de bestias, sino una montaña de carne y vegetación parásita. Un **Rey del Pantano (Clase A)**. Medía treinta metros de largo, una quimera de apéndices de quitina y cientos de ojos bioluminiscentes que parpadeaban con un hambre antigua. La tierra temblaba a su paso, y los árboles de mil toneladas se astillaban como ramitas bajo su peso. Estaba demasiado cerca del Velo del Refugio.

—¿No vamos a hacer nada? —preguntó Leo, sintiendo que la Pieza en su pecho vibraba con una advertencia gélida.

—Nosotros no. —Elena miró hacia un afloramiento rocoso, a mitad de camino entre el monstruo y el Titán.

Una figura solitaria estaba allí. No llevaba armadura pesada, ni lanzadores de flujo. Solo una túnica de arpillera gris y un bastón de madera de hueso. Un anciano, pequeño en la distancia, frente a una pesadilla biológica que podría haber devorado una ciudad.

Era Caine.

El Rey del Pantano rugió, un sonido que partió las nubes de esporas y obligó a Leo a taparse los oídos. La bestia lanzó un haz de bilis cáustica hacia la roca donde estaba el hombre. 

Caine no se movió. No usó un Ancla de flujo visible. Simplemente golpeó el suelo con su bastón.

La Resonancia fue tan pura que Leo no la sintió en sus oídos, sino en su ADN. Fue como si el universo entero se sincronizara por un nanosegundo. 

El monstruo se detuvo en seco. Sus cientos de patas dejaron de moverse. Sus ojos bioluminiscentes se apagaron uno tras otro. Leo vio, horrorizado y fascinado, cómo la anatomía de la bestia empezaba a rebelarse contra sí misma. Los tendones de flujo se desenroscaron. El caparazón de quitina se volvió blando como la cera. El Rey del Pantano no murió por una explosión; murió porque Caine le recordó a su cuerpo que era solo un cúmulo de células sin propósito.

En menos de un minuto, el Clase A se derrumbó sobre el lodo, convertido en una montaña de abono orgánico sobre la que ya empezaban a brotar flores blancas. Flores de rastro.

Caine se giró. Miró hacia arriba, hacia la Cresta donde Leo y Elena estaban. No hizo ningún gesto, pero Leo sintió que aquellos ojos, incluso a esa distancia, le estaban midiendo, juzgando si la Copia sería digna de portar el futuro.

Luego, el hombre se fundió con la niebla de esporas y desapareció.

---
"@

$caineScene = $caineScene -replace "`r", ""
$content = $content -replace "`r", ""

$target = "---`n`nEsa noche, Leo y Elena hablaron durante horas."
$pattern = [Regex]::Escape($target)
$content = $content -replace $pattern, ($caineScene + "`n`nEsa noche, Leo y Elena hablaron durante horas.")

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
