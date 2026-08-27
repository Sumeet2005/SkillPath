import { useState, useEffect, useCallback } from "react";
import { fetchJobs, fetchSkills, generatePath, checkBackendStatus } from "../services/api";

export function useSkillPath() {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [targetJob, setTargetJob] = useState("");
  const [currentSkills, setCurrentSkills] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [readinessScore, setReadinessScore] = useState(0);
  const [masteredRequiredSkills, setMasteredRequiredSkills] = useState([]);
  const [missingRequiredSkills, setMissingRequiredSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [skillSearch, setSkillSearch] = useState("");

  // Load initial backend telemetry & data
  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      setIsLoading(true);
      setError(null);

      try {
        const isHealthy = await checkBackendStatus();
        if (isMounted) setBackendOnline(isHealthy);

        const [jobsData, skillsData] = await Promise.all([
          fetchJobs().catch((err) => {
            console.warn("Failed fetching jobs:", err.message);
            return { jobs: [] };
          }),
          fetchSkills().catch((err) => {
            console.warn("Failed fetching skills:", err.message);
            return { skills: [] };
          }),
        ]);

        if (!isMounted) return;

        const loadedJobs = jobsData.jobs || [];
        const loadedSkills = skillsData.skills || [];

        setJobs(loadedJobs);
        setSkills(loadedSkills);

        if (loadedJobs.length > 0) {
          setTargetJob(loadedJobs[0].title);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed initializing SkillPath engine.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute categories dynamically
  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean))).sort()];

  // Toggle skill selection
  const toggleSkill = useCallback((skillName) => {
    setCurrentSkills((prev) => {
      if (prev.includes(skillName)) {
        return prev.filter((s) => s !== skillName);
      }
      return [...prev, skillName];
    });
  }, []);

  const selectAllSkills = useCallback((skillsToSelect) => {
    const names = skillsToSelect.map((s) => (typeof s === "string" ? s : s.name));
    setCurrentSkills((prev) => Array.from(new Set([...prev, ...names])));
  }, []);

  const clearAllSkills = useCallback(() => {
    setCurrentSkills([]);
  }, []);

  // Calculate learning path via backend Neo4j traversal
  // Accepts optional override params for direct shortcut execution from Career Explorer
  const handleGeneratePath = useCallback(
    async (overrideTargetJob, overrideCurrentSkills, overrideNextTab = "roadmap") => {
      // Guard against React Synthetic Event objects passed as event handlers
      const validTargetJob = typeof overrideTargetJob === "string" ? overrideTargetJob : null;
      const validCurrentSkills = Array.isArray(overrideCurrentSkills) ? overrideCurrentSkills : undefined;
      const validNextTab = typeof overrideNextTab === "string" ? overrideNextTab : "roadmap";

      const jobToUse = validTargetJob || targetJob;
      const skillsToUse = validCurrentSkills !== undefined ? validCurrentSkills : currentSkills;

      if (!jobToUse) return;

      setIsGeneratingPath(true);
      setError(null);

      try {
        const data = await generatePath(skillsToUse, jobToUse);
        setLearningPath(data.path || []);
        setReadinessScore(data.readinessScore || 0);
        setMasteredRequiredSkills(data.masteredRequiredSkills || []);
        setMissingRequiredSkills(data.missingRequiredSkills || []);
        if (validNextTab) {
          setActiveTab(validNextTab);
        }
      } catch (err) {
        setError(err.message || "Failed generating prerequisite learning path.");
      } finally {
        setIsGeneratingPath(false);
      }
    },
    [currentSkills, targetJob]
  );

  // Canonical state reset
  const resetState = useCallback(() => {
    if (jobs.length > 0) setTargetJob(jobs[0].title);
    setCurrentSkills([]);
    setLearningPath([]);
    setReadinessScore(0);
    setMasteredRequiredSkills([]);
    setMissingRequiredSkills([]);
    setSkillSearch("");
    setSelectedCategoryFilter("All");
    setError(null);
    setActiveTab("dashboard");
  }, [jobs]);

  const activeJobDetails = jobs.find((j) => j.title === targetJob);

  return {
    jobs,
    skills,
    categories,
    targetJob,
    setTargetJob,
    currentSkills,
    toggleSkill,
    selectAllSkills,
    clearAllSkills,
    learningPath,
    readinessScore,
    masteredRequiredSkills,
    missingRequiredSkills,
    activeTab,
    setActiveTab,
    isLoading,
    isGeneratingPath,
    error,
    backendOnline,
    handleGeneratePath,
    resetState,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    skillSearch,
    setSkillSearch,
    activeJobDetails,
  };
}

export default useSkillPath;
