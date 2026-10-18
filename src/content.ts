export const features = [
  {
    icon: "user",
    title: "AI Assistant",
    tag: "YOUR SECOND PERSPECTIVE",
    text: "A neural network personally trained by [NAME] helps you analyze the market, find setups, and make decisions while you trade.",
    detail:
      "Read order flow alongside an assistant trained on [NAME]’s trading methodology. Discuss market context, review potential setups, and understand what the data is showing. The final decision always stays with you.",
  },
  {
    icon: "chart",
    title: "Footprint Charts",
    tag: "INSIDE EVERY CANDLE",
    text: "See aggressive buying and selling at every price level inside each candle.",
    detail:
      "Compare bid and ask volume inside the candle instead of relying on its outline. The interactive platform preview includes an illustrative footprint view with volume imbalances at individual price levels.",
  },
  {
    icon: "chart",
    title: "Volume & Delta Profile",
    tag: "SEE THE PRESSURE",
    text: "Identify areas of absorption and buying or selling pressure at a glance.",
    detail:
      "Read the distribution of traded volume alongside delta to understand where participation is concentrated. Put potential absorption and directional pressure into the context of the whole session.",
  },
  {
    icon: "bank",
    title: "DeepDOM",
    tag: "LIQUIDITY, REVEALED",
    text: "An order ladder with a liquidity heatmap to help identify icebergs and stop runs.",
    detail:
      "Inspect resting liquidity in the depth-of-market ladder. Use the heatmap to follow changes in available size and investigate potential iceberg activity and stop runs alongside executed trades.",
  },
  {
    icon: "bolt",
    title: "Order Flow Analyzer",
    tag: "ONE CLEAR VIEW",
    text: "Delta, imbalances, and absorption together in one panel.",
    detail:
      "Bring the main order-flow signals into a single workspace. Compare delta, volume imbalances, and potential absorption without switching between separate analysis windows.",
  },
  {
    icon: "play",
    title: "Deep Replay",
    tag: "PRACTICE WITH CONTEXT",
    text: "Replay the market with active indicators and build experience before taking live trades.",
    detail:
      "Revisit historical market action with your indicators active. Practice reading order flow, review your decisions, and develop a consistent process before moving to real trades.",
  },
  {
    icon: "globe",
    title: "DeepGamma",
    tag: "OPTIONS MEET FUTURES",
    text: "SPX options gamma levels, directly on your futures chart.",
    detail:
      "Add an options-market perspective to your futures analysis. View SPX gamma levels on the futures chart alongside order flow. DeepGamma and options flow are included in the Pro toolkit.",
  },
];
export const plans = [
  {
    name: "Orderflow",
    description: "The foundations of volume and order flow.",
    items: [
      "Core volume tools",
      "Footprint charts",
      "Volume & Delta Profile",
      "Order-flow analysis",
    ],
    popular: false,
  },
  {
    name: "Full",
    description: "A complete workspace for your trading process.",
    items: [
      "Everything in Orderflow",
      "Proprietary indicators",
      "AI Assistant",
      "Live trading sessions",
    ],
    popular: true,
  },
  {
    name: "Pro",
    description: "Order flow with an options-market perspective.",
    items: [
      "Everything in Full",
      "DeepGamma",
      "Options flow",
      "SPX gamma levels on futures",
    ],
    popular: false,
  },
  {
    name: "DeepDOM",
    description: "A dedicated view into market liquidity.",
    items: [
      "Standalone DOM",
      "Liquidity heatmap",
      "Order ladder",
      "Iceberg and stop-run analysis",
    ],
    popular: false,
  },
];
export const lessons = [
  {
    tag: "START FROM ZERO",
    title: "Your first step into order flow",
    time: "FOUNDATION COURSE",
    art: "orbit",
    icon: "chart",
    body: "Learn to read the market from the ground up. The course introduces bid and ask volume, footprint charts, delta, profiles, and liquidity so you can build a structured approach to futures analysis.",
  },
  {
    tag: "LEARN IN CONTEXT",
    title: "Live market breakdowns, every week",
    time: "WEEKLY SESSIONS",
    art: "candles",
    icon: "play",
    body: "Join weekly live breakdowns to see order-flow concepts applied in market context. Review the reasoning behind setups, ask questions, and connect the theory with a repeatable trading process.",
  },
  {
    tag: "GROW TOGETHER",
    title: "A community that speaks your language",
    time: "DISCORD COMMUNITY",
    art: "secure",
    icon: "headphones",
    body: "Connect with other futures traders in the Discord community. Discuss market structure, share observations, and continue learning between live sessions. Community access details will be provided with the platform launch.",
  },
];
export const assistantExamples = [
  {
    question: "Where is the liquidity?",
    answer:
      "In this sample replay, resting orders are concentrated near the session high. Compare the DeepDOM heatmap with executed volume: displayed liquidity can change before a trade reaches it.",
    context: "DeepDOM · Resting liquidity",
  },
  {
    question: "Explain the delta",
    answer:
      "This example shows positive delta while price makes little progress. That can suggest aggressive buyers are meeting passive sellers. Check the footprint and surrounding volume profile for context.",
    context: "Footprint · Delta & absorption",
  },
  {
    question: "Help me review a setup",
    answer:
      "Start with the session context, identify your key levels, then check for a change in order-flow behavior. Define your invalidation before considering an entry. This sample is a process walkthrough, not a trade signal.",
    context: "Order Flow Analyzer · Setup review",
  },
];
export const riskDisclosure =
  "Futures trading involves a high risk of loss. The AI Assistant does not provide investment advice. Past performance does not guarantee future results.";
