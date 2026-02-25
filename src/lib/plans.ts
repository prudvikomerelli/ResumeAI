export const PLANS = {
  FREE: {
    name: "Free",
    generationsPerDay: 3,
    exportsPerDay: 1,
    features: [
      "3 generations per day",
      "1 export per day",
      "Basic ATS scoring",
      "Email support",
    ],
  },
  PRO: {
    name: "Pro",
    generationsPerDay: Infinity,
    exportsPerDay: Infinity,
    price: "$19/month",
    features: [
      "Unlimited generations",
      "Unlimited exports",
      "Advanced ATS scoring",
      "Priority support",
      "Keyword gap analysis",
    ],
  },
} as const;
