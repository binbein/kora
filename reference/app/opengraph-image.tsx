import { ImageResponse } from "next/og";
import { it } from "@/lib/i18n/it";

/*
 * Anteprima del link quando la demo viene mandata per email o messaggio.
 *
 * L'immagine è generata al build e servita come file statico, quindi non
 * introduce nessuna funzione a runtime: resta vero che la demo è tutta
 * statica (§2.2).
 *
 * Palette e tono sono quelli del §4: fondo petrolio, marchio spaziato, la
 * stessa frase dell'hero. Nessun gradiente e nessuna ombra, come ovunque.
 *
 * La famiglia tipografica è quella di sistema del generatore: Inter è
 * self-hosted per il sito (§3) e caricarla qui vorrebbe dire portarsi in
 * repository un file di font solo per questa immagine. A questa dimensione,
 * su un grottesco, la differenza non regge il costo.
 */

export const alt = it.meta.shareImageAlt;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#04342C",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: "#FFFFFF",
        }}
      >
        {it.common.appName}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 600,
          lineHeight: 1.15,
          color: "#FFFFFF",
          maxWidth: 900,
        }}
      >
        {it.site.hero.title}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#9FE1CB",
        }}
      >
        {it.site.hero.eyebrow}
      </div>
    </div>,
    size,
  );
}
