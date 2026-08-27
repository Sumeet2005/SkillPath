CREATE CONSTRAINT skill_name_unique IF NOT EXISTS
FOR (s:Skill)
REQUIRE s.name IS UNIQUE;

CREATE CONSTRAINT course_name_unique IF NOT EXISTS
FOR (c:Course)
REQUIRE c.name IS UNIQUE;

CREATE CONSTRAINT job_title_unique IF NOT EXISTS
FOR (j:Job)
REQUIRE j.title IS UNIQUE;

CREATE CONSTRAINT certification_name_unique IF NOT EXISTS
FOR (c:Certification)
REQUIRE c.name IS UNIQUE;

// ===============================
// SKILLS
// ===============================

UNWIND [
  {name: 'Python', category: 'Programming', level: 'Beginner'},
  {name: 'JavaScript', category: 'Programming', level: 'Beginner'},
  {name: 'TypeScript', category: 'Programming', level: 'Intermediate'},
  {name: 'Java', category: 'Programming', level: 'Intermediate'},
  {name: 'C++', category: 'Programming', level: 'Intermediate'},

  {name: 'HTML', category: 'Web Development', level: 'Beginner'},
  {name: 'CSS', category: 'Web Development', level: 'Beginner'},
  {name: 'React', category: 'Web Development', level: 'Intermediate'},
  {name: 'Next.js', category: 'Web Development', level: 'Advanced'},
  {name: 'Node.js', category: 'Web Development', level: 'Intermediate'},
  {name: 'Express.js', category: 'Web Development', level: 'Intermediate'},
  {name: 'FastAPI', category: 'Web Development', level: 'Intermediate'},
  {name: 'HTTP/REST', category: 'Web Development', level: 'Intermediate'},
  {name: 'Authentication', category: 'Security', level: 'Intermediate'},

  {name: 'SQL', category: 'Data', level: 'Beginner'},
  {name: 'PostgreSQL', category: 'Data', level: 'Intermediate'},
  {name: 'Data Analysis', category: 'Data', level: 'Intermediate'},
  {name: 'Pandas', category: 'Data', level: 'Intermediate'},
  {name: 'NumPy', category: 'Data', level: 'Intermediate'},
  {name: 'Statistics', category: 'Data', level: 'Intermediate'},
  {name: 'Data Visualization', category: 'Data', level: 'Intermediate'},

  {name: 'Machine Learning', category: 'AI/ML', level: 'Intermediate'},
  {name: 'Deep Learning', category: 'AI/ML', level: 'Advanced'},
  {name: 'LLM Fundamentals', category: 'AI/ML', level: 'Advanced'},
  {name: 'Prompt Engineering', category: 'AI/ML', level: 'Intermediate'},
  {name: 'Vector Databases', category: 'AI/ML', level: 'Advanced'},
  {name: 'RAG', category: 'AI/ML', level: 'Advanced'},
  {name: 'Model Evaluation', category: 'AI/ML', level: 'Advanced'},

  {name: 'Git', category: 'Developer Tools', level: 'Beginner'},
  {name: 'GitHub', category: 'Developer Tools', level: 'Beginner'},
  {name: 'Linux', category: 'DevOps', level: 'Intermediate'},
  {name: 'Networking', category: 'DevOps', level: 'Intermediate'},
  {name: 'Docker', category: 'DevOps', level: 'Intermediate'},
  {name: 'Kubernetes', category: 'DevOps', level: 'Advanced'},
  {name: 'CI/CD', category: 'DevOps', level: 'Intermediate'},
  {name: 'Cloud Fundamentals', category: 'Cloud', level: 'Beginner'},
  {name: 'AWS', category: 'Cloud', level: 'Intermediate'},
  {name: 'Azure', category: 'Cloud', level: 'Intermediate'},

  {name: 'API Security', category: 'Security', level: 'Advanced'},
  {name: 'System Design', category: 'Software Engineering', level: 'Advanced'},
  {name: 'Testing', category: 'Software Engineering', level: 'Intermediate'}
] AS skill

MERGE (s:Skill {name: skill.name})
SET
  s.category = skill.category,
  s.level = skill.level;

// ===============================
// SKILL PREREQUISITES
// ===============================

UNWIND [
  ['HTML', 'CSS'],
  ['JavaScript', 'TypeScript'],
  ['JavaScript', 'React'],
  ['React', 'Next.js'],

  ['JavaScript', 'Node.js'],
  ['Node.js', 'Express.js'],
  ['Python', 'FastAPI'],
  ['HTTP/REST', 'FastAPI'],

  ['SQL', 'PostgreSQL'],
  ['Python', 'NumPy'],
  ['Python', 'Pandas'],
  ['Statistics', 'Data Analysis'],
  ['Pandas', 'Data Analysis'],
  ['Data Analysis', 'Machine Learning'],
  ['Python', 'Machine Learning'],
  ['Statistics', 'Machine Learning'],
  ['Machine Learning', 'Deep Learning'],
  ['Deep Learning', 'LLM Fundamentals'],
  ['LLM Fundamentals', 'Prompt Engineering'],
  ['LLM Fundamentals', 'Vector Databases'],
  ['Vector Databases', 'RAG'],
  ['RAG', 'Model Evaluation'],

  ['Git', 'GitHub'],
  ['Linux', 'Networking'],
  ['Linux', 'Docker'],
  ['Networking', 'Cloud Fundamentals'],
  ['Cloud Fundamentals', 'AWS'],
  ['Cloud Fundamentals', 'Azure'],
  ['Docker', 'Kubernetes'],
  ['GitHub', 'CI/CD'],
  ['Docker', 'CI/CD'],

  ['HTTP/REST', 'Authentication'],
  ['Authentication', 'API Security'],
  ['Testing', 'System Design']
] AS prerequisite

MATCH (a:Skill {name: prerequisite[0]})
MATCH (b:Skill {name: prerequisite[1]})
MERGE (a)-[:PREREQUISITE_OF]->(b);

// ===============================
// JOBS
// ===============================

UNWIND [
  {title: 'Frontend Developer', level: 'Junior', industry: 'Web Development', skills: ['JavaScript', 'HTML', 'CSS', 'React', 'Git']},
  {title: 'React Developer', level: 'Junior', industry: 'Web Development', skills: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Git']},
  {title: 'Backend Developer', level: 'Junior', industry: 'Backend', skills: ['JavaScript', 'Node.js', 'Express.js', 'HTTP/REST', 'Authentication', 'SQL', 'Git']},
  {title: 'Python Backend Developer', level: 'Junior', industry: 'Backend', skills: ['Python', 'FastAPI', 'HTTP/REST', 'Authentication', 'SQL', 'Git']},
  {title: 'Full Stack Developer', level: 'Junior', industry: 'Web Development', skills: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Express.js', 'SQL', 'Git']},
  {title: 'Data Analyst', level: 'Junior', industry: 'Data Science', skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Statistics', 'Data Visualization']},
  {title: 'Data Scientist', level: 'Junior', industry: 'Data Science', skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Statistics', 'Machine Learning']},
  {title: 'Machine Learning Engineer', level: 'Junior', industry: 'AI/ML', skills: ['Python', 'NumPy', 'Statistics', 'Machine Learning', 'Deep Learning', 'Git']},
  {title: 'AI Engineer', level: 'Junior', industry: 'AI/ML', skills: ['Python', 'Machine Learning', 'Deep Learning', 'LLM Fundamentals', 'Git']},
  {title: 'Generative AI Engineer', level: 'Junior', industry: 'AI/ML', skills: ['Python', 'Machine Learning', 'Deep Learning', 'LLM Fundamentals', 'Prompt Engineering', 'Vector Databases', 'RAG', 'Model Evaluation']},
  {title: 'RAG Engineer', level: 'Junior', industry: 'AI/ML', skills: ['Python', 'LLM Fundamentals', 'Vector Databases', 'RAG', 'Model Evaluation', 'API Security']},
  {title: 'DevOps Engineer', level: 'Junior', industry: 'Infrastructure', skills: ['Git', 'Linux', 'Networking', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Fundamentals']},
  {title: 'Cloud Engineer', level: 'Junior', industry: 'Infrastructure', skills: ['Linux', 'Networking', 'Docker', 'CI/CD', 'Cloud Fundamentals', 'AWS']},
  {title: 'Software Engineer', level: 'Junior', industry: 'Software Engineering', skills: ['Python', 'SQL', 'Git', 'GitHub', 'System Design', 'Testing']},
  {title: 'AI Full Stack Developer', level: 'Junior', industry: 'AI/ML', skills: ['Python', 'React', 'Node.js', 'HTTP/REST', 'LLM Fundamentals', 'RAG', 'Docker']}
] AS jobData

MERGE (j:Job {title: jobData.title})
SET j.level = jobData.level, j.industry = jobData.industry
WITH j, jobData
UNWIND jobData.skills AS sName
MATCH (s:Skill {name: sName})
MERGE (j)-[:REQUIRES]->(s);

// ===============================
// COURSES
// ===============================

UNWIND [
  {name: 'Python Foundations', provider: 'DataCamp', level: 'Beginner', duration_hours: 10, teaches: ['Python']},
  {name: 'Java Programming Masterclass', provider: 'udemy', level: 'Intermediate', duration_hours: 35, teaches: ['Java']},
  {name: 'C++ Systems Programming', provider: 'coursera', level: 'Intermediate', duration_hours: 30, teaches: ['C++']},
  {name: 'Modern JavaScript', provider: 'scrimba', level: 'Beginner', duration_hours: 15, teaches: ['JavaScript', 'HTML', 'CSS']},
  {name: 'React Development', provider: 'meta', level: 'Intermediate', duration_hours: 25, teaches: ['TypeScript', 'React']},
  {name: 'Next.js Fullstack Framework', provider: 'Vercel Academy', level: 'Advanced', duration_hours: 20, teaches: ['Next.js']},
  {name: 'Node.js Backend Development', provider: 'coursera', level: 'Intermediate', duration_hours: 30, teaches: ['Node.js', 'Express.js', 'HTTP/REST']},
  {name: 'FastAPI Backend Engineering', provider: 'udemy', level: 'Intermediate', duration_hours: 12, teaches: ['FastAPI', 'HTTP/REST']},
  {name: 'Advanced API Security & Auth', provider: 'Security Academy', level: 'Advanced', duration_hours: 15, teaches: ['Authentication', 'API Security']},
  {name: 'SQL & PostgreSQL', provider: 'datacamp', level: 'Beginner', duration_hours: 12, teaches: ['SQL', 'PostgreSQL']},
  {name: 'Data Analysis with Python', provider: 'freeCodeCamp', level: 'Intermediate', duration_hours: 20, teaches: ['Python', 'Data Analysis', 'Pandas', 'NumPy', 'Data Visualization']},
  {name: 'Statistics for Data Science', provider: 'coursera', level: 'Intermediate', duration_hours: 18, teaches: ['Data Analysis', 'Statistics']},
  {name: 'Machine Learning Fundamentals', provider: 'stanford', level: 'Intermediate', duration_hours: 40, teaches: ['Python', 'Statistics', 'Machine Learning']},
  {name: 'Deep Learning with Python', provider: 'deeplearning.ai', level: 'Advanced', duration_hours: 50, teaches: ['Python', 'Deep Learning']},
  {name: 'LLM Engineering Fundamentals', provider: 'deeplearning.ai', level: 'Advanced', duration_hours: 15, teaches: ['LLM Fundamentals']},
  {name: 'Prompt Engineering', provider: 'openai', level: 'Intermediate', duration_hours: 5, teaches: ['Prompt Engineering']},
  {name: 'Vector Databases', provider: 'pinecone', level: 'Advanced', duration_hours: 8, teaches: ['Vector Databases']},
  {name: 'RAG Application Development', provider: 'langchain', level: 'Advanced', duration_hours: 12, teaches: ['Vector Databases', 'RAG']},
  {name: 'AI Model Evaluation & Governance', provider: 'AI Quality Lab', level: 'Advanced', duration_hours: 12, teaches: ['Model Evaluation']},
  {name: 'Docker & Containerization', provider: 'docker', level: 'Intermediate', duration_hours: 10, teaches: ['Docker']},
  {name: 'Kubernetes Fundamentals', provider: 'cncf', level: 'Advanced', duration_hours: 25, teaches: ['Kubernetes']},
  {name: 'CI/CD Pipelines & DevOps Automation', provider: 'DevOps Institute', level: 'Intermediate', duration_hours: 18, teaches: ['CI/CD']},
  {name: 'AWS Cloud Fundamentals', provider: 'aws', level: 'Intermediate', duration_hours: 20, teaches: ['Cloud Fundamentals', 'AWS']},
  {name: 'Azure Cloud Architecture', provider: 'Cloud Master', level: 'Intermediate', duration_hours: 25, teaches: ['Azure']},
  {name: 'Linux & Networking', provider: 'redhat', level: 'Intermediate', duration_hours: 15, teaches: ['Linux', 'Networking']},
  {name: 'Git & GitHub', provider: 'github', level: 'Beginner', duration_hours: 6, teaches: ['Git', 'GitHub']},
  {name: 'System Design & Scalability', provider: 'Engineering Mastery', level: 'Advanced', duration_hours: 30, teaches: ['System Design']},
  {name: 'Software Testing & Quality', provider: 'udemy', level: 'Intermediate', duration_hours: 14, teaches: ['Testing']}
] AS courseData

MERGE (c:Course {name: courseData.name})
SET c.provider = courseData.provider, c.level = courseData.level, c.duration_hours = courseData.duration_hours
WITH c, courseData
UNWIND courseData.teaches AS sName
MATCH (s:Skill {name: sName})
MERGE (c)-[:TEACHES]->(s);