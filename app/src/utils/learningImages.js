const image = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const DOMAIN_IMAGES = {
  Technology: image("photo-1518770660439-4636190af475"),
  Design: image("photo-1558655146-9f40138edfeb"),
  "Arts & Creative": image("photo-1513364776144-60967b0f800f"),
  Languages: image("photo-1457369804613-52c61a468e7d"),
  Business: image("photo-1556761175-b413da4baf72"),
  Science: image("photo-1532094349884-543bc11b234d"),
  "Health & Wellness": image("photo-1517836357463-d25dfeac3438"),
  Architecture: image("photo-1487958449943-2429e8be8625"),
  Education: image("photo-1503676260728-1c00da094a0b"),
  Other: image("photo-1516321318423-f06f85e504b3"),
};

export const SUBDOMAIN_IMAGES = {
  "Web Development": image("photo-1498050108023-c5249f4df085"),
  "Mobile Development": image("photo-1512941937669-90a1b58e7e9c"),
  "Artificial Intelligence": image("photo-1555255707-c07966088b7b"),
  "Data Science": image("photo-1551288049-bebda4e38f71"),
  Cybersecurity: image("photo-1563013544-824ae1b704d3"),
  "Cloud & DevOps": image("photo-1451187580459-43490279c0fa"),
  Programming: image("photo-1515879218367-8466d910aaa4"),
  "UI/UX Design": image("photo-1561070791-2526d30994b5"),
  "Graphic Design": image("photo-1541701494587-cb58502866ab"),
  "Product Design": image("photo-1559028012-481c04fa702d"),
  "Motion Design": image("photo-1550745165-9bc0b252726f"),
  Drawing: image("photo-1541961017774-22349e4a1262"),
  Photography: image("photo-1452780212940-6f5c0d14d848"),
  "Video Editing": image("photo-1574717024653-61fd2cf4d44d"),
  "3D Art": image("photo-1633356122544-f134324a6cee"),
  Animation: image("photo-1536240478700-b869070f9279"),
  Music: image("photo-1511379938547-c1f69419868d"),
  English: image("photo-1543109740-4bdb38fda756"),
  French: image("photo-1502602898657-3e91760cbb34"),
  Spanish: image("photo-1539035104074-e182a0d2a65f"),
  German: image("photo-1467269204594-9661b134dd2b"),
  Korean: image("photo-1538485399081-7c897c6f4d5c"),
  Japanese: image("photo-1528360983277-13d401cdc186"),
  "Other Language": image("photo-1523240795612-9a054b0db644"),
  Entrepreneurship: image("photo-1556761175-4b46a572b786"),
  Marketing: image("photo-1533750349088-cd871a92f312"),
  Finance: image("photo-1559526324-593bc073d938"),
  Management: image("photo-1552664730-d307ca884978"),
  Mathematics: image("photo-1509228468518-180dd4864904"),
  Physics: image("photo-1635070041078-e363dbe005cb"),
  Chemistry: image("photo-1532634922-8fe0b757fb13"),
  Biology: image("photo-1530026405186-ed1f139313f8"),
  Fitness: image("photo-1534438327276-14e5300c3a48"),
  Nutrition: image("photo-1490645935967-10de6ba17061"),
  "Mental Wellness": image("photo-1506126613408-eca07ce68773"),
  Architecture: image("photo-1487958449943-2429e8be8625"),
  "Interior Design": image("photo-1618221195710-dd6b41faaea6"),
  "3D Architecture": image("photo-1545324418-cc1a3fa10c00"),
  Teaching: image("photo-1509062522246-3755977927d7"),
  "Educational Technology": image("photo-1531482615713-2afd69097998"),
  "Study Skills": image("photo-1498243691581-b145c3f54a5a"),
};

export const getDomainImage = (domain) => DOMAIN_IMAGES[domain] || DOMAIN_IMAGES.Other;

export const getLearningImage = (domain, subdomain) => {
  if (domain === "Languages") return DOMAIN_IMAGES.Languages;
  return SUBDOMAIN_IMAGES[subdomain] || DOMAIN_IMAGES[domain] || DOMAIN_IMAGES.Other;
};
