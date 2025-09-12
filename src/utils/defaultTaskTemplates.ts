
export const defaultTaskTemplates = [
// Ideation Stage Templates
{
  name: "Market Research Analysis",
  description: "Conduct comprehensive market research to understand target audience, competitors, and market opportunities",
  business_stage_name: "Ideation",
  task_type: "analysis",
  priority: "high",
  complexity_score: 7,
  estimated_duration: 240,
  template_data: JSON.stringify({
    deliverables: ["Market size analysis", "Competitor analysis", "Target audience personas"],
    research_methods: ["Surveys", "Interviews", "Secondary research"],
    timeline: "5-7 business days"
  }),
  required_agent_types: JSON.stringify(["Research Agent", "Data Analyst"]),
  success_criteria: JSON.stringify([
  "Complete competitor analysis",
  "Define target market segments",
  "Identify market opportunities"]
  )
},
{
  name: "Business Model Canvas Creation",
  description: "Create and validate a comprehensive business model canvas",
  business_stage_name: "Ideation",
  task_type: "creation",
  priority: "high",
  complexity_score: 6,
  estimated_duration: 180,
  template_data: JSON.stringify({
    deliverables: ["Business Model Canvas", "Value proposition statement"],
    components: ["Value propositions", "Customer segments", "Revenue streams"],
    validation_steps: ["Customer interviews", "Market testing"]
  }),
  required_agent_types: JSON.stringify(["Strategy Agent", "Business Analyst"]),
  success_criteria: JSON.stringify([
  "Complete business model canvas",
  "Validated value proposition",
  "Identified revenue streams"]
  )
},

// Planning Stage Templates
{
  name: "Business Plan Development",
  description: "Develop a comprehensive business plan including financial projections and go-to-market strategy",
  business_stage_name: "Planning",
  task_type: "creation",
  priority: "urgent",
  complexity_score: 9,
  estimated_duration: 480,
  template_data: JSON.stringify({
    deliverables: ["Executive summary", "Financial projections", "Marketing plan", "Operations plan"],
    sections: ["Company overview", "Market analysis", "Financial plan", "Risk assessment"],
    timeline: "2-3 weeks"
  }),
  required_agent_types: JSON.stringify(["Business Analyst", "Financial Advisor", "Strategy Agent"]),
  success_criteria: JSON.stringify([
  "Complete business plan document",
  "5-year financial projections",
  "Go-to-market strategy"]
  )
},
{
  name: "Legal Structure Setup",
  description: "Establish proper legal structure and register the business",
  business_stage_name: "Planning",
  task_type: "administrative",
  priority: "high",
  complexity_score: 5,
  estimated_duration: 120,
  template_data: JSON.stringify({
    deliverables: ["Business registration", "Tax ID application", "Legal documents"],
    requirements: ["Choose business structure", "Register with authorities", "Obtain permits"],
    timeline: "1-2 weeks"
  }),
  required_agent_types: JSON.stringify(["Legal Agent", "Administrative Agent"]),
  success_criteria: JSON.stringify([
  "Business legally registered",
  "Tax identification obtained",
  "Required permits secured"]
  )
},

// Launch Stage Templates
{
  name: "Brand Identity Development",
  description: "Create comprehensive brand identity including logo, colors, and brand guidelines",
  business_stage_name: "Launch",
  task_type: "creation",
  priority: "high",
  complexity_score: 6,
  estimated_duration: 300,
  template_data: JSON.stringify({
    deliverables: ["Logo design", "Brand guidelines", "Color palette", "Typography system"],
    components: ["Visual identity", "Brand voice", "Brand positioning"],
    timeline: "2-3 weeks"
  }),
  required_agent_types: JSON.stringify(["Design Agent", "Creative Director"]),
  success_criteria: JSON.stringify([
  "Final logo and variations",
  "Complete brand guidelines",
  "Brand asset library"]
  )
},
{
  name: "Website Development",
  description: "Design and develop a professional website with e-commerce capabilities if needed",
  business_stage_name: "Launch",
  task_type: "development",
  priority: "high",
  complexity_score: 8,
  estimated_duration: 600,
  template_data: JSON.stringify({
    deliverables: ["Responsive website", "Content management system", "Analytics setup"],
    features: ["Mobile optimization", "SEO optimization", "Contact forms", "Payment integration"],
    timeline: "3-4 weeks"
  }),
  required_agent_types: JSON.stringify(["Web Developer", "UI/UX Designer", "SEO Specialist"]),
  success_criteria: JSON.stringify([
  "Fully functional website",
  "Mobile responsive design",
  "SEO optimized content"]
  )
},

// Growth Stage Templates
{
  name: "Customer Acquisition Campaign",
  description: "Launch multi-channel customer acquisition campaign",
  business_stage_name: "Growth",
  task_type: "marketing",
  priority: "urgent",
  complexity_score: 7,
  estimated_duration: 360,
  template_data: JSON.stringify({
    deliverables: ["Campaign strategy", "Ad creatives", "Landing pages", "Conversion tracking"],
    channels: ["Social media", "Google Ads", "Email marketing", "Content marketing"],
    timeline: "4-6 weeks"
  }),
  required_agent_types: JSON.stringify(["Marketing Agent", "Content Creator", "Data Analyst"]),
  success_criteria: JSON.stringify([
  "Campaign launched across all channels",
  "Target CPA achieved",
  "Conversion tracking implemented"]
  )
},
{
  name: "Product Feature Enhancement",
  description: "Develop and deploy new product features based on customer feedback",
  business_stage_name: "Growth",
  task_type: "development",
  priority: "high",
  complexity_score: 8,
  estimated_duration: 480,
  template_data: JSON.stringify({
    deliverables: ["Feature specifications", "Development plan", "Testing suite", "Deployment guide"],
    process: ["Requirements gathering", "Design", "Development", "Testing", "Deployment"],
    timeline: "4-6 weeks"
  }),
  required_agent_types: JSON.stringify(["Product Manager", "Developer", "QA Tester"]),
  success_criteria: JSON.stringify([
  "Features developed and tested",
  "User acceptance testing passed",
  "Successfully deployed to production"]
  )
},

// Scale Stage Templates
{
  name: "Team Expansion Planning",
  description: "Plan and execute strategic team expansion including hiring and onboarding",
  business_stage_name: "Scale",
  task_type: "planning",
  priority: "high",
  complexity_score: 7,
  estimated_duration: 300,
  template_data: JSON.stringify({
    deliverables: ["Hiring plan", "Job descriptions", "Onboarding process", "Performance metrics"],
    roles: ["Key positions to fill", "Skills requirements", "Compensation packages"],
    timeline: "6-8 weeks"
  }),
  required_agent_types: JSON.stringify(["HR Agent", "Recruitment Specialist", "Operations Manager"]),
  success_criteria: JSON.stringify([
  "Hiring plan approved",
  "Key positions filled",
  "Onboarding process implemented"]
  )
},
{
  name: "Process Automation Implementation",
  description: "Implement automation tools and processes to improve efficiency and scalability",
  business_stage_name: "Scale",
  task_type: "optimization",
  priority: "medium",
  complexity_score: 8,
  estimated_duration: 420,
  template_data: JSON.stringify({
    deliverables: ["Automation strategy", "Tool selection", "Implementation plan", "Training materials"],
    areas: ["Customer service", "Marketing", "Sales", "Operations", "Finance"],
    timeline: "6-8 weeks"
  }),
  required_agent_types: JSON.stringify(["Automation Specialist", "Operations Manager", "IT Support"]),
  success_criteria: JSON.stringify([
  "Automation tools implemented",
  "Processes streamlined",
  "Team trained on new systems"]
  )
},

// Optimization Stage Templates
{
  name: "Performance Analytics Review",
  description: "Comprehensive analysis of business performance metrics and KPIs",
  business_stage_name: "Optimization",
  task_type: "analysis",
  priority: "high",
  complexity_score: 6,
  estimated_duration: 240,
  template_data: JSON.stringify({
    deliverables: ["Performance dashboard", "KPI analysis", "Improvement recommendations"],
    metrics: ["Revenue", "Customer acquisition cost", "Lifetime value", "Churn rate"],
    timeline: "2-3 weeks"
  }),
  required_agent_types: JSON.stringify(["Data Analyst", "Business Intelligence Specialist"]),
  success_criteria: JSON.stringify([
  "Complete performance analysis",
  "Actionable improvement recommendations",
  "Performance dashboard implemented"]
  )
},
{
  name: "Cost Optimization Initiative",
  description: "Identify and implement cost reduction opportunities across all business operations",
  business_stage_name: "Optimization",
  task_type: "optimization",
  priority: "medium",
  complexity_score: 7,
  estimated_duration: 300,
  template_data: JSON.stringify({
    deliverables: ["Cost analysis report", "Optimization plan", "Implementation roadmap"],
    areas: ["Operations", "Marketing", "Technology", "Human resources"],
    timeline: "3-4 weeks"
  }),
  required_agent_types: JSON.stringify(["Financial Analyst", "Operations Manager"]),
  success_criteria: JSON.stringify([
  "Cost reduction opportunities identified",
  "Optimization plan implemented",
  "Target cost savings achieved"]
  )
}];