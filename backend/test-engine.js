require("dotenv").config();
const { calculatePath } = require("./src/services/pathService");

async function runTests() {
  console.log("==========================================");
  console.log("RUNNING V2 CAREER READINESS SCORE AUDIT SUITE");
  console.log("==========================================\n");

  const testCases = [
    // 1. Generative AI Engineer variations
    { targetJob: "Generative AI Engineer", currentSkills: ["Python"] },
    { targetJob: "Generative AI Engineer", currentSkills: ["Python", "Machine Learning"] },
    { targetJob: "Generative AI Engineer", currentSkills: ["Python", "Machine Learning", "Deep Learning"] },

    // 2. Backend Developer variations
    { targetJob: "Backend Developer", currentSkills: ["Python"] },
    { targetJob: "Backend Developer", currentSkills: ["Python", "Git"] },
    { targetJob: "Backend Developer", currentSkills: ["Python", "Git", "SQL"] },

    // 3. Frontend Developer variations
    { targetJob: "Frontend Developer", currentSkills: ["HTML", "CSS"] },
    { targetJob: "Frontend Developer", currentSkills: ["HTML", "CSS", "JavaScript"] },

    // 4. DevOps Engineer
    { targetJob: "DevOps Engineer", currentSkills: ["Linux"] },

    // 5. Data Analyst
    { targetJob: "Data Analyst", currentSkills: ["Python", "SQL"] },

    // 6. RAG Engineer
    { targetJob: "RAG Engineer", currentSkills: ["Python", "LLM Fundamentals"] },
  ];

  for (const tc of testCases) {
    console.log(`>>> TARGET: "${tc.targetJob}" | KNOWN: [${tc.currentSkills.join(", ")}]`);
    try {
      const res = await calculatePath(tc.currentSkills, tc.targetJob);
      console.log(`    READINESS SCORE: ${res.readinessScore}% (${res.masteredRequiredSkills.length}/${res.requiredSkillCount} required skills mastered)`);
      console.log(`    Mastered Required: [${res.masteredRequiredSkills.join(", ") || "None"}]`);
      console.log(`    Missing Required (${res.missingRequiredSkills.length}): [${res.missingRequiredSkills.join(", ")}]`);
      console.log(`    Total Hops: ${res.totalHops} | Unique Courses: ${res.uniqueCourseCount} | Est Duration: ${res.totalDurationHours} hrs\n`);
    } catch (err) {
      console.error(`    ERROR: ${err.message}\n`);
    }
  }

  // Validation test for invalid job
  console.log(`>>> TARGET: "NonExistentJob" (Validation Test)`);
  try {
    await calculatePath(["Python"], "NonExistentJob");
  } catch (err) {
    console.log(`    EXPECTED ERROR: ${err.message}\n`);
  }

  console.log("==========================================");
  console.log("V2 READINESS SCORE AUDIT COMPLETED!");
  console.log("==========================================");
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test suite failed:", err);
    process.exit(1);
  });
