const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/database/User');
const Subject = require('./src/database/Subject');
const Roadmap = require('./src/database/Roadmap');
const DashboardStats = require('./src/database/DashboardStats');
const Test = require('./src/database/Test');
const bcrypt = require('bcryptjs');

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Roadmap.deleteMany({});
    await DashboardStats.deleteMany({});
    console.log('Cleared existing data');

    // ============================================================
    // COMPREHENSIVE GATE CS SUBJECTS WITH VERIFIED RESOURCES
    // ============================================================

    const subjects = await Subject.insertMany([
      // ==================== DATA STRUCTURES ====================
      {
        name: 'Data Structures',
        description: 'Comprehensive coverage of fundamental and advanced data structures including arrays, linked lists, trees, graphs, and hash tables. Essential for GATE CS with 10-15% weightage.',
        syllabus: 'gate',
        icon: 'database',
        weightage: 12,
        topics: [
          {
            title: 'Arrays and Strings',
            content: `Arrays are contiguous memory locations storing elements of the same type. Key concepts include:
            
            **Array Operations:**
            - Traversal: O(n) time complexity
            - Insertion: O(n) worst case (shifting elements)
            - Deletion: O(n) worst case
            - Search: O(n) linear, O(log n) binary search for sorted arrays
            
            **String Algorithms:**
            - Pattern matching (KMP, Rabin-Karp)
            - String manipulation and reversal
            - Anagram detection and palindrome checking
            
            **GATE Important Topics:**
            - 2D arrays and matrix operations
            - Sparse matrices representation
            - String matching algorithms complexity analysis`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=n60Dn0UsbEk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/array-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Data Structures (IIT Delhi)',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106102064)',
                type: 'video_course'
              },
              {
                title: 'Visualgo - Array Visualization',
                url: '[visualgo.net](https://visualgo.net/en/array)',
                type: 'interactive'
              },
              {
                title: 'MIT OCW - Introduction to Algorithms',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)',
                type: 'course'
              }
            ],
            practiceProblems: [
              {
                title: 'Two Sum Problem',
                url: '[leetcode.com](https://leetcode.com/problems/two-sum/)',
                difficulty: 'easy'
              },
              {
                title: 'Maximum Subarray (Kadane\'s Algorithm)',
                url: '[leetcode.com](https://leetcode.com/problems/maximum-subarray/)',
                difficulty: 'medium'
              },
              {
                title: 'Rotate Array',
                url: '[leetcode.com](https://leetcode.com/problems/rotate-array/)',
                difficulty: 'medium'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'medium'
          },
          {
            title: 'Linked Lists',
            content: `Linked lists are dynamic data structures where elements are stored in nodes connected via pointers.

            **Types of Linked Lists:**
            - Singly Linked List: Each node points to next
            - Doubly Linked List: Nodes have prev and next pointers
            - Circular Linked List: Last node points to first
            
            **Key Operations & Complexity:**
            - Insertion at beginning: O(1)
            - Insertion at end: O(n) for singly, O(1) with tail pointer
            - Deletion: O(n) search + O(1) removal
            - Search: O(n)
            
            **GATE Frequently Asked:**
            - Cycle detection (Floyd's algorithm)
            - Reversal of linked list
            - Finding middle element
            - Merge two sorted linked lists
            - Memory comparison with arrays`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=dmb1i4oN5oE)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/data-structures/linked-list/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Stanford CS Library - Linked List Basics',
                url: '[cslibrary.stanford.edu](http://cslibrary.stanford.edu/103/LinkedListBasics.pdf)',
                type: 'pdf'
              },
              {
                title: 'Programiz - Linked List Tutorial',
                url: '[programiz.com](https://www.programiz.com/dsa/linked-list)',
                type: 'tutorial'
              }
            ],
            practiceProblems: [
              {
                title: 'Reverse Linked List',
                url: '[leetcode.com](https://leetcode.com/problems/reverse-linked-list/)',
                difficulty: 'easy'
              },
              {
                title: 'Linked List Cycle Detection',
                url: '[leetcode.com](https://leetcode.com/problems/linked-list-cycle/)',
                difficulty: 'easy'
              },
              {
                title: 'Merge Two Sorted Lists',
                url: '[leetcode.com](https://leetcode.com/problems/merge-two-sorted-lists/)',
                difficulty: 'easy'
              },
              {
                title: 'LRU Cache Implementation',
                url: '[leetcode.com](https://leetcode.com/problems/lru-cache/)',
                difficulty: 'hard'
              }
            ],
            order: 2,
            difficulty: 'beginner',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Stacks',
            content: `Stack is a LIFO (Last In First Out) data structure with restricted access pattern.

            **Core Operations (All O(1)):**
            - Push: Add element to top
            - Pop: Remove element from top
            - Peek/Top: View top element without removal
            - isEmpty: Check if stack is empty
            
            **Implementations:**
            - Array-based: Fixed size, cache-friendly
            - Linked list-based: Dynamic size
            
            **Applications (GATE Important):**
            - Expression evaluation (infix, postfix, prefix)
            - Expression conversion algorithms
            - Parentheses matching and validation
            - Function call stack (recursion)
            - Undo operations in editors
            - Browser back button functionality
            
            **GATE Previous Year Topics:**
            - Stack permutations
            - Multiple stacks in single array
            - Min stack design`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=L3ud3rXpIxA)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/stack-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Stacks and Applications',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106106127)',
                type: 'video_course'
              },
              {
                title: 'Visualgo - Stack Visualization',
                url: '[visualgo.net](https://visualgo.net/en/list)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Valid Parentheses',
                url: '[leetcode.com](https://leetcode.com/problems/valid-parentheses/)',
                difficulty: 'easy'
              },
              {
                title: 'Evaluate Reverse Polish Notation',
                url: '[leetcode.com](https://leetcode.com/problems/evaluate-reverse-polish-notation/)',
                difficulty: 'medium'
              },
              {
                title: 'Min Stack',
                url: '[leetcode.com](https://leetcode.com/problems/min-stack/)',
                difficulty: 'medium'
              },
              {
                title: 'Largest Rectangle in Histogram',
                url: '[leetcode.com](https://leetcode.com/problems/largest-rectangle-in-histogram/)',
                difficulty: 'hard'
              }
            ],
            order: 3,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Queues',
            content: `Queue is a FIFO (First In First Out) data structure for ordered processing.

            **Types of Queues:**
            - Simple Queue: Basic FIFO
            - Circular Queue: Efficient space utilization
            - Double-ended Queue (Deque): Insert/delete at both ends
            - Priority Queue: Elements served by priority
            
            **Operations (All O(1) for basic queue):**
            - Enqueue: Add to rear
            - Dequeue: Remove from front
            - Front: View front element
            - Rear: View rear element
            
            **Applications:**
            - CPU scheduling (Round Robin)
            - BFS traversal in graphs
            - Print queue management
            - Handling of interrupts
            - Call center systems
            
            **GATE Important Concepts:**
            - Circular queue implementation
            - Queue using two stacks
            - Stack using two queues
            - Priority queue using heaps`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=zp6pBNbUB2U)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/queue-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Programiz - Queue Tutorial',
                url: '[programiz.com](https://www.programiz.com/dsa/queue)',
                type: 'tutorial'
              }
            ],
            practiceProblems: [
              {
                title: 'Implement Queue using Stacks',
                url: '[leetcode.com](https://leetcode.com/problems/implement-queue-using-stacks/)',
                difficulty: 'easy'
              },
              {
                title: 'Design Circular Queue',
                url: '[leetcode.com](https://leetcode.com/problems/design-circular-queue/)',
                difficulty: 'medium'
              },
              {
                title: 'Sliding Window Maximum',
                url: '[leetcode.com](https://leetcode.com/problems/sliding-window-maximum/)',
                difficulty: 'hard'
              }
            ],
            order: 4,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Binary Trees',
            content: `Binary tree is a hierarchical data structure where each node has at most two children.

            **Types of Binary Trees:**
            - Full Binary Tree: Every node has 0 or 2 children
            - Complete Binary Tree: All levels filled except possibly last
            - Perfect Binary Tree: All internal nodes have 2 children, all leaves at same level
            - Balanced Binary Tree: Height difference ≤ 1 for all nodes
            - Degenerate Tree: Each parent has only one child (like linked list)
            
            **Tree Traversals:**
            - Inorder (Left-Root-Right): Gives sorted output for BST
            - Preorder (Root-Left-Right): Used for tree copying
            - Postorder (Left-Right-Root): Used for tree deletion
            - Level Order (BFS): Using queue
            
            **Important Properties:**
            - Maximum nodes at level l = 2^l
            - Maximum nodes in tree of height h = 2^(h+1) - 1
            - Minimum height = ⌈log₂(n+1)⌉ - 1
            
            **GATE Focus Areas:**
            - Traversal outputs and tree construction
            - Height and depth calculations
            - Counting nodes and leaves
            - Tree isomorphism`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=YAdLFsTG70w)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/binary-tree-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Visualgo - Binary Tree Visualization',
                url: '[visualgo.net](https://visualgo.net/en/bst)',
                type: 'interactive'
              },
              {
                title: 'MIT OCW - Trees Lecture',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-6-binary-trees-part-1/)',
                type: 'video'
              }
            ],
            practiceProblems: [
              {
                title: 'Binary Tree Inorder Traversal',
                url: '[leetcode.com](https://leetcode.com/problems/binary-tree-inorder-traversal/)',
                difficulty: 'easy'
              },
              {
                title: 'Maximum Depth of Binary Tree',
                url: '[leetcode.com](https://leetcode.com/problems/maximum-depth-of-binary-tree/)',
                difficulty: 'easy'
              },
              {
                title: 'Construct Binary Tree from Preorder and Inorder',
                url: '[leetcode.com](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)',
                difficulty: 'medium'
              },
              {
                title: 'Serialize and Deserialize Binary Tree',
                url: '[leetcode.com](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)',
                difficulty: 'hard'
              }
            ],
            order: 5,
            difficulty: 'intermediate',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Binary Search Trees (BST)',
            content: `BST is a binary tree with ordering property: left subtree < root < right subtree.

            **BST Operations:**
            - Search: O(h) where h is height
            - Insert: O(h)
            - Delete: O(h) - Three cases: leaf, one child, two children
            - Inorder Successor/Predecessor: O(h)
            
            **Balanced BSTs:**
            - AVL Trees: Strict balance (height diff ≤ 1)
            - Red-Black Trees: Relaxed balance with color properties
            
            **AVL Tree Rotations:**
            - Left Rotation (LL)
            - Right Rotation (RR)
            - Left-Right Rotation (LR)
            - Right-Left Rotation (RL)
            
            **GATE Important:**
            - Time complexity analysis
            - Construction from sorted array: O(n)
            - Checking if tree is BST
            - Floor and ceiling operations`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=cySVml6e_Fc)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/binary-search-tree-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - BST and Balanced Trees',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106102064)',
                type: 'video_course'
              },
              {
                title: 'AVL Tree Visualizer',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Validate Binary Search Tree',
                url: '[leetcode.com](https://leetcode.com/problems/validate-binary-search-tree/)',
                difficulty: 'medium'
              },
              {
                title: 'Kth Smallest Element in BST',
                url: '[leetcode.com](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)',
                difficulty: 'medium'
              },
              {
                title: 'Convert Sorted Array to BST',
                url: '[leetcode.com](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/)',
                difficulty: 'easy'
              }
            ],
            order: 6,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Heaps and Priority Queues',
            content: `Heap is a complete binary tree satisfying heap property (max-heap or min-heap).

            **Heap Properties:**
            - Max-Heap: Parent ≥ Children
            - Min-Heap: Parent ≤ Children
            - Complete Binary Tree structure
            
            **Array Representation:**
            - Parent of i: (i-1)/2
            - Left child of i: 2i + 1
            - Right child of i: 2i + 2
            
            **Operations:**
            - Insert: O(log n) - Add at end, heapify up
            - Extract Min/Max: O(log n) - Remove root, heapify down
            - Build Heap: O(n) - Heapify from bottom-up
            - Heapify: O(log n)
            
            **Applications:**
            - Heap Sort: O(n log n)
            - Priority Queue implementation
            - K largest/smallest elements
            - Median finding in stream
            - Dijkstra's and Prim's algorithms
            
            **GATE Focus:**
            - Heap construction steps
            - Time complexity proofs
            - Heap sort analysis`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=HqPJF2L5h9U)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/heap-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Heap Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Heap.html)',
                type: 'interactive'
              },
              {
                title: 'MIT OCW - Heaps and Heap Sort',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-8-binary-heaps/)',
                type: 'video'
              }
            ],
            practiceProblems: [
              {
                title: 'Kth Largest Element in Array',
                url: '[leetcode.com](https://leetcode.com/problems/kth-largest-element-in-an-array/)',
                difficulty: 'medium'
              },
              {
                title: 'Top K Frequent Elements',
                url: '[leetcode.com](https://leetcode.com/problems/top-k-frequent-elements/)',
                difficulty: 'medium'
              },
              {
                title: 'Merge K Sorted Lists',
                url: '[leetcode.com](https://leetcode.com/problems/merge-k-sorted-lists/)',
                difficulty: 'hard'
              },
              {
                title: 'Find Median from Data Stream',
                url: '[leetcode.com](https://leetcode.com/problems/find-median-from-data-stream/)',
                difficulty: 'hard'
              }
            ],
            order: 7,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Hashing and Hash Tables',
            content: `Hashing provides O(1) average time for search, insert, and delete operations.

            **Hash Function Properties:**
            - Deterministic: Same input gives same output
            - Uniform Distribution: Minimizes collisions
            - Efficient Computation: O(1)
            
            **Common Hash Functions:**
            - Division Method: h(k) = k mod m
            - Multiplication Method: h(k) = ⌊m(kA mod 1)⌋
            - Universal Hashing
            
            **Collision Resolution:**
            - Chaining: Linked list at each slot
            - Open Addressing:
              - Linear Probing: h(k,i) = (h'(k) + i) mod m
              - Quadratic Probing: h(k,i) = (h'(k) + c₁i + c₂i²) mod m
              - Double Hashing: h(k,i) = (h₁(k) + i·h₂(k)) mod m
            
            **Load Factor:** α = n/m
            - Chaining: Average search = O(1 + α)
            - Open Addressing: Depends on probing sequence
            
            **GATE Topics:**
            - Collision probability calculations
            - Comparing collision resolution methods
            - Time complexity analysis`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=shs0KM3wKv8)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/hashing-data-structure/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Hashing',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-4-hashing/)',
                type: 'video'
              },
              {
                title: 'Hash Table Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/OpenHash.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Two Sum (Hash Map approach)',
                url: '[leetcode.com](https://leetcode.com/problems/two-sum/)',
                difficulty: 'easy'
              },
              {
                title: 'Group Anagrams',
                url: '[leetcode.com](https://leetcode.com/problems/group-anagrams/)',
                difficulty: 'medium'
              },
              {
                title: 'Longest Consecutive Sequence',
                url: '[leetcode.com](https://leetcode.com/problems/longest-consecutive-sequence/)',
                difficulty: 'medium'
              },
              {
                title: 'Design HashMap',
                url: '[leetcode.com](https://leetcode.com/problems/design-hashmap/)',
                difficulty: 'easy'
              }
            ],
            order: 8,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Graphs - Representation and Traversal',
            content: `Graph G = (V, E) consists of vertices and edges connecting them.

            **Graph Types:**
            - Directed vs Undirected
            - Weighted vs Unweighted
            - Cyclic vs Acyclic
            - Connected vs Disconnected
            - Sparse vs Dense
            
            **Representations:**
            - Adjacency Matrix: O(V²) space, O(1) edge lookup
            - Adjacency List: O(V+E) space, O(degree) edge lookup
            
            **When to use what:**
            - Matrix: Dense graphs, frequent edge queries
            - List: Sparse graphs, iteration over neighbors
            
            **Graph Traversals:**
            - BFS (Breadth-First Search):
              - Uses Queue
              - Time: O(V+E)
              - Applications: Shortest path (unweighted), level order
            
            - DFS (Depth-First Search):
              - Uses Stack/Recursion
              - Time: O(V+E)
              - Applications: Cycle detection, topological sort, SCC
            
            **GATE Important:**
            - Traversal sequences
            - Tree edges, back edges, forward edges, cross edges
            - Applications of BFS/DFS`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=tWVWeAqZ0WU)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Visualgo - Graph Traversal',
                url: '[visualgo.net](https://visualgo.net/en/dfsbfs)',
                type: 'interactive'
              },
              {
                title: 'NPTEL - Graph Algorithms',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106106131)',
                type: 'video_course'
              },
              {
                title: 'MIT OCW - Graph Theory',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-9-breadth-first-search/)',
                type: 'video'
              }
            ],
            practiceProblems: [
              {
                title: 'Number of Islands',
                url: '[leetcode.com](https://leetcode.com/problems/number-of-islands/)',
                difficulty: 'medium'
              },
              {
                title: 'Clone Graph',
                url: '[leetcode.com](https://leetcode.com/problems/clone-graph/)',
                difficulty: 'medium'
              },
              {
                title: 'Course Schedule (Cycle Detection)',
                url: '[leetcode.com](https://leetcode.com/problems/course-schedule/)',
                difficulty: 'medium'
              },
              {
                title: 'Word Ladder',
                url: '[leetcode.com](https://leetcode.com/problems/word-ladder/)',
                difficulty: 'hard'
              }
            ],
            order: 9,
            difficulty: 'intermediate',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Graph Algorithms - Shortest Paths',
            content: `Shortest path algorithms find minimum cost path between vertices.

            **Single Source Shortest Path:**
            
            1. **Dijkstra's Algorithm:**
               - Works for non-negative weights
               - Time: O((V+E)log V) with binary heap
               - Greedy approach using priority queue
            
            2. **Bellman-Ford Algorithm:**
               - Works with negative weights
               - Detects negative cycles
               - Time: O(VE)
               - DP approach: Relax all edges V-1 times
            
            **All Pairs Shortest Path:**
            
            3. **Floyd-Warshall Algorithm:**
               - Works with negative weights (no negative cycles)
               - Time: O(V³), Space: O(V²)
               - DP approach using intermediate vertices
            
            **GATE Focus:**
            - Algorithm comparison and when to use which
            - Time complexity derivations
            - Trace through examples
            - Negative cycle detection`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=pSqmAO-m7Lk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/shortest-path-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Dijkstra Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Dijkstra.html)',
                type: 'interactive'
              },
              {
                title: 'Floyd-Warshall Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Floyd.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Network Delay Time (Dijkstra)',
                url: '[leetcode.com](https://leetcode.com/problems/network-delay-time/)',
                difficulty: 'medium'
              },
              {
                title: 'Cheapest Flights Within K Stops',
                url: '[leetcode.com](https://leetcode.com/problems/cheapest-flights-within-k-stops/)',
                difficulty: 'medium'
              },
              {
                title: 'Path with Maximum Probability',
                url: '[leetcode.com](https://leetcode.com/problems/path-with-maximum-probability/)',
                difficulty: 'medium'
              }
            ],
            order: 10,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Minimum Spanning Trees',
            content: `MST connects all vertices with minimum total edge weight.

            **Properties:**
            - Exactly V-1 edges for V vertices
            - No cycles
            - May not be unique
            
            **Algorithms:**
            
            1. **Kruskal's Algorithm:**
               - Sort edges by weight
               - Add edges without creating cycle (use Union-Find)
               - Time: O(E log E) or O(E log V)
               - Better for sparse graphs
            
            2. **Prim's Algorithm:**
               - Grow tree from arbitrary vertex
               - Always add minimum weight edge to tree
               - Time: O((V+E)log V) with binary heap
               - Better for dense graphs
            
            **Union-Find (Disjoint Set Union):**
            - Find: Identify component of element
            - Union: Merge two components
            - With path compression and union by rank: O(α(n)) ≈ O(1)
            
            **GATE Topics:**
            - MST uniqueness conditions
            - Cut property and cycle property
            - Algorithm trace and complexity`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=4ZlRH0eK-qQ)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Kruskal Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Kruskal.html)',
                type: 'interactive'
              },
              {
                title: 'Prim Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Prim.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Min Cost to Connect All Points',
                url: '[leetcode.com](https://leetcode.com/problems/min-cost-to-connect-all-points/)',
                difficulty: 'medium'
              },
              {
                title: 'Connecting Cities With Minimum Cost',
                url: '[leetcode.com](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)',
                difficulty: 'medium'
              }
            ],
            order: 11,
            difficulty: 'advanced',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Tries and Advanced Data Structures',
            content: `Trie (Prefix Tree) is a tree-based structure for efficient string operations.

            **Trie Properties:**
            - Each node represents a character
            - Root is empty
            - Path from root to node forms a prefix
            
            **Operations:**
            - Insert: O(m) where m is string length
            - Search: O(m)
            - Prefix Search: O(m)
            - Delete: O(m)
            
            **Space:** O(ALPHABET_SIZE * m * n) for n strings
            
            **Applications:**
            - Autocomplete
            - Spell checker
            - IP routing (Longest prefix matching)
            - Word games
            
            **Other Advanced Structures:**
            - Segment Trees: Range queries O(log n)
            - Fenwick Trees (BIT): Prefix sums O(log n)
            - Suffix Arrays: String matching
            
            **GATE Relevance:**
            - Trie operations and complexity
            - Comparison with hash tables for strings`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=oobqoCJlHA0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/trie-insert-and-search/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Trie Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Trie.html)',
                type: 'interactive'
              },
              {
                title: 'Segment Tree Tutorial',
                url: '[cp-algorithms.com](https://cp-algorithms.com/data_structures/segment_tree.html)',
                type: 'tutorial'
              }
            ],
            practiceProblems: [
              {
                title: 'Implement Trie',
                url: '[leetcode.com](https://leetcode.com/problems/implement-trie-prefix-tree/)',
                difficulty: 'medium'
              },
              {
                title: 'Word Search II',
                url: '[leetcode.com](https://leetcode.com/problems/word-search-ii/)',
                difficulty: 'hard'
              },
              {
                title: 'Design Add and Search Words',
                url: '[leetcode.com](https://leetcode.com/problems/design-add-and-search-words-data-structure/)',
                difficulty: 'medium'
              }
            ],
            order: 12,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'medium'
          }
        ]
      },

      // ==================== ALGORITHMS ====================
      {
        name: 'Algorithms',
        description: 'Algorithm design paradigms, analysis techniques, and complexity theory. Covers sorting, searching, divide & conquer, greedy, dynamic programming, and NP-completeness. GATE weightage: 10-15%.',
        syllabus: 'gate',
        icon: 'code',
        weightage: 12,
        topics: [
          {
            title: 'Asymptotic Analysis',
            content: `Asymptotic analysis describes algorithm efficiency as input grows.

            **Notations:**
            - Big-O (O): Upper bound - Worst case
            - Big-Omega (Ω): Lower bound - Best case
            - Big-Theta (Θ): Tight bound - Average case
            - Little-o (o): Strict upper bound
            - Little-omega (ω): Strict lower bound
            
            **Properties:**
            - O(f(n)) + O(g(n)) = O(max(f(n), g(n)))
            - O(f(n)) × O(g(n)) = O(f(n) × g(n))
            - O(c × f(n)) = O(f(n)) for constant c
            
            **Common Complexities (increasing order):**
            O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
            
            **Recurrence Relations:**
            - Master Theorem: T(n) = aT(n/b) + f(n)
            - Substitution Method
            - Recursion Tree Method
            
            **GATE Focus:**
            - Comparing growth rates
            - Solving recurrences
            - Master theorem applications`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=0oDAlMwTrLo)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Asymptotic Notation',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/)',
                type: 'video'
              },
              {
                title: 'Big-O Cheat Sheet',
                url: '[bigocheatsheet.com](https://www.bigocheatsheet.com/)',
                type: 'reference'
              },
              {
                title: 'NPTEL - Analysis of Algorithms',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106101060)',
                type: 'video_course'
              }
            ],
            practiceProblems: [
              {
                title: 'Complexity Analysis Practice',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/)',
                difficulty: 'medium'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 10,
            gateWeightage: 'very_high'
          },
          {
            title: 'Sorting Algorithms',
            content: `Sorting arranges elements in a specific order.

            **Comparison-Based Sorts:**
            
            1. **Bubble Sort:** O(n²) - Compare adjacent, swap if needed
            2. **Selection Sort:** O(n²) - Find min, place at beginning
            3. **Insertion Sort:** O(n²) - Insert each element in sorted portion
               - Best for nearly sorted data: O(n)
            4. **Merge Sort:** O(n log n) - Divide, sort, merge
               - Stable, not in-place, O(n) space
            5. **Quick Sort:** O(n log n) average, O(n²) worst
               - In-place, not stable
               - Randomized pivot for O(n log n) expected
            6. **Heap Sort:** O(n log n) - Build heap, extract max
               - In-place, not stable
            
            **Non-Comparison Sorts:**
            - Counting Sort: O(n + k) - Count occurrences
            - Radix Sort: O(d(n + k)) - Sort by digits
            - Bucket Sort: O(n + k) average - Distribute to buckets
            
            **Lower Bound:** Ω(n log n) for comparison-based sorting
            
            **GATE Topics:**
            - Stability and in-place properties
            - Best/worst/average case analysis
            - When to use which sort`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=kPRA0W1kECg)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/sorting-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Sorting Visualization',
                url: '[toptal.com](https://www.toptal.com/developers/sorting-algorithms)',
                type: 'interactive'
              },
              {
                title: 'Visualgo - Sorting',
                url: '[visualgo.net](https://visualgo.net/en/sorting)',
                type: 'interactive'
              },
              {
                title: 'MIT OCW - Sorting',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-5-linear-sorting/)',
                type: 'video'
              }
            ],
            practiceProblems: [
              {
                title: 'Sort an Array',
                url: '[leetcode.com](https://leetcode.com/problems/sort-an-array/)',
                difficulty: 'medium'
              },
              {
                title: 'Sort Colors (Dutch National Flag)',
                url: '[leetcode.com](https://leetcode.com/problems/sort-colors/)',
                difficulty: 'medium'
              },
              {
                title: 'Merge Intervals',
                url: '[leetcode.com](https://leetcode.com/problems/merge-intervals/)',
                difficulty: 'medium'
              },
              {
                title: 'Largest Number',
                url: '[leetcode.com](https://leetcode.com/problems/largest-number/)',
                difficulty: 'medium'
              }
            ],
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Searching Algorithms',
            content: `Searching finds target elements in data structures.

            **Linear Search:**
            - Time: O(n)
            - Works on unsorted data
            - Sequential checking
            
            **Binary Search:**
            - Time: O(log n)
            - Requires sorted data
            - Divide search space in half
            
            **Binary Search Variants:**
            - First/Last occurrence
            - Lower/Upper bound
            - Search in rotated array
            - Peak element finding
            - Square root calculation
            
            **Ternary Search:**
            - For unimodal functions
            - Time: O(log n)
            
            **Interpolation Search:**
            - For uniformly distributed data
            - Time: O(log log n) average, O(n) worst
            
            **Exponential Search:**
            - For unbounded arrays
            - Time: O(log n)
            
            **GATE Focus:**
            - Binary search applications
            - Number of comparisons
            - Searching in special arrays`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=P3YID7liBug)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/searching-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Binary Search Tutorial',
                url: '[cp-algorithms.com](https://cp-algorithms.com/num_methods/binary_search.html)',
                type: 'tutorial'
              },
              {
                title: 'Topcoder - Binary Search',
                url: '[topcoder.com](https://www.topcoder.com/thrive/articles/Binary%20Search)',
                type: 'article'
              }
            ],
            practiceProblems: [
              {
                title: 'Binary Search',
                url: '[leetcode.com](https://leetcode.com/problems/binary-search/)',
                difficulty: 'easy'
              },
              {
                title: 'Search in Rotated Sorted Array',
                url: '[leetcode.com](https://leetcode.com/problems/search-in-rotated-sorted-array/)',
                difficulty: 'medium'
              },
              {
                title: 'Find First and Last Position',
                url: '[leetcode.com](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)',
                difficulty: 'medium'
              },
              {
                title: 'Median of Two Sorted Arrays',
                url: '[leetcode.com](https://leetcode.com/problems/median-of-two-sorted-arrays/)',
                difficulty: 'hard'
              }
            ],
            order: 3,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Divide and Conquer',
            content: `Divide and conquer breaks problems into smaller subproblems.

            **Three Steps:**
            1. **Divide:** Break into smaller subproblems
            2. **Conquer:** Solve subproblems recursively
            3. **Combine:** Merge solutions
            
            **Classic Examples:**
            
            1. **Merge Sort:** T(n) = 2T(n/2) + O(n) = O(n log n)
            
            2. **Quick Sort:** T(n) = T(k) + T(n-k-1) + O(n)
               - Average: O(n log n), Worst: O(n²)
            
            3. **Binary Search:** T(n) = T(n/2) + O(1) = O(log n)
            
            4. **Strassen's Matrix Multiplication:**
               - Standard: O(n³)
               - Strassen: O(n^2.81)
            
            5. **Karatsuba Multiplication:**
               - Standard: O(n²)
               - Karatsuba: O(n^1.585)
            
            6. **Closest Pair of Points:** O(n log n)
            
            7. **Maximum Subarray (Divide & Conquer):** O(n log n)
            
            **Master Theorem:**
            T(n) = aT(n/b) + f(n)
            - Case 1: f(n) = O(n^(logb(a)-ε)) → T(n) = Θ(n^logb(a))
            - Case 2: f(n) = Θ(n^logb(a)) → T(n) = Θ(n^logb(a) × log n)
            - Case 3: f(n) = Ω(n^(logb(a)+ε)) → T(n) = Θ(f(n))`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=2Rr2tW9zvRg)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/divide-and-conquer-algorithm/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Divide and Conquer',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-3-sets-and-sorting/)',
                type: 'video'
              },
              {
                title: 'CLRS Book Chapter',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/divide-and-conquer/)',
                type: 'reference'
              }
            ],
            practiceProblems: [
              {
                title: 'Maximum Subarray',
                url: '[leetcode.com](https://leetcode.com/problems/maximum-subarray/)',
                difficulty: 'medium'
              },
              {
                title: 'Pow(x, n)',
                url: '[leetcode.com](https://leetcode.com/problems/powx-n/)',
                difficulty: 'medium'
              },
              {
                title: 'Count of Smaller Numbers After Self',
                url: '[leetcode.com](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)',
                difficulty: 'hard'
              }
            ],
            order: 4,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Greedy Algorithms',
            content: `Greedy algorithms make locally optimal choices at each step.

            **Greedy Choice Property:**
            - Locally optimal choice leads to globally optimal solution
            - No backtracking needed
            
            **When Greedy Works:**
            - Optimal substructure
            - Greedy choice property
            
            **Classic Greedy Problems:**
            
            1. **Activity Selection:** O(n log n)
               - Sort by end time, select non-overlapping
            
            2. **Fractional Knapsack:** O(n log n)
               - Sort by value/weight ratio
               - Take items greedily
            
            3. **Huffman Coding:** O(n log n)
               - Build optimal prefix-free codes
               - Use priority queue
            
            4. **Job Sequencing with Deadlines:** O(n²) or O(n log n)
            
            5. **Minimum Spanning Tree:**
               - Kruskal's: Sort edges, use Union-Find
               - Prim's: Grow tree from vertex
            
            6. **Dijkstra's Shortest Path:** O((V+E)log V)
            
            **GATE Important:**
            - Proving greedy correctness
            - Identifying when greedy fails
            - Greedy vs DP comparison`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=HzeK7g8cD0Y)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/greedy-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Greedy Algorithms',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-16-greedy-algorithms/)',
                type: 'video'
              },
              {
                title: 'Huffman Coding Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Huffman.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Jump Game',
                url: '[leetcode.com](https://leetcode.com/problems/jump-game/)',
                difficulty: 'medium'
              },
              {
                title: 'Gas Station',
                url: '[leetcode.com](https://leetcode.com/problems/gas-station/)',
                difficulty: 'medium'
              },
              {
                title: 'Task Scheduler',
                url: '[leetcode.com](https://leetcode.com/problems/task-scheduler/)',
                difficulty: 'medium'
              },
              {
                title: 'Minimum Number of Arrows',
                url: '[leetcode.com](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)',
                difficulty: 'medium'
              }
            ],
            order: 5,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Dynamic Programming',
            content: `DP solves problems by breaking them into overlapping subproblems.

            **Key Concepts:**
            - Optimal Substructure: Optimal solution contains optimal solutions to subproblems
            - Overlapping Subproblems: Same subproblems solved multiple times
            
            **Approaches:**
            1. **Top-Down (Memoization):**
               - Recursive with caching
               - Compute only needed subproblems
            
            2. **Bottom-Up (Tabulation):**
               - Iterative approach
               - Fill table from base cases
            
            **Classic DP Problems:**
            
            1. **Fibonacci:** O(n) with DP vs O(2^n) naive
            
            2. **Longest Common Subsequence (LCS):** O(mn)
               dp[i][j] = dp[i-1][j-1] + 1 if match
               dp[i][j] = max(dp[i-1][j], dp[i][j-1]) otherwise
            
            3. **0/1 Knapsack:** O(nW)
               dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]])
            
            4. **Longest Increasing Subsequence:** O(n²) or O(n log n)
            
            5. **Matrix Chain Multiplication:** O(n³)
            
            6. **Edit Distance:** O(mn)
            
            7. **Coin Change:** O(n×amount)
            
            8. **Rod Cutting:** O(n²)
            
            **GATE Focus:**
            - Recurrence relations
            - Time and space complexity
            - Table filling order`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=oBt53YbR9Kk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/dynamic-programming/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Dynamic Programming',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-15-dynamic-programming-part-1-srtbot-fib-dags-bowling/)',
                type: 'video'
              },
              {
                title: 'DP Patterns - LeetCode',
                url: '[leetcode.com](https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns)',
                type: 'article'
              },
              {
                title: 'AtCoder DP Contest',
                url: '[atcoder.jp](https://atcoder.jp/contests/dp)',
                type: 'practice'
              }
            ],
            practiceProblems: [
              {
                title: 'Climbing Stairs',
                url: '[leetcode.com](https://leetcode.com/problems/climbing-stairs/)',
                difficulty: 'easy'
              },
              {
                title: 'Coin Change',
                url: '[leetcode.com](https://leetcode.com/problems/coin-change/)',
                difficulty: 'medium'
              },
              {
                title: 'Longest Common Subsequence',
                url: '[leetcode.com](https://leetcode.com/problems/longest-common-subsequence/)',
                difficulty: 'medium'
              },
              {
                title: 'Edit Distance',
                url: '[leetcode.com](https://leetcode.com/problems/edit-distance/)',
                difficulty: 'hard'
              },
              {
                title: 'Partition Equal Subset Sum',
                url: '[leetcode.com](https://leetcode.com/problems/partition-equal-subset-sum/)',
                difficulty: 'medium'
              },
              {
                title: 'Longest Increasing Subsequence',
                url: '[leetcode.com](https://leetcode.com/problems/longest-increasing-subsequence/)',
                difficulty: 'medium'
              }
            ],
            order: 6,
            difficulty: 'advanced',
            estimatedHours: 20,
            gateWeightage: 'very_high'
          },
          {
            title: 'Backtracking',
            content: `Backtracking explores all potential solutions by building incrementally.

            **Core Concept:**
            - Build solution incrementally
            - Abandon partial solutions that cannot lead to valid solution
            - Backtrack and try alternative paths
            
            **Template:**
            \`\`\`
            backtrack(candidate):
                if isValidSolution(candidate):
                    addToResults(candidate)
                    return
                
                for next_candidate in generateCandidates(candidate):
                    if isPromising(next_candidate):
                        makeChoice(next_candidate)
                        backtrack(next_candidate)
                        undoChoice(next_candidate)  // backtrack
            \`\`\`
            
            **Classic Problems:**
            
            1. **N-Queens:** Place N queens on N×N board
               - Time: O(N!)
            
            2. **Sudoku Solver:** Fill 9×9 grid
            
            3. **Subset Sum:** Find subsets with given sum
            
            4. **Permutations and Combinations**
            
            5. **Graph Coloring:** Color graph with k colors
            
            6. **Hamiltonian Cycle:** Visit all vertices exactly once
            
            7. **Rat in a Maze:** Find path from source to destination
            
            **Pruning Techniques:**
            - Constraint propagation
            - Bound estimation
            - Symmetry breaking`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=DKCbsiDBN6c)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/backtracking-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'N-Queens Visualizer',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/RecQueens.html)',
                type: 'interactive'
              }
            ],
            practiceProblems: [
              {
                title: 'Subsets',
                url: '[leetcode.com](https://leetcode.com/problems/subsets/)',
                difficulty: 'medium'
              },
              {
                title: 'Permutations',
                url: '[leetcode.com](https://leetcode.com/problems/permutations/)',
                difficulty: 'medium'
              },
              {
                title: 'N-Queens',
                url: '[leetcode.com](https://leetcode.com/problems/n-queens/)',
                difficulty: 'hard'
              },
              {
                title: 'Sudoku Solver',
                url: '[leetcode.com](https://leetcode.com/problems/sudoku-solver/)',
                difficulty: 'hard'
              },
              {
                title: 'Word Search',
                url: '[leetcode.com](https://leetcode.com/problems/word-search/)',
                difficulty: 'medium'
              }
            ],
            order: 7,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'medium'
          },
          {
            title: 'NP-Completeness and Computational Complexity',
            content: `Complexity theory classifies problems by computational difficulty.

            **Complexity Classes:**
            
            1. **P (Polynomial Time):**
               - Solvable in polynomial time
               - Examples: Sorting, shortest path, MST
            
            2. **NP (Nondeterministic Polynomial):**
               - Verifiable in polynomial time
               - Solution can be checked quickly
            
            3. **NP-Complete:**
               - In NP
               - Every NP problem reduces to it in polynomial time
               - If any NP-Complete problem has polynomial solution, P = NP
            
            4. **NP-Hard:**
               - At least as hard as NP-Complete
               - May not be in NP
            
            **Key NP-Complete Problems:**
            - SAT (Boolean Satisfiability)
            - 3-SAT
            - Vertex Cover
            - Independent Set
            - Clique
            - Hamiltonian Cycle/Path
            - Traveling Salesman (decision version)
            - Subset Sum
            - Graph Coloring
            - Knapsack (decision version)
            
            **Reduction:**
            - To prove problem B is NP-Complete:
              1. Show B ∈ NP
              2. Reduce known NP-Complete problem to B
            
            **P vs NP:**
            - Major unsolved problem in CS
            - \$1 million prize problem
            
            **GATE Focus:**
            - Identifying complexity class
            - Polynomial reductions
            - Cook's theorem (SAT is NP-Complete)`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=YX40hbAHx3s)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/np-completeness-set-1/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Complexity Theory',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-23-computational-complexity/)',
                type: 'video'
              },
              {
                title: 'P vs NP Explained',
                url: '[youtube.com](https://www.youtube.com/watch?v=u2DLlNQiPB4)',
                type: 'video'
              }
            ],
            practiceProblems: [
              {
                title: 'GATE Previous Year Questions on NP',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/gate-gate-cs-2015-set-1-question-42/)',
                difficulty: 'hard'
              }
            ],
            order: 8,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== OPERATING SYSTEMS ====================
      {
        name: 'Operating Systems',
        description: 'OS fundamentals including process management, memory management, file systems, and synchronization. Essential GATE topic with 10-12% weightage.',
        syllabus: 'gate',
        icon: 'cpu',
        weightage: 11,
        topics: [
          {
            title: 'Introduction to Operating Systems',
            content: `An Operating System is software that manages computer hardware and provides services for programs.

            **OS Functions:**
            - Process Management
            - Memory Management
            - File System Management
            - I/O Management
            - Security and Protection
            
            **Types of OS:**
            - Batch Operating Systems
            - Time-Sharing Systems
            - Distributed Systems
            - Real-Time Operating Systems (RTOS)
            - Embedded Systems
            
            **OS Structure:**
            - Monolithic Kernel: All services in kernel space (Linux)
            - Microkernel: Minimal kernel, services in user space (Minix)
            - Hybrid Kernel: Combination (Windows NT)
            - Layered Architecture
            
            **System Calls:**
            - Interface between user programs and OS
            - Types: Process control, File management, Device management, Information maintenance, Communication
            
            **Interrupts:**
            - Hardware interrupts
            - Software interrupts (traps)
            - Interrupt handling mechanism`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=vBURTt97EkA)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/operating-systems/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Operating Systems (IIT Kharagpur)',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106105214)',
                type: 'video_course'
              },
              {
                title: 'MIT OCW - Operating System Engineering',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/6-828-operating-system-engineering-fall-2012/)',
                type: 'course'
              },
              {
                title: 'Operating Systems: Three Easy Pieces (FREE Book)',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/)',
                type: 'book'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 6,
            gateWeightage: 'medium'
          },
          {
            title: 'Process Management',
            content: `A process is a program in execution with its own address space.

            **Process States:**
            - New: Being created
            - Ready: Waiting to be assigned to CPU
            - Running: Executing on CPU
            - Waiting/Blocked: Waiting for I/O or event
            - Terminated: Finished execution
            
            **Process Control Block (PCB):**
            - Process ID (PID)
            - Process state
            - Program counter
            - CPU registers
            - Memory management info
            - I/O status info
            - Accounting info
            
            **Context Switch:**
            - Saving state of current process
            - Loading state of new process
            - Overhead: ~1-1000 microseconds
            
            **Process Creation:**
            - fork(): Creates child process (Unix)
            - exec(): Replaces process memory
            - CreateProcess(): Windows
            
            **Process vs Thread:**
            - Process: Independent memory space
            - Thread: Shared memory, lighter weight
            
            **Inter-Process Communication (IPC):**
            - Pipes (named and unnamed)
            - Message queues
            - Shared memory
            - Sockets
            - Signals`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=udlPWkiOSWA)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/process-management-in-os/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Processes Chapter',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf)',
                type: 'pdf'
              }
            ],
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'CPU Scheduling',
            content: `CPU scheduling determines which process runs when CPU is available.

            **Scheduling Criteria:**
            - CPU Utilization: Keep CPU busy
            - Throughput: Processes completed per unit time
            - Turnaround Time: Total time from submission to completion
            - Waiting Time: Time spent in ready queue
            - Response Time: Time from submission to first response
            
            **Scheduling Algorithms:**
            
            1. **First Come First Serve (FCFS):**
               - Non-preemptive
               - Convoy effect (short processes wait for long ones)
            
            2. **Shortest Job First (SJF):**
               - Non-preemptive: Run shortest job to completion
               - Optimal for average waiting time
               - Problem: Starvation of long processes
            
            3. **Shortest Remaining Time First (SRTF):**
               - Preemptive version of SJF
               - Optimal for average waiting time
            
            4. **Priority Scheduling:**
               - Can be preemptive or non-preemptive
               - Problem: Starvation (solved by aging)
            
            5. **Round Robin (RR):**
               - Time quantum based
               - Fair for time-sharing systems
               - Performance depends on quantum size
            
            6. **Multilevel Queue:**
               - Multiple queues with different priorities
               - Each queue may have different algorithm
            
            7. **Multilevel Feedback Queue:**
               - Processes can move between queues
               - Most flexible algorithm
            
            **GATE Calculations:**
            - Turnaround Time = Completion Time - Arrival Time
            - Waiting Time = Turnaround Time - Burst Time
            - Response Time = First Response - Arrival Time`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=EWkQl0n0w5M)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'CPU Scheduling Simulator',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/OSCPUScheduling.html)',
                type: 'interactive'
              },
              {
                title: 'OSTEP - Scheduling Chapters',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf)',
                type: 'pdf'
              }
            ],
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Process Synchronization',
            content: `Synchronization ensures orderly execution of cooperating processes.

            **Critical Section Problem:**
            - Mutual Exclusion: Only one process in critical section
            - Progress: Selection must be made if no process in CS
            - Bounded Waiting: Limit on waiting time
            
            **Race Condition:**
            - Outcome depends on execution order
            - Must be avoided through synchronization
            
            **Synchronization Solutions:**
            
            1. **Peterson's Solution:**
               - Software solution for 2 processes
               - Uses turn and flag variables
            
            2. **Hardware Solutions:**
               - Test-and-Set instruction
               - Compare-and-Swap instruction
            
            3. **Semaphores:**
               - Integer variable with atomic operations
               - wait(S): Decrement, block if negative
               - signal(S): Increment, wake up blocked process
               - Binary Semaphore: Values 0 or 1 (mutex)
               - Counting Semaphore: Any non-negative value
            
            4. **Monitors:**
               - High-level synchronization construct
               - Mutual exclusion built-in
               - Condition variables for waiting
            
            **Classic Synchronization Problems:**
            - Producer-Consumer (Bounded Buffer)
            - Readers-Writers
            - Dining Philosophers
            
            **GATE Focus:**
            - Semaphore solutions
            - Deadlock vs starvation
            - Proving mutual exclusion`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=_qnAqHXkHGw)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/process-synchronization-set-1/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Concurrency',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf)',
                type: 'pdf'
              },
              {
                title: 'Dining Philosophers Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/DiningPhilosophers.html)',
                type: 'interactive'
              }
            ],
            order: 4,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Deadlocks',
            content: `Deadlock occurs when processes wait indefinitely for resources held by each other.

            **Necessary Conditions (All must hold):**
            1. Mutual Exclusion: Resources not sharable
            2. Hold and Wait: Process holds resources while waiting
            3. No Preemption: Resources cannot be forcibly taken
            4. Circular Wait: Circular chain of waiting processes
            
            **Resource Allocation Graph:**
            - Request Edge: Process → Resource
            - Assignment Edge: Resource → Process
            - Cycle in graph may indicate deadlock
            
            **Deadlock Handling Methods:**
            
            1. **Prevention (Break one condition):**
               - Eliminate Mutual Exclusion: Use sharable resources
               - Eliminate Hold and Wait: Request all resources at once
               - Allow Preemption: Take away resources
               - Eliminate Circular Wait: Order resources, request in order
            
            2. **Avoidance:**
               - Banker's Algorithm:
                 - Safe State: Can allocate to all processes
                 - Need = Max - Allocation
                 - Available after allocation
                 - Find safe sequence
               - O(n²m) complexity
            
            3. **Detection and Recovery:**
               - Detect: Use wait-for graph or matrix
               - Recover: Kill processes or preempt resources
            
            4. **Ignorance (Ostrich Algorithm):**
               - Assume deadlocks are rare
               - Reboot if system hangs
            
            **GATE Focus:**
            - Banker's algorithm calculations
            - Safe sequence finding
            - Minimum resources to avoid deadlock`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=onkWXpBEv3g)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Banker\'s Algorithm Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Bankers.html)',
                type: 'interactive'
              },
              {
                title: 'OSTEP - Deadlock',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf)',
                type: 'pdf'
              }
            ],
            order: 5,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Memory Management - Basics',
            content: `Memory management allocates memory to processes and manages memory hierarchy.

            **Address Binding:**
            - Compile Time: Absolute address (MS-DOS .COM)
            - Load Time: Relocatable address
            - Execution Time: Dynamic relocation (most modern systems)
            
            **Logical vs Physical Address:**
            - Logical (Virtual): Generated by CPU
            - Physical: Actual memory address
            - MMU: Maps logical to physical
            
            **Contiguous Memory Allocation:**
            
            1. **Fixed Partitioning:**
               - Equal-sized partitions
               - Internal fragmentation
            
            2. **Variable Partitioning:**
               - Partitions sized to process needs
               - External fragmentation
            
            **Allocation Strategies:**
            - First Fit: First hole that fits
            - Best Fit: Smallest hole that fits
            - Worst Fit: Largest hole
            - First Fit generally fastest and best
            
            **Fragmentation:**
            - Internal: Wasted space within allocated partition
            - External: Free memory scattered in small pieces
            - Solution: Compaction (expensive)
            
            **Swapping:**
            - Move entire process to backing store
            - Swap in when needed
            - Increases multiprogramming degree`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=rWDY1cRkwp8)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/memory-management-in-operating-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Address Spaces',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf)',
                type: 'pdf'
              }
            ],
            order: 6,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Paging',
            content: `Paging divides physical memory into fixed-size frames and logical memory into pages.

            **Basic Concepts:**
            - Page: Fixed-size block of logical memory
            - Frame: Fixed-size block of physical memory
            - Page Size = Frame Size (typically 4KB)
            
            **Address Translation:**
            - Logical Address = Page Number + Page Offset
            - Physical Address = Frame Number + Page Offset
            - Page Table: Maps page number to frame number
            
            **Page Table Entry (PTE):**
            - Frame number
            - Valid/Invalid bit
            - Protection bits (R/W/X)
            - Dirty bit (modified)
            - Reference bit (accessed)
            
            **Page Table Storage:**
            - In main memory
            - Page Table Base Register (PTBR) points to table
            - Two memory accesses per data access
            
            **Translation Lookaside Buffer (TLB):**
            - Cache for page table entries
            - Associative memory (fast lookup)
            - TLB hit: Single memory access
            - TLB miss: Page table lookup + TLB update
            
            **Effective Access Time:**
            EAT = (TLB hit ratio × TLB time) + (TLB miss ratio × miss time)
            
            **Hierarchical Paging:**
            - Two-level: Page directory + Page table
            - Reduces page table memory requirements
            
            **Inverted Page Table:**
            - One entry per frame, not per page
            - Saves memory for large address spaces
            - Slower lookup (hash table helps)`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=pJ6qrCB8pDw)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/paging-in-operating-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Paging',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf)',
                type: 'pdf'
              },
              {
                title: 'Paging Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Paging.html)',
                type: 'interactive'
              }
            ],
            order: 7,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Virtual Memory and Page Replacement',
            content: `Virtual memory allows execution of processes larger than physical memory.

            **Demand Paging:**
            - Load pages only when needed
            - Page fault: Page not in memory
            - Lazy loading reduces memory usage
            
            **Page Fault Handling:**
            1. Trap to OS
            2. Find frame (may need replacement)
            3. Load page from disk
            4. Update page table
            5. Restart instruction
            
            **Page Replacement Algorithms:**
            
            1. **FIFO (First In First Out):**
               - Replace oldest page
               - Belady's Anomaly: More frames can cause more faults
            
            2. **Optimal (OPT):**
               - Replace page used farthest in future
               - Not implementable (requires future knowledge)
               - Used as benchmark
            
            3. **LRU (Least Recently Used):**
               - Replace page unused for longest time
               - Good approximation of optimal
               - Implementation: Counters or stack
            
            4. **LRU Approximations:**
               - Second Chance (Clock): Reference bit + FIFO
               - Enhanced Second Chance: Reference + Dirty bits
               - Not Recently Used (NRU): Reference + Dirty bits
            
            **Thrashing:**
            - Process spends more time paging than executing
            - Caused by insufficient frames
            - Solution: Working Set Model
            
            **Working Set Model:**
            - Pages referenced in recent window
            - Allocate frames ≥ working set size
            
            **GATE Calculations:**
            - Page fault rate
            - Effective Access Time with page faults
            - Comparing algorithm performance`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=o2_iCzS9-ZQ)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/virtual-memory-in-operating-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Swapping Policies',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf)',
                type: 'pdf'
              },
              {
                title: 'Page Replacement Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Paging.html)',
                type: 'interactive'
              }
            ],
            order: 8,
            difficulty: 'advanced',
            estimatedHours: 14,
            gateWeightage: 'very_high'
          },
          {
            title: 'File Systems',
            content: `File systems organize and manage data on storage devices.

            **File Concepts:**
            - File: Named collection of related information
            - Attributes: Name, type, size, location, protection, timestamps
            
            **File Operations:**
            - Create, Delete, Open, Close
            - Read, Write, Append
            - Seek (reposition)
            - Truncate
            
            **Directory Structure:**
            - Single-level: All files in one directory
            - Two-level: Separate directory per user
            - Tree: Hierarchical structure
            - Acyclic Graph: Shared subdirectories
            - General Graph: With cycles (need garbage collection)
            
            **File Allocation Methods:**
            
            1. **Contiguous Allocation:**
               - Files stored in consecutive blocks
               - Fast sequential and direct access
               - External fragmentation
               - File size must be known
            
            2. **Linked Allocation:**
               - Each block points to next
               - No external fragmentation
               - Only sequential access
               - Pointer overhead
               - FAT (File Allocation Table) optimization
            
            3. **Indexed Allocation:**
               - Index block contains pointers to file blocks
               - Direct access
               - Index block overhead
               - Multi-level indexing for large files
            
            **UNIX Inode Structure:**
            - Direct blocks (12 typically)
            - Single indirect
            - Double indirect
            - Triple indirect
            
            **Free Space Management:**
            - Bit Vector: 1 bit per block
            - Linked List: Free blocks linked
            - Grouping: First free block stores addresses
            - Counting: Contiguous free blocks`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=mzUyMy7Ihk0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/file-systems-in-operating-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'OSTEP - Files and Directories',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf)',
                type: 'pdf'
              }
            ],
            order: 9,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Disk Scheduling',
            content: `Disk scheduling optimizes disk head movement for I/O requests.

            **Disk Structure:**
            - Platters, Tracks, Sectors, Cylinders
            - Seek Time: Move head to cylinder
            - Rotational Latency: Wait for sector
            - Transfer Time: Data transfer
            
            **Access Time = Seek Time + Rotational Latency + Transfer Time**
            
            **Disk Scheduling Algorithms:**
            
            1. **FCFS (First Come First Serve):**
               - Service requests in arrival order
               - Fair but high seek time
            
            2. **SSTF (Shortest Seek Time First):**
               - Service nearest request
               - Reduces seek time
               - May cause starvation
            
            3. **SCAN (Elevator Algorithm):**
               - Move in one direction, service all requests
               - Reverse at end of disk
               - No starvation
            
            4. **C-SCAN (Circular SCAN):**
               - Like SCAN but return to start without servicing
               - More uniform wait time
            
            5. **LOOK:**
               - Like SCAN but reverse at last request
               - No need to go to disk end
            
            6. **C-LOOK:**
               - Like C-SCAN but reverse at last request
            
            **GATE Calculations:**
            - Total seek time
            - Average seek time
            - Comparing algorithms for given request sequence
            
            **RAID (Redundant Array of Independent Disks):**
            - RAID 0: Striping (performance)
            - RAID 1: Mirroring (reliability)
            - RAID 5: Striping with distributed parity
            - RAID 6: Striping with double parity`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=Pp7DlrOv6lk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/disk-scheduling-algorithms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Disk Scheduling Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/DiskScheduling.html)',
                type: 'interactive'
              }
            ],
            order: 10,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== DATABASE MANAGEMENT SYSTEMS ====================
      {
        name: 'Database Management Systems',
        description: 'Complete DBMS coverage including ER modeling, relational algebra, SQL, normalization, transactions, and indexing. GATE weightage: 8-10%.',
        syllabus: 'gate',
        icon: 'database',
        weightage: 9,
        topics: [
          {
            title: 'Introduction to DBMS',
            content: `DBMS is software for creating, managing, and accessing databases.

            **Advantages over File Systems:**
            - Data independence
            - Reduced redundancy
            - Data consistency
            - Data sharing
            - Security
            - Backup and recovery
            - Concurrent access
            
            **Database Users:**
            - Database Administrator (DBA)
            - Database Designers
            - End Users
            - Application Programmers
            
            **Three Schema Architecture:**
            1. External Schema (View Level): User views
            2. Conceptual Schema (Logical Level): Overall structure
            3. Internal Schema (Physical Level): Storage details
            
            **Data Independence:**
            - Logical Independence: Change conceptual without changing external
            - Physical Independence: Change internal without changing conceptual
            
            **Data Models:**
            - Hierarchical Model: Tree structure
            - Network Model: Graph structure
            - Relational Model: Tables (most common)
            - Object-Oriented Model
            - Object-Relational Model`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=kBdlM6hNDAE)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - DBMS (IIT Kharagpur)',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106105175)',
                type: 'video_course'
              },
              {
                title: 'Stanford DB Course',
                url: '[online.stanford.edu](https://online.stanford.edu/courses/soe-ydatabases-databases)',
                type: 'course'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 6,
            gateWeightage: 'medium'
          },
          {
            title: 'ER Model',
            content: `Entity-Relationship model is a conceptual data model for database design.

            **Basic Concepts:**
            - Entity: Real-world object (Person, Product)
            - Attribute: Property of entity (Name, Price)
            - Relationship: Association between entities
            
            **Entity Types:**
            - Strong Entity: Exists independently
            - Weak Entity: Depends on strong entity for identification
            
            **Attribute Types:**
            - Simple vs Composite (can be divided)
            - Single-valued vs Multi-valued
            - Stored vs Derived
            - Key attribute (uniquely identifies entity)
            
            **Relationship Types:**
            - Degree: Unary, Binary, Ternary
            - Cardinality: 1:1, 1:N, M:N
            - Participation: Total (mandatory) or Partial (optional)
            
            **ER Diagram Symbols:**
            - Rectangle: Entity
            - Diamond: Relationship
            - Ellipse: Attribute
            - Double ellipse: Multi-valued attribute
            - Dashed ellipse: Derived attribute
            - Double rectangle: Weak entity
            - Double diamond: Identifying relationship
            
            **Extended ER (EER):**
            - Specialization: Top-down (superclass → subclasses)
            - Generalization: Bottom-up (subclasses → superclass)
            - Aggregation: Treating relationship as entity
            
            **GATE Focus:**
            - Drawing ER diagrams from requirements
            - Converting ER to relational schema
            - Cardinality constraints`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=dYvxao3S19M)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-er-model/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'ER Diagram Tool',
                url: '[lucidchart.com](https://www.lucidchart.com/pages/er-diagrams)',
                type: 'tool'
              },
              {
                title: 'Draw.io ER Templates',
                url: '[app.diagrams.net](https://app.diagrams.net/)',
                type: 'tool'
              }
            ],
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Relational Model',
            content: `The relational model represents data as tables (relations).

            **Basic Terminology:**
            - Relation: Table
            - Tuple: Row
            - Attribute: Column
            - Domain: Set of allowable values for attribute
            - Degree: Number of attributes
            - Cardinality: Number of tuples
            
            **Keys:**
            - Super Key: Attribute set that uniquely identifies tuples
            - Candidate Key: Minimal super key
            - Primary Key: Chosen candidate key
            - Alternate Key: Candidate keys not chosen as primary
            - Foreign Key: Attribute referencing another relation's primary key
            
            **Integrity Constraints:**
            - Domain Constraints: Values must be from domain
            - Entity Integrity: Primary key cannot be NULL
            - Referential Integrity: Foreign key must reference existing tuple or be NULL
            - Key Constraints: Key values must be unique
            
            **Relational Algebra:**
            Basic operations:
            - Selection (σ): Horizontal subset (filter rows)
            - Projection (π): Vertical subset (select columns)
            - Union (∪): Combine tuples from two relations
            - Set Difference (-): Tuples in one but not other
            - Cartesian Product (×): All combinations
            - Rename (ρ): Rename relation or attributes
            
            Derived operations:
            - Intersection (∩): Tuples in both relations
            - Join (⋈): Combine related tuples
              - Natural Join: On common attributes
              - Theta Join: With condition
              - Equi-Join: Theta join with equality
            - Division (÷): For "all" type queries
            
            **GATE Focus:**
            - Relational algebra expressions
            - Query equivalence
            - Key identification`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=WGJuq9Kk5jE)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/relational-model-in-dbms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Relational Algebra Calculator',
                url: '[dbis-uibk.github.io](https://dbis-uibk.github.io/relax/)',
                type: 'interactive'
              }
            ],
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'SQL - Structured Query Language',
            content: `SQL is the standard language for relational database management.

            **SQL Components:**
            - DDL (Data Definition Language): CREATE, ALTER, DROP
            - DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE
            - DCL (Data Control Language): GRANT, REVOKE
            - TCL (Transaction Control): COMMIT, ROLLBACK, SAVEPOINT
            
            **Data Types:**
            - Numeric: INT, DECIMAL, FLOAT
            - Character: CHAR, VARCHAR, TEXT
            - Date/Time: DATE, TIME, DATETIME, TIMESTAMP
            - Boolean: BOOLEAN
            
            **SELECT Query Structure:**
            \`\`\`sql
            SELECT [DISTINCT] columns
            FROM table
            [JOIN table ON condition]
            [WHERE condition]
            [GROUP BY columns]
            [HAVING condition]
            [ORDER BY columns [ASC|DESC]]
            [LIMIT n];
            \`\`\`
            
            **Aggregate Functions:**
            - COUNT(), SUM(), AVG(), MIN(), MAX()
            - Used with GROUP BY
            - HAVING filters groups (WHERE filters rows)
            
            **Joins:**
            - INNER JOIN: Matching rows only
            - LEFT JOIN: All left + matching right
            - RIGHT JOIN: All right + matching left
            - FULL OUTER JOIN: All from both
            - CROSS JOIN: Cartesian product
            - SELF JOIN: Table with itself
            
            **Subqueries:**
            - Scalar subquery: Returns single value
            - Row subquery: Returns single row
            - Table subquery: Returns multiple rows
            - Correlated subquery: References outer query
            
            **Set Operations:**
            - UNION, UNION ALL
            - INTERSECT
            - EXCEPT (MINUS)
            
            **Views:**
            - Virtual tables based on queries
            - Can be updatable under certain conditions`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=HXV3zeQKqGY)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/sql-tutorial/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'SQLZoo - Interactive Tutorial',
                url: '[sqlzoo.net](https://sqlzoo.net/)',
                type: 'interactive'
              },
              {
                title: 'W3Schools SQL Tutorial',
                url: '[w3schools.com](https://www.w3schools.com/sql/)',
                type: 'tutorial'
              },
              {
                title: 'LeetCode SQL Problems',
                url: '[leetcode.com](https://leetcode.com/problemset/database/)',
                type: 'practice'
              },
              {
                title: 'Mode SQL Tutorial',
                url: '[mode.com](https://mode.com/sql-tutorial/)',
                type: 'tutorial'
              }
            ],
            practiceProblems: [
              {
                title: 'Combine Two Tables',
                url: '[leetcode.com](https://leetcode.com/problems/combine-two-tables/)',
                difficulty: 'easy'
              },
              {
                title: 'Second Highest Salary',
                url: '[leetcode.com](https://leetcode.com/problems/second-highest-salary/)',
                difficulty: 'medium'
              },
              {
                title: 'Department Top Three Salaries',
                url: '[leetcode.com](https://leetcode.com/problems/department-top-three-salaries/)',
                difficulty: 'hard'
              }
            ],
            order: 4,
            difficulty: 'beginner',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Normalization',
            content: `Normalization organizes data to reduce redundancy and improve integrity.

            **Functional Dependency (FD):**
            - X → Y: Y is functionally dependent on X
            - If two tuples agree on X, they must agree on Y
            
            **Armstrong's Axioms:**
            - Reflexivity: If Y ⊆ X, then X → Y
            - Augmentation: If X → Y, then XZ → YZ
            - Transitivity: If X → Y and Y → Z, then X → Z
            
            **Derived Rules:**
            - Union: X → Y, X → Z implies X → YZ
            - Decomposition: X → YZ implies X → Y, X → Z
            - Pseudo-transitivity: X → Y, WY → Z implies WX → Z
            
            **Closure:**
            - Attribute closure (X⁺): All attributes determined by X
            - FD closure: All FDs derivable from given FDs
            
            **Normal Forms:**
            
            **1NF (First Normal Form):**
            - All attributes are atomic (no multi-valued)
            - No repeating groups
            
            **2NF (Second Normal Form):**
            - In 1NF
            - No partial dependencies (non-prime attributes fully depend on entire candidate key)
            
            **3NF (Third Normal Form):**
            - In 2NF
            - No transitive dependencies (X → Y → Z where Y is non-prime)
            - For X → A: X is superkey OR A is prime attribute
            
            **BCNF (Boyce-Codd Normal Form):**
            - For every FD X → Y: X is a superkey
            - Stricter than 3NF
            - May lose dependency preservation
            
            **4NF:**
            - In BCNF
            - No multi-valued dependencies (except trivial ones)
            
            **Decomposition Properties:**
            - Lossless-Join: Can reconstruct original relation
            - Dependency Preservation: Can check all FDs locally
            
            **GATE Focus:**
            - Identifying normal form
            - Finding candidate keys from FDs
            - Decomposing to BCNF/3NF`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=xoTyrdT9SZI)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/database-normalization/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Normalization Practice Problems',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/database-normalization-questions/)',
                type: 'practice'
              }
            ],
            order: 5,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Transactions and Concurrency Control',
            content: `A transaction is a logical unit of work that must be completed entirely or not at all.

            **ACID Properties:**
            - **Atomicity:** All or nothing
            - **Consistency:** Database stays valid
            - **Isolation:** Concurrent transactions don't interfere
            - **Durability:** Committed changes persist
            
            **Transaction States:**
            Active → Partially Committed → Committed
                  ↓                          ↓
                Failed → Aborted → (Restart or Kill)
            
            **Schedule:**
            - Sequence of operations from concurrent transactions
            - Serial Schedule: Transactions execute one after another
            - Serializable: Equivalent to some serial schedule
            
            **Conflict Serializability:**
            - Conflicting operations: Same item, at least one write
            - Conflict equivalent: Same conflicts in same order
            - Test: Check if precedence graph is acyclic
            
            **View Serializability:**
            - Weaker than conflict serializability
            - Same initial reads, same final writes, same intermediate reads
            
            **Recoverable Schedules:**
            - If Tᵢ reads from Tⱼ, Tⱼ commits before Tᵢ
            
            **Cascadeless Schedules:**
            - Read only committed data
            
            **Concurrency Control Protocols:**
            
            1. **Lock-Based:**
               - Shared Lock (S): For reading
               - Exclusive Lock (X): For writing
               - Two-Phase Locking (2PL): Growing + Shrinking phases
               - Strict 2PL: Hold all locks until commit
               - Rigorous 2PL: Hold all locks until end
            
            2. **Timestamp-Based:**
               - Each transaction gets timestamp
               - Check read/write timestamps
               - Abort if conflict detected
            
            **Deadlock:**
            - Detection: Wait-for graph cycle
            - Prevention: Wound-Wait, Wait-Die schemes
            - Recovery: Rollback younger/older transaction`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=eYQwKi7P8MM)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/transaction-in-dbms/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'CMU Database Systems - Transactions',
                url: '[15445.courses.cs.cmu.edu](https://15445.courses.cs.cmu.edu/fall2022/notes/15-concurrencycontrol.pdf)',
                type: 'pdf'
              }
            ],
            order: 6,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Indexing and Hashing',
            content: `Indexing speeds up data retrieval by providing efficient access paths.

            **Index Types:**
            
            1. **Primary Index:**
               - On ordering key field
               - One entry per block (sparse)
            
            2. **Clustering Index:**
               - On non-key ordering field
               - One entry per distinct value
            
            3. **Secondary Index:**
               - On non-ordering field
               - Dense index (entry per record) or sparse
            
            **B-Tree:**
            - Self-balancing search tree
            - Order m: Each node has at most m children
            - Root has at least 2 children
            - Non-root nodes have at least ⌈m/2⌉ children
            - All leaves at same level
            
            **B+ Tree:**
            - Only leaves have data pointers
            - Internal nodes have only keys
            - Leaves are linked (range queries)
            - More keys per node (better for disk)
            
            **B+ Tree Calculations:**
            - Fan-out (f) = ⌊(block size - pointer) / (key + pointer)⌋ + 1
            - Height = ⌈logf(n/leaf capacity)⌉
            - Search cost = O(log n)
            
            **Hash-Based Indexing:**
            
            1. **Static Hashing:**
               - Fixed number of buckets
               - Overflow handling: Chaining, Open addressing
            
            2. **Dynamic Hashing:**
               - Extendible Hashing: Directory doubles when needed
               - Linear Hashing: Buckets added linearly
            
            **Comparison:**
            - B+ Tree: Good for range queries, ordered access
            - Hash Index: Good for equality queries
            
            **GATE Focus:**
            - B+ tree calculations (height, fan-out)
            - Number of disk accesses
            - Index selection for queries`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=aZjYr87r1b8)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/indexing-in-databases/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'B+ Tree Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)',
                type: 'interactive'
              }
            ],
            order: 7,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== COMPUTER NETWORKS ====================
      {
        name: 'Computer Networks',
        description: 'Network fundamentals, protocols, and architectures. Covers OSI/TCP-IP models, routing, transport, and application layers. GATE weightage: 8-10%.',
        syllabus: 'gate',
        icon: 'globe',
        weightage: 9,
        topics: [
          {
            title: 'Network Fundamentals and Models',
            content: `Computer networks enable communication between devices.

            **Network Types:**
            - LAN (Local Area Network)
            - MAN (Metropolitan Area Network)
            - WAN (Wide Area Network)
            - PAN (Personal Area Network)
            
            **Network Topologies:**
            - Bus, Star, Ring, Mesh, Tree, Hybrid
            
            **OSI Model (7 Layers):**
            7. Application: HTTP, FTP, SMTP, DNS
            6. Presentation: Encryption, Compression
            5. Session: Session management
            4. Transport: TCP, UDP (end-to-end)
            3. Network: IP, Routing
            2. Data Link: Framing, MAC, Error detection
            1. Physical: Bits, Cables, Signals
            
            **TCP/IP Model (4 Layers):**
            4. Application: HTTP, FTP, SMTP, DNS
            3. Transport: TCP, UDP
            2. Internet: IP, ICMP
            1. Network Access: Ethernet, Wi-Fi
            
            **Data Unit at Each Layer:**
            - Application: Data/Message
            - Transport: Segment (TCP) / Datagram (UDP)
            - Network: Packet
            - Data Link: Frame
            - Physical: Bits
            
            **Encapsulation:**
            Each layer adds header (and sometimes trailer)
            
            **Transmission Modes:**
            - Simplex: One direction only
            - Half-Duplex: Both directions, not simultaneously
            - Full-Duplex: Both directions simultaneously`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=3QhU9jd03a0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/computer-network-tutorials/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Computer Networks (IIT Kharagpur)',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106105183)',
                type: 'video_course'
              },
              {
                title: 'Computer Networking: A Top-Down Approach (Book)',
                url: '[gaia.cs.umass.edu](https://gaia.cs.umass.edu/kurose_ross/index.php)',
                type: 'book'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'medium'
          },
          {
            title: 'Physical Layer',
            content: `Physical layer handles bit transmission over physical media.

            **Transmission Media:**
            
            1. **Guided Media:**
               - Twisted Pair: UTP, STP
               - Coaxial Cable: Baseband, Broadband
               - Fiber Optic: Single-mode, Multi-mode
            
            2. **Unguided Media:**
               - Radio Waves
               - Microwaves
               - Infrared
            
            **Digital Encoding:**
            - NRZ-L, NRZ-I
            - Manchester, Differential Manchester
            - AMI, B8ZS, HDB3
            
            **Multiplexing:**
            - FDM (Frequency Division Multiplexing)
            - TDM (Time Division Multiplexing)
              - Synchronous TDM
              - Statistical TDM
            - WDM (Wavelength Division Multiplexing)
            - CDM (Code Division Multiplexing)
            
            **Digital Modulation:**
            - ASK (Amplitude Shift Keying)
            - FSK (Frequency Shift Keying)
            - PSK (Phase Shift Keying)
            - QAM (Quadrature Amplitude Modulation)
            
            **Channel Capacity:**
            - Nyquist Rate: C = 2B log₂(L) for noiseless channel
            - Shannon Capacity: C = B log₂(1 + SNR) for noisy channel
            
            **GATE Calculations:**
            - Bit rate vs Baud rate
            - Channel capacity problems
            - Multiplexing efficiency`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=H7tPRz3rAho)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/physical-layer-in-osi-model/)',
            documentationSource: 'geeksforgeeks',
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'medium'
          },
          {
            title: 'Data Link Layer',
            content: `Data link layer provides node-to-node communication.

            **Functions:**
            - Framing
            - Error Detection/Correction
            - Flow Control
            - Access Control (for shared media)
            
            **Framing Methods:**
            - Character Count
            - Flag bytes with byte stuffing
            - Start and End flags with bit stuffing
            
            **Error Detection:**
            
            1. **Parity:**
               - Single bit parity: Detects odd errors
               - 2D parity: Detects and corrects single bit
            
            2. **Checksum:**
               - Sum of data segments
               - Complement at sender, verify at receiver
            
            3. **CRC (Cyclic Redundancy Check):**
               - Polynomial division
               - Detects all burst errors ≤ polynomial degree
               - CRC-32, CRC-16 common
            
            **Error Correction:**
            - Hamming Distance: Minimum flips between codewords
            - To detect d errors: min distance = d + 1
            - To correct d errors: min distance = 2d + 1
            - Hamming Code: Position parity bits at 2^i
            
            **Flow Control:**
            
            1. **Stop-and-Wait:**
               - Send one frame, wait for ACK
               - Efficiency = 1/(1 + 2a) where a = propagation/transmission time
            
            2. **Sliding Window:**
               - Send multiple frames before ACK
               - Go-Back-N: Retransmit from error
               - Selective Repeat: Retransmit only error frame
               - Window size: 2^(n-1) for SR, 2^n - 1 for GBN
            
            **GATE Focus:**
            - Efficiency calculations
            - CRC computation
            - Hamming code error detection/correction`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=LkolbURrtTs)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/data-link-layer/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'CRC Calculator',
                url: '[lddgo.net](https://www.lddgo.net/en/encrypt/crc)',
                type: 'tool'
              }
            ],
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'high'
          },
          {
            title: 'Medium Access Control (MAC)',
            content: `MAC sublayer controls access to shared broadcast channel.

            **Multiple Access Protocols:**
            
            **1. Random Access:**
            
            a) **ALOHA:**
               - Pure ALOHA: Transmit anytime
                 - Throughput: S = G × e^(-2G), Max = 0.184 at G=0.5
               - Slotted ALOHA: Transmit at slot start
                 - Throughput: S = G × e^(-G), Max = 0.368 at G=1
            
            b) **CSMA (Carrier Sense Multiple Access):**
               - 1-persistent: Send immediately if idle
               - Non-persistent: Wait random time if busy
               - p-persistent: Send with probability p if idle
            
            c) **CSMA/CD (Collision Detection):**
               - Used in Ethernet
               - Detect collision while transmitting
               - Minimum frame size = 2 × propagation time × bandwidth
               - Binary Exponential Backoff
            
            d) **CSMA/CA (Collision Avoidance):**
               - Used in Wi-Fi (802.11)
               - RTS/CTS handshake
               - ACK after successful reception
            
            **2. Controlled Access:**
            - Reservation
            - Polling
            - Token Passing
            
            **3. Channelization:**
            - FDMA, TDMA, CDMA
            
            **Ethernet (IEEE 802.3):**
            - Frame format: Preamble, SFD, Destination, Source, Type/Length, Data, CRC
            - MAC address: 48 bits
            - Minimum frame size: 64 bytes
            - Maximum frame size: 1518 bytes
            
            **GATE Focus:**
            - ALOHA efficiency
            - CSMA/CD minimum frame size
            - Collision domain vs broadcast domain`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=iKn0GzF5-IU)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/multiple-access-protocols-in-computer-network/)',
            documentationSource: 'geeksforgeeks',
            order: 4,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Network Layer - IP Addressing',
            content: `Network layer provides logical addressing and routing.

            **IPv4 Address:**
            - 32 bits, dotted decimal notation
            - Network ID + Host ID
            
            **Classful Addressing:**
            - Class A: 0.0.0.0 - 127.255.255.255 (/8)
            - Class B: 128.0.0.0 - 191.255.255.255 (/16)
            - Class C: 192.0.0.0 - 223.255.255.255 (/24)
            - Class D: 224.0.0.0 - 239.255.255.255 (Multicast)
            - Class E: 240.0.0.0 - 255.255.255.255 (Reserved)
            
            **Private IP Ranges:**
            - 10.0.0.0/8
            - 172.16.0.0/12
            - 192.168.0.0/16
            
            **Special Addresses:**
            - 127.0.0.1: Loopback
            - 0.0.0.0: This network
            - 255.255.255.255: Limited broadcast
            
            **Subnetting:**
            - Borrow bits from host portion
            - Number of subnets = 2^borrowed bits
            - Hosts per subnet = 2^host bits - 2
            
            **CIDR (Classless Inter-Domain Routing):**
            - Variable length subnet mask
            - Address/prefix notation (e.g., 192.168.1.0/24)
            - Supernetting: Combine multiple networks
            
            **IPv6:**
            - 128 bits, hexadecimal notation
            - No NAT needed
            - Simplified header
            - Built-in security (IPsec)
            
            **NAT (Network Address Translation):**
            - Private to public address mapping
            - PAT (Port Address Translation)
            
            **GATE Focus:**
            - Subnet calculations
            - Finding network address, broadcast address
            - CIDR aggregation`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=ddM9AcreVqY)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/ip-addressing-classful-addressing/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Subnet Calculator',
                url: '[calculator.net](https://www.calculator.net/ip-subnet-calculator.html)',
                type: 'tool'
              },
              {
                title: 'CIDR Visualization',
                url: '[cidr.xyz](https://cidr.xyz/)',
                type: 'interactive'
              }
            ],
            order: 5,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Network Layer - Routing',
            content: `Routing determines the path for packets through the network.

            **Routing Types:**
            - Static Routing: Manually configured
            - Dynamic Routing: Automatic updates
            
            **Distance Vector Routing:**
            - Bellman-Ford algorithm
            - Each router shares routing table with neighbors
            - Examples: RIP, RIPv2
            
            **RIP (Routing Information Protocol):**
            - Hop count metric (max 15)
            - Updates every 30 seconds
            - Count-to-infinity problem
            - Solutions: Split horizon, Poison reverse
            
            **Link State Routing:**
            - Dijkstra's algorithm
            - Each router has complete network topology
            - Examples: OSPF, IS-IS
            
            **OSPF (Open Shortest Path First):**
            - Uses link state advertisements (LSA)
            - Supports hierarchical routing (areas)
            - Faster convergence than RIP
            - No hop count limit
            
            **Path Vector Routing:**
            - BGP (Border Gateway Protocol)
            - Used between autonomous systems
            - Stores complete path information
            
            **Routing Table:**
            - Destination network
            - Next hop
            - Metric/Cost
            - Interface
            
            **Longest Prefix Match:**
            - Most specific route wins
            
            **ICMP (Internet Control Message Protocol):**
            - Error reporting (Destination unreachable, Time exceeded)
            - Query (Echo request/reply - ping)
            - Traceroute uses TTL and ICMP
            
            **ARP (Address Resolution Protocol):**
            - Maps IP to MAC address
            - ARP request (broadcast)
            - ARP reply (unicast)
            
            **GATE Focus:**
            - Routing table construction
            - Distance vector examples
            - Longest prefix matching`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=0hw2JcLxnXk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/routing-in-computer-network/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Dijkstra Visualization',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/Dijkstra.html)',
                type: 'interactive'
              }
            ],
            order: 6,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          },
          {
            title: 'Transport Layer',
            content: `Transport layer provides end-to-end communication.

            **UDP (User Datagram Protocol):**
            - Connectionless
            - Unreliable (no ACK)
            - No flow/congestion control
            - Low overhead (8-byte header)
            - Uses: DNS, DHCP, VoIP, Gaming
            
            **TCP (Transmission Control Protocol):**
            - Connection-oriented
            - Reliable (ACK, retransmission)
            - Flow control (sliding window)
            - Congestion control
            - In-order delivery
            - Uses: HTTP, FTP, SMTP, SSH
            
            **TCP Header Fields:**
            - Source/Destination Port (16 bits each)
            - Sequence Number (32 bits)
            - Acknowledgment Number (32 bits)
            - Flags: SYN, ACK, FIN, RST, PSH, URG
            - Window Size
            - Checksum
            
            **TCP Connection:**
            - 3-Way Handshake (SYN, SYN-ACK, ACK)
            - 4-Way Termination (FIN, ACK, FIN, ACK)
            
            **TCP Flow Control:**
            - Receiver advertises window size
            - Sender limits unacknowledged data
            
            **TCP Congestion Control:**
            - Slow Start: cwnd doubles each RTT
            - Congestion Avoidance: cwnd increases by 1 MSS per RTT
            - Threshold (ssthresh): Switch point
            
            **On Timeout:**
            - ssthresh = cwnd/2
            - cwnd = 1 MSS
            - Start slow start
            
            **On 3 Duplicate ACKs (Fast Recovery):**
            - ssthresh = cwnd/2
            - cwnd = ssthresh + 3
            - Continue congestion avoidance
            
            **GATE Focus:**
            - TCP state transitions
            - Congestion window calculations
            - Sequence number problems`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=xMtP5ZB3wSk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/transport-layer-responsibilities/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'TCP Congestion Control Visualization',
                url: '[www2.tkn.tu-berlin.de](https://www2.tkn.tu-berlin.de/teaching/rn/animations/)',
                type: 'interactive'
              }
            ],
            order: 7,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Application Layer Protocols',
            content: `Application layer provides services directly to users.

            **DNS (Domain Name System):**
            - Hierarchical naming system
            - Maps domain names to IP addresses
            - Record types: A, AAAA, CNAME, MX, NS, PTR
            - Recursive vs Iterative queries
            - Port 53 (UDP/TCP)
            
            **HTTP (HyperText Transfer Protocol):**
            - Stateless request-response protocol
            - Methods: GET, POST, PUT, DELETE, HEAD
            - Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error
            - HTTP/1.1: Persistent connections
            - HTTP/2: Multiplexing, Server push
            - HTTP/3: QUIC (UDP-based)
            - Port 80 (HTTP), 443 (HTTPS)
            
            **FTP (File Transfer Protocol):**
            - Uses two connections: Control (21) and Data (20)
            - Active vs Passive mode
            
            **SMTP (Simple Mail Transfer Protocol):**
            - Email sending protocol
            - Port 25
            - Commands: HELO, MAIL FROM, RCPT TO, DATA
            
            **POP3 vs IMAP:**
            - POP3: Download and delete (port 110)
            - IMAP: Synchronize (port 143)
            
            **DHCP (Dynamic Host Configuration Protocol):**
            - Automatic IP configuration
            - DORA: Discover, Offer, Request, Acknowledge
            - Port 67 (server), 68 (client)
            
            **Telnet/SSH:**
            - Remote login
            - Telnet: Unencrypted (port 23)
            - SSH: Encrypted (port 22)
            
            **GATE Focus:**
            - DNS resolution steps
            - HTTP request/response
            - Protocol port numbers`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=1z0ULvg_pW8)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/application-layer-in-osi-model/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'DNS Explained',
                url: '[howdns.works](https://howdns.works/)',
                type: 'interactive'
              },
              {
                title: 'HTTP Status Codes',
                url: '[httpstatuses.com](https://httpstatuses.com/)',
                type: 'reference'
              }
            ],
            order: 8,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== THEORY OF COMPUTATION ====================
      {
        name: 'Theory of Computation',
        description: 'Formal languages, automata theory, computability, and complexity. Covers regular languages, context-free grammars, Turing machines, and decidability. GATE weightage: 8-10%.',
        syllabus: 'gate',
        icon: 'cpu',
        weightage: 9,
        topics: [
          {
            title: 'Finite Automata',
            content: `Finite Automata are mathematical models of computation with finite memory.

            **Deterministic Finite Automaton (DFA):**
            - 5-tuple: (Q, Σ, δ, q₀, F)
              - Q: Finite set of states
              - Σ: Input alphabet
              - δ: Q × Σ → Q (transition function)
              - q₀: Start state
              - F: Set of final/accepting states
            - Exactly one transition per symbol from each state
            - Accepts if ends in final state
            
            **Non-deterministic Finite Automaton (NFA):**
            - δ: Q × Σ → P(Q) (power set of Q)
            - Multiple transitions possible
            - ε-transitions allowed (NFA-ε)
            - Accepts if any path leads to final state
            
            **NFA to DFA Conversion (Subset Construction):**
            - DFA states = Subsets of NFA states
            - At most 2^n DFA states for n NFA states
            
            **DFA Minimization:**
            - Partition states by distinguishability
            - Merge indistinguishable states
            
            **Key Theorems:**
            - DFA ≡ NFA ≡ NFA-ε (same expressive power)
            - Regular languages closed under: Union, Intersection, Complement, Concatenation, Kleene star
            
            **GATE Focus:**
            - Constructing DFA/NFA for given language
            - NFA to DFA conversion
            - DFA minimization`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=Qa6csfkK7_I)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-finite-automata/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Theory of Computation',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106104148)',
                type: 'video_course'
              },
              {
                title: 'JFLAP - Automata Simulator',
                url: '[jflap.org](https://www.jflap.org/)',
                type: 'tool'
              },
              {
                title: 'Automata Tutor',
                url: '[automatatutor.com](https://automatatutor.com/)',
                type: 'interactive'
              }
            ],
            order: 1,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Regular Expressions and Languages',
            content: `Regular expressions define patterns for regular languages.

            **Regular Expression Operations:**
            - Union: R₁ | R₂ or R₁ + R₂
            - Concatenation: R₁R₂
            - Kleene Star: R* (zero or more)
            - Kleene Plus: R⁺ (one or more)
            
            **Precedence (highest to lowest):**
            1. Kleene star/plus
            2. Concatenation
            3. Union
            
            **Examples:**
            - (0|1)*: All binary strings
            - 0*10*: Strings with exactly one 1
            - (01)*: Even-length alternating strings starting with 0
            - (0|1)*11(0|1)*: Strings containing 11
            
            **Kleene's Theorem:**
            - Every regular expression has equivalent DFA
            - Every DFA has equivalent regular expression
            
            **Arden's Theorem:**
            - If R = Q + RP, then R = QP*
            - Used to convert DFA to regex
            
            **Pumping Lemma for Regular Languages:**
            - For regular language L, exists pumping length p
            - Any string s with |s| ≥ p can be split: s = xyz where:
              - |y| > 0
              - |xy| ≤ p
              - xy^i z ∈ L for all i ≥ 0
            
            **Using Pumping Lemma (to prove non-regular):**
            1. Assume L is regular
            2. Choose string s in L with |s| ≥ p
            3. Show no valid split exists
            4. Contradiction → L is not regular
            
            **Non-Regular Languages:**
            - {aⁿbⁿ | n ≥ 0}
            - {ww | w ∈ {a,b}*}
            - {aⁿ | n is prime}`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=eqCkkC9A0Q4)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/regular-expressions-regular-grammar-and-regular-languages/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Regex101 - Regex Tester',
                url: '[regex101.com](https://regex101.com/)',
                type: 'tool'
              }
            ],
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'very_high'
          },
          {
            title: 'Context-Free Grammars',
            content: `CFGs generate context-free languages with recursive structure.

            **Grammar Definition:**
            - 4-tuple: (V, T, P, S)
              - V: Non-terminals
              - T: Terminals
              - P: Production rules (A → α)
              - S: Start symbol
            
            **Derivation:**
            - Leftmost: Always replace leftmost non-terminal
            - Rightmost: Always replace rightmost non-terminal
            
            **Parse Trees:**
            - Root: Start symbol
            - Internal nodes: Non-terminals
            - Leaves: Terminals
            - Yield: String from left-to-right leaves
            
            **Ambiguity:**
            - Grammar is ambiguous if some string has multiple parse trees
            - Inherently ambiguous language: All grammars are ambiguous
            
            **Normal Forms:**
            
            1. **Chomsky Normal Form (CNF):**
               - A → BC (two non-terminals)
               - A → a (single terminal)
               - S → ε (only if needed)
               - Every CFG has equivalent CNF
            
            2. **Greibach Normal Form (GNF):**
               - A → aα (terminal followed by non-terminals)
               - Removes left recursion
            
            **Simplification:**
            1. Remove ε-productions
            2. Remove unit productions (A → B)
            3. Remove useless symbols
            
            **CFG vs Regular:**
            - All regular languages are context-free
            - Not all CFLs are regular
            - CFLs closed under: Union, Concatenation, Kleene star
            - NOT closed under: Intersection, Complement`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=5_tfVe7ED3g)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/classification-of-context-free-grammars/)',
            documentationSource: 'geeksforgeeks',
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Pushdown Automata',
            content: `PDA is a finite automaton with a stack for memory.

            **PDA Definition:**
            - 7-tuple: (Q, Σ, Γ, δ, q₀, Z₀, F)
              - Γ: Stack alphabet
              - Z₀: Initial stack symbol
              - δ: Q × (Σ ∪ {ε}) × Γ → P(Q × Γ*)
            
            **PDA Operation:**
            - Read input symbol (or ε)
            - Pop stack top
            - Push string onto stack
            - Move to new state
            
            **Acceptance:**
            - By final state: End in F with any stack
            - By empty stack: End with empty stack
            - Both methods equivalent
            
            **Deterministic PDA (DPDA):**
            - At most one move per configuration
            - DPDA ⊂ NPDA (strictly less powerful)
            
            **PDA ≡ CFG:**
            - For every CFG, there's equivalent PDA
            - For every PDA, there's equivalent CFG
            
            **Pumping Lemma for CFLs:**
            - For CFL L, exists pumping length p
            - Any string s with |s| ≥ p can be split: s = uvxyz where:
              - |vy| > 0
              - |vxy| ≤ p
              - uv^i xy^i z ∈ L for all i ≥ 0
            
            **Non-Context-Free:**
            - {aⁿbⁿcⁿ | n ≥ 0}
            - {ww | w ∈ {a,b}*}
            - {aⁿbⁿ²}
            
            **GATE Focus:**
            - Constructing PDA for CFL
            - Using pumping lemma
            - DPDA vs NPDA`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=JtRyd7Svlew)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-pushdown-automata/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'JFLAP PDA Tutorial',
                url: '[jflap.org](https://www.jflap.org/tutorial/)',
                type: 'tutorial'
              }
            ],
            order: 4,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          },
          {
            title: 'Turing Machines',
            content: `Turing Machine is the most powerful computational model.

            **TM Definition:**
            - 7-tuple: (Q, Σ, Γ, δ, q₀, B, F)
              - Γ: Tape alphabet (includes blank B)
              - δ: Q × Γ → Q × Γ × {L, R}
            
            **TM Operation:**
            - Read current tape symbol
            - Write new symbol
            - Move head left or right
            - Change state
            
            **TM Variants (All equivalent):**
            - Multi-tape TM
            - Non-deterministic TM
            - Two-way infinite tape
            - Multi-track TM
            
            **Church-Turing Thesis:**
            - Anything computable can be computed by TM
            - TM captures our intuitive notion of algorithm
            
            **TM as Language Acceptor:**
            - Accept: Halt in accepting state
            - Reject: Halt in rejecting state (or loop forever)
            
            **TM as Function Computer:**
            - Input on tape
            - Output on tape when halts
            
            **Recursively Enumerable (RE) Languages:**
            - Accepted by some TM
            - TM halts on yes instances (may loop on no)
            
            **Recursive (Decidable) Languages:**
            - Decided by some TM
            - TM always halts
            
            **Hierarchy:**
            Regular ⊂ Context-Free ⊂ Context-Sensitive ⊂ Recursive ⊂ RE
            
            **GATE Focus:**
            - TM construction for simple tasks
            - Understanding TM variants`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=PLVCscCY4xI)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/turing-machine-in-toc/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Turing Machine Simulator',
                url: '[turingmachinesimulator.com](https://turingmachinesimulator.com/)',
                type: 'interactive'
              }
            ],
            order: 5,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          },
          {
            title: 'Decidability and Undecidability',
            content: `Decidability concerns which problems can be solved by algorithms.

            **Definitions:**
            - Decidable: TM always halts with yes/no
            - Semi-decidable (RE): TM halts on yes, may loop on no
            - Undecidable: No TM decides the language
            
            **The Halting Problem:**
            - H = {<M,w> | M halts on input w}
            - H is undecidable (Turing's proof)
            - H is RE (semi-decidable)
            
            **Proof by Diagonalization:**
            - Assume TM H decides halting problem
            - Construct D that does opposite of H on itself
            - D(<D>) leads to contradiction
            
            **Rice's Theorem:**
            - Any non-trivial property of RE languages is undecidable
            - Non-trivial: True for some TMs, false for others
            
            **Undecidable Problems:**
            - Halting problem
            - Emptiness of TM language
            - Equivalence of TMs
            - Whether TM accepts any string
            - Whether language is regular/context-free
            - Post's Correspondence Problem (PCP)
            
            **Decidable Problems:**
            - Emptiness/finiteness of DFA
            - Equivalence of DFAs
            - Membership in CFL
            - Emptiness of CFL
            - Whether CFG is ambiguous (undecidable!)
            
            **Reductions:**
            - A ≤ B means: A reducible to B
            - If A ≤ B and B decidable, then A decidable
            - If A ≤ B and A undecidable, then B undecidable
            
            **GATE Focus:**
            - Identifying decidable vs undecidable
            - Using reductions
            - Rice's theorem application`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=HeQX2HjkcNo)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/decidability-and-undecidability/)',
            documentationSource: 'geeksforgeeks',
            order: 6,
            difficulty: 'advanced',
            estimatedHours: 12,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== COMPILER DESIGN ====================
      {
        name: 'Compiler Design',
        description: 'Compiler phases, lexical analysis, parsing, syntax-directed translation, and code optimization. GATE weightage: 6-8%.',
        syllabus: 'gate',
        icon: 'code',
        weightage: 7,
        topics: [
          {
            title: 'Introduction to Compilers',
            content: `A compiler translates source code to target code.

            **Compiler Phases:**
            
            **Analysis (Front End):**
            1. Lexical Analysis (Scanner)
               - Input: Source code
               - Output: Tokens
            2. Syntax Analysis (Parser)
               - Input: Tokens
               - Output: Parse tree
            3. Semantic Analysis
               - Type checking
               - Output: Annotated parse tree
            
            **Synthesis (Back End):**
            4. Intermediate Code Generation
               - Three-address code
            5. Code Optimization
               - Improve efficiency
            6. Code Generation
               - Target machine code
            
            **Symbol Table:**
            - Stores identifiers and their attributes
            - Used throughout compilation
            
            **Error Handler:**
            - Lexical errors (invalid characters)
            - Syntax errors (invalid structure)
            - Semantic errors (type mismatches)
            
            **Compiler vs Interpreter:**
            - Compiler: Entire program translated, then executed
            - Interpreter: Line-by-line execution
            - JIT: Compile at runtime
            
            **Passes:**
            - Single-pass: One scan through code
            - Multi-pass: Multiple scans
            
            **Bootstrapping:**
            - Writing compiler in its own language`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=Qkwj65l_96I)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-compiler-design/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Compiler Design',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106108052)',
                type: 'video_course'
              },
              {
                title: 'Dragon Book (Online Resources)',
                url: '[suif.stanford.edu](https://suif.stanford.edu/dragonbook/)',
                type: 'book'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 6,
            gateWeightage: 'medium'
          },
          {
            title: 'Lexical Analysis',
            content: `Lexical analyzer (scanner) converts character stream to tokens.

            **Token:**
            - <token-name, attribute-value>
            - Examples: <id, ptr>, <num, 42>, <if, ->, <+, ->
            
            **Lexeme:**
            - Actual character sequence matching pattern
            
            **Pattern:**
            - Rule describing lexemes (usually regex)
            
            **Token Types:**
            - Keywords: if, while, for
            - Identifiers: variable names
            - Operators: +, -, *, /
            - Literals: numbers, strings
            - Punctuation: ;, (, )
            
            **Lexer Implementation:**
            - Regular expressions → NFA → DFA
            - DFA for token recognition
            
            **Tools:**
            - Lex/Flex: Generate lexers from regex specifications
            
            **Lex Specification:**
            \`\`\`
            %{
            /* C declarations */
            %}
            /* Definitions */
            %%
            /* Rules (pattern action) */
            %%
            /* User code */
            \`\`\`
            
            **Conflicts:**
            - Longest match wins
            - First pattern wins (for equal length)
            
            **Symbol Table Interaction:**
            - Insert new identifiers
            - Return attributes for existing ones
            
            **GATE Focus:**
            - Token identification
            - NFA/DFA for lexer`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=3ehxJKGYXmk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-lexical-analysis/)',
            documentationSource: 'geeksforgeeks',
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'medium'
          },
          {
            title: 'Syntax Analysis - Parsing',
            content: `Parser builds parse tree from tokens using grammar rules.

            **Grammar for Parsing:**
            - Context-Free Grammar (CFG)
            - Start symbol, productions, terminals, non-terminals
            
            **Parse Tree:**
            - Root: Start symbol
            - Internal: Non-terminals
            - Leaves: Terminals (input tokens)
            
            **Parsing Types:**
            
            **1. Top-Down Parsing:**
            - Start from root, derive input
            - Leftmost derivation
            
            a) **Recursive Descent:**
               - One function per non-terminal
               - May need backtracking
            
            b) **Predictive (LL) Parsing:**
               - No backtracking
               - LL(1): 1 token lookahead
               - FIRST and FOLLOW sets
            
            **LL(1) Conditions:**
            - No left recursion
            - Must be left factored
            - For A → α | β: FIRST(α) ∩ FIRST(β) = ∅
            
            **FIRST Set:**
            - First terminals derivable from a string
            
            **FOLLOW Set:**
            - Terminals that can appear after a non-terminal
            
            **2. Bottom-Up Parsing:**
            - Start from leaves, reduce to root
            - Rightmost derivation (in reverse)
            
            a) **Shift-Reduce Parsing:**
               - Shift: Push token onto stack
               - Reduce: Replace handle with non-terminal
            
            b) **LR Parsing:**
               - Most powerful deterministic parsing
               - LR(0), SLR(1), LALR(1), LR(1)
               - Uses parse table (Action, Goto)
            
            **LR Conflicts:**
            - Shift-Reduce conflict
            - Reduce-Reduce conflict
            
            **GATE Focus:**
            - LL(1) parsing table construction
            - LR(0)/SLR parsing
            - First and Follow sets`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=MhpLOc5-RM0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-to-syntax-analysis-in-compiler-design/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'First and Follow Calculator',
                url: '[codeproject.com](https://www.codeproject.com/Articles/346873/First-and-Follow-Sets)',
                type: 'tool'
              }
            ],
            order: 3,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Syntax Directed Translation',
            content: `SDT attaches semantic rules to grammar productions.

            **Syntax-Directed Definition (SDD):**
            - CFG + semantic rules
            - Attributes for grammar symbols
            
            **Attribute Types:**
            - Synthesized: Computed from children
            - Inherited: Computed from parent/siblings
            
            **S-Attributed Definition:**
            - Only synthesized attributes
            - Can evaluate bottom-up
            
            **L-Attributed Definition:**
            - Synthesized attributes
            - Inherited from left siblings and parent
            - Can evaluate in single left-to-right pass
            
            **Dependency Graph:**
            - Nodes: Attribute instances
            - Edges: Dependencies
            - Topological order gives evaluation order
            
            **SDT Scheme:**
            - Semantic actions embedded in productions
            - Actions executed when reduced (bottom-up)
            
            **Example - Expression Evaluation:**
            \`\`\`
            E → E₁ + T  { E.val = E₁.val + T.val }
            E → T       { E.val = T.val }
            T → num     { T.val = num.lexval }
            \`\`\`
            
            **Intermediate Code:**
            - Three-Address Code (TAC)
            - t1 = a + b (one operator, at most 3 addresses)
            
            **TAC Representations:**
            - Quadruples: (op, arg1, arg2, result)
            - Triples: (op, arg1, arg2) with implicit result
            - Indirect triples
            
            **GATE Focus:**
            - Attribute evaluation order
            - Generating intermediate code`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=HnJIJgE9w4Y)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/syntax-directed-translation-in-compiler-design/)',
            documentationSource: 'geeksforgeeks',
            order: 4,
            difficulty: 'advanced',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Code Optimization',
            content: `Optimization improves code efficiency without changing behavior.

            **Optimization Levels:**
            - Machine-independent (on intermediate code)
            - Machine-dependent (on target code)
            
            **Local Optimization (Basic Block):**
            
            1. **Common Subexpression Elimination:**
               \`\`\`
               t1 = a + b; t2 = a + b  →  t1 = a + b; t2 = t1
               \`\`\`
            
            2. **Dead Code Elimination:**
               - Remove unreachable code
               - Remove unused computations
            
            3. **Constant Folding:**
               \`\`\`
               x = 2 * 3  →  x = 6
               \`\`\`
            
            4. **Constant Propagation:**
               \`\`\`
               x = 5; y = x + 2  →  x = 5; y = 7
               \`\`\`
            
            5. **Strength Reduction:**
               \`\`\`
               x * 2  →  x << 1
               x * 8  →  x << 3
               \`\`\`
            
            6. **Copy Propagation:**
               \`\`\`
               x = y; z = x + 1  →  z = y + 1
               \`\`\`
            
            **Global Optimization (Control Flow):**
            
            1. **Loop Optimization:**
               - Loop invariant code motion
               - Induction variable elimination
               - Loop unrolling
            
            2. **Data Flow Analysis:**
               - Reaching definitions
               - Live variable analysis
               - Available expressions
            
            **Basic Block:**
            - Maximal sequence of consecutive statements
            - Single entry, single exit
            
            **Control Flow Graph (CFG):**
            - Nodes: Basic blocks
            - Edges: Control flow
            
            **GATE Focus:**
            - Identifying optimizations
            - Basic block division
            - Data flow analysis basics`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=H2NG3q5rSoY)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/code-optimization-in-compiler-design/)',
            documentationSource: 'geeksforgeeks',
            order: 5,
            difficulty: 'advanced',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Runtime Environment',
            content: `Runtime environment manages memory during program execution.

            **Memory Layout:**
            \`\`\`
            High Address
            ┌─────────────┐
            │    Stack    │ ← grows down
            │      ↓      │
            │             │
            │      ↑      │
            │    Heap     │ ← grows up
            ├─────────────┤
            │    BSS      │ (uninitialized data)
            ├─────────────┤
            │    Data     │ (initialized data)
            ├─────────────┤
            │    Text     │ (code)
            └─────────────┘
            Low Address
            \`\`\`
            
            **Activation Record (Stack Frame):**
            - Return value
            - Actual parameters
            - Control link (old base pointer)
            - Access link (for nested functions)
            - Saved registers
            - Local variables
            - Temporaries
            
            **Storage Allocation:**
            1. **Static Allocation:**
               - Size known at compile time
               - Global variables
            
            2. **Stack Allocation:**
               - LIFO for function calls
               - Local variables
               - Automatic deallocation
            
            3. **Heap Allocation:**
               - Dynamic allocation
               - malloc/free, new/delete
               - May cause fragmentation
            
            **Parameter Passing:**
            - Call by Value: Copy value
            - Call by Reference: Pass address
            - Call by Name: Textual substitution
            
            **Symbol Table Organization:**
            - Linear list: O(n) lookup
            - Hash table: O(1) average
            - Tree: O(log n) lookup
            
            **GATE Focus:**
            - Activation record structure
            - Parameter passing mechanisms
            - Memory layout understanding`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=lHbIjjGVQog)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/runtime-environments-in-compiler-design/)',
            documentationSource: 'geeksforgeeks',
            order: 6,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== DIGITAL LOGIC ====================
      {
        name: 'Digital Logic',
        description: 'Boolean algebra, combinational and sequential circuits, number systems. GATE weightage: 6-8%.',
        syllabus: 'gate',
        icon: 'circuit',
        weightage: 7,
        topics: [
          {
            title: 'Number Systems and Codes',
            content: `Digital systems use various number representations.

            **Number Systems:**
            - Binary (Base 2): 0, 1
            - Octal (Base 8): 0-7
            - Decimal (Base 10): 0-9
            - Hexadecimal (Base 16): 0-9, A-F
            
            **Conversions:**
            - Binary ↔ Decimal: Positional notation
            - Binary ↔ Octal: Group 3 bits
            - Binary ↔ Hex: Group 4 bits
            
            **Signed Number Representation:**
            
            1. **Sign-Magnitude:**
               - MSB is sign (0 = +, 1 = -)
               - Range: -(2^(n-1)-1) to +(2^(n-1)-1)
               - Two zeros (+0, -0)
            
            2. **1's Complement:**
               - Negative: Invert all bits
               - Range: -(2^(n-1)-1) to +(2^(n-1)-1)
               - Two zeros
            
            3. **2's Complement:**
               - Negative: Invert + 1
               - Range: -2^(n-1) to +(2^(n-1)-1)
               - One zero, asymmetric
               - Most common in computers
            
            **Binary Codes:**
            - BCD (Binary Coded Decimal): 4 bits per digit
            - Excess-3: BCD + 3
            - Gray Code: Adjacent values differ by 1 bit
            - ASCII: 7-bit character code
            
            **Gray Code ↔ Binary:**
            - Gray to Binary: XOR from MSB
            - Binary to Gray: XOR adjacent bits
            
            **GATE Focus:**
            - Conversions
            - Range calculations
            - Overflow detection`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=LpuPe81bc2w)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/number-system-and-base-conversions/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Digital Circuits',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/117104055)',
                type: 'video_course'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 6,
            gateWeightage: 'medium'
          },
          {
            title: 'Boolean Algebra',
            content: `Boolean algebra is the mathematics of digital circuits.

            **Basic Operations:**
            - AND: A · B or AB
            - OR: A + B
            - NOT: A' or Ā
            
            **Basic Theorems:**
            - Identity: A + 0 = A, A · 1 = A
            - Null: A + 1 = 1, A · 0 = 0
            - Idempotent: A + A = A, A · A = A
            - Complement: A + A' = 1, A · A' = 0
            - Involution: (A')' = A
            
            **De Morgan's Theorems:**
            - (A + B)' = A' · B'
            - (A · B)' = A' + B'
            
            **Commutative, Associative, Distributive:**
            - A + B = B + A
            - A + (B + C) = (A + B) + C
            - A · (B + C) = A·B + A·C
            - A + B·C = (A+B) · (A+C)
            
            **Canonical Forms:**
            
            1. **Sum of Products (SOP) / Minterm:**
               - F = Σm(minterms where F=1)
               - Each minterm: All variables (ANDed)
            
            2. **Product of Sums (POS) / Maxterm:**
               - F = ΠM(maxterms where F=0)
               - Each maxterm: All variables (ORed)
            
            **Minterm ↔ Maxterm:**
            - m_i' = M_i
            - Σm(list) = ΠM(complement list)
            
            **GATE Focus:**
            - Simplification using theorems
            - Converting between forms
            - Finding complement`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=WW-NPtIzHwk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/boolean-algebra/)',
            documentationSource: 'geeksforgeeks',
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Logic Gate Minimization',
            content: `Minimization reduces gates needed to implement a function.

            **K-Map (Karnaugh Map):**
            - Visual method for minimization
            - Group adjacent 1s (or 0s for POS)
            - Groups must be power of 2
            - Groups can wrap around edges
            
            **K-Map Rules:**
            - Larger groups = simpler terms
            - Cover all 1s with minimum groups
            - Groups can overlap
            - Don't cares (X) can be 0 or 1
            
            **2-Variable K-Map:**
            \`\`\`
                B=0  B=1
            A=0 [ m0 | m1 ]
            A=1 [ m2 | m3 ]
            \`\`\`
            
            **3-Variable K-Map:**
            \`\`\`
                  BC=00 BC=01 BC=11 BC=10
            A=0 [  m0  | m1  | m3  | m2  ]
            A=1 [  m4  | m5  | m7  | m6  ]
            \`\`\`
            Note: Gray code order (00,01,11,10)
            
            **4-Variable K-Map:**
            \`\`\`
                    CD=00 CD=01 CD=11 CD=10
            AB=00 [  m0  | m1  | m3  | m2  ]
            AB=01 [  m4  | m5  | m7  | m6  ]
            AB=11 [ m12  | m13 | m15 | m14 ]
            AB=10 [  m8  | m9  | m11 | m10 ]
            \`\`\`
            
            **Quine-McCluskey Method:**
            - Tabular method for any number of variables
            - Find prime implicants
            - Select essential prime implicants
            - Cover remaining minterms
            
            **GATE Focus:**
            - K-map minimization
            - Prime implicants
            - Essential prime implicants`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=3vkMgTmieZI)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/k-mapkarnaugh-map/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'K-Map Solver',
                url: '[charlie-coleman.com](https://www.charlie-coleman.com/experiments/kmap/)',
                type: 'interactive'
              }
            ],
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'very_high'
          },
          {
            title: 'Combinational Circuits',
            content: `Combinational circuits have outputs dependent only on current inputs.

            **Basic Gates:**
            - AND, OR, NOT, NAND, NOR, XOR, XNOR
            - NAND and NOR are universal gates
            
            **Arithmetic Circuits:**
            
            1. **Half Adder:**
               - Sum = A ⊕ B
               - Carry = A · B
            
            2. **Full Adder:**
               - Sum = A ⊕ B ⊕ Cin
               - Cout = AB + Cin(A ⊕ B)
            
            3. **Ripple Carry Adder:**
               - Chain of full adders
               - Slow due to carry propagation
            
            4. **Carry Look-Ahead Adder:**
               - Generate: Gi = Ai · Bi
               - Propagate: Pi = Ai ⊕ Bi
               - Faster carry computation
            
            5. **Subtractor:**
               - Use 2's complement: A - B = A + B' + 1
            
            **Data Selectors:**
            
            1. **Multiplexer (MUX):**
               - 2^n inputs, n select lines, 1 output
               - Can implement any function
               - 2:1 MUX: Y = S'·I0 + S·I1
            
            2. **Demultiplexer (DEMUX):**
               - 1 input, n select lines, 2^n outputs
            
            **Encoders/Decoders:**
            
            1. **Encoder:**
               - 2^n inputs, n outputs
               - Priority encoder handles multiple inputs
            
            2. **Decoder:**
               - n inputs, 2^n outputs
               - Exactly one output high
               - Can implement any function
            
            **Comparator:**
            - Compares two n-bit numbers
            - Outputs: A>B, A=B, A<B
            
            **GATE Focus:**
            - Implementing functions using MUX/Decoder
            - Adder/Subtractor design
            - Gate count calculations`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=M0mx8S05v60)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/combinational-circuits/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Logic Circuit Simulator',
                url: '[logic.ly](https://logic.ly/demo/)',
                type: 'interactive'
              }
            ],
            order: 4,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'high'
          },
          {
            title: 'Sequential Circuits',
            content: `Sequential circuits have memory and outputs depend on current and past inputs.

            **Flip-Flops:**
            
            1. **SR Flip-Flop:**
               - S=1: Set (Q=1)
               - R=1: Reset (Q=0)
               - S=R=1: Invalid
            
            2. **JK Flip-Flop:**
               - Like SR but J=K=1 toggles
               - No invalid state
            
            3. **D Flip-Flop:**
               - Q(next) = D
               - Data/Delay flip-flop
            
            4. **T Flip-Flop:**
               - T=1: Toggle
               - T=0: Hold
            
            **Triggering:**
            - Level triggered (latch)
            - Edge triggered (flip-flop)
               - Positive edge: Rising
               - Negative edge: Falling
            
            **Excitation Tables:**
            - Q(present) → Q(next): Required inputs
            - Used for counter design
            
            **Counters:**
            
            1. **Asynchronous (Ripple):**
               - Clock to first FF only
               - Each FF triggers next
               - Slower, simpler
            
            2. **Synchronous:**
               - Common clock to all FFs
               - Faster, more complex
            
            **Counter Design:**
            - State table
            - Excitation table for chosen FF
            - K-map for FF inputs
            
            **Registers:**
            - Parallel load register
            - Shift register (SISO, SIPO, PISO, PIPO)
            
            **State Machines:**
            - Mealy: Output depends on state and input
            - Moore: Output depends only on state
            
            **State Diagram → Circuit:**
            1. Draw state diagram
            2. Create state table
            3. Assign state codes
            4. Derive FF inputs
            5. Draw circuit
            
            **GATE Focus:**
            - Counter design
            - FF conversions
            - State machine analysis`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=6SFcFVQ7rFY)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-of-sequential-circuits/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Flip-Flop Simulator',
                url: '[circuitverse.org](https://circuitverse.org/)',
                type: 'interactive'
              }
            ],
            order: 5,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          }
        ]
      },

      // ==================== DISCRETE MATHEMATICS ====================
      {
        name: 'Discrete Mathematics',
        description: 'Mathematical foundations for CS including logic, sets, relations, functions, combinatorics, and graph theory. GATE weightage: 8-10%.',
        syllabus: 'gate',
        icon: 'calculator',
        weightage: 9,
        topics: [
          {
            title: 'Propositional Logic',
            content: `Propositional logic deals with statements that are true or false.

            **Propositions:**
            - Declarative statement with truth value
            - p, q, r denote propositions
            
            **Logical Connectives:**
            - Negation (¬): NOT
            - Conjunction (∧): AND
            - Disjunction (∨): OR
            - Implication (→): If...then
            - Biconditional (↔): If and only if
            
            **Truth Tables:**
            - ¬p: True when p is false
            - p ∧ q: True when both true
            - p ∨ q: True when at least one true
            - p → q: False only when p true, q false
            - p ↔ q: True when both same
            
            **Logical Equivalences:**
            - Identity: p ∧ T ≡ p, p ∨ F ≡ p
            - Domination: p ∨ T ≡ T, p ∧ F ≡ F
            - Idempotent: p ∨ p ≡ p, p ∧ p ≡ p
            - Double negation: ¬(¬p) ≡ p
            - Commutative, Associative, Distributive
            - De Morgan's: ¬(p ∧ q) ≡ ¬p ∨ ¬q
            - Absorption: p ∨ (p ∧ q) ≡ p
            
            **Implication Equivalences:**
            - p → q ≡ ¬p ∨ q
            - p → q ≡ ¬q → ¬p (contrapositive)
            - p ↔ q ≡ (p → q) ∧ (q → p)
            
            **Tautology, Contradiction, Contingency:**
            - Tautology: Always true
            - Contradiction: Always false
            - Contingency: Neither
            
            **Arguments and Validity:**
            - Valid: True premises guarantee true conclusion
            - Modus Ponens: p, p → q ⊢ q
            - Modus Tollens: ¬q, p → q ⊢ ¬p
            - Hypothetical Syllogism: p → q, q → r ⊢ p → r
            
            **GATE Focus:**
            - Equivalence checking
            - Validity of arguments
            - CNF/DNF conversion`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=itrXYg41-V0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/propositional-logic/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Discrete Mathematics',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/111104026)',
                type: 'video_course'
              },
              {
                title: 'Logic Calculator',
                url: '[erpelstolz.at](https://www.erpelstolz.at/gateway/TrssAssistant.html)',
                type: 'tool'
              }
            ],
            order: 1,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Predicate Logic',
            content: `Predicate logic extends propositional logic with quantifiers.

            **Predicates:**
            - P(x): Statement about variable x
            - Domain: Set of possible values for variable
            
            **Quantifiers:**
            - Universal (∀): "For all"
            - Existential (∃): "There exists"
            
            **Quantifier Negations:**
            - ¬(∀x P(x)) ≡ ∃x ¬P(x)
            - ¬(∃x P(x)) ≡ ∀x ¬P(x)
            
            **Nested Quantifiers:**
            - ∀x∀y ≡ ∀y∀x
            - ∃x∃y ≡ ∃y∃x
            - ∀x∃y ≢ ∃y∀x (order matters)
            
            **Translating Statements:**
            - "All X are Y": ∀x (X(x) → Y(x))
            - "Some X are Y": ∃x (X(x) ∧ Y(x))
            - "No X is Y": ∀x (X(x) → ¬Y(x)) or ¬∃x (X(x) ∧ Y(x))
            
            **Rules of Inference:**
            - Universal Instantiation: ∀x P(x) ⊢ P(c)
            - Universal Generalization: P(c) for arbitrary c ⊢ ∀x P(x)
            - Existential Instantiation: ∃x P(x) ⊢ P(c) for some c
            - Existential Generalization: P(c) ⊢ ∃x P(x)
            
            **Satisfiability:**
            - Satisfiable: Some assignment makes it true
            - Valid: All assignments make it true
            - Unsatisfiable: No assignment makes it true
            
            **GATE Focus:**
            - Negating quantified statements
            - Translating English to logic
            - Proving validity`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=gyoqX0W-NH4)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/predicate-logic/)',
            documentationSource: 'geeksforgeeks',
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 8,
            gateWeightage: 'high'
          },
          {
            title: 'Sets, Relations, and Functions',
            content: `Fundamental concepts for mathematical structures.

            **Set Operations:**
            - Union: A ∪ B
            - Intersection: A ∩ B
            - Difference: A - B
            - Complement: A'
            - Symmetric Difference: A ⊕ B = (A - B) ∪ (B - A)
            
            **Set Identities:**
            - De Morgan's: (A ∪ B)' = A' ∩ B'
            - Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)
            
            **Power Set:**
            - P(A) = Set of all subsets
            - |P(A)| = 2^|A|
            
            **Cartesian Product:**
            - A × B = {(a,b) | a ∈ A, b ∈ B}
            - |A × B| = |A| × |B|
            
            **Relations:**
            - Subset of A × B
            - R: A → B
            
            **Relation Properties:**
            - Reflexive: (a,a) ∈ R for all a
            - Symmetric: (a,b) ∈ R → (b,a) ∈ R
            - Transitive: (a,b) ∈ R ∧ (b,c) ∈ R → (a,c) ∈ R
            - Antisymmetric: (a,b) ∈ R ∧ (b,a) ∈ R → a = b
            
            **Special Relations:**
            - Equivalence: Reflexive + Symmetric + Transitive
            - Partial Order: Reflexive + Antisymmetric + Transitive
            - Total Order: Partial order + any two elements comparable
            
            **Functions:**
            - f: A → B, each element of A maps to exactly one in B
            - Domain, Codomain, Range
            
            **Function Types:**
            - Injective (One-to-one): f(a) = f(b) → a = b
            - Surjective (Onto): Range = Codomain
            - Bijective: Injective + Surjective
            
            **Counting Functions:**
            - |A| = m, |B| = n
            - Total functions: n^m
            - Injective: n!/(n-m)! if n ≥ m
            - Surjective: n! × S(m,n) where S is Stirling number
            
            **GATE Focus:**
            - Relation property checking
            - Counting functions
            - Equivalence classes`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=tyDKR4FG3Yw)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/set-theory/)',
            documentationSource: 'geeksforgeeks',
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Combinatorics',
            content: `Combinatorics deals with counting and arrangements.

            **Basic Counting Principles:**
            - Addition: |A ∪ B| = |A| + |B| for disjoint sets
            - Multiplication: |A × B| = |A| × |B|
            
            **Permutations:**
            - P(n,r) = n!/(n-r)!
            - Ordered arrangements
            - With repetition: n^r
            
            **Combinations:**
            - C(n,r) = n!/[r!(n-r)!]
            - Unordered selections
            - With repetition: C(n+r-1,r)
            
            **Binomial Theorem:**
            - (x+y)^n = Σ C(n,k) x^k y^(n-k)
            - C(n,0) + C(n,1) + ... + C(n,n) = 2^n
            
            **Pascal's Identity:**
            - C(n,r) = C(n-1,r-1) + C(n-1,r)
            
            **Inclusion-Exclusion:**
            - |A ∪ B| = |A| + |B| - |A ∩ B|
            - |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |B ∩ C| - |A ∩ C| + |A ∩ B ∩ C|
            
            **Pigeonhole Principle:**
            - n+1 pigeons, n holes → some hole has ≥ 2 pigeons
            - Generalized: kn+1 pigeons, n holes → some hole has ≥ k+1
            
            **Derangements:**
            - Permutations with no element in original position
            - D_n = n! × (1 - 1/1! + 1/2! - 1/3! + ... + (-1)^n/n!)
            
            **Stars and Bars:**
            - Distributing n identical items into r groups
            - C(n+r-1, r-1)
            
            **GATE Focus:**
            - Distribution problems
            - Counting with restrictions
            - Inclusion-exclusion applications`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=8DRQO_xLDqc)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/combinatorics-gq/)',
            documentationSource: 'geeksforgeeks',
            order: 4,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'very_high'
          },
          {
            title: 'Graph Theory',
            content: `Graph theory studies graphs - vertices connected by edges.

            **Graph Types:**
            - Simple Graph: No loops, no multiple edges
            - Multigraph: Multiple edges allowed
            - Pseudograph: Loops allowed
            - Directed Graph (Digraph)
            - Weighted Graph
            
            **Graph Terminology:**
            - Degree: Number of edges incident to vertex
            - In-degree, Out-degree (for digraphs)
            - Path: Sequence of adjacent vertices
            - Cycle: Path that starts and ends at same vertex
            - Connected: Path exists between any two vertices
            
            **Handshaking Lemma:**
            - Sum of degrees = 2 × |E|
            - Number of odd-degree vertices is even
            
            **Special Graphs:**
            - Complete Graph K_n: All pairs connected, C(n,2) edges
            - Bipartite: Vertices can be split into two independent sets
            - Complete Bipartite K_{m,n}: m×n edges
            - Tree: Connected acyclic graph, n-1 edges
            
            **Graph Representations:**
            - Adjacency Matrix: O(V²) space
            - Adjacency List: O(V+E) space
            
            **Euler Path/Circuit:**
            - Euler Path: Visit each edge exactly once
              - Exists iff exactly 0 or 2 vertices have odd degree
            - Euler Circuit: Euler path starting and ending at same vertex
              - Exists iff all vertices have even degree
            
            **Hamiltonian Path/Cycle:**
            - Visit each vertex exactly once
            - NP-complete to determine existence
            
            **Graph Coloring:**
            - Chromatic number χ(G): Minimum colors to color vertices
            - Adjacent vertices must have different colors
            - χ(K_n) = n
            - χ(bipartite) = 2
            
            **Planar Graphs:**
            - Can be drawn without edge crossings
            - Euler's formula: V - E + F = 2
            - K_5 and K_{3,3} are not planar
            - E ≤ 3V - 6 for V ≥ 3
            
            **Trees:**
            - Connected acyclic graph
            - n vertices, n-1 edges
            - Unique path between any two vertices
            - Spanning tree: Subgraph that is a tree including all vertices
            
            **GATE Focus:**
            - Euler/Hamiltonian determination
            - Chromatic number
            - Planar graph verification
            - Tree properties`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=LFKZLXVO-Dg)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/graph-theory-tutorial/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Graph Editor',
                url: '[csacademy.com](https://csacademy.com/app/graph_editor/)',
                type: 'interactive'
              }
            ],
            order: 5,
            difficulty: 'intermediate',
            estimatedHours: 14,
            gateWeightage: 'very_high'
          },
          {
            title: 'Recurrence Relations',
            content: `Recurrence relations define sequences recursively.

            **Definition:**
            - a_n in terms of previous terms
            - Example: Fibonacci: F_n = F_{n-1} + F_{n-2}
            
            **Linear Recurrences:**
            - Homogeneous: a_n = c₁a_{n-1} + c₂a_{n-2} + ...
            - Non-homogeneous: ... + f(n)
            
            **Solving Homogeneous Recurrences:**
            1. Find characteristic equation
            2. Find roots
            3. Form general solution
            
            **Characteristic Equation:**
            - a_n = c₁a_{n-1} + c₂a_{n-2}
            - x² = c₁x + c₂
            - x² - c₁x - c₂ = 0
            
            **Solution Forms:**
            - Distinct roots r₁, r₂: a_n = A×r₁ⁿ + B×r₂ⁿ
            - Repeated root r: a_n = (A + Bn)×rⁿ
            
            **Non-Homogeneous:**
            - Find homogeneous solution
            - Find particular solution
            - General = Homogeneous + Particular
            
            **Master Theorem:**
            - T(n) = aT(n/b) + f(n)
            - Compare f(n) with n^(log_b(a))
            
            **Master Theorem Cases:**
            1. f(n) = O(n^(log_b(a)-ε)): T(n) = Θ(n^log_b(a))
            2. f(n) = Θ(n^log_b(a)): T(n) = Θ(n^log_b(a) × log n)
            3. f(n) = Ω(n^(log_b(a)+ε)): T(n) = Θ(f(n))
            
            **Common Recurrences:**
            - T(n) = T(n-1) + 1 → O(n)
            - T(n) = T(n/2) + 1 → O(log n)
            - T(n) = 2T(n/2) + n → O(n log n)
            - T(n) = 2T(n/2) + 1 → O(n)
            
            **GATE Focus:**
            - Solving recurrences
            - Master theorem applications
            - Algorithm complexity analysis`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=4V30R3I1vLI)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/recurrence-relation/)',
            documentationSource: 'geeksforgeeks',
            order: 6,
            difficulty: 'advanced',
            estimatedHours: 10,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== COMPUTER ORGANIZATION & ARCHITECTURE ====================
      {
        name: 'Computer Organization & Architecture',
        description: 'Computer architecture, instruction sets, memory hierarchy, and I/O systems. GATE weightage: 8-10%.',
        syllabus: 'gate',
        icon: 'cpu',
        weightage: 9,
        topics: [
          {
            title: 'Basic Computer Organization',
            content: `Computer organization deals with hardware structure and implementation.

            **Computer Components:**
            - CPU (Central Processing Unit)
            - Memory (RAM, ROM, Cache)
            - I/O Devices
            - System Bus
            
            **CPU Components:**
            - ALU (Arithmetic Logic Unit)
            - Control Unit
            - Registers
            - Program Counter (PC)
            - Instruction Register (IR)
            - Memory Address Register (MAR)
            - Memory Data Register (MDR)
            
            **Instruction Cycle:**
            1. Fetch: Get instruction from memory
            2. Decode: Interpret instruction
            3. Execute: Perform operation
            4. Memory Access (if needed)
            5. Write Back (if needed)
            
            **Bus System:**
            - Address Bus: Memory location (unidirectional)
            - Data Bus: Data transfer (bidirectional)
            - Control Bus: Control signals
            
            **Computer Architecture Types:**
            - Von Neumann: Single memory for data and instructions
            - Harvard: Separate memories
            
            **Performance Metrics:**
            - Clock Rate: Cycles per second (Hz)
            - CPI: Cycles Per Instruction
            - MIPS: Million Instructions Per Second
            - CPU Time = Instructions × CPI × Cycle Time
            
            **GATE Focus:**
            - CPU time calculations
            - Instruction cycle understanding`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=Ol8D69VKX2k)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'NPTEL - Computer Organization',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106103068)',
                type: 'video_course'
              },
              {
                title: 'Computer Organization and Design (Patterson & Hennessy)',
                url: '[elsevier.com](https://www.elsevier.com/books/computer-organization-and-design/patterson/978-0-12-820109-1)',
                type: 'book'
              }
            ],
            order: 1,
            difficulty: 'beginner',
            estimatedHours: 8,
            gateWeightage: 'medium'
          },
          {
            title: 'Instruction Set Architecture',
            content: `ISA defines the interface between hardware and software.

            **Instruction Types:**
            - Data Transfer: LOAD, STORE, MOV
            - Arithmetic: ADD, SUB, MUL, DIV
            - Logical: AND, OR, NOT, XOR
            - Control: JMP, CALL, RET, BRANCH
            - I/O: IN, OUT
            
            **Instruction Format:**
            - Opcode: Operation to perform
            - Operands: Source and destination
            
            **Addressing Modes:**
            
            1. **Immediate:** Operand in instruction
               - ADD R1, #5 (R1 = R1 + 5)
            
            2. **Register:** Operand in register
               - ADD R1, R2 (R1 = R1 + R2)
            
            3. **Direct:** Address in instruction
               - LOAD R1, [1000] (R1 = M[1000])
            
            4. **Indirect:** Address in memory/register
               - LOAD R1, @R2 (R1 = M[R2])
            
            5. **Indexed:** Base + Offset
               - LOAD R1, [R2 + 100]
            
            6. **Base-Register:** Base register + displacement
               - LOAD R1, 100(R2)
            
            7. **PC-Relative:** PC + Offset
               - Used for branches
            
            **Instruction Set Types:**
            - CISC: Complex instructions, many addressing modes
            - RISC: Simple instructions, load/store architecture
            
            **CISC vs RISC:**
            | CISC | RISC |
            |------|------|
            | Variable length | Fixed length |
            | Many addressing modes | Few addressing modes |
            | Memory operands | Load/Store only |
            | Complex instructions | Simple instructions |
            | Microcode | Hardwired |
            
            **GATE Focus:**
            - Effective address calculation
            - Instruction format design
            - CPI calculation with addressing modes`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=kq2Gjv_pPe8)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/introduction-to-instruction-set-architecture/)',
            documentationSource: 'geeksforgeeks',
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          },
          {
            title: 'Pipelining',
            content: `Pipelining overlaps instruction execution for better throughput.

            **Classic 5-Stage Pipeline:**
            1. IF: Instruction Fetch
            2. ID: Instruction Decode
            3. EX: Execute
            4. MEM: Memory Access
            5. WB: Write Back
            
            **Pipeline Performance:**
            - Ideal speedup = Number of stages
            - Throughput = 1 instruction per cycle (ideally)
            - Latency = Time for single instruction
            
            **Pipeline Hazards:**
            
            1. **Structural Hazards:**
               - Resource conflict
               - Solution: Duplicate resources
            
            2. **Data Hazards:**
               - RAW (Read After Write): True dependency
               - WAR (Write After Read): Anti-dependency
               - WAW (Write After Write): Output dependency
               
               **Solutions:**
               - Stalling (bubbles)
               - Forwarding/Bypassing
               - Compiler scheduling
            
            3. **Control Hazards:**
               - Branch instructions
               
               **Solutions:**
               - Stall until branch resolved
               - Branch prediction
               - Delayed branch
            
            **Branch Prediction:**
            - Static: Predict always taken/not taken
            - Dynamic: Use history
              - 1-bit predictor
              - 2-bit predictor (saturating counter)
            
            **Pipeline Calculations:**
            - Cycles = k + (n-1) for n instructions, k stages
            - CPI = 1 + stall cycles per instruction
            - Speedup = Time_unpipelined / Time_pipelined
            
            **GATE Focus:**
            - Hazard identification
            - Stall calculation
            - Speedup with hazards`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=eVRdfl4zxfI)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/computer-organization-and-architecture-pipelining/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Pipeline Simulator',
                url: '[visualcpu.com](https://visualcpu.com/)',
                type: 'interactive'
              }
            ],
            order: 3,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Memory Hierarchy',
            content: `Memory hierarchy balances speed, size, and cost.

            **Memory Hierarchy (fastest to slowest):**
            1. Registers
            2. L1 Cache (per core)
            3. L2 Cache
            4. L3 Cache (shared)
            5. Main Memory (RAM)
            6. Secondary Storage (SSD/HDD)
            
            **Cache Organization:**
            - Block/Line: Unit of transfer
            - Set: Group of lines
            - Tag: Identifies block in cache
            
            **Cache Mapping:**
            
            1. **Direct Mapped:**
               - Block i → Line (i mod n)
               - Simple, but conflict misses
               - Address: Tag | Index | Offset
            
            2. **Fully Associative:**
               - Block can go anywhere
               - No conflict misses
               - Expensive (compare all tags)
               - Address: Tag | Offset
            
            3. **Set Associative:**
               - Block i → Set (i mod sets)
               - Can go to any line in set
               - k-way: k lines per set
               - Address: Tag | Set Index | Offset
            
            **Cache Performance:**
            - Hit Rate = Hits / Total accesses
            - Miss Rate = 1 - Hit Rate
            - AMAT = Hit time + Miss rate × Miss penalty
            
            **Miss Types (3 Cs):**
            - Compulsory: First access to block
            - Capacity: Cache too small
            - Conflict: Multiple blocks map to same line
            
            **Replacement Policies:**
            - LRU (Least Recently Used)
            - FIFO
            - Random
            - LFU (Least Frequently Used)
            
            **Write Policies:**
            - Write Through: Write to cache and memory
            - Write Back: Write to cache, update memory later
            - Write Allocate: On miss, load block then write
            - No Write Allocate: On miss, write directly to memory
            
            **GATE Focus:**
            - Cache size calculations
            - AMAT calculations
            - Tag, index, offset bits`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=cFvT8a9ZFZM)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/cache-memory-in-computer-organization/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Cache Simulator',
                url: '[ecs.umass.edu](https://www.ecs.umass.edu/ece/koren/architecture/Cache/frame1.htm)',
                type: 'interactive'
              }
            ],
            order: 4,
            difficulty: 'advanced',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'I/O Organization',
            content: `I/O systems handle communication with external devices.

            **I/O Techniques:**
            
            1. **Programmed I/O:**
               - CPU controls entire transfer
               - Polling (busy waiting)
               - Simple but wastes CPU time
            
            2. **Interrupt-Driven I/O:**
               - Device interrupts CPU when ready
               - CPU free between interrupts
               - Overhead for each byte/word
            
            3. **DMA (Direct Memory Access):**
               - DMA controller handles transfer
               - CPU initiates, DMA completes
               - Cycle stealing or burst mode
               - Best for large transfers
            
            **DMA Modes:**
            - Burst Mode: DMA has exclusive bus
            - Cycle Stealing: DMA and CPU alternate
            - Transparent: DMA uses idle cycles
            
            **Interrupt Handling:**
            1. Device raises interrupt
            2. CPU completes current instruction
            3. CPU saves state (PC, registers)
            4. CPU jumps to ISR (Interrupt Service Routine)
            5. ISR handles device
            6. CPU restores state
            7. Continue execution
            
            **I/O Interfaces:**
            - Parallel: Multiple bits simultaneously
            - Serial: One bit at a time (USB, SATA)
            
            **Bus Arbitration:**
            - Centralized: Central arbiter
            - Distributed: Devices negotiate
            - Priority schemes: Fixed, rotating
            
            **GATE Focus:**
            - I/O time calculations
            - DMA vs Interrupt comparison
            - Bus bandwidth calculations`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=K8YfZLfgUB0)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/io-interface-interrupt-dma-mode/)',
            documentationSource: 'geeksforgeeks',
            order: 5,
            difficulty: 'intermediate',
            estimatedHours: 10,
            gateWeightage: 'high'
          }
        ]
      },

      // ==================== ENGINEERING MATHEMATICS ====================
      {
        name: 'Engineering Mathematics',
        description: 'Mathematical foundations including linear algebra, probability, calculus, and numerical methods. GATE weightage: 13-15%.',
        syllabus: 'gate',
        icon: 'calculator',
        weightage: 14,
        topics: [
          {
            title: 'Linear Algebra',
            content: `Linear algebra deals with vectors, matrices, and linear systems.

            **Matrix Operations:**
            - Addition, Subtraction, Multiplication
            - Transpose: (AB)ᵀ = BᵀAᵀ
            - Inverse: AA⁻¹ = I
            
            **Determinant:**
            - |A| = Σ aᵢⱼ Cᵢⱼ (cofactor expansion)
            - |AB| = |A||B|
            - |Aᵀ| = |A|
            - |A⁻¹| = 1/|A|
            - |kA| = kⁿ|A| for n×n matrix
            
            **Matrix Inverse:**
            - A⁻¹ = adj(A)/|A|
            - (AB)⁻¹ = B⁻¹A⁻¹
            - Exists iff |A| ≠ 0
            
            **Rank:**
            - Maximum number of linearly independent rows/columns
            - rank(A) = rank(Aᵀ)
            - rank(AB) ≤ min(rank(A), rank(B))
            
            **System of Linear Equations:**
            - Ax = b
            - Consistent: rank(A) = rank([A|b])
            - Unique solution: rank(A) = n
            - Infinite solutions: rank(A) < n
            
            **Eigenvalues and Eigenvectors:**
            - Av = λv
            - Characteristic equation: |A - λI| = 0
            - Sum of eigenvalues = trace(A)
            - Product of eigenvalues = |A|
            
            **Properties of Eigenvalues:**
            - λ(A⁻¹) = 1/λ(A)
            - λ(Aⁿ) = [λ(A)]ⁿ
            - λ(A + kI) = λ(A) + k
            
            **Cayley-Hamilton Theorem:**
            - Every matrix satisfies its characteristic equation
            
            **GATE Focus:**
            - Eigenvalue calculations
            - Rank determination
            - System consistency`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=fNk_zzaMoSs)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/engineering-mathematics-linear-algebra/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'MIT OCW - Linear Algebra',
                url: '[ocw.mit.edu](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/)',
                type: 'course'
              },
              {
                title: '3Blue1Brown - Essence of Linear Algebra',
                url: '[youtube.com](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)',
                type: 'video'
              },
              {
                title: 'Matrix Calculator',
                url: '[matrixcalc.org](https://matrixcalc.org/)',
                type: 'tool'
              }
            ],
            order: 1,
            difficulty: 'intermediate',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Probability and Statistics',
            content: `Probability theory quantifies uncertainty.

            **Basic Probability:**
            - P(A) = Favorable outcomes / Total outcomes
            - 0 ≤ P(A) ≤ 1
            - P(A') = 1 - P(A)
            
            **Addition Rule:**
            - P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
            - For mutually exclusive: P(A ∪ B) = P(A) + P(B)
            
            **Conditional Probability:**
            - P(A|B) = P(A ∩ B) / P(B)
            
            **Independence:**
            - P(A ∩ B) = P(A) × P(B)
            - P(A|B) = P(A)
            
            **Bayes' Theorem:**
            - P(A|B) = P(B|A) × P(A) / P(B)
            
            **Random Variables:**
            - Discrete: PMF P(X = x)
            - Continuous: PDF f(x), P(a < X < b) = ∫f(x)dx
            
            **Expected Value and Variance:**
            - E[X] = Σ xP(X=x) or ∫xf(x)dx
            - Var(X) = E[X²] - (E[X])²
            - σ = √Var(X) (standard deviation)
            
            **Common Distributions:**
            
            **Discrete:**
            - Bernoulli: P(X=1) = p, P(X=0) = 1-p
            - Binomial: P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ
              - E[X] = np, Var(X) = np(1-p)
            - Poisson: P(X=k) = e⁻λλᵏ/k!
              - E[X] = Var(X) = λ
            - Geometric: P(X=k) = p(1-p)ᵏ⁻¹
              - E[X] = 1/p
            
            **Continuous:**
            - Uniform: f(x) = 1/(b-a)
              - E[X] = (a+b)/2, Var(X) = (b-a)²/12
            - Exponential: f(x) = λe⁻λˣ
              - E[X] = 1/λ, Var(X) = 1/λ²
            - Normal: f(x) = (1/σ√2π)e^(-(x-μ)²/2σ²)
              - E[X] = μ, Var(X) = σ²
            
            **GATE Focus:**
            - Conditional probability
            - Distribution calculations
            - Expected value problems`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=uzkc-qNVoOk)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/engineering-mathematics-probability/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: 'Khan Academy - Probability',
                url: '[khanacademy.org](https://www.khanacademy.org/math/statistics-probability/probability-library)',
                type: 'course'
              },
              {
                title: 'Seeing Theory - Visual Probability',
                url: '[seeing-theory.brown.edu](https://seeing-theory.brown.edu/)',
                type: 'interactive'
              }
            ],
            order: 2,
            difficulty: 'intermediate',
            estimatedHours: 15,
            gateWeightage: 'very_high'
          },
          {
            title: 'Calculus',
            content: `Calculus deals with continuous change.

            **Limits:**
            - lim(x→a) f(x) = L
            - L'Hôpital's Rule: lim f(x)/g(x) = lim f'(x)/g'(x) for 0/0 or ∞/∞
            
            **Derivatives:**
            - d/dx(xⁿ) = nxⁿ⁻¹
            - d/dx(eˣ) = eˣ
            - d/dx(ln x) = 1/x
            - d/dx(sin x) = cos x
            - d/dx(cos x) = -sin x
            
            **Derivative Rules:**
            - Sum: (f + g)' = f' + g'
            - Product: (fg)' = f'g + fg'
            - Quotient: (f/g)' = (f'g - fg')/g²
            - Chain: (f(g(x)))' = f'(g(x)) × g'(x)
            
            **Applications:**
            - Maxima/Minima: f'(x) = 0
            - Rate of change
            - Taylor Series: f(x) = Σ f⁽ⁿ⁾(a)(x-a)ⁿ/n!
            
            **Integration:**
            - ∫xⁿdx = xⁿ⁺¹/(n+1) + C
            - ∫eˣdx = eˣ + C
            - ∫1/x dx = ln|x| + C
            
            **Integration Techniques:**
            - Substitution
            - Integration by parts: ∫udv = uv - ∫vdu
            - Partial fractions
            
            **Definite Integrals:**
            - ∫ₐᵇ f(x)dx = F(b) - F(a)
            - Area under curve
            
            **Multiple Integrals:**
            - Double integral: ∫∫ f(x,y) dA
            - Change of order
            
            **GATE Focus:**
            - Limits and continuity
            - Maxima/minima problems
            - Integration techniques`,
            videoUrl: '[youtube.com](https://www.youtube.com/watch?v=WUvTyaaNkzM)',
            documentationUrl: '[geeksforgeeks.org](https://www.geeksforgeeks.org/engineering-mathematics-calculus/)',
            documentationSource: 'geeksforgeeks',
            additionalResources: [
              {
                title: '3Blue1Brown - Essence of Calculus',
                url: '[youtube.com](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr)',
                type: 'video'
              },
              {
                title: 'Wolfram Alpha',
                url: '[wolframalpha.com](https://www.wolframalpha.com/)',
                type: 'tool'
              }
            ],
            order: 3,
            difficulty: 'intermediate',
            estimatedHours: 12,
            gateWeightage: 'high'
          }
        ]
      }
    ]);

    for (const subject of subjects) {
      subject.totalTopics = subject.topics.length;
      await subject.save();
    }

    console.log(`✅ Created ${subjects.length} comprehensive subjects`);

    // ============================================================
    // COMPREHENSIVE ROADMAPS
    // ============================================================

    const roadmaps = await Roadmap.insertMany([
      {
        title: 'GATE CS Complete Preparation Roadmap',
        description: 'A comprehensive 6-month roadmap covering all GATE CS subjects with strategic planning and resource allocation.',
        category: 'gate_preparation',
        level: 'intermediate',
        nodes: [
          {
            title: 'Phase 1: Foundation (Month 1-2)',
            description: 'Build strong fundamentals in core subjects',
            level: 'beginner',
            order: 1,
            estimatedTime: '8 weeks',
            skills: [
              'Data Structures basics',
              'Algorithm analysis',
              'Discrete Mathematics',
              'Digital Logic',
              'C/C++ Programming'
            ],
            resources: [
              {
                title: 'NPTEL - Data Structures',
                url: '[nptel.ac.in](https://nptel.ac.in/courses/106102064)',
                type: 'video'
              },
              {
                title: 'GeeksforGeeks - DS Tutorial',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/data-structures/)',
                type: 'article'
              }
            ]
          },
          {
            title: 'Phase 2: Core Subjects (Month 3-4)',
            description: 'Master DBMS, OS, CN, and TOC',
            level: 'intermediate',
            order: 2,
            estimatedTime: '8 weeks',
            skills: [
              'Operating Systems concepts',
              'Database Management',
              'Computer Networks',
              'Theory of Computation',
              'SQL and Relational Algebra'
            ],
            resources: [
              {
                title: 'OSTEP Book',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/)',
                type: 'book'
              },
              {
                title: 'Kurose & Ross - Networking',
                url: '[gaia.cs.umass.edu](https://gaia.cs.umass.edu/kurose_ross/index.php)',
                type: 'book'
              }
            ]
          },
          {
            title: 'Phase 3: Advanced Topics (Month 5)',
            description: 'Complete COA, Compiler Design, and advanced algorithms',
            level: 'advanced',
            order: 3,
            estimatedTime: '4 weeks',
            skills: [
              'Computer Organization',
              'Compiler Design',
              'Advanced Algorithms',
              'Dynamic Programming',
              'Graph Algorithms'
            ],
            resources: [
              {
                title: 'Patterson & Hennessy - COA',
                url: '[elsevier.com](https://www.elsevier.com/books/computer-organization-and-design/patterson/978-0-12-820109-1)',
                type: 'book'
              }
            ]
          },
          {
            title: 'Phase 4: Practice & Revision (Month 6)',
            description: 'Intensive practice and revision',
            level: 'advanced',
            order: 4,
            estimatedTime: '4 weeks',
            skills: [
              'Previous year questions',
              'Mock tests',
              'Time management',
              'Quick revision',
              'Weak area focus'
            ],
            resources: [
              {
                title: 'GATE Overflow',
                url: '[gateoverflow.in](https://gateoverflow.in/)',
                type: 'practice'
              },
              {
                title: 'Previous Year Papers',
                url: '[gate.iitk.ac.in](https://gate.iitk.ac.in/GATE2024/)',
                type: 'practice'
              }
            ]
          }
        ],
        totalEstimatedTime: '24 weeks',
        difficulty: 'hard'
      },
      {
        title: 'Data Structures & Algorithms Mastery',
        description: 'Complete DSA roadmap from basics to advanced problem solving for GATE and placements.',
        category: 'data_structures',
        level: 'intermediate',
        subject: subjects[0]._id,
        nodes: [
          {
            title: 'Foundation',
            description: 'Arrays, Strings, and complexity analysis',
            level: 'beginner',
            order: 1,
            estimatedTime: '2 weeks',
            skills: ['Arrays', 'Strings', 'Time Complexity', 'Space Complexity', 'Big O notation'],
            resources: [
              {
                title: 'Big O Cheat Sheet',
                url: '[bigocheatsheet.com](https://www.bigocheatsheet.com/)',
                type: 'reference'
              }
            ],
            videos: [
              {
                title: 'Abdul Bari - Algorithms',
                url: '[youtube.com](https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O)',
                platform: 'youtube',
                duration: '20+ hours'
              }
            ]
          },
          {
            title: 'Linear Data Structures',
            description: 'Stacks, Queues, Linked Lists',
            level: 'beginner',
            order: 2,
            estimatedTime: '2 weeks',
            skills: ['Stack operations', 'Queue types', 'Linked List variants', 'Applications'],
            resources: [
              {
                title: 'Visualgo',
                url: '[visualgo.net](https://visualgo.net/en)',
                type: 'interactive'
              }
            ]
          },
          {
            title: 'Trees',
            description: 'Binary Trees, BST, AVL, Heaps',
            level: 'intermediate',
            order: 3,
            estimatedTime: '3 weeks',
            skills: ['Tree traversals', 'BST operations', 'Balancing', 'Heap operations'],
            resources: [
              {
                title: 'Tree Visualizer',
                url: '[cs.usfca.edu](https://www.cs.usfca.edu/~galles/visualization/BST.html)',
                type: 'interactive'
              }
            ]
          },
          {
            title: 'Graphs',
            description: 'Graph algorithms and applications',
            level: 'intermediate',
            order: 4,
            estimatedTime: '3 weeks',
            skills: ['BFS', 'DFS', 'Shortest paths', 'MST', 'Topological sort'],
            resources: [
              {
                title: 'Graph Algorithm Visualizer',
                url: '[visualgo.net](https://visualgo.net/en/graphds)',
                type: 'interactive'
              }
            ]
          },
          {
            title: 'Advanced Algorithms',
            description: 'DP, Greedy, Backtracking',
            level: 'advanced',
            order: 5,
            estimatedTime: '4 weeks',
            skills: ['Dynamic Programming', 'Greedy algorithms', 'Backtracking', 'Divide & Conquer'],
            resources: [
              {
                title: 'AtCoder DP Contest',
                url: '[atcoder.jp](https://atcoder.jp/contests/dp)',
                type: 'practice'
              }
            ]
          }
        ],
        totalEstimatedTime: '14 weeks',
        difficulty: 'hard'
      },
      {
        title: 'Operating Systems Deep Dive',
        description: 'Comprehensive OS preparation covering all GATE topics with practical understanding.',
        category: 'operating_systems',
        level: 'intermediate',
        subject: subjects[2]._id,
        nodes: [
          {
            title: 'Process Management',
            description: 'Processes, Threads, Scheduling',
            level: 'intermediate',
            order: 1,
            estimatedTime: '2 weeks',
            skills: ['Process states', 'Scheduling algorithms', 'Context switching'],
            resources: [
              {
                title: 'OSTEP - Processes',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf)',
                type: 'pdf'
              }
            ]
          },
          {
            title: 'Synchronization',
            description: 'Process synchronization and deadlocks',
            level: 'advanced',
            order: 2,
            estimatedTime: '2 weeks',
            skills: ['Semaphores', 'Monitors', 'Deadlock handling', 'Banker\'s algorithm'],
            resources: [
              {
                title: 'OSTEP - Concurrency',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf)',
                type: 'pdf'
              }
            ]
          },
          {
            title: 'Memory Management',
            description: 'Paging, Virtual Memory, Page Replacement',
            level: 'advanced',
            order: 3,
            estimatedTime: '3 weeks',
            skills: ['Paging', 'Segmentation', 'Virtual memory', 'Page replacement'],
            resources: [
              {
                title: 'OSTEP - Virtual Memory',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf)',
                type: 'pdf'
              }
            ]
          },
          {
            title: 'File Systems & I/O',
            description: 'File systems and disk scheduling',
            level: 'intermediate',
            order: 4,
            estimatedTime: '1 week',
            skills: ['File allocation', 'Directory structures', 'Disk scheduling'],
            resources: [
              {
                title: 'OSTEP - File Systems',
                url: '[pages.cs.wisc.edu](https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf)',
                type: 'pdf'
              }
            ]
          }
        ],
        totalEstimatedTime: '8 weeks',
        difficulty: 'hard'
      },
      {
        title: 'DBMS Complete Guide',
        description: 'Master database concepts from ER modeling to transactions and indexing.',
        category: 'databases',
        level: 'intermediate',
        subject: subjects[3]._id,
        nodes: [
          {
            title: 'Database Fundamentals',
            description: 'ER Model and Relational Model',
            level: 'beginner',
            order: 1,
            estimatedTime: '2 weeks',
            skills: ['ER diagrams', 'Relational model', 'Keys', 'Constraints'],
            resources: [
              {
                title: 'Stanford DB Course',
                url: '[online.stanford.edu](https://online.stanford.edu/courses/soe-ydatabases-databases)',
                type: 'course'
              }
            ]
          },
          {
            title: 'SQL Mastery',
            description: 'SQL and Relational Algebra',
            level: 'intermediate',
            order: 2,
            estimatedTime: '2 weeks',
            skills: ['SQL queries', 'Joins', 'Subqueries', 'Relational algebra'],
            resources: [
              {
                title: 'SQLZoo',
                url: '[sqlzoo.net](https://sqlzoo.net/)',
                type: 'interactive'
              },
              {
                title: 'LeetCode SQL',
                url: '[leetcode.com](https://leetcode.com/problemset/database/)',
                type: 'practice'
              }
            ]
          },
          {
            title: 'Normalization',
            description: 'Database design and normal forms',
            level: 'advanced',
            order: 3,
            estimatedTime: '2 weeks',
            skills: ['Functional dependencies', '1NF to BCNF', 'Decomposition'],
            resources: [
              {
                title: 'Normalization Tutorial',
                url: '[geeksforgeeks.org](https://www.geeksforgeeks.org/database-normalization/)',
                type: 'article'
              }
            ]
          },
          {
            title: 'Transactions & Indexing',
            description: 'Concurrency control and indexing',
            level: 'advanced',
            order: 4,
            estimatedTime: '2 weeks',
            skills: ['ACID properties', 'Serializability', 'B+ Trees', 'Hashing'],
            resources: [
              {
                title: 'CMU Database Systems',
                url: '[15445.courses.cs.cmu.edu](https://15445.courses.cs.cmu.edu/)',
                type: 'course'
              }
            ]
          }
        ],
        totalEstimatedTime: '8 weeks',
        difficulty: 'medium'
      }
    ]);

    console.log(`✅ Created ${roadmaps.length} comprehensive roadmaps`);

    // ============================================================
    // TEST USERS
    // ============================================================

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const hashedPassword2 = await bcrypt.hash('demo123', salt);

    const testUser = await User.create({
      name: 'GATE Aspirant',
      email: 'test@example.com',
      password: hashedPassword,
      dashboard: {
        totalTests: 15,
        totalScore: 1150,
        averageScore: 76.67,
        bestScore: 92,
        testsSeries: [
          {
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            score: 68,
            totalQuestions: 100,
            correctAnswers: 68,
            testType: 'practice',
            subject: subjects[0]._id
          },
          {
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            score: 72,
            totalQuestions: 100,
            correctAnswers: 72,
            testType: 'practice',
            subject: subjects[1]._id
          },
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            score: 78,
            totalQuestions: 100,
            correctAnswers: 78,
            testType: 'practice',
            subject: subjects[2]._id
          },
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            score: 85,
            totalQuestions: 100,
            correctAnswers: 85,
            testType: 'grand'
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            score: 92,
            totalQuestions: 100,
            correctAnswers: 92,
            testType: 'grand'
          }
        ]
      }
    });

    const demoUser = await User.create({
      name: 'Demo Student',
      email: 'demo@example.com',
      password: hashedPassword2,
      dashboard: {
        totalTests: 3,
        totalScore: 210,
        averageScore: 70,
        bestScore: 75
      }
    });

    console.log('✅ Created 2 test users');

    // Associate roadmaps with test user
    for (const roadmap of roadmaps) {
      roadmap.createdBy = testUser._id;
      await roadmap.save();
    }

    console.log(`✅ Associated ${roadmaps.length} roadmaps with test user`);

    // Create some actual Test documents for the trend graph
    const testHistory = [
      { type: 'practice', complexity: 'easy', score: 8, accuracy: 80, timeTaken: 15, completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { type: 'practice', complexity: 'moderate', score: 7, accuracy: 70, timeTaken: 20, completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
      { type: 'practice', complexity: 'moderate', score: 9, accuracy: 90, timeTaken: 18, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { type: 'grand', complexity: 'hard', score: 65, accuracy: 65, timeTaken: 120, completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { type: 'practice', complexity: 'hard', score: 6, accuracy: 60, timeTaken: 25, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: 'practice', complexity: 'extreme', score: 5, accuracy: 50, timeTaken: 30, completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { type: 'grand', complexity: 'moderate', score: 88, accuracy: 88, timeTaken: 110, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ];

    for (const testData of testHistory) {
      await mongoose.model('Test').create({
        user: testUser._id,
        ...testData,
        questions: [{ question: 'Sample?', options: ['A', 'B'], correctAnswer: 0 }] // Minimal for history
      });
    }
    console.log('✅ Created 7 historical test records');

    // ============================================================
    // DASHBOARD STATS
    // ============================================================

    await DashboardStats.create({
      user: testUser._id,
      testStats: {
        totalTests: 15,
        practiceTests: 12,
        grandTests: 3,
        totalScore: 1150,
        averageScore: 76.67,
        bestScore: 92,
        worstScore: 62,
        accuracyRate: 77,
        complexityStats: {
          easy: 45,
          moderate: 65,
          hard: 38,
          extreme: 12
        }
      },
      subjectStats: subjects.map((subject, index) => ({
        subject: subject._id,
        testsAttempted: Math.floor(Math.random() * 5) + 2,
        averageScore: 70 + Math.floor(Math.random() * 20),
        bestScore: 85 + Math.floor(Math.random() * 15),
        accuracyRate: 70 + Math.floor(Math.random() * 20),
        topicsCompleted: Math.floor(subject.topics.length * 0.6),
        totalTopics: subject.topics.length,
        completionPercentage: 60 + Math.floor(Math.random() * 30)
      })),
      performanceTrend: [
        { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), averageScore: 65, testsCompleted: 2 },
        { date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), averageScore: 68, testsCompleted: 4 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), averageScore: 72, testsCompleted: 6 },
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), averageScore: 75, testsCompleted: 9 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), averageScore: 78, testsCompleted: 12 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), averageScore: 82, testsCompleted: 15 }
      ],
      learningStats: {
        totalHoursSpent: 45,
        averageSessionTime: 45,
        longestSession: 140,
        totalSessions: 60,
        currentStreak: 12,
        bestStreak: 15
      },
      weeklyGoals: {
        testsTarget: 5,
        testsCompleted: 3,
        topicsTarget: 10,
        topicsCompleted: 7,
        hoursTarget: 20,
        hoursCompleted: 14
      }
    });

    console.log('✅ Created comprehensive dashboard stats');

    // ============================================================
    // SUMMARY
    // ============================================================

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));

    console.log('\n📊 SEEDED DATA SUMMARY:');
    console.log(`   • ${subjects.length} Subjects with ${subjects.reduce((acc, s) => acc + s.topics.length, 0)} Topics`);
    console.log(`   • ${roadmaps.length} Learning Roadmaps`);
    console.log(`   • 2 Test Users`);
    console.log(`   • Dashboard Stats for test user`);

    console.log('\n📚 SUBJECTS CREATED:');
    subjects.forEach(s => {
      console.log(`   • ${s.name}: ${s.topics.length} topics (${s.weightage}% GATE weightage)`);
    });

    console.log('\n🗺️ ROADMAPS CREATED:');
    roadmaps.forEach(r => {
      console.log(`   • ${r.title}: ${r.nodes.length} phases (${r.totalEstimatedTime})`);
    });

    console.log('\n========== TEST CREDENTIALS ==========');
    console.log('Primary Test Account:');
    console.log('  Email: test@example.com');
    console.log('  Password: password123');
    console.log('\nDemo Account:');
    console.log('  Email: demo@example.com');
    console.log('  Password: demo123');
    console.log('=======================================\n');

    process.exit(0);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('❌ Mongoose Validation Error Details:');
      for (let field in error.errors) {
        console.error(`Field: ${field}, Message: ${error.errors[field].message}`);
      }
    } else {
      console.error('❌ Seeding error:', error);
    }
    process.exit(1);
  }
}

seedDatabase();
