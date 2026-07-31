import type { TimelineEvent } from "@/types/timeline";

export const timelineSeed: TimelineEvent[] = [
  {
    id: "first-date",
    title: "Nuestra primera cita",
    commitTag: "feat(life): first-date",
    date: "2024-02-14",
    location: "Cafe del centro",
    coordinates: {
      lat: 4.711,
      lng: -74.0721,
    },
    patchNotes: [
      "Llegamos con nervios y terminamos riendo como si nos conocieramos de toda la vida.",
      "Pedimos algo sencillo y la charla se quedo con nosotros toda la noche.",
      "Ese dia quedo marcado como el inicio oficial de nuestra historia.",
    ],
    media: [
      {
        id: "first-date-photo",
        type: "image",
        url: "https://picsum.photos/seed/nexus-first-date/960/640",
        alt: "Momento de nuestra primera cita",
      },
    ],
  },
  {
    id: "first-trip",
    title: "Primer viaje juntos",
    commitTag: "feat(travel): first-trip",
    date: "2024-06-02",
    location: "Montanas del norte",
    coordinates: {
      lat: 6.2442,
      lng: -75.5812,
    },
    patchNotes: [
      "Tomamos carretera temprano con playlist compartida y cafe en mano.",
      "Descubrimos lugares nuevos y confirmamos que viajar juntos es parte de nuestro lenguaje.",
      "Esa tarde nos dejo fotos, videos y una memoria que sigue viva en cada conversacion.",
    ],
    media: [
      {
        id: "first-trip-photo",
        type: "image",
        url: "https://picsum.photos/seed/nexus-first-trip/960/640",
        alt: "Vista del primer viaje juntos",
      },
      {
        id: "first-trip-video",
        type: "video",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        alt: "Clip de referencia para la galeria de video",
      },
    ],
  },
  {
    id: "anniversary-night",
    title: "Noche de aniversario",
    commitTag: "feat(heart): anniversary-night",
    date: "2025-02-14",
    location: "Terraza de la ciudad",
    coordinates: {
      lat: 3.4516,
      lng: -76.532,
    },
    patchNotes: [
      "Preparamos una cena simple pero llena de significado.",
      "Hicimos recuento de todo lo que superamos y de lo que seguimos construyendo.",
      "Terminamos con promesas nuevas y una lista de lugares por descubrir.",
    ],
    media: [
      {
        id: "anniversary-photo",
        type: "image",
        url: "https://picsum.photos/seed/nexus-anniversary/960/640",
        alt: "Foto de la noche de aniversario",
      },
    ],
  },
];
