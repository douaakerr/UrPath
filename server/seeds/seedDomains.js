import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";
import connectDB from "../config/connectDb.js";
import LearningDomain from "../models/LearningDomain.js";

dotenv.config();

export const initialDomains = [
  {
    name: "Technology",
    description: "Software development, artificial intelligence, data science, cybersecurity, and cloud infrastructure.",
    subdomains: [
      { name: "Web Development", description: "Building websites and web applications" },
      { name: "Mobile Development", description: "Creating apps for iOS and Android" },
      { name: "Artificial Intelligence", description: "Machine learning, deep learning, and AI applications" },
      { name: "Data Science", description: "Data analysis, visualization, and big data processing" },
      { name: "Cybersecurity", description: "Network security, ethical hacking, and information protection" },
      { name: "Cloud & DevOps", description: "Cloud infrastructure, CI/CD pipelines, and server management" },
      { name: "Programming", description: "Core programming concepts, algorithms, and data structures" },
    ],
    isActive: true,
  },
  {
    name: "Design",
    description: "Visual design, user experience, product interfaces, and interactive motion design.",
    subdomains: [
      { name: "UI/UX Design", description: "User interface design, user research, and prototyping" },
      { name: "Graphic Design", description: "Visual branding, typography, and graphic assets" },
      { name: "Product Design", description: "End-to-end digital product design and design systems" },
      { name: "Motion Design", description: "Animation, micro-interactions, and visual storytelling" },
    ],
    isActive: true,
  },
  {
    name: "Arts & Creative",
    description: "Fine arts, digital illustration, photography, video production, music, and 3D modeling.",
    subdomains: [
      { name: "Drawing", description: "Traditional and digital drawing techniques" },
      { name: "Photography", description: "Camera operation, composition, and photo editing" },
      { name: "Video Editing", description: "Video post-production, color grading, and effects" },
      { name: "3D Art", description: "3D modeling, texturing, and asset creation" },
      { name: "Animation", description: "2D and 3D character and motion animation" },
      { name: "Music", description: "Music theory, composition, instrument practice, and audio production" },
    ],
    isActive: true,
  },
  {
    name: "Languages",
    description: "Communication and fluency in world languages.",
    subdomains: [
      { name: "English", description: "Grammar, vocabulary, speaking, and writing" },
      { name: "French", description: "French grammar, conversation, and comprehension" },
      { name: "Spanish", description: "Spanish vocabulary, grammar, and fluency" },
      { name: "German", description: "German language skills, grammar, and conversation" },
      { name: "Korean", description: "Hangul, Korean vocabulary, and conversational skills" },
      { name: "Japanese", description: "Hiragana, Katakana, Kanji, and Japanese grammar" },
      { name: "Other Language", description: "Learning any additional world language" },
    ],
    isActive: true,
  },
  {
    name: "Business",
    description: "Entrepreneurship, marketing, financial management, and business administration.",
    subdomains: [
      { name: "Entrepreneurship", description: "Business planning, startups, and product launch" },
      { name: "Marketing", description: "Digital marketing, SEO, brand strategy, and content marketing" },
      { name: "Finance", description: "Financial planning, investing, accounting, and personal finance" },
      { name: "Management", description: "Project management, leadership, and team operations" },
    ],
    isActive: true,
  },
  {
    name: "Science",
    description: "Natural and formal sciences including math, physics, chemistry, and biology.",
    subdomains: [
      { name: "Mathematics", description: "Algebra, calculus, geometry, and statistics" },
      { name: "Physics", description: "Classical mechanics, quantum physics, and thermodynamics" },
      { name: "Chemistry", description: "Organic chemistry, inorganic chemistry, and biochemistry" },
      { name: "Biology", description: "Genetics, microbiology, ecology, and human anatomy" },
    ],
    isActive: true,
  },
  {
    name: "Health & Wellness",
    description: "Physical fitness, nutrition, mental health, and personal well-being.",
    subdomains: [
      { name: "Fitness", description: "Strength training, cardio, mobility, and exercise routines" },
      { name: "Nutrition", description: "Dietary planning, healthy eating, and sports nutrition" },
      { name: "Mental Wellness", description: "Mindfulness, stress management, and mental health practices" },
    ],
    isActive: true,
  },
  {
    name: "Architecture",
    description: "Architectural design, spatial planning, interior aesthetics, and 3D visualization.",
    subdomains: [
      { name: "Architecture", description: "Building design, structural concepts, and architectural history" },
      { name: "Interior Design", description: "Space planning, color schemes, and interior styling" },
      { name: "3D Architecture", description: "Architectural 3D rendering and CAD modeling" },
    ],
    isActive: true,
  },
  {
    name: "Education",
    description: "Pedagogy, educational technology, instructional design, and effective study techniques.",
    subdomains: [
      { name: "Teaching", description: "Pedagogy, classroom management, and lesson planning" },
      { name: "Educational Technology", description: "EdTech tools, online learning platforms, and digital instruction" },
      { name: "Study Skills", description: "Memory techniques, time management, and exam preparation" },
    ],
    isActive: true,
  },
  {
    name: "Other",
    description: "Custom or niche learning paths outside standard categories.",
    subdomains: [],
    isActive: true,
  },
];

export const seedLearningDomains = async () => {
  try {
    for (const domain of initialDomains) {
      await LearningDomain.updateOne(
        { name: domain.name },
        { $set: domain },
        { upsert: true }
      );
    }
    console.log(chalk.green("✓ Learning domains seeded successfully"));
  } catch (error) {
    console.error(chalk.red("Error seeding learning domains:"), error);
    throw error;
  }
};

const runSeeder = async () => {
  try {
    await connectDB();
    await seedLearningDomains();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

runSeeder();
