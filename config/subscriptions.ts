import { ProductTier } from "@/types/subscriptions";

export const SUBSCRIPTION_TIERS: ProductTier[] = [
  {
    name: "Starter",
    id: "tier-hobby",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // $11 monthly subscription
    priceMonthly: "$11",
    description: "Perfect for individual developers and small projects.",
    features: [
      "Global authentication system",
      "Database integration",
      "Secure API routes",
      "Modern UI components",
      "Dark/Light mode",
      "Community forum access",
    ],
    featured: false,
    discountCode: "", // Optional discount code
  },
  {
    name: "Business",
    id: "tier-pro",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // $29 monthly subscription
    priceMonthly: "$29",
    description: "Ideal for growing businesses and development teams.",
    features: [
      "Everything in Starter",
      "Multi-currency payments",
      "Priority support",
      "Advanced analytics",
      "Custom branding options",
      "API usage dashboard",
    ],
    featured: true,
    discountCode: "", // Optional discount code
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    productId: "prod_6E43JxQebqP1JmRXdM5OmQ", // $99 monthly subscription
    priceMonthly: "$99",
    description: "For large organizations with advanced requirements.",
    features: [
      "Everything in Business",
      "Dedicated account manager",
      "Custom implementation support",
      "High-volume transaction processing",
      "Advanced security features",
      "Service Level Agreement (SLA)",
    ],
    featured: false,
    discountCode: "", // Optional discount code
  },
];

export const CREDITS_TIERS: ProductTier[] = [
  {
    name: "Basic Package",
    nameCn: "基础套餐",
    id: "tier-1dollar-credits",
    productId: "prod_a197uVwjTQahlPWGGsqNj", // $1 one-time purchase
    priceMonthly: "$1",
    credits: 20,
    creditsExtra: 5,
    creditAmount: 25, // * 充值后所得的【总积分数】（非常重要，千万不可弄错）
    description: "20 credits",
    descriptionCn: "20 积分",
    features: [
      "Extra 5 credits bonus (25 credits total)",
      "No expiration date",
      "Access to all features",
    ],
    featuresCn: [
      "赠送5积分（共25积分）",
      "无过期时间",
      "可用所有功能",
    ],
    featured: true,
    discountCode: "", // Optional discount code
  },
  {
    name: "Standard Package",
    nameCn: "标准套餐",
    id: "tier-3dollar-credits",
    productId: "prod_vtoBwDBbNREY58cIaQQNc", // $3 one-time purchase
    priceMonthly: "$3",
    credits: 60,
    creditsExtra: 40,
    creditAmount: 100, // * 充值后所得的【总积分数】（非常重要，千万不可弄错）
    description: "60 credits",
    descriptionCn: "60 积分",
    features: [
      "Extra 40 credits bonus (100 credits total)",
      "No expiration date",
      "Access to all features",
    ],
    featuresCn: [
      "赠送40积分（共100积分）",
      "无过期时间",
      "可用所有功能",
    ],
    featured: false,
    discountCode: "", // Optional discount code
  },
  // {
  //   name: "Premium Package",
  //   id: "tier-9-credits",
  //   productId: "prod_a197uVwjTQahlPWGGsqNj", // $29 one-time purchase
  //   priceMonthly: "$29",
  //   description: "9 credits for larger applications and production use.",
  //   creditAmount: 9,
  //   features: [
  //     "9 credits for use across all features",
  //     "No expiration date",
  //     "Premium support",
  //     "Advanced analytics access"
  //   ],
  //   featured: false,
  //   discountCode: "", // Optional discount code
  // },
];
