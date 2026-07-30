"use client";

import { useEffect } from "react";

const ASCII_ART = `
 ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
 ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
 ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
 ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
 ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
        L O V E  S Y S T E M  v2.0
`;

export function ConsoleEasterEgg() {
  useEffect(() => {
    // Solo corre en el navegador
    if (typeof window === "undefined") return;

    const pink = "color: #e91e8c; font-weight: bold;";
    const glow = "color: #ff6eb4;";
    const muted = "color: #8b8ba3;";
    const green = "color: #4ade80; font-weight: bold;";
    const white = "color: #ffffff; font-weight: bold;";
    const dim = "color: #4a4a6a;";

    console.log(
      "%c" + ASCII_ART,
      "color: #e91e8c; font-family: monospace; font-size: 10px; font-weight: bold; line-height: 1.2;"
    );

    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      pink
    );

    console.log(
      "%c[SYSTEM INFO]%c  Nexus Love System — Authenticated Session",
      pink, white
    );
    console.log(
      "%c[USER]%c        The Most Amazing Girl in the World™",
      glow, white
    );
    console.log(
      "%c[STATUS]%c      Heart rate nominal. Love levels at maximum capacity.",
      green, white
    );
    console.log(
      "%c[UPTIME]%c      Running continuously since 22/02/2026",
      glow, muted
    );
    console.log(
      "%c[MEMORY]%c      Full — recuerdos cargados correctamente ✓",
      glow, muted
    );
    console.log(
      "%c[SECURITY]%c    Acceso autorizado. Solo usuarios del corazón.",
      pink, muted
    );

    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      pink
    );

    console.log(
      "%c  💜 Psst... si encontraste esto, es porque eres curiosa.",
      "color: #ff6eb4; font-style: italic; font-size: 12px;"
    );
    console.log(
      "%c  Y eso es exactamente por qué te quiero tanto.",
      "color: #ff6eb4; font-style: italic; font-size: 12px;"
    );

    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      pink
    );
    console.log(
      "%c[HINT]%c  Prueba el Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A",
      dim, "color: #4a4a6a; font-style: italic;"
    );
  }, []);

  return null; // no renderiza nada visible
}
