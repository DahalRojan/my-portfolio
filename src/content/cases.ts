export type Chip = string;

export type Motif = "pipeline" | "rag-loop" | "printer-bed" | "none";

export type Case = {
  slug: string;
  company: string;
  role: string;
  dates: string;
  headline: string;
  stack: Chip[];
  scale: Chip[];
  bullets: string[];
  /** Hooks the case into the 3D scene's choreography. */
  motif: Motif;
};

export const cases: Case[] = [
  {
    slug: "titancloud",
    company: "Titan Cloud Software",
    role: "AI Engineer",
    dates: "Mar 2026 — Present",
    headline:
      "The Gatekeeper — a cost-control filter in front of a 3-agent Bedrock IDP pipeline.",
    stack: [
      "Python",
      "PyTorch",
      "ONNX Runtime",
      "AWS Step Functions",
      "AWS Lambda",
      "Amazon Bedrock — Claude Sonnet 4 / Haiku 4.5",
      "Bedrock Guardrails",
      "MCP (RAG · DB · KG)",
      "OpenSearch Serverless",
      "RDS PostgreSQL",
      "Amazon A2I",
      "SQS · EventBridge · S3 (SSE-KMS)",
      "API Gateway",
      "SageMaker",
      "Azure DevOps",
      "DataDog",
    ],
    scale: [
      "3-agent serverless pipeline",
      "4-layer Gatekeeper (L0–L3)",
      "DocAligner ONNX + CLAHE",
      "EfficientNet-B0 (~20 MB · <250 ms on Lambda CPU)",
      "IPR — Haiku ↔ Sonnet routing on a single agent",
      "OpenSearch RAG few-shot · grows via A2I corrections",
      "PII / prompt-injection guardrailed",
    ],
    bullets: [
      "Owned the Gatekeeper end-to-end — a 4-layer hybrid filter (L0 DocAligner ONNX + CLAHE → L1 rule pre-filter → L2 keyword scorer → L3 EfficientNet-B0 CNN) that sits in front of the Bedrock VLM. Reframed it from a doc-type router to a cost-control gate, because the dominant cost wasn't misrouting — it was garbage documents reaching the VLM.",
      "Designed a 3-agent serverless IDP pipeline on Step Functions — Gatekeeper → Primary Extraction → Validation — where each agent reaches data only through MCP servers (RAG, DB, knowledge graph). The MCP boundary keeps the agent–data contract clean and lets us swap the KG from a PG adjacency list to Neptune without touching prompts.",
      "Built Intelligent Prompt Routing (IPR) on a single Extraction agent — a `complexity_flag` + `template_conf` route between Claude Haiku 4.5 and Sonnet 4. One prompt to maintain, cheaper than two agents, optimization at routing time. Cross-validated extractions against the KG; low-confidence outputs route to Amazon A2I and corrections flow back through SQS → EventBridge → OpenSearch as new few-shot examples.",
    ],
    motif: "pipeline",
  },
  {
    slug: "gannon-ga",
    company: "Gannon University",
    role: "Graduate Assistant",
    dates: "Oct 2024 — Dec 2025",
    headline: "A RAG advising chatbot the campus actually uses.",
    stack: [
      "vLLM",
      "FastAPI",
      "GCP Cloud Run",
      "Redis",
      "Vector DB",
      "Cloudflare Tunnels",
      "JWT",
      "LangChain",
    ],
    scale: [
      "Sub-100 ms latency",
      "99.9% uptime",
      "80% GPU utilization",
      "OpenAI-compatible local LLM",
    ],
    bullets: [
      "Built a RAG-based Academic Advising Chatbot from scratch — local LLMs via vLLM, vector DB retrieval, Redis caching, FastAPI backend deployed on GCP Cloud Run.",
      "Designed the LangChain agent workflows that route automated student queries; secured the endpoint with Cloudflare tunnels and a JWT proxy at sub-100 ms latency under load.",
      "Maintained 99.9% uptime and 80% GPU utilization on the local inference rig — local LLM serving that the lab and students actually rely on.",
    ],
    motif: "rag-loop",
  },
  {
    slug: "gannon-research",
    company: "Gannon University",
    role: "Student Research Assistant",
    dates: "Jan 2024 — Oct 2024",
    headline: "CNNs in a metal 3D printer.",
    stack: ["PyTorch", "CNN", "OpenCV", "DMLS", "Additive Manufacturing"],
    scale: [
      "Peer-reviewed",
      "NAMRC 53 / MSEC 2025",
      "Poster — University of Maryland",
    ],
    bullets: [
      "Applied CNNs to automate powder-bed leveling in Direct Metal Laser Sintering (DMLS) — improving accuracy and reducing material waste in a live manufacturing feedback loop.",
      "Co-authored and presented a peer-reviewed paper at NAMRC 53 / MSEC 2025 in Greenville, SC, and a poster at the SAMPE Baltimore-Washington 30th URS at the University of Maryland.",
      "Same problem I optimize in production: latency budget, reliability under drift, what to escalate when the model is uncertain.",
    ],
    motif: "printer-bed",
  },
  {
    slug: "bitskraft",
    company: "BitsKraft (DigiConnect)",
    role: "AI/ML Engineer",
    dates: "Nov 2020 — Nov 2023",
    headline:
      "Three production AI systems for a Nepali fintech, each one different enough I had to learn something new.",
    stack: [
      "Python",
      "PyTorch",
      "YOLOv5",
      "OpenCV",
      "Azure (IoT Hub / Cognitive Services / Functions)",
      "REST APIs",
      "Docker",
    ],
    scale: [
      "5,000 daily requests",
      "99.9% uptime",
      "95% verification accuracy",
      "90% forgery detection",
      "40% fewer false positives",
      "30% payment-speed lift",
    ],
    bullets: [
      "Identity verification — liveness detection + emotion analysis for a video-banking platform. The system that confirms a remote applicant is real before they open a bank account.",
      "Signature forgery detection — YOLOv5 model for bank cheque verification at 90% accuracy with 40% fewer false positives, behind a REST API handling 5,000+ requests/day at 99.9% uptime.",
      "QR-based voice notification system for POS devices that lifted payment-processing speed by 30% — Azure IoT Hub, Cognitive Services, and Functions doing the work.",
    ],
    motif: "none",
  },
];
