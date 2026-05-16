export type Publication = {
  authors: string;
  year: string;
  title: string;
  venue: string;
  paperNo?: string;
  presentedAt?: string[];
  reflection?: string;
};

export const publications: Publication[] = [
  {
    authors: "Dahal, R., Zhou, L., & Ji, X.",
    year: "2025",
    title:
      "Automatic Powder Bed Leveling for Direct Metal Laser Sintering Based on Machine Learning.",
    venue: "ASME MSEC 2025, Greenville, SC.",
    paperNo: "MSEC2025-152596",
    presentedAt: [
      "NAMRC 53 / MSEC 2025 — Greenville, SC.",
      "Poster: SAMPE Baltimore-Washington 30th URS, University of Maryland.",
    ],
    reflection:
      "Putting computer vision into a manufacturing feedback loop is the same problem I optimize in production: latency budget, reliability under drift, and what to escalate when the model is uncertain.",
  },
];

export const certifications: string[] = [
  "Fundamentals of AI Agents Using RAG and LangChain",
  "IBM AI Engineering with Python, PyTorch & TensorFlow",
  "Deep Learning with PyTorch",
  "Generative AI Language Modeling with Transformers",
  "Introduction to Deep Learning & Neural Networks with Keras",
  "LangChain — Develop LLM-powered applications",
  "Machine Learning — Coursera",
  "Google Prompting Essentials",
];
