const Subject = require('../database/Subject');
const User = require('../database/User');
const DashboardStats = require('../database/DashboardStats');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to generate example topic structure based on subject
const generateExampleStructure = (subjectName, level) => {
  const examples = {
    'DSA': `"topics": [
      {"title": "Programming Language Basics (C/Python)", "description": "Learn fundamentals of programming", "difficulty": "beginner"},
      {"title": "Array", "description": "Master array data structure", "difficulty": "beginner"},
      {"title": "String", "description": "String operations and algorithms", "difficulty": "beginner"},
      {"title": "Linked List", "description": "Singly and doubly linked lists", "difficulty": "intermediate"},
      {"title": "Stack", "description": "LIFO data structure and applications", "difficulty": "intermediate"},
      {"title": "Queue", "description": "FIFO data structure and variations", "difficulty": "intermediate"},
      {"title": "Tree", "description": "Binary trees, BST, traversals", "difficulty": "intermediate"},
      {"title": "Graph", "description": "Graphs, DFS, BFS, shortest path", "difficulty": "advanced"},
      {"title": "Sorting Algorithms", "description": "Quick sort, Merge sort, Heap sort", "difficulty": "advanced"},
      {"title": "Dynamic Programming", "description": "DP concepts and problem solving", "difficulty": "advanced"}
    ]`,
    'Data Structures and Algorithms': `"topics": [
      {"title": "Programming Language Basics (C/Python)", "description": "Learn fundamentals of programming", "difficulty": "beginner"},
      {"title": "Array", "description": "Master array data structure", "difficulty": "beginner"},
      {"title": "String", "description": "String operations and algorithms", "difficulty": "beginner"},
      {"title": "Linked List", "description": "Singly and doubly linked lists", "difficulty": "intermediate"},
      {"title": "Stack", "description": "LIFO data structure and applications", "difficulty": "intermediate"},
      {"title": "Queue", "description": "FIFO data structure and variations", "difficulty": "intermediate"},
      {"title": "Tree", "description": "Binary trees, BST, traversals", "difficulty": "intermediate"},
      {"title": "Graph", "description": "Graphs, DFS, BFS, shortest path", "difficulty": "advanced"},
      {"title": "Sorting Algorithms", "description": "Quick sort, Merge sort, Heap sort", "difficulty": "advanced"},
      {"title": "Dynamic Programming", "description": "DP concepts and problem solving", "difficulty": "advanced"}
    ]`,
    'Web Development': `"topics": [
      {"title": "HTML", "description": "HTML structure and semantic elements", "difficulty": "beginner"},
      {"title": "CSS", "description": "Styling, layouts, responsive design", "difficulty": "beginner"},
      {"title": "JavaScript Basics", "description": "Variables, functions, DOM manipulation", "difficulty": "beginner"},
      {"title": "React Fundamentals", "description": "Components, JSX, hooks", "difficulty": "intermediate"},
      {"title": "State Management", "description": "Props, useState, Context API", "difficulty": "intermediate"},
      {"title": "REST APIs", "description": "API calls, fetch, axios", "difficulty": "intermediate"},
      {"title": "Database Design", "description": "SQL, MongoDB, relations", "difficulty": "intermediate"},
      {"title": "Authentication", "description": "JWT, OAuth, security", "difficulty": "advanced"},
      {"title": "Performance Optimization", "description": "Caching, lazy loading", "difficulty": "advanced"},
      {"title": "Deployment", "description": "CI/CD, hosting, DevOps", "difficulty": "advanced"}
    ]`
  };
  
  return examples[subjectName] || examples['Data Structures and Algorithms'];
};

// Helper function to generate comprehensive fallback topics
const generateFallbackTopics = (subjectName, level = 'intermediate') => {
  const commonSubjectsTopics = {
    'Data Structures': {
      topics: [
        {
          title: 'Arrays and Strings',
          description: 'Arrays are contiguous memory locations. Learn traversal, insertion, deletion, searching algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=55l-aZ7_F24',
          documentationUrl: 'https://www.geeksforgeeks.org/array-data-structure/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'Linked Lists',
          description: 'Linked lists operations: insertion, deletion, traversal, and reversal.',
          videoUrl: 'https://www.youtube.com/watch?v=WwfhLC16bis',
          documentationUrl: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'beginner'
        },
        {
          title: 'Stacks and Queues',
          description: 'LIFO and FIFO data structures with array and linked list implementations.',
          videoUrl: 'https://www.youtube.com/watch?v=F1F2imiOJfk',
          documentationUrl: 'https://www.geeksforgeeks.org/stack-data-structure/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'beginner'
        },
        {
          title: 'Trees and Binary Trees',
          description: 'Tree traversals: inorder, preorder, postorder, level order. Binary search trees.',
          videoUrl: 'https://www.youtube.com/watch?v=H5JubkIy_p8',
          documentationUrl: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
          documentationSource: 'geeksforgeeks',
          order: 4,
          difficulty: 'intermediate'
        },
        {
          title: 'Graphs',
          description: 'Graph representations, BFS, DFS traversals, and shortest path algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=09_LlHjoEiY',
          documentationUrl: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
          documentationSource: 'geeksforgeeks',
          order: 5,
          difficulty: 'intermediate'
        }
      ]
    },
    'Algorithms': {
      topics: [
        {
          title: 'Time and Space Complexity',
          description: 'Big O notation for analyzing algorithm efficiency.',
          videoUrl: 'https://www.youtube.com/watch?v=9TlHvipP5yA',
          documentationUrl: 'https://www.geeksforgeeks.org/time-complexity-and-space-complexity/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'Sorting Algorithms',
          description: 'Bubble, Insertion, Merge, Quick, Heap sort algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=ZZuD6iUe3Pc',
          documentationUrl: 'https://www.geeksforgeeks.org/sorting-algorithms/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'intermediate'
        },
        {
          title: 'Searching Algorithms',
          description: 'Linear search, Binary search, Hash tables.',
          videoUrl: 'https://www.youtube.com/watch?v=JQofi7nYg-A',
          documentationUrl: 'https://www.geeksforgeeks.org/searching-algorithms/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'beginner'
        },
        {
          title: 'Dynamic Programming',
          description: 'Memoization and tabulation. Classic DP problems.',
          videoUrl: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
          documentationUrl: 'https://www.geeksforgeeks.org/dynamic-programming/',
          documentationSource: 'geeksforgeeks',
          order: 4,
          difficulty: 'advanced'
        }
      ]
    },
    'Operating Systems': {
      topics: [
        {
          title: 'Process Management',
          description: 'Processes, threads, scheduling algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=OrM7nZcxXZU',
          documentationUrl: 'https://www.geeksforgeeks.org/process-management-in-os/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'intermediate'
        },
        {
          title: 'Memory Management',
          description: 'Virtual memory, paging, segmentation, page replacement.',
          videoUrl: 'https://www.youtube.com/watch?v=7AcUdYA9nnM',
          documentationUrl: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'advanced'
        },
        {
          title: 'File Systems',
          description: 'File organization, directory structures, allocation methods.',
          videoUrl: 'https://www.youtube.com/watch?v=6-WE7NFzHxw',
          documentationUrl: 'https://www.geeksforgeeks.org/file-systems-in-operating-system/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'intermediate'
        }
      ]
    },
    'Database Management': {
      topics: [
        {
          title: 'Relational Model',
          description: 'Tables, keys, relationships, ER diagrams.',
          videoUrl: 'https://www.youtube.com/watch?v=jyB6wOdFWI4',
          documentationUrl: 'https://www.geeksforgeeks.org/relational-model-in-dbms/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'SQL Queries',
          description: 'SELECT, INSERT, UPDATE, DELETE, JOIN operations.',
          videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
          documentationUrl: 'https://www.geeksforgeeks.org/sql-tutorial/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'beginner'
        },
        {
          title: 'Normalization',
          description: 'Database normalization forms, functional dependencies.',
          videoUrl: 'https://www.youtube.com/watch?v=7r3h5Lw1FgE',
          documentationUrl: 'https://www.geeksforgeeks.org/database-normalization/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'intermediate'
        }
      ]
    },
    'DSA': {
      // Maps to combined Data Structures and Algorithms
      topics: [
        {
          title: 'Arrays and Strings',
          description: 'Arrays are contiguous memory locations. Learn traversal, insertion, deletion, searching algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=55l-aZ7_F24',
          documentationUrl: 'https://www.geeksforgeeks.org/array-data-structure/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'Linked Lists',
          description: 'Linked lists operations: insertion, deletion, traversal, and reversal.',
          videoUrl: 'https://www.youtube.com/watch?v=WwfhLC16bis',
          documentationUrl: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'beginner'
        },
        {
          title: 'Stack', 
          description: "LIFO data structure and applications", 
          difficulty: "intermediate",
          estimatedHours: 8,
          ePointsReward: 15,
          content: "Master stack data structure. Learn push, pop, peek operations. Applications include expression evaluation, backtracking.",
          subtopics: ["Stack Operations", "Expression Evaluation", "Parenthesis Matching", "Backtracking", "Applications"],
          videoUrl: 'https://www.youtube.com/watch?v=F1F2imiOJfk',
          documentationUrl: 'https://www.geeksforgeeks.org/stack-data-structure/',
          documentationSource: 'geeksforgeeks',
        },
        { 
          title: "Tree", 
          description: "Binary trees, BST, and tree traversals", 
          difficulty: "intermediate",
          estimatedHours: 12,
          ePointsReward: 15,
          content: "Learn tree structures, binary trees, BST. Understand traversals (inorder, preorder, postorder), insertion, deletion, searching.",
          subtopics: ["Tree Basics", "Binary Trees", "BST", "Traversals", "Balanced Trees"],
          videoUrl: 'https://www.youtube.com/watch?v=H5JubkIy_p8',
          documentationUrl: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
          documentationSource: 'geeksforgeeks',
        },
        { 
          title: "Graph", 
          description: "Graphs, DFS, BFS, shortest path algorithms", 
          difficulty: "advanced",
          estimatedHours: 12,
          ePointsReward: 20,
          content: "Master graph data structures. Learn DFS, BFS, Dijkstra, Bellman-Ford. Understand spanning trees and other algorithms.",
          subtopics: ["Graph Basics", "DFS", "BFS", "Shortest Path", "MST", "Advanced algorithms"],
          videoUrl: 'https://www.youtube.com/watch?v=09_LlHjoEiY',
          documentationUrl: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
          documentationSource: 'geeksforgeeks',
        },
        {
          title: 'Sorting Algorithms',
          description: 'Bubble, Insertion, Merge, Quick, Heap sort algorithms.',
          videoUrl: 'https://www.youtube.com/watch?v=ZZuD6iUe3Pc',
          documentationUrl: 'https://www.geeksforgeeks.org/sorting-algorithms/',
          documentationSource: 'geeksforgeeks',
          order: 6,
          difficulty: 'intermediate'
        },
        {
          title: 'Dynamic Programming',
          description: 'Memoization and tabulation. Classic DP problems.',
          videoUrl: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
          documentationUrl: 'https://www.geeksforgeeks.org/dynamic-programming/',
          documentationSource: 'geeksforgeeks',
          order: 7,
          difficulty: 'advanced'
        }
      ]
    },
    'C++ Programming': {
      topics: [
        {
          title: 'Introduction & Setup',
          description: 'Install g++ and write your first C++ program',
          videoUrl: 'https://www.youtube.com/watch?v=M NeXUN7fgg',
          documentationUrl: 'https://www.geeksforgeeks.org/c-hello-world-program/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'Object-Oriented Programming',
          description: 'Master OOP concepts in C++',
          videoUrl: 'https://www.youtube.com/watch?v=wN0x9eLdgG4',
          documentationUrl: 'https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'intermediate'
        },
        {
          title: 'Memory & Pointers',
          description: 'Deep dive into memory management and pointer arithmetic',
          videoUrl: 'https://www.youtube.com/watch?v=rtgwvkaL0nU',
          documentationUrl: 'https://www.geeksforgeeks.org/pointers-in-cpp/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'advanced'
        }
      ]
    },
    'Computer Networks': {
      topics: [
        {
          title: 'OSI Model Layers',
          description: 'Understand the 7 layers of the OSI model',
          videoUrl: 'https://www.youtube.com/watch?v=vv4y_uOneC0',
          documentationUrl: 'https://www.geeksforgeeks.org/layers-of-isi-model/',
          documentationSource: 'geeksforgeeks',
          order: 1,
          difficulty: 'beginner'
        },
        {
          title: 'TCP vs UDP Protocols',
          description: 'Learn the differences between core transport protocols',
          videoUrl: 'https://www.youtube.com/watch?v=hUfS37xT8kU',
          documentationUrl: 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/',
          documentationSource: 'geeksforgeeks',
          order: 2,
          difficulty: 'intermediate'
        },
        {
          title: 'Network Security Basics',
          description: 'Deep dive into firewalls, SSL, and encryption',
          videoUrl: 'https://www.youtube.com/watch?v=L-0T-0V2z6w',
          documentationUrl: 'https://www.geeksforgeeks.org/network-security-introduction/',
          documentationSource: 'geeksforgeeks',
          order: 3,
          difficulty: 'advanced'
        }
      ]
    },
    'Web Development': {
      topics: [
        { 
          title: "HTML Basics & Semantic Elements", 
          description: "Master the structure of the web using modern semantic HTML5 tags for accessibility and SEO.", 
          difficulty: "beginner",
          estimatedHours: 6,
          ePointsReward: 10,
          content: "Learn how to build well-structured web pages. This topic covers semantic elements like <header>, <main>, <footer>, sectioning, forms, and accessibility best practices.",
          subtopics: ["Document Structure", "Semantic Tags", "Attributes", "Forms & Validation", "ARIA Labels"],
          videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
          documentationUrl: "https://www.geeksforgeeks.org/html-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "CSS Foundations & Layouts", 
          description: "Learn to style web pages using modern CSS techniques including Flexbox and Grid.", 
          difficulty: "beginner",
          estimatedHours: 8,
          ePointsReward: 10,
          content: "Master CSS selectors, the box model, and layouts. Understand how Flexbox and CSS Grid revolutionize responsive design.",
          subtopics: ["Box Model", "Selectors", "Flexbox", "CSS Grid", "Positioning", "Typography"],
          videoUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
          documentationUrl: "https://www.geeksforgeeks.org/css-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Modern JavaScript (ES6+)", 
          description: "Master core programming concepts with the latest ECMAScript features.", 
          difficulty: "beginner",
          estimatedHours: 10,
          ePointsReward: 15,
          content: "Understand JavaScript fundamentals including variables (let/const), arrow functions, destructuring, template literals, and basic array methods.",
          subtopics: ["Variables & Scope", "Functions", "Objects & Arrays", "ES6+ Features", "Promises Basics"],
          videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          documentationUrl: "https://www.geeksforgeeks.org/javascript-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "DOM Manipulation & Events", 
          description: "Learn how to make web pages interactive using JavaScript and the DOM API.", 
          difficulty: "beginner",
          estimatedHours: 6,
          ePointsReward: 10,
          content: "Master selecting elements, modifying content/styles dynamically, and handling user interactions with event listeners.",
          subtopics: ["Selecting Elements", "Changing Styles", "Event Listeners", "Bubbling & Capturing", "Form Handling"],
          videoUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8",
          documentationUrl: "https://www.geeksforgeeks.org/dom-introduction/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "React.js Fundamentals", 
          description: "Build component-based user interfaces with React, the most popular frontend library.", 
          difficulty: "intermediate",
          estimatedHours: 12,
          ePointsReward: 15,
          content: "Learn the core concepts of React: Components, JSX, Props, and the thinking-in-react philosophy.",
          subtopics: ["JSX", "Components", "Props", "Lists & Keys", "Fragment", "Conditional Rendering"],
          videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
          documentationUrl: "https://react.dev/learn",
          documentationSource: "official docs"
        },
        { 
          title: "React Hooks & State Management", 
          description: "Manage component lifecycle and application state using hooks like useState and useEffect.", 
          difficulty: "intermediate",
          estimatedHours: 10,
          ePointsReward: 15,
          content: "Master built-in hooks and learn how to manage shared state across components using Context API.",
          subtopics: ["useState", "useEffect", "useContext", "useRef", "Custom Hooks", "State Lifting"],
          videoUrl: "https://www.youtube.com/watch?v=70_Xp9p-l3k",
          documentationUrl: "https://www.geeksforgeeks.org/reactjs-hooks/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Tailwind CSS Mastery", 
          description: "Rapidly build modern interfaces with utility-first CSS frameworks.", 
          difficulty: "beginner",
          estimatedHours: 6,
          ePointsReward: 10,
          content: "Learn how to style apps using utility classes without writing custom CSS. Covers configuration, responsiveness, and themes.",
          subtopics: ["Utility Classes", "Configuring Tailwind", "Responsiveness", "Hover & Focus", "Dark Mode"],
          videoUrl: "https://www.youtube.com/watch?v=lCxcTsOHrjo",
          documentationUrl: "https://tailwindcss.com/docs/",
          documentationSource: "official docs"
        },
        { 
          title: "Node.js & Express.js Back-end", 
          description: "Build fast and scalable server-side applications using JavaScript.", 
          difficulty: "intermediate",
          estimatedHours: 10,
          ePointsReward: 15,
          content: "Learn environment setup, routing, middleware, and request/response handling in Express.",
          subtopics: ["Node Runtime", "Modules", "Express Routing", "Middleware", "Body Parsing"],
          videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
          documentationUrl: "https://www.geeksforgeeks.org/node-js-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "RESTful API Design", 
          description: "Design professional API endpoints following REST architecture standards.", 
          difficulty: "intermediate",
          estimatedHours: 8,
          ePointsReward: 15,
          content: "Master HTTP methods (GET, POST, PUT, DELETE), status codes, and structuring JSON responses.",
          subtopics: ["HTTP Verbs", "Resource Paths", "Status Codes", "JSON Format", "Error Handling"],
          videoUrl: "https://www.youtube.com/watch?v=lsMQRaeKNDk",
          documentationUrl: "https://www.geeksforgeeks.org/rest-api-introduction/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "MongoDB & Database Design", 
          description: "Work with NoSQL databases and learn how to structure documents and collections.", 
          difficulty: "intermediate",
          estimatedHours: 10,
          ePointsReward: 15,
          content: "Learn basic CRUD operations, Mongoose schemas, relations, and aggregation frameworks.",
          subtopics: ["CRUD Operations", "Mongoose Schemas", "Validation", "Relationships", "Atlas Setup"],
          videoUrl: "https://www.youtube.com/watch?v=j095WclCL68",
          documentationUrl: "https://www.geeksforgeeks.org/mongodb-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Authentication & Security", 
          description: "Secure your applications using JSON Web Tokens and password hashing.", 
          difficulty: "advanced",
          estimatedHours: 10,
          ePointsReward: 20,
          content: "Master encryption with bcrypt, generating tokens, and protecting routes with auth middleware.",
          subtopics: ["Bcrypt Hashing", "JWT Signing", "Verification", "Auth Middleware", "CORS"],
          videoUrl: "https://www.youtube.com/watch?v=2jqok-WgelI",
          documentationUrl: "https://www.geeksforgeeks.org/node-js-authentication-using-jsonwebtoken-and-rest-api/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Git & GitHub Workflow", 
          description: "Learn version control for collaboration and tracking code changes.", 
          difficulty: "beginner",
          estimatedHours: 5,
          ePointsReward: 10,
          content: "Master commits, branches, pull requests, and resolving merge conflicts efficiently.",
          subtopics: ["Git Init/Add/Commit", "Branching", "Push/Pull", "Pull Requests", "Conflict Resolution"],
          videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
          documentationUrl: "https://www.geeksforgeeks.org/git-tutorial/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Performance Optimization", 
          description: "Make your web apps faster and optimize for Core Web Vitals.", 
          difficulty: "advanced",
          estimatedHours: 8,
          ePointsReward: 20,
          content: "Learn lazy loading, image optimization, code splitting, and using Lighthouse for auditing.",
          subtopics: ["Lazy Loading", "Asset Optimization", "Code Splitting", "Lighthouse", "Caching"],
          videoUrl: "https://www.youtube.com/watch?v=0fONene3OIA",
          documentationUrl: "https://web.dev/learn/performance/",
          documentationSource: "official docs"
        },
        { 
          title: "Deployment (Vercel & Netlify)", 
          description: "Take your project from localhost to the real world.", 
          difficulty: "intermediate",
          estimatedHours: 5,
          ePointsReward: 10,
          content: "Learn how to deploy your React and Node apps, configure environment variables, and manage CI/CD.",
          subtopics: ["Vercel Deployment", "Environment Variables", "CI/CD", "Domains", "HTTPS"],
          videoUrl: "https://www.youtube.com/watch?v=j7VfO_InMVA",
          documentationUrl: "https://www.geeksforgeeks.org/how-to-deploy-react-app-on-vercel/",
          documentationSource: "geeksforgeeks"
        },
        { 
          title: "Full-stack Project Architecture", 
          description: "Learn how to structure large-scale full-stack applications.", 
          difficulty: "advanced",
          estimatedHours: 12,
          ePointsReward: 25,
          content: "Understand project folder structure, state synchronization, environment management, and best practices for scaling.",
          subtopics: ["Folder Structure", "Monorepos", "State Sync", "Scaling Strategies", "Security Layering"],
          videoUrl: "https://www.youtube.com/watch?v=P_VIsF0pA0c",
          documentationUrl: "https://www.geeksforgeeks.org/full-stack-development-tutorial/",
          documentationSource: "geeksforgeeks"
        }
      ]
    }
  };

  // Get subject-specific topics or use generic ones
  const baseTopic = commonSubjectsTopics[subjectName] || null;
  
  if (baseTopic) {
    return {
      topics: baseTopic.topics
    };
  }

  // Generic fallback for any subject
  return {
    topics: [
      {
        title: `Introduction to ${subjectName}`,
        description: `Learn the basics and foundations of ${subjectName}`,
        difficulty: 'beginner',
        estimatedHours: 8,
        ePointsReward: 10,
        content: `Master the foundational concepts of ${subjectName}. This course covers essential terminology, basic principles, and introductory topics that form the foundation for advanced learning.`,
        subtopics: ['Introduction', 'Basics', 'Fundamentals', 'Terminology'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' introduction'),
        documentationUrl: 'https://www.geeksforgeeks.org/',
        documentationSource: 'geeksforgeeks'
      },
      {
        title: `Core Principles & Architecture`,
        description: `Understand the underlying architecture of ${subjectName}`,
        difficulty: 'beginner',
        estimatedHours: 10,
        ePointsReward: 10,
        content: `Dive deep into the architecture and core design principles of ${subjectName}. Learn how different components work together.`,
        subtopics: ['Architecture', 'Design Principles', 'Components', 'Interactions'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' architecture'),
        documentationUrl: 'https://www.tutorialspoint.com/',
        documentationSource: 'tutorialspoint'
      },
      {
        title: `Environment Setup & Tooling`,
        description: `Getting started with the necessary tools`,
        difficulty: 'beginner',
        estimatedHours: 6,
        ePointsReward: 10,
        content: `Set up your development/learning environment for ${subjectName}. Install essential software and learn about the toolchain.`,
        subtopics: ['Installation', 'Configuration', 'Tooling', 'First Project'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' setup'),
        documentationUrl: 'https://www.geeksforgeeks.org/',
        documentationSource: 'geeksforgeeks'
      },
      {
        title: `${subjectName} Data Management`,
        description: `Handling data and state in ${subjectName}`,
        difficulty: 'intermediate',
        estimatedHours: 10,
        ePointsReward: 15,
        content: `Learn how data is structured and managed in ${subjectName}. Covers databases, state management, and data flow.`,
        subtopics: ['Databases', 'State', 'Data Flow', 'Persistence'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' data management'),
        documentationUrl: 'https://www.geeksforgeeks.org/',
        documentationSource: 'geeksforgeeks'
      },
      {
        title: `Practical Project Implementation`,
        description: `Building a real-world project with ${subjectName}`,
        difficulty: 'intermediate',
        estimatedHours: 14,
        ePointsReward: 15,
        content: `Apply your knowledge by building a practical project from start to finish using ${subjectName}.`,
        subtopics: ['Project Planning', 'Implementation', 'Debugging', 'Testing'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' project'),
        documentationUrl: 'https://www.tutorialspoint.com/',
        documentationSource: 'tutorialspoint'
      },
      {
        title: `Optimization & Performance Tuning`,
        description: `Making ${subjectName} faster and more efficient`,
        difficulty: 'intermediate',
        estimatedHours: 12,
        ePointsReward: 15,
        content: `Identify bottlenecks and apply optimization techniques to improve the performance of your ${subjectName} projects.`,
        subtopics: ['Profiling', 'Caching', 'Performance Optimization', 'Best Practices'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' optimization'),
        documentationUrl: 'https://www.geeksforgeeks.org/',
        documentationSource: 'geeksforgeeks'
      },
      {
        title: `Security & Best Practices`,
        description: `Writing secure and maintainable code in ${subjectName}`,
        difficulty: 'advanced',
        estimatedHours: 12,
        ePointsReward: 20,
        content: `Learn about common security vulnerabilities and how to prevent them. Focus on writing clean, secure, and maintainable code.`,
        subtopics: ['Security Basics', 'OWASP', 'Encryption', 'Coding Standards'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' security'),
        documentationUrl: 'https://www.tutorialspoint.com/',
        documentationSource: 'tutorialspoint'
      },
      {
        title: `Advanced Dynamic Systems`,
        description: `Complex system design with ${subjectName}`,
        difficulty: 'advanced',
        estimatedHours: 15,
        ePointsReward: 20,
        content: `Master complex system design and advanced patterns used in large-scale ${subjectName} applications.`,
        subtopics: ['System Design', 'Patterns', 'Scale', 'Resilience'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' systems'),
        documentationUrl: 'https://www.geeksforgeeks.org/',
        documentationSource: 'geeksforgeeks'
      },
      {
        title: `Industry Trends & Expert Level Insights`,
        description: `Future of ${subjectName} and expert techniques`,
        difficulty: 'advanced',
        estimatedHours: 15,
        ePointsReward: 20,
        content: `Stay updated with the latest industry trends and learn about cutting-edge techniques used by experts in ${subjectName}.`,
        subtopics: ['Latest Trends', 'Future Tech', 'Expert Insights', 'Career Path'],
        videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName + ' industry trends'),
        documentationUrl: 'https://www.tutorialspoint.com/',
        documentationSource: 'tutorialspoint'
      }
    ]
  };
};

const getSubjects = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🔍 Fetching subjects for user:", userId);
    
    // Get all public subjects + user's created subjects
    const subjects = await Subject.find({
      $or: [
        { createdBy: null }, // Public subjects
        { createdBy: userId } // User's created subjects
      ]
    }).select('-__v').sort({ createdAt: -1 });

    console.log(`✅ Found ${subjects.length} subjects`);

    // Get user progress
    const user = await User.findById(userId).populate('progress.subject');

    // Add progress info to subjects
    const subjectsWithProgress = subjects.map(subject => {
      // Find user progress for this subject safely
      const progress = user.progress.find(p => {
        if (!p.subject) return false;
        
        // Handle both populated (object) and unpopulated (ID) subject field
        const pSubjectId = p.subject._id ? p.subject._id.toString() : p.subject.toString();
        return pSubjectId === subject._id.toString();
      });

      // Mark topics as completed based on user progress
      const completedTopicIds = progress 
        ? progress.completedTopics.map(id => id.toString())
        : [];

      return {
        ...subject.toObject(),
        totalTopics: subject.totalTopics || subject.topics?.length || 0,
        topics: subject.topics.map(topic => ({
          ...topic.toObject(),
          isCompleted: completedTopicIds.includes(topic._id.toString())
        })),
        userProgress: progress ? {
          completedTopics: Array.isArray(progress.completedTopics) ? progress.completedTopics.length : 0,
          isCompleted: !!progress.isCompleted,
          completedAt: progress.completedAt
        } : {
          completedTopics: 0,
          isCompleted: false
        }
      };
    });

    console.log("📤 Returning subjects with progress:", subjectsWithProgress.length);
    res.json(subjectsWithProgress);
  } catch (error) {
    console.error('❌ Get subjects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getSubjectTopics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const subject = await Subject.findById(id).select('topics name');

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get user progress for this subject
    const user = await User.findById(userId);
    const subjectProgress = user.progress.find(p => p.subject.toString() === id);

    // Mark topics as completed based on user progress
    const completedTopicIds = subjectProgress 
      ? subjectProgress.completedTopics.map(id => id.toString())
      : [];

    const topicsWithProgress = subject.topics.map(topic => ({
      ...topic.toObject(),
      isCompleted: completedTopicIds.includes(topic._id.toString())
    }));

    res.json({
      subjectName: subject.name,
      topics: topicsWithProgress
    });
  } catch (error) {
    console.error('Get subject topics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const completeTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find subject containing the topic
    const subject = await Subject.findOne({ 'topics._id': id });

    if (!subject) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Update user progress
    const user = await User.findById(userId);
    let subjectProgress = user.progress.find(p => p.subject.toString() === subject._id.toString());

    if (!subjectProgress) {
      subjectProgress = {
        subject: subject._id,
        completedTopics: [],
        isCompleted: false
      };
      user.progress.push(subjectProgress);
    }

    // Add topic to completed topics if not already there
    if (!subjectProgress.completedTopics.includes(id)) {
      subjectProgress.completedTopics.push(id);
    }

    // Check if subject is completed
    if (subjectProgress.completedTopics.length === subject.topics.length) {
      subjectProgress.isCompleted = true;
      subjectProgress.completedAt = new Date();
    }

    await user.save();

    // Sync with DashboardStats
    try {
      let stats = await DashboardStats.findOne({ user: userId });
      if (!stats) {
        stats = new DashboardStats({ user: userId });
        await stats.save(); // Initial save to get the object structure
      }

      // Find or create subject session in subjectStats
      let subjectStat = stats.subjectStats.find(s => s.subject.toString() === subject._id.toString());
      if (!subjectStat) {
        stats.subjectStats.push({
          subject: subject._id,
          topicsCompleted: subjectProgress.completedTopics.length,
          totalTopics: subject.topics.length,
          completionPercentage: (subjectProgress.completedTopics.length / subject.topics.length) * 100
        });
      } else {
        subjectStat.topicsCompleted = subjectProgress.completedTopics.length;
        subjectStat.totalTopics = subject.topics.length;
        subjectStat.completionPercentage = (subjectStat.topicsCompleted / subjectStat.totalTopics) * 100;
      }
      
      stats.learningStats.totalSessions += 1;
      stats.lastUpdated = new Date();
      await stats.save();
    } catch (statsError) {
      console.error('Failed to sync DashboardStats on topic completion:', statsError);
    }

    res.json({
      message: 'Topic marked as completed',
      progress: {
        completedTopics: subjectProgress.completedTopics.length,
        totalTopics: subject.topics.length,
        isCompleted: subjectProgress.isCompleted
      }
    });
  } catch (error) {
    console.error('Complete topic error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('progress.subject');

    const progress = user.progress.map(p => ({
      subject: {
        _id: p.subject._id,
        name: p.subject.name,
        totalTopics: p.subject.topics.length
      },
      completedTopics: p.completedTopics.length,
      isCompleted: p.isCompleted,
      completedAt: p.completedAt
    }));

    res.json(progress);
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to generate detailed content for a topic
const generateTopicContent = async (topicTitle, subjectName, difficulty) => {
  try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const contentPrompt = `Generate detailed study material for this topic:
Topic: ${topicTitle}
Subject: ${subjectName}
Difficulty: ${difficulty}

Provide:
1. Key concepts (2-3 sentences)
2. Important formulas/algorithms (if applicable)
3. Common use cases (2-3 examples)
4. Prerequisites
5. Learning outcomes

Keep it concise but informative (200-300 words). Focus on practical understanding.`;

    const result = await model.generateContent(contentPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn('Failed to generate detailed content:', error.message);
    return '';
  }
};

// Helper function to generate proper video and documentation URLs
const generateResourceUrls = async (topicTitle, subjectName) => {
  try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const urlPrompt = `For the topic "${topicTitle}" in "${subjectName}", suggest the BEST learning resources.
Return ONLY JSON, no markdown:
{
  "videoUrl": "Actual YouTube video URL (MANDATORY)",
  "documentationUrl": "Direct GeeksforGeeks link (PREFERRED) or official documentation URL",
  "documentationSource": "geeksforgeeks or official docs"
}`;

    const result = await model.generateContent(urlPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    try {
      return JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }
  } catch (error) {
    console.warn('Failed to generate resource URLs:', error.message);
    return {};
  }
};

// Create subject with AI-generated topics
const createSubjectWithAI = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectName, description, level, examType, syllabus, priorKnowledge } = req.body;

    if (!subjectName) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    // Check if subject already exists for this user
    const existingSubject = await Subject.findOne({
      name: new RegExp(`^${subjectName}$`, 'i'),
      createdBy: userId
    });

    if (existingSubject) {
      return res.status(400).json({ error: 'You already have a subject with this name' });
    }

    // Build enhanced prompt with additional context
    const contextInfo = [];
    if (examType) contextInfo.push(`Exam: ${examType}`);
    if (syllabus) contextInfo.push(`Syllabus: ${syllabus}`);
    if (priorKnowledge) contextInfo.push(`Prior Knowledge: ${priorKnowledge}`);

    // Generate comprehensive syllabus using Gemini AI
    const prompt = `You are an expert curriculum designer. Create a COMPLETE and COMPREHENSIVE learning curriculum for "${subjectName}".

${contextInfo.length > 0 ? `\nADDITIONAL CONTEXT:\n${contextInfo.join('\n')}\n` : ''}

⚠️ CRITICAL - READ CAREFULLY:
Topic TITLES must be SPECIFIC and CONCRETE - NOT generic categories!

❌ BAD Examples (DO NOT USE THESE):
- "${subjectName} Fundamentals"
- "${subjectName} Core Concepts"
- "${subjectName} Basics"
- "${subjectName} Introduction"
- "${subjectName} Advanced Topics"
- "Introduction to ${subjectName}"

✅ GOOD Examples for DSA (USE THESE AS REFERENCE):
- "Programming Language Basics (C/Python)"
- "Array"
- "String"
- "Linked List"
- "Stack"
- "Queue"
- "Tree"
- "Graph"
- "Sorting Algorithms"
- "Dynamic Programming"

✅ GOOD Examples for Web Development:
- "HTML"
- "CSS"
- "JavaScript Basics"
- "React Fundamentals"
- "State Management"
- "REST APIs"
- "Database Design"
- "Authentication & Security"

INSTRUCTIONS:
- Generate a COMPREHENSIVE list of at least 15-20 SPECIFIC topic names (not generic descriptions)
- Include EVERYTHING necessary for a student to master this subject from zero to expert.
- Each topic should be a single concrete concept, tool, or data structure
- Topics must build progressively from beginner to advanced
- No topic should end with "Basics", "Introduction", "Core Concepts", "Fundamentals", or similar generic terms

REQUIRED JSON FORMAT:
{
  "topics": [
    {
      "title": "SPECIFIC topic name (e.g., 'Array', 'Stack', 'React Hooks') - NOT a generic description",
      "description": "What the user will learn about this specific topic",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedHours": 8,
      "ePointsReward": 15,
      "gateWeightage": "low|medium|high|very_high",
      "content": "Comprehensive and detailed study material with examples and key points",
      "subtopics": ["detailed subtopic 1", "detailed subtopic 2"],
      "videoUrl": "Direct YouTube link for this topic (MANDATORY)",
      "documentationUrl": "Direct GeeksforGeeks/Official documentation URL",
      "documentationSource": "geeksforgeeks|official docs|other",
      "additionalResources": [
        { "title": "Resource Title", "url": "URL", "type": "video|article|pdf|tutorial" }
      ],
      "practiceProblems": [
        { "title": "Problem Title", "url": "LeetCode/GFG URL", "difficulty": "easy|medium|hard" }
      ]
    }
  ]
}

TOPIC STRUCTURE:
- 5 Beginner topics: Foundation, setup, and core basics
- 7 Intermediate topics: Core techniques and intermediate patterns
- 5-8 Advanced topics: Expert-level concepts, security, and performance
- Topics must build progressively

Subject: ${subjectName}
${description ? `Additional context: ${description}` : ''}
Target level: ${level || 'intermediate'}`;

    let topicsData;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      console.log('📚 Gemini topics response received, length:', responseText.length);
      console.log('🎯 First 500 chars:', responseText.substring(0, 500));

      // Parse JSON response
      try {
        topicsData = JSON.parse(responseText);
      } catch (parseError) {
        // Try to extract JSON - look for JSON object in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('📍 Found JSON match, parsing...');
          topicsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      }

      // Validate topics structure
      if (!topicsData.topics || !Array.isArray(topicsData.topics) || topicsData.topics.length === 0) {
        throw new Error('Invalid or empty topics structure from AI');
      }

      console.log(`✅ Successfully parsed ${topicsData.topics.length} topics from AI`);

      // Enhance topics with additional details if needed
      for (let i = 0; i < topicsData.topics.length; i++) {
        const topic = topicsData.topics[i];
        
        // Ensure content is detailed
        if (!topic.content || topic.content.length < 100) {
          console.log(`📝 Generating detailed content for: ${topic.title}`);
          const detailedContent = await generateTopicContent(topic.title, subjectName, topic.difficulty);
          if (detailedContent) {
            topic.content = detailedContent;
          }
        }

        // Ensure URLs are valid (basic validation)
        if (!topic.videoUrl) {
          console.log(`🎬 Generating missing video URL for: ${topic.title}`);
          const urls = await generateResourceUrls(topic.title, subjectName);
          if (urls.videoUrl) topic.videoUrl = urls.videoUrl;
          if (urls.documentationUrl) topic.documentationUrl = urls.documentationUrl;
          if (urls.documentationSource) topic.documentationSource = urls.documentationSource;
        }
      }
    } catch (geminiError) {
      console.error('❌ Gemini API error:', geminiError.message);
      console.error('Full error:', geminiError);
      
      // Improved fallback with more comprehensive topics
      console.warn('⚠️ Using comprehensive fallback topics...');
      topicsData = generateFallbackTopics(subjectName, level);
    }

    // Create topic documents with ePointsReward
    const topics = topicsData.topics.map((topic, index) => {
      // Calculate ePointsReward based on difficulty if not provided
      let ePointsReward = topic.ePointsReward;
      if (!ePointsReward) {
        const difficultyRewards = {
          'beginner': 10,
          'intermediate': 15,
          'advanced': 20
        };
        ePointsReward = difficultyRewards[topic.difficulty] || 10;
      }

      return {
        title: topic.title || `Topic ${index + 1}`,
        description: topic.description || '',
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(topic.difficulty) ? topic.difficulty : 'beginner',
        estimatedHours: topic.estimatedHours || 10,
        ePointsReward: ePointsReward,
        videoUrl: topic.videoUrl || '',
        documentationUrl: topic.documentationUrl || '',
        documentationSource: topic.documentationSource || 'official docs',
        content: topic.content || '',
        subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : [],
        additionalResources: Array.isArray(topic.additionalResources) ? topic.additionalResources : [],
        practiceProblems: Array.isArray(topic.practiceProblems) ? topic.practiceProblems : [],
        gateWeightage: topic.gateWeightage || 'medium'
      };
    });

    // Create and save subject
    const newSubject = new Subject({
      name: subjectName,
      description: description || `Learn ${subjectName} from basics to advanced concepts`,
      topics: topics,
      createdBy: userId,
      totalTopics: topics.length,
      level: level || 'intermediate'
    });

    console.log("💾 Saving subject:", subjectName, "with", topics.length, "topics");
    await newSubject.save();
    console.log("✅ Subject saved with ID:", newSubject._id);

    // Add subject to user's progress
    const user = await User.findById(userId);
    user.progress.push({
      subject: newSubject._id,
      completedTopics: [],
      isCompleted: false
    });
    console.log("👤 Updating user progress...");
    await user.save();
    console.log("✅ User progress updated");

    res.status(201).json({
      message: 'Subject created successfully with AI-generated topics',
      subject: {
        _id: newSubject._id,
        name: newSubject.name,
        description: newSubject.description,
        totalTopics: newSubject.totalTopics,
        level: newSubject.level,
        createdBy: newSubject.createdBy,
        createdAt: newSubject.createdAt,
        topics: topics.map((t, idx) => ({
          _id: newSubject.topics[idx]._id,
          title: t.title,
          description: t.description,
          difficulty: t.difficulty,
          estimatedHours: t.estimatedHours,
          ePointsReward: t.ePointsReward,
          videoUrl: t.videoUrl,
          documentationUrl: t.documentationUrl,
          subtopics: t.subtopics
        })),
        userProgress: {
          completedTopics: 0,
          isCompleted: false,
          completedAt: null
        }
      }
    });
  } catch (error) {
    console.error('Create subject with AI error:', error);
    res.status(500).json({ 
      error: 'Failed to create subject',
      details: error.message 
    });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    console.log(`🗑️ Deleting subject ${id} for user ${userId}`);

    // Find and delete the subject by ID (allow deleting any subject as requested)
    const subject = await Subject.findByIdAndDelete(id);
    
    if (!subject) {
      return res.status(404).json({ 
        error: 'Subject not found.' 
      });
    }

    // Clean up user progress and dashboard stats
    await User.findByIdAndUpdate(userId, {
      $pull: { 
        progress: { subject: id },
        "dashboard.subjectStats": { subject: id }
      }
    });

    res.json({ message: 'Subject deleted successfully', success: true });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ error: 'Failed to delete subject', message: error.message });
  }
};

// Delete a topic from a subject
const deleteTopic = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId, topicId } = req.params;

    console.log(`🗑️ Deleting topic ${topicId} from subject ${subjectId}`);

    // Find the subject by ID (allow modifying any subject as requested)
    const subject = await Subject.findById(subjectId);
    
    if (!subject) {
      return res.status(404).json({ 
        error: 'Subject not found.' 
      });
    }

    // Filter out the topic
    const initialCount = subject.topics.length;
    subject.topics = subject.topics.filter(t => t._id.toString() !== topicId);
    
    if (subject.topics.length === initialCount) {
      return res.status(404).json({ error: 'Topic not found in this subject' });
    }
    
    // Update completion status
    if (subject.topics.length > 0) {
      subject.isCompleted = subject.topics.every(t => t.isCompleted);
    } else {
      subject.isCompleted = false;
    }
    
    await subject.save();

    res.json({ 
      message: 'Topic deleted successfully', 
      success: true, 
      totalTopics: subject.topics.length 
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ error: 'Failed to delete topic', message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectTopics,
  completeTopic,
  getUserProgress,
  createSubjectWithAI,
  deleteSubject,
  deleteTopic
};