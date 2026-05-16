/**
 * The Gatekeeper command palette intent map.
 *
 * Purely client-side. No backend, no LLM, no network. Visitor types a query,
 * we score it against these intents using a simple weighted keyword match
 * plus a deterministic confidence formula, and we return a "decision" in the
 * style of the real Gatekeeper at TitanCloud.
 */

export type Decision = "ACCEPTED" | "REVIEW" | "OUT-OF-SCOPE";

export type Intent = {
  id: string;
  /** Keywords that score for this intent (case-insensitive substring match). */
  keys: string[];
  decision: Decision;
  /** Base confidence (0-1) — tweaked by match quality. */
  confidence: number;
  /** One-line response shown in the palette. */
  response: string;
  /** Section to deep-link to. */
  target: `#${string}`;
  targetLabel: string;
};

export const intents: Intent[] = [
  {
    id: "hire",
    keys: ["hire", "hiring", "recruit", "offer", "interview", "open role", "available"],
    decision: "ACCEPTED",
    confidence: 0.97,
    response: "Available for full-time from Dec 2025. Email is the fastest path.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "resume",
    keys: ["resume", "cv", "pdf"],
    decision: "ACCEPTED",
    confidence: 0.95,
    response: "Resume is at /resume.pdf — opens in a new tab.",
    target: "#handoff",
    targetLabel: "Open resume",
  },
  {
    id: "papers",
    keys: ["paper", "publication", "research", "msec", "namrc", "asme", "sintering"],
    decision: "ACCEPTED",
    confidence: 0.94,
    response: "One peer-reviewed paper at ASME MSEC 2025 — CNN-driven powder-bed leveling for DMLS.",
    target: "#decision",
    targetLabel: "Go to research",
  },
  {
    id: "stack",
    keys: ["stack", "tech", "tools", "framework", "language", "skills"],
    decision: "ACCEPTED",
    confidence: 0.93,
    response: "Skills render as a weighted signal table. Heavy in Python, PyTorch, AWS, Bedrock, MCP, CV.",
    target: "#signals",
    targetLabel: "Go to skills",
  },
  {
    id: "gatekeeper",
    keys: ["gatekeeper", "classifier", "4-layer", "four layer", "tier", "tiered"],
    decision: "ACCEPTED",
    confidence: 0.96,
    response: "The Gatekeeper is the case study at the top of Work. Hover the diagram to inspect each layer.",
    target: "#inference",
    targetLabel: "Go to work",
  },
  {
    id: "mcp",
    keys: ["mcp", "model context protocol", "agent", "agents", "tool use", "tool-use"],
    decision: "ACCEPTED",
    confidence: 0.92,
    response: "Built MCP servers exposing schema, DB, and knowledge-graph tools to Bedrock agents.",
    target: "#inference",
    targetLabel: "Go to TitanCloud case",
  },
  {
    id: "vllm",
    keys: ["vllm", "local llm", "self host", "self-host", "inference", "gpu"],
    decision: "ACCEPTED",
    confidence: 0.91,
    response: "Local-LLM stack at Gannon: vLLM, OpenAI-compatible APIs, JWT proxy, 80% GPU utilization.",
    target: "#inference",
    targetLabel: "Go to Gannon case",
  },
  {
    id: "cv",
    keys: ["yolo", "yolov5", "opencv", "vision", "ocr", "image", "computer vision"],
    decision: "ACCEPTED",
    confidence: 0.92,
    response: "CV experience spans YOLOv5 forgery detection, EfficientNet, OCR pipelines, DocAligner.",
    target: "#signals",
    targetLabel: "Go to skills",
  },
  {
    id: "aws",
    keys: ["aws", "lambda", "step functions", "bedrock", "sagemaker", "opensearch"],
    decision: "ACCEPTED",
    confidence: 0.93,
    response: "AWS is the default stack — Lambda, Step Functions, SageMaker, S3, EventBridge, OpenSearch.",
    target: "#signals",
    targetLabel: "Go to skills",
  },
  {
    id: "mlops",
    keys: ["mlops", "ci", "cd", "deploy", "deployment", "canary", "rollback", "azure devops"],
    decision: "ACCEPTED",
    confidence: 0.9,
    response: "MLOps story: Azure DevOps → SageMaker → Step Functions, with canary + rollback + DataDog.",
    target: "#inference",
    targetLabel: "Go to TitanCloud case",
  },
  {
    id: "rag",
    keys: ["rag", "retrieval", "few-shot", "few shot", "opensearch", "embeddings"],
    decision: "ACCEPTED",
    confidence: 0.9,
    response: "RAG-driven few-shot prompt system with an EventBridge correction feedback loop.",
    target: "#inference",
    targetLabel: "Go to TitanCloud case",
  },
  {
    id: "contact",
    keys: ["contact", "email", "reach", "message", "mail", "linkedin", "github"],
    decision: "ACCEPTED",
    confidence: 0.97,
    response: "Email: rojandahal1026@gmail.com. LinkedIn and GitHub at the footer.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "location",
    keys: ["where", "location", "city", "country", "erie", "remote", "relocate"],
    decision: "ACCEPTED",
    confidence: 0.9,
    response: "Erie, PA — US-based, open to remote and to relocation.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "education",
    keys: ["education", "degree", "masters", "ms", "phd", "gpa", "school", "gannon"],
    decision: "ACCEPTED",
    confidence: 0.92,
    response: "MS Data Science @ Gannon, GPA 4.0, graduating Dec 2025.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "titancloud",
    keys: ["titancloud", "titan cloud", "fuel"],
    decision: "ACCEPTED",
    confidence: 0.95,
    response: "TitanCloud is where the Gatekeeper lives — fuel-asset optimization platform.",
    target: "#inference",
    targetLabel: "Go to TitanCloud case",
  },
  {
    id: "bitskraft",
    keys: ["bitskraft", "bits kraft", "fintech", "video banking", "signature", "forgery"],
    decision: "ACCEPTED",
    confidence: 0.9,
    response: "BitsKraft (Nepal) — 2 years of CV in fintech: liveness, forgery detection, 5k req/day.",
    target: "#inference",
    targetLabel: "Go to BitsKraft case",
  },
  {
    id: "safety",
    keys: ["safety", "trust", "trustworthy", "guardrail", "guardrails", "alignment", "evals", "eval"],
    decision: "ACCEPTED",
    confidence: 0.92,
    response: "I optimize for reliability + cost — Bedrock Guardrails, PII safety, schema-bound outputs.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "salary",
    keys: ["salary", "comp", "compensation", "pay", "rate"],
    decision: "REVIEW",
    confidence: 0.72,
    response: "Send an offer or a range — happy to discuss over email.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "freelance",
    keys: ["freelance", "contract", "consulting", "part time", "part-time"],
    decision: "REVIEW",
    confidence: 0.7,
    response: "Prefer full-time, but open to short scoped contracts. Email with details.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "writing",
    keys: ["blog", "writing", "post", "essay", "article"],
    decision: "REVIEW",
    confidence: 0.68,
    response: "Blog is still a `// soon` card in the Research section — paper first, posts after.",
    target: "#decision",
    targetLabel: "Go to research",
  },
  {
    id: "talk",
    keys: ["talk", "speak", "podcast", "interview", "webinar"],
    decision: "REVIEW",
    confidence: 0.7,
    response: "Open to talks on document AI, MCP, and cost-aware LLM systems. Email with the venue.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "open-source",
    keys: ["open source", "open-source", "oss", "github", "repo", "repository"],
    decision: "REVIEW",
    confidence: 0.74,
    response: "GitHub: github.com/DahalRojan — mostly project repos, some early.",
    target: "#handoff",
    targetLabel: "Open GitHub",
  },
  {
    id: "crypto",
    keys: ["crypto", "blockchain", "web3", "nft", "token"],
    decision: "OUT-OF-SCOPE",
    confidence: 0.95,
    response: "Out of scope. I build AI systems for production — not blockchain projects.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "design",
    keys: ["logo", "branding", "graphic design", "illustration", "figma"],
    decision: "OUT-OF-SCOPE",
    confidence: 0.92,
    response: "Out of scope. I ship ML/AI systems — design help is not what I'm offering.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "non-tech",
    keys: ["marketing", "sales", "seo", "ads", "growth"],
    decision: "OUT-OF-SCOPE",
    confidence: 0.9,
    response: "Out of scope. AI-engineering only.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "internship",
    keys: ["intern", "internship"],
    decision: "OUT-OF-SCOPE",
    confidence: 0.82,
    response: "Past the internship stage — full-time engineering / research roles from Dec 2025.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
  {
    id: "joke",
    keys: ["joke", "funny", "lol", "haha"],
    decision: "OUT-OF-SCOPE",
    confidence: 0.6,
    response: "The Gatekeeper does not tell jokes. It rejects them at L1.",
    target: "#inference",
    targetLabel: "Go to work",
  },
  {
    id: "about",
    keys: ["about", "who", "bio", "introduce", "background"],
    decision: "ACCEPTED",
    confidence: 0.93,
    response: "Short bio is in section 01 — research engineer building AI systems that gate other AI systems.",
    target: "#rules",
    targetLabel: "Go to about",
  },
  {
    id: "help",
    keys: ["help", "what can", "what do you", "how does", "?"],
    decision: "ACCEPTED",
    confidence: 0.8,
    response: "Try queries like: hire · papers · stack · gatekeeper · mcp · contact · location.",
    target: "#entry",
    targetLabel: "Back to top",
  },
  {
    id: "thanks",
    keys: ["thank", "thanks", "great", "cool", "love it"],
    decision: "ACCEPTED",
    confidence: 0.85,
    response: "Appreciated. Send a request via /hire when you're ready.",
    target: "#handoff",
    targetLabel: "Go to contact",
  },
];

/** Match a query against the intent map and return the best-scoring intent. */
export function classify(query: string): {
  intent: Intent;
  matchScore: number;
} {
  const q = query.toLowerCase().trim();
  if (!q) {
    const fallback = intents.find((i) => i.id === "help")!;
    return { intent: fallback, matchScore: 0.4 };
  }

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const key of intent.keys) {
      if (q.includes(key)) {
        // longer keyword matches score higher
        score += Math.max(1, key.length / 4);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (!best || bestScore === 0) {
    // No keyword hit — return a generic REVIEW so the palette still feels alive.
    return {
      intent: {
        id: "unmatched",
        keys: [],
        decision: "REVIEW",
        confidence: 0.41,
        response:
          "No clean match. Try: hire · papers · stack · gatekeeper · mcp · contact.",
        target: "#entry",
        targetLabel: "Back to top",
      },
      matchScore: 0,
    };
  }

  return { intent: best, matchScore: bestScore };
}
