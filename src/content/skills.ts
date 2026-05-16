export type SkillRow = {
  label: string;
  tagline: string;
  items: string[];
};

export const skillRows: SkillRow[] = [
  {
    label: "Agentic AI & LLMs",
    tagline: "What I reach for when the problem is language, tool-use, or reasoning.",
    items: [
      "Amazon Bedrock (Claude Sonnet 4 / Haiku 4.5)",
      "Claude API",
      "Model Context Protocol (MCP)",
      "LangChain",
      "vLLM",
      "RAG",
      "Bedrock Guardrails",
      "Structured-JSON outputs",
      "Prompt engineering",
      "LLM evaluation",
    ],
  },
  {
    label: "ML & Computer Vision",
    tagline: "Five years of training, optimizing, and shipping models — most of them vision.",
    items: [
      "PyTorch",
      "TensorFlow",
      "ONNX Runtime",
      "Transformers",
      "CNNs",
      "EfficientNet",
      "YOLOv5",
      "OpenCV",
      "DocAligner",
      "CLAHE",
      "OCR",
      "Fine-tuning",
      "Liveness detection",
    ],
  },
  {
    label: "Cloud & MLOps",
    tagline: "Where the model actually has to behave — across three clouds.",
    items: [
      "AWS — Lambda · Step Functions · SageMaker · S3 · EventBridge · OpenSearch Serverless · RDS",
      "GCP Cloud Run",
      "Azure — IoT Hub · Cognitive Services · Functions",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Azure DevOps",
      "DataDog",
      "Cloudflare (Tunnels, Pages)",
    ],
  },
  {
    label: "Languages & Data",
    tagline: "Day-to-day tools. Python for almost everything; TypeScript for surfaces like this one.",
    items: [
      "Python",
      "TypeScript",
      "Java",
      "SQL / PostgreSQL",
      "Redis",
      "MongoDB",
      "Vector DBs",
    ],
  },
  {
    label: "Production engineering",
    tagline: "The boring, important parts most ML resumes skip.",
    items: [
      "FastAPI",
      "REST APIs",
      "JWT / auth proxies",
      "Multi-tenant SaaS",
      "CI/CD",
      "Canary deploys",
      "Sub-100 ms latency systems",
      "Rate limiting",
    ],
  },
];
