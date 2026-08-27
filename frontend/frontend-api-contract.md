# SkillPath Frontend-to-Backend API Contract

This document records the exact API contract discovered from the SkillPath frontend application before the frontend presentation layer reset. The backend and Neo4j database remain untouched.

---

## 🔌 Proxy & Base URL Configuration

- **Vite Proxy Target**: `http://localhost:5000`
- **Frontend API Base Path**: `/api`
- **Proxy Configuration in `vite.config.js`**:
  ```javascript
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  }
  ```

---

## 📡 Discovered REST Endpoints

### 1. Backend Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies backend server connectivity and status.
- **Expected Response**: `200 OK`

---

### 2. Fetch Job Roles
- **Endpoint**: `GET /api/jobs`
- **Description**: Retrieves all indexed software engineering job roles from Neo4j.
- **Method**: `GET`
- **Headers**: `Accept: application/json`
- **Response Format**:
  ```json
  {
    "jobs": [
      {
        "title": "Backend Developer",
        "industry": "Software Engineering",
        "level": "Junior",
        "requiredSkills": ["Python", "Express.js", "SQL", "Docker", "Git"]
      }
    ]
  }
  ```

---

### 3. Fetch Technical Skills
- **Endpoint**: `GET /api/skills`
- **Description**: Retrieves all indexed technical skills and their category classifications.
- **Method**: `GET`
- **Headers**: `Accept: application/json`
- **Response Format**:
  ```json
  {
    "skills": [
      {
        "name": "Python",
        "category": "Backend",
        "level": "Beginner",
        "prerequisites": []
      }
    ]
  }
  ```

---

### 4. Generate Learning Path
- **Endpoint**: `POST /api/path`
- **Description**: Traverses the Neo4j prerequisite graph using shortest path Cypher queries to compute the user's missing skills, readiness score, and recommended course steps to reach the target job.
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body Payload**:
  ```json
  {
    "currentSkills": ["Python", "Git"],
    "targetJob": "Backend Developer"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "readinessScore": 40,
    "masteredRequiredSkills": ["Python", "Git"],
    "missingRequiredSkills": ["Express.js", "SQL", "Docker"],
    "path": [
      {
        "step": 1,
        "skill": "Express.js",
        "category": "Backend",
        "hops": 1,
        "prerequisites": ["Node.js"],
        "courses": [
          {
            "name": "Express Web Applications",
            "provider": "Coursera",
            "durationHours": 12,
            "url": "https://example.com"
          }
        ]
      }
    ]
  }
  ```

---

### 5. Fetch Course Recommendations (Optional / Secondary)
- **Endpoint**: `GET /api/recommendations`
- **Description**: Fetches general or skill-mapped course recommendations from backend nodes.
- **Method**: `GET`
