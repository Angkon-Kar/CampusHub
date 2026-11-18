// client/src/constants/syllabusData.js
// Official University of Dhaka (Affiliated Engineering Colleges) Complete Syllabi:
// - B.Sc. in CSE (160.50 Credits)
// - B.Sc. in EEE (162.00 Credits)
// - B.Sc. in CE  (160.00 Credits)
// - B.Sc. in ME  (161.00 Credits)

export const DEPARTMENTS_WITH_SYLLABUS = ['CSE', 'EEE', 'CE', 'ME'];
export const SEMESTER_COUNT = 8;

const split = (topics) => topics.split(';').map((topic) => topic.trim()).filter(Boolean);

// Helper for courses with explicit course codes, credit hours, and detailed topic breakdowns
const course = (code, name, credit, topics) => ({
  code,
  name,
  credit,
  topics: split(topics),
});

// ============================================================================
// OFFICIAL DU AFFILIATED ENGINEERING COLLEGES — B.Sc. in CSE SYLLABUS
// ============================================================================
const CSE = [
  // Semester I (1st Year 1st Semester) — Total: 20.50 Credits
  [
    course(
      'CSE-1101',
      'Fundamentals of Computers and Computing',
      2.0,
      'Introduction to Computers: Hardware, Software, OS, Microprocessor, Memory & File Systems, I/O Devices; Application Software: Text Editors, Document Processing, Spreadsheets, Presentations, Databases & Simulation; Network and Internet: Topologies, MAC/IP/Port Addresses, DNS, Browsers, Email & Network Tools (ping, traceroute); Number Systems & Bit-Arrays: Binary, Octal, Decimal & Hexadecimal Conversions, Binary Arithmetic & Bit-Shifting; Character Representation & Memory: ASCII, UTF-8, Character Arithmetic & Memory Organization; System Modeling & Programming Basics: Flowcharts, Program Structure, Variables, Constants, I/O & Conditional Statements (If-Else, Nested If)'
    ),
    course(
      'CSE-1102',
      'Discrete Mathematics',
      3.0,
      'Logics and Proofs: Propositional Logic, Equivalences, Predicates, Quantifiers, Rules of Inference & Proof Methods; Sets, Functions, Sequences, Summations & Zero-One Matrices; Number Theory: Divisibility, Modular Arithmetic, Primes, GCD & Modular Exponentiation; Mathematical Induction & Recursion: Induction Proofs & Applications of Recurrence Relations; Counting & Combinatorics: Pigeonhole Principle, Permutations, Combinations, Binomial Coefficients & Inclusion-Exclusion; Relations, Graphs & Trees: Relation Properties & Representations, Graph Models, Euler/Hamilton Paths & Introduction to Trees'
    ),
    course(
      'EEE-1103',
      'Electrical Circuits',
      3.0,
      'Resistors & Series/Parallel DC Circuits: Ohm Law, KVL, KCL, Voltage & Current Divider Rules; DC Series-Parallel Networks & Analysis Methods: Mesh Analysis, Nodal Analysis, Bridge Networks & Y-Delta Conversions; DC Network Theorems: Superposition, Thevenin, Norton, Maximum Power Transfer & Millman Theorems; Capacitors & Inductors: Electric/Magnetic Fields, Charging/Discharging, Faraday & Lenz Laws, R-L, R-C & R-L-C DC Circuits; Sinusoidal Alternating Waveforms: Phase Relations, Average/RMS Values, Phasors, Power Factor & R-L-C Frequency Response'
    ),
    course(
      'CHE-1104',
      'Chemistry',
      3.0,
      'Atomic Structure & Periodic Table: Bohr Model, Heisenberg Uncertainty, Schrodinger Equation, Quantum Numbers & Periodic Properties; Chemical Bonding & Oxidation-Reduction: Ionic, Covalent, Coordinate, Hydrogen & Metallic Bonds, Redox Balancing; Acids, Bases & Buffers: Bronsted/Lewis Concepts, pH, Neutralization Curves, Indicators & Henderson Equation; States of Matter, Phase Rule & Thermodynamics: Gas Laws, Vander Waals Equation, Water/CO2 Phase Rule, First/Second/Third Laws & Carnot Cycle; Chemical Kinetics & Equilibrium: Rate Laws, 1st/2nd Order Reactions, Half-Life, Law of Mass Action & Le Chatelier Principle; Solutions, Electrochemistry & Biomolecules: Colligative Properties, Electrolysis, Nernst Equation, Carbohydrates, Proteins, Nucleic Acids & Polymers'
    ),
    course(
      'MATH-1105',
      'Differential and Integral Calculus',
      3.0,
      'Functions & Limits: Graphing, Transformations, Inverse Functions, Limit Laws, Sandwich Theorem, Continuity & Intermediate Value Theorem; Derivatives: Rate of Change, Differentiability & Rules/Techniques of Differentiation; Applications of Differentiation: Extrema, 1st/2nd Derivative Tests, L Hospital Rule, Linear Approximation & Curve Sketching; Integrals: Riemann Sums, Definite/Indefinite Integrals, Fundamental Theorem of Calculus, Net Change & Substitution Rule; Applications of Integration: Area Between Curves, Volumes by Slicing & Cylindrical Shells, Average Value & Mean Value Theorem'
    ),
    course(
      'SS-1106',
      'Government and Public Administration',
      2.0,
      'Constitution of Bangladesh & Fundamental Rights; Forms and Organs of Government: Legislative Assembly, Judiciary & Executive Composition, Powers and Functions; Public Administration & Role of Government; Good Governance, Accountability & Transparency of Public Servants; Local Government Structure, Human Resource Management & Planning'
    ),
    course(
      'CSE-1111',
      'Fundamentals of Computers and Computing Lab',
      1.5,
      'OS Navigation, Basic Text Editors (gedit, Notepad), Document Processing, Spreadsheets & Presentation Tools; Basic Network Configuration & Diagnostic Tools (ping, traceroute, IP/DNS lookup); Number System Conversions, Bit-Level Operations & Basic Conditional Programming Exercises; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'EEE-1113',
      'Electrical Circuits Lab',
      1.5,
      'Verification of Ohm Law, KVL, KCL & Series-Parallel DC Circuit Measurements; Experimental Verification of Superposition, Thevenin, Norton & Maximum Power Transfer Theorems; R-L, R-C & R-L-C Transient and AC Sinusoidal Waveform Measurements using Oscilloscope; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'CHE-1114',
      'Chemistry Lab',
      1.5,
      'Acid-Base Titration, Redox Titration & pH/Buffer Solution Preparation; Quantitative Volumetric Analysis & Determination of Solution Concentrations; Electrochemistry & Chemical Kinetics Experiments; Lab Reports & Practical Viva Preparation'
    ),
  ],

  // Semester II (1st Year 2nd Semester) — Total: 21.50 Credits
  [
    course(
      'CSE-1201',
      'Fundamentals of Programming',
      3.0,
      'Basics, Operators & Formatted I/O: Data Types, ASCII, Switch-Case, Arithmetic/Bitwise Operators & printf/scanf Formatting; Loops & Nested Loops: While, For, Do-While, Entry/Exit Controlled Loops & Multi-level Nested Loop Problem Formulation; Functions & Recursion: Parameter Passing, Call by Value/Reference, Scope/Lifetime, Header Files & Recursive Functions; Arrays & Strings: 1D/2D/Multidimensional Arrays, Character Arrays vs Strings, Custom String Operations & String Library; Structures, Pointers & Dynamic Memory: Struct Arrays, Pointer Arithmetic, Pointers with Arrays/Structs, malloc, calloc, realloc & free; File I/O, Preprocessors & Macros: File Opening/Closing, Read/Write Operations, Redirection Operators & Macro Definitions'
    ),
    course(
      'CSE-1202',
      'Digital Logic Design',
      3.0,
      'Number Systems, Codes & Combinational Logic: BCD, ASCII, EBCDIC, Boolean Algebra & NAND/NOR Universal Gate Design; Switching Function Minimization: Algebraic Simplification, Karnaugh Map (K-Map), VEKM & Quine-McCluskey Method; Sequential Logic & Flip-Flops: NAND/NOR Latches, Clocked SR, JK, D, T & Master-Slave Flip-Flops, Timing Considerations; Counters & Shift Registers: Ripple/Synchronous Up-Down Counters, MOD Counters, 74193 Counter, Shift Registers & Digital Clocks; MSI Logic & Arithmetic Circuits: BCD-to-Decimal/7-Segment Decoders, Encoders, Multiplexers, Demultiplexers & Half/Full/Parallel Adders; Logic Families & Memory Devices: TTL & Digital MOSFET Families, ROM/EPROM/EEPROM, Static/Dynamic RAM (SRAM/DRAM) & Sequential Circuit Formalism'
    ),
    course(
      'PHY-1203',
      'Physics',
      3.0,
      'Heat and Thermodynamics: Zeroth, First & Second Laws, Thermodynamic Processes, Carnot Cycle, Heat Engines & Entropy; Structure of Matter: Crystalline/Non-Crystalline Solids, Unit Cells, Miller Indices, Bragg Law, Crystal Defects, Bonds & Band Theory; Waves and Oscillations: Simple Harmonic Oscillator, Lissajous Figures, Damped/Forced Oscillation, Resonance, Progressive/Stationary Waves & Architectural Acoustics (Sabine Formula); Physical Optics — Interference: Young Double Slit Experiment, Fresnel Bi-Prism, Newton Rings & Interferometers; Physical Optics — Diffraction & Polarization: Fresnel/Fraunhofer Diffraction, N-Slit Diffraction Grating, Resolving Power & Polarized Light'
    ),
    course(
      'MATH-1204',
      'Methods of Integration, Differential Equations and Series',
      3.0,
      'Techniques & Applications of Integration: Integration by Parts, Trigonometric Substitution, Partial Fractions, Simpson Rule, Improper Integrals, Arc Length & Surface Area of Revolution; First-Order Differential Equations: Modeling, Direction Fields, Euler Method, Separable & Linear Differential Equations; Parametric Equations & Polar Coordinates: Parametric Calculus, Polar Area/Arc Length & Conic Sections in Polar Coordinates; Sequences & Infinite Series: Convergence Tests, Alternating Series & Power Series Representations; Taylor & Maclaurin Series: Taylor Polynomials & Function Approximation by Polynomials'
    ),
    course(
      'ENG-1205',
      'Developing English Language Skills',
      2.0,
      'English Phonetics & Vocabulary: Places/Manners of Articulation of English Sounds & Word Stock Enrichment Techniques; English Grammar & Reading Comprehension: Sentence Construction, Common Grammatical Problems & Prose Analysis; Paragraph & Discourse Writing: Developing Cohesive Paragraphs as Building Blocks of Larger Discourses; Business Correspondence & Reports: Classifications, Layouts & Structures of Business Letters and Formal Reports; Technical Writing: Research Papers, Dissertations/Theses, Technical Proposals & Instruction Manuals'
    ),
    course(
      'CSE-1211',
      'Fundamentals of Programming Lab',
      3.0,
      'Structured C Programming Assignments: Conditional Logic, Nested Loops & Number/Pattern Problems; Arrays, Strings, User-Defined Functions & Recursive Problem Solving; Pointers, Structures, Dynamic Memory Allocation & File I/O Implementation; Lab Coding Tests, Project & Viva Preparation'
    ),
    course(
      'CSE-1212',
      'Digital Logic Design Lab',
      1.5,
      'Breadboard Implementation of Basic Logic Gates, Universal NAND/NOR Circuits & Boolean Minimization; Design and Testing of Adders, Multiplexers, Decoders & 7-Segment Display Drivers; Sequential Circuit Experiments: Flip-Flops, Asynchronous/Synchronous Counters & Shift Registers; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'PHY-1213',
      'Physics Lab',
      1.5,
      'Optics Experiments: Newton Rings, Diffraction Grating, Spectrometer & Polarimeter Measurements; Waves, Oscillations & Spring-Mass/Pendulum Harmonic Motion Experiments; Thermal & Electrical Properties of Matter Measurements; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'ENG-1215',
      'Developing English Language Skills Lab',
      1.5,
      'Applied Grammar & Vocabulary Building: Tenses, Articles, Prepositions, Subject-Verb Agreement, Clauses, Affixes & Formal Diction; Reading Strategies: Skimming, Scanning, Predicting, Inference & Literary/Non-Literary Text Analysis; Writing Practice: Sentence Variety, Paragraphs, Essays, Reports & Formal/Informal Letters; Listening, Note-Taking & Oral Communication: Lecture Note-Taking, Giving Opinions, Presentations & Communicative Expressions'
    ),
  ],

  // Semester III (2nd Year 1st Semester) — Total: 22.25 Credits
  [
    course(
      'CSE-2101',
      'Data Structures and Algorithms',
      3.0,
      'Introduction, Linked Lists & Dynamic Arrays: ADTs, Big-O Time/Space Complexity, Singly/Doubly/Circular Linked Lists; Stacks, Queues & Recursion: Array/Linked Implementations, Infix-to-Postfix, Parentheses Balancing, Circular Queue, Deque, Josephus Problem & Recursion Laws; Sorting & Searching: Insertion, Selection, Bubble, Merge, Randomized Quick, Counting, Radix & Bucket Sort, Linear & Binary Search (Bisection Applications); Binary Trees, BST, AVL & Heaps: Tree Traversals, BST Operations, AVL Tree Rotations, Min/Max/Fibonacci Heaps, Priority Queue & Heap Sort; Disjoint Sets, Huffman Coding & General Trees: Union-Find with Path Compression, Huffman Compression & File System Trees; Graphs, Bitmasks & String ADT: Adjacency Matrix/List, BFS, DFS, Bicoloring, Bitmask Set Operations & String Matching/Parsing'
    ),
    course(
      'CSE-2102',
      'Object Oriented Programming',
      3.0,
      'OOP Concepts & Modeling: OOP vs Procedural Programming, Encapsulation, Inheritance, Polymorphism & Introduction to UML; Classes & Objects: Attributes, Methods, Constructors, Destructors, Method Overloading, Access Control & Stream/File I/O; Inheritance & Polymorphism: Class Hierarchy, Method Overriding, Dynamic Binding, Abstract Classes, Inner Classes, Multiple Inheritance & Interfaces; Exception Handling: Fundamentals, Exception Hierarchy, Chained Exceptions & Custom Exception Subclasses; Generics/Templates & Packages/Namespaces: Generic Programming & Modular Package Organization; Object-Oriented Design Principles & Case Study Implementation'
    ),
    course(
      'CSE-2103',
      'Digital Electronics and Pulse Technique',
      3.0,
      'Logic Gates & Families: Diode Logic, Transistor Switches, MOS Gates, TTL, ECL, IIL & CMOS Operation, Propagation Delay & Noise Immunity; Flip-Flops, Counters, Registers, Memory Systems & PLAs: Electronic Circuit Implementations, Open Collector & High-Impedance Gates; A/D and D/A Converters & Display/Sample Circuits: ADC/DAC Architectures, Sample-and-Hold (S/H) Circuits, LED, LCD & Optically Coupled Oscillators; Linear Wave Shaping & Non-Linear Op-Amp Applications: Diode Wave Shaping, Clipping/Clamping Circuits, Comparators & Analog Switches; Pulse Generation & Multivibrators: Pulse Transformers, Monostable, Bistable & Astable Multivibrators, Schmitt Trigger & Blocking Oscillators; Timing Circuits & Time-Base Generators: Simple Voltage Sweeps & Linear Current Sweeps'
    ),
    course(
      'EEE-2104',
      'Electronic Devices and Circuits',
      3.0,
      'Semiconductors & Diodes: PN Junction Properties, V-I Characteristics, LED, Zener Diode, Half/Full-Wave Rectifiers, Filters, Clippers, Clampers & Voltage Regulators; Bipolar Junction Transistors (BJT): NPN/PNP Operation, CB/CE/CC Configurations, Load Line, Operating Point (Q-Point) & BJT Biasing/Stabilization Circuits; Single-Stage Transistor Amplifiers: DC/AC Equivalent Circuits, Phase Reversal, Voltage/Power Gain & Amplifier Classifications; Field Effect Transistors (FET): JFET & MOSFET Construction, Characteristics, Shockley Equation & DC Biasing; Power Electronics & Feedback/Op-Amps: SCR, TRIAC, DIAC, Negative/Positive Feedback, Emitter Follower, Inverting/Non-Inverting Op-Amps, Integrators, Differentiators & Summing Amplifiers; Oscillators & IC Fabrication: Theory of Oscillation, Oscillator Circuits & Introduction to IC Fabrication'
    ),
    course(
      'MATH-2105',
      'Linear Algebra',
      3.0,
      'Matrices & Linear Systems: Gaussian Elimination, Inverse Matrices & LU Factorization; Vector Spaces & Linear Independence: Row Space, Column Space, Null Space, Rank, Basis & Dimension; Orthogonality & Least Squares: Inner Products, Subspace Projections, Projection Matrices & Gram-Schmidt Orthogonalization; Determinants, Eigenvalues & Eigenvectors: Cofactors, Cramer Rule, Matrix Diagonalization, Matrix Powers & Difference Equations; Special Matrices & Linear Transformations: Symmetric, Hermitian & Positive Definite Matrices, Spectral Theorem, Change of Basis & Singular Value Decomposition (SVD); Numerical Matrix Computation (MATLAB/Octave): Matrix Norms, Condition Number, Pseudoinverse & QR Decomposition'
    ),
    course(
      'SS-2106',
      'Bangladesh Studies',
      2.0,
      'History & Society of Bengal: Impact of British and Pakistan Rule on Economy and Education; Emergence of Bangladesh: Language Movement of 1952, Mass Upsurge of 1969 & War of Independence in 1971; Geography, Ecology & Resources: Location, Boundaries, River System, Climate & Natural/Human Resources of Bangladesh; Social Structure, Language, Literature, Art & Cultural Heritage of Bangladesh; Politics, Constitutional Development, Economy, Sectoral Achievements & Socio-Cultural Prospects'
    ),
    course(
      'CSE-2111',
      'Data Structures and Algorithms Lab',
      1.5,
      'Implementation of Linked Lists, Stacks, Queues, Deques & Recursive Algorithms; Sorting Algorithms, Binary Search, BST, AVL Trees, Heaps & Disjoint Set Union (DSU) Coding; Graph Representations, BFS, DFS, Huffman Coding & Bitmask Operations; Lab Coding Contests, Reports & Viva Preparation'
    ),
    course(
      'CSE-2112',
      'Object Oriented Programming Lab',
      1.5,
      'Classes, Objects, Constructors, Overloading & Encapsulation Exercises in Java/C++; Inheritance, Polymorphism, Abstract Classes, Interfaces & Custom Exception Handling; Generics/Templates, File Streams, Packages & OOP Design Mini-Project; Lab Reports & Viva Preparation'
    ),
    course(
      'CSE-2113',
      'Digital Electronics and Pulse Technique Lab',
      1.5,
      'Diode/Transistor Logic Gates, TTL/CMOS Characteristics & Wave Shaping (Clipping/Clamping) Experiments; Astable, Monostable & Bistable Multivibrators, Schmitt Trigger & 555 Timer Circuits; ADC/DAC Converters & Voltage/Current Sweep Circuit Experiments; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'EEE-2114',
      'Electronic Devices and Circuits Lab',
      0.75,
      'PN Junction & Zener Diode Characteristics, Rectifiers & Voltage Regulator Circuits; BJT & FET Characteristic Curves, Biasing & Single-Stage CE Amplifier Testing; Op-Amp Applications (Inverting, Non-Inverting, Integrator, Adder) & Oscillator Experiments; Lab Reports & Viva Preparation'
    ),
  ],

  // Semester IV (2nd Year 2nd Semester) — Total: 19.25 Credits
  [
    course(
      'CSE-2201',
      'Database Management Systems-I',
      3.0,
      'Introduction & Relational Model: DBMS Overview, Architecture, Key/Referential Integrity Constraints & Relational Algebra Operations; Entity-Relationship (ER) Modeling: Entity/Relationship Sets, Cardinality/Participation Constraints, Weak Entities, EER Specialization/Aggregation & ER-to-Relational Mapping; SQL & Application Development: DDL, DML, Integrity Constraints, Nested/Complex Queries, Aggregate Functions, Views & Cursors; Extending DBMS & Administration: Stored Procedures, Assertions, Triggers, Embedded/Dynamic SQL, Users, Privileges & Security; Functional Dependencies (FDs): FD Closure, Attribute Closure, Canonical Cover & Lossless/Dependency-Preserving Decomposition; Database Normalization: 1NF, 2NF, 3NF, BCNF, Multi-Valued Dependencies & 4NF Design Process'
    ),
    course(
      'CSE-2202',
      'Design and Analysis of Algorithms-I',
      3.0,
      'Complexity Analysis & Recurrence Relations: Asymptotic Notations (Big-O, Omega, Theta) & Solving Recurrences (Substitution, Recursion Tree, Master Method); Graph Traversal & Connectivity: BFS/DFS Review, Topological Sort, Strongly Connected Components (SCC), Euler Path, Articulation Points, Bridges & Biconnected Components; Shortest Path Algorithms: Dijkstra Algorithm, Bellman-Ford & Negative Cycle Detection, Floyd-Warshall All-Pairs Shortest Path & DAG Shortest Path; Divide & Conquer (D&C): Counting Inversions, Closest Pair of Points, Modular Exponentiation & Expected Linear-Time Order Statistics (k-th Smallest); Greedy Algorithms & Minimum Spanning Tree: Greedy Choice Property, Fractional Knapsack, Job Scheduling with Deadlines, Prim & Kruskal MST Algorithms; Dynamic Programming & Network Flow: Memoization/Tabulation, Coin Change, LIS, LCS, 0/1 Knapsack, Matrix Chain Multiplication, Ford-Fulkerson, Edmonds-Karp & Max Bipartite Matching'
    ),
    course(
      'CSE-2203',
      'Data and Telecommunication',
      3.0,
      'Communication Models & Protocol Architecture: Standards, Layered Architecture, Peer-to-Peer Communication, PDUs, Encapsulation & Segmentation; Physical Layer & Transmission Media: Analog/Digital Signals, Bandwidth, Impairments, Channel Capacity (Nyquist/Shannon) & Guided Media (Twisted Pair, Coax, Fiber); Wireless Transmission & Propagation: Terrestrial/Satellite Microwave, Radio Waves, Free Space/Land Propagation, Path Loss, Multipath Fading & VSAT; Digital & Analog Transmission: Line Coding (NRZ, RZ, Manchester, AMI), Block Coding, PCM, Delta Modulation, ASK, FSK, PSK, QPSK, QAM, AM, FM & PM; Multiplexing & Spread Spectrum: FDM, Synchronous/Statistical TDM, FHSS, DSSS & CDMA; Data Link Layer & Control: Parity, CRC, Hamming Code, Forward Error Correction, Flow/Error Control (Stop-and-Wait, Sliding Window, Go-Back-N, Selective Reject ARQ) & HDLC'
    ),
    course(
      'CSE-2204',
      'Computer Architecture and Organization',
      3.0,
      'Microcomputer Arithmetic & Representation: Carry-Lookahead/Carry-Save Adders, Booth Multiplier, Dividers, IEEE-754 Floating Point & FSMs; CPU Organization & Instruction Sets: Accumulator CPU, RISC vs CISC, Addressing Modes & Basic MIPS Instruction Set Architecture; Pipelined Processing & ALUs: Combinational/Sequential ALUs, Systolic Arrays, Structural/Data/Control/Name Hazards & Pipeline Performance Analysis; Memory Hierarchy & Cache Organization: Direct-Mapped/Associative Caches, Write-Through/Write-Back, Non-Blocking/Pipelined Caches, Virtual Memory & Coherence; Advanced Processor Architecture: Superscalar, Out-of-Order Execution, Register Renaming, Branch Prediction, Speculative Execution, VLIW, SIMD & Multithreading; Control Unit & I/O Organization: Hardwired vs Microprogrammed Control, Bus Arbitration, Interrupts & Direct Memory Access (DMA)'
    ),
    course(
      'CSE-2205',
      'Introduction to Mechatronics',
      2.0,
      'Introduction, Electronics & Mechanical Basics: Mechatronics Systems, Measurement/Control Systems, Mechanical Design & Discrete Linear Systems; Sensors and Transducers: Displacement, Proximity, Motion, Sound, Light, Temperature, Fluid Level/Flow & Force Sensors; Actuation Systems: Pneumatic and Hydraulic Systems, Mechanical Actuators, Electrical Actuators & Servos; System Models & Controllers: Electrical, Mechanical, Fluid & Thermal Models, PID Controllers, Digital Logic & Microprocessor Control; Programmable Logic Controllers (PLCs) & System Design: PLC Architecture, Mnemonics, Timers, Relays, Counters, Analog I/O & Mechatronics Case Studies'
    ),
    course(
      'CSE-2211',
      'Database Management Systems - I Lab',
      1.5,
      'ER Diagram Design & Relational Schema Mapping; SQL DDL, DML, Complex Joins, Subqueries, Views, Triggers & Stored Procedures; Database Design & Normalization Case Study Implementation; Lab Tests & Viva Preparation'
    ),
    course(
      'CSE-2212',
      'Design and Analysis of Algorithms - I Lab',
      1.5,
      'Graph Algorithms Implementation: Topological Sort, SCC, Articulation Points, Bridges, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim & Kruskal; Divide & Conquer and Greedy Problem Solving: Inversion Count, Closest Pair, Fractional Knapsack & Job Scheduling; Dynamic Programming & Network Flow Coding: 0/1 Knapsack, LCS, LIS, Matrix Chain Multiplication & Edmonds-Karp Max Flow; Lab Coding Contests & Viva Preparation'
    ),
    course(
      'CSE-2213',
      'Data and Telecommunication Lab',
      0.75,
      'Simulation and Implementation of Line Coding Schemes (NRZ, RZ, Manchester, Differential Manchester, AMI); Analog/Digital Modulation, PCM & Multiplexing Experiments; Error Detection/Correction (CRC, Hamming Code) & Data Link Flow Control Protocol Implementation'
    ),
    course(
      'CSE-2216',
      'Application Development Lab',
      1.5,
      'Requirement Analysis, UI/UX Architecture & Database Schema Design for Full-Stack Application; Backend API, Authentication, Frontend Integration & Feature Implementation; Testing, Deployment, Documentation & Final Project Defense'
    ),
  ],

  // Semester V (3rd Year 1st Semester) — Total: 19.50 Credits
  [
    course(
      'CSE-3101',
      'Computer Networking',
      3.0,
      'Introduction & Network Performance: Protocol Layers, Delay, Loss, Throughput, Circuit Switching & Packet Switching; Application Layer Protocols: HTTP, FTP, Email (SMTP, POP3, IMAP), DNS, SNMP & P2P Networks; Transport Layer: UDP, Reliable Data Transfer (RDT), TCP Connection Management, Flow Control & Congestion Control (TCP Tahoe, Reno, New Reno); Network Layer & Routing: IPv4, IPv6, IP Addressing/Subnetting, NAT & Routing Algorithms (RIP, OSPF, BGP); Wireless & Mobile Networks: Wireless Links, MAC Protocols (CSMA/CA), Wireless Routing, Mobility & Mobile IPv6'
    ),
    course(
      'CSE-3102',
      'Software Engineering',
      3.0,
      'Software Process Models: Generic Framework, Waterfall, V-Model, Incremental & Spiral Evolutionary Models; Software Project Management: Effort/Schedule Estimation, Timeline Planning & Risk Identification/Mitigation; Requirements Engineering & SRS: Stakeholder Elicitation, Use Cases, Functional/Non-Functional Requirements & IEEE 830 SRS Standard; System, Architectural, UI & Data Design: Context Models, Design Patterns, Modularity, Information Hiding, Refactoring & IEEE 1016 Design Standard; Testing & Quality Assurance: Unit, Integration, White-Box (Basis Path, Cyclomatic Complexity), Black-Box, Validation, UAT, Six Sigma & IEEE 730 QA; Deployment, Maintenance & Reengineering: Direct/Parallel/Pilot Deployment, Supportability & Final Project Presentation'
    ),
    course(
      'CSE-3103',
      'Microprocessor and Microcontroller',
      3.0,
      'Evolution & 8086 Microprocessor: Architecture, Register Organization, Instruction Set, Interrupts, 8259A PIC & 80286/80386/80486 Overview; Pentium Microprocessor: Architecture, Cache, Floating-Point Unit, Addressing Modes, Paging & Protected Mode Operations; Next-Generation & Mobile Microprocessors: Intel Core (Dual Core to Core i7), Atom, Helio & ARM Architectures; 8051 Microcontroller & Interfacing: Architecture, Instruction Set, Memory Organization & External I/O Device Interfacing; Programmable Logic Controllers (PLC): Basic Structure, Ladder/Mnemonic Programming, Timers, Relays, Counters & Analog I/O Control'
    ),
    course(
      'CSE-3104',
      'Database Management Systems -II',
      3.0,
      'Storage, Indexing & Hashing: RAID Levels, File/Record Organization, Data Dictionary, B-Tree/B+-Tree Indices & Static/Dynamic Hashing; Query Processing & Optimization: Query Cost Measures, Selection/Sorting/Join Algorithms, Relational Expression Equivalence, Cost-Based/Heuristic Optimization & Materialized Views; Modern Databases: Object-Relational/Object-Oriented Databases, Structured/Collection Types & Temporal, Spatial, Multimedia and Mobile Databases; Data Preprocessing & Visualization: Attribute Types, Statistical Descriptions, Similarity Measures, Cleaning/Reduction/Discretization & Visualization Techniques; Parallel & Distributed Databases: Client-Server, Speedup/Scaleup, I/O/Interquery/Intraquery Parallelism, Data Replication/Fragmentation & Distributed Query Processing; Data Warehousing & Data Mining: Decision Support Systems, OLAP Schemas, Association Rules, Classification & Clustering'
    ),
    course(
      'MATH-3105',
      'Multivariable Calculus and Geometry',
      3.0,
      'Vectors & 3D Analytic Geometry: 2D/3D Vectors, Dot & Cross Products, Equations of Lines, Planes, Cylinders & Quadric Surfaces; Vector-Valued Functions: Differentiation, Integration, Arc Length, Curvature & Motion in Space; Partial Derivatives: Multivariable Limits/Continuity, Tangent Planes, Linear Approximation, Chain Rule, Directional Derivatives, Extrema & Lagrange Multipliers; Multiple Integrals: Double & Triple Integrals, Change of Variables (Jacobians) & Physical Applications; Vector Calculus: Vector Fields, Line Integrals, Green Theorem, Curl, Divergence, Parametric Surfaces, Stokes Theorem & Divergence Theorem'
    ),
    course(
      'CSE-3111',
      'Computer Networking Lab',
      1.5,
      'Socket Programming (TCP/UDP Client-Server) & Application Layer Protocol Analysis using Wireshark; IP Subnetting, NAT & Static/Dynamic Routing Configuration (RIP, OSPF, BGP) in Packet Tracer/GNS3; Wireless Network Configuration, Performance Evaluation & Lab Viva Preparation'
    ),
    course(
      'CSE-3112',
      'Software Engineering Lab',
      0.75,
      'Preparation of IEEE 830 System Requirements Specification (SRS) & Use-Case Modeling; UML System/Architectural/UI/Data Design Documentation (IEEE 1016); Unit/Integration Testing, Cyclomatic Complexity Analysis & Final Software Project Presentation'
    ),
    course(
      'CSE-3113',
      'Microprocessor and Assembly Language Lab',
      1.5,
      '8086 Assembly Language Programming: Arithmetic, Logic, Loop, Array & String Manipulation; Interrupt Handling, Subroutine Calls & Hardware Interfacing Experiments with 8086 Kit/Emulator; Lab Reports & Practical Viva Preparation'
    ),
    course(
      'CSE-3116',
      'Microcontroller Lab',
      0.75,
      '8051/Arduino/AVR Microcontroller Programming, GPIO, Timers & Interrupts; Sensor, Display (LCD/7-Segment), Motor & Actuator Interfacing Mini-Project'
    ),
  ],

  // Semester VI (3rd Year 2nd Semester) — Total: 19.50 Credits
  [
    course(
      'CSE-3201',
      'Operating Systems',
      3.0,
      'OS Overview & System Calls: Computer System Structure, OS Components & Classes of System Calls; Processes, Threads & CPU Scheduling: Process/Thread Models, User/Kernel Threads, Context Switch, Dispatcher & Scheduling Algorithms (FCFS, SJF, RR, Priority, Real-Time); Concurrency & Synchronization: IPC, Critical Section Problem, Semaphores, Mutexes & Classic Synchronization Problems; Deadlocks: Characterization, Ostrich Algorithm, Deadlock Prevention, Avoidance (Banker Algorithm), Detection, Recovery & Starvation; Memory & Virtual Memory Management: Contiguous Allocation, Paging, Segmentation, Page Tables, TLB, Demand Paging, Page Replacement Algorithms & Thrashing; File Systems, I/O & Disk Management: File Allocation, Directory Implementation, UNIX i-node, DMA, Interrupts, Disk Arm Scheduling & RAID/Stable Storage'
    ),
    course(
      'CSE-3202',
      'Numerical Methods',
      3.0,
      'Number Representation, Errors & MATLAB Experiments: Floating-Point Representation, Round-off/Truncation Errors & Error Propagation; Roots of Nonlinear Equations: Bisection, False Position, Fixed-Point Iteration, Newton-Raphson & Secant Methods; Interpolation & Approximation: Lagrange Polynomials, Newton Divided Differences & Cubic Spline Interpolation; Numerical Differentiation & Integration: Finite Difference Formulas, Trapezoidal Rule, Simpson Rules & Romberg Integration; Systems of Linear Equations: Gaussian Elimination with Pivoting, LU Decomposition, Jacobi & Gauss-Seidel Iterative Methods; Numerical ODEs, PDEs & Optimization: Euler, Runge-Kutta (RK4), Finite Difference Methods for PDEs & Numerical Optimization'
    ),
    course(
      'CSE-3203',
      'Design and Analysis of Algorithms - II',
      3.0,
      'Advanced Hashing & Number Theory: Linear/Quadratic Probing, Double/Random Hashing, Sieve of Eratosthenes, CRT, Euler Totient (Phi) & Extended Euclidean Algorithm; Computational Geometry: Vector Cross Product, Segment/Circle Intersection, Point-in-Polygon, Polygon Area & Convex Hull Algorithms; Backtracking & Branch-and-Bound: Permutation/Combination Generation, Graph Coloring, N-Queens, Hamiltonian Cycle & Traveling Salesman Problem (TSP); String Matching Data Structures & Algorithms: Naive, Rabin-Karp, Finite Automata, KMP Algorithm, Trie & Suffix Array; NP-Completeness & Reducibility: Classes P, NP, Polynomial-Time Verification, Reductions & Classic NP-Complete Problems; Online & Multithreaded Algorithms: Competitive Analysis, Online Paging, Marker Algorithm, Adversary Models & Dynamic Multithreading'
    ),
    course(
      'CSE-3204',
      'Formal Language, Automata and Computability',
      3.0,
      'Finite Automata & Regular Languages: DFA, NFA, Epsilon-NFA, Regular Expressions, Pumping Lemma, Closure Properties, DFA Minimization & Mealy/Moore Machines; Context-Free Grammars & Pushdown Automata: Chomsky Hierarchy, CFG, Ambiguity, Chomsky/Greibach Normal Forms, PDA, CFL Pumping Lemma & CYK Algorithm; Computability & Turing Machines: Standard/Multi-tape/Nondeterministic Turing Machines, Church-Turing Thesis, Decidability, Halting Problem, Recursive/RE Languages & Linear Bounded Automata; Time Complexity & NP-Completeness: P, NP, Cook-Levin Theorem, Polynomial-Time Reductions & Approximation Algorithms; Space Complexity & Randomized Classes: Savitch Theorem, PSPACE, PSPACE-Complete, Log-Space (L, NL), Hierarchy Theorems & Class BPP'
    ),
    course(
      'STAT-3205',
      'Introduction to Probability and Statistics',
      3.0,
      'Descriptive Statistics & Exploratory Data Analysis (R/MATLAB): Data Types, Stem-and-Leaf, Frequency Tables, Histograms, Skewness, Quartiles, 5-Number Summary & Box Plots; Measures of Location & Spread: Mean, Median, Mode, Variance, Standard Deviation, Trimmed/Winsorized Mean, IQR, MAD & Markov/Chebyshev Inequalities; Multivariate Data & Correlation: Scatterplot Matrices, Homoscedasticity, Outliers, Pearson & Rank Correlation Coefficients; Probability Theory: Axioms of Probability, Counting Methods, Conditional Probability, Independence & Bayes Theorem; Random Variables & Probability Distributions: PMF/PDF/CDF, Expectation, Variance, Moment Generating Functions, Bernoulli, Binomial, Geometric, Hypergeometric, Poisson, Uniform, Exponential, Gamma, Beta & Normal Distributions; Q-Q Plots & Limit Theorems: Normal Probability Plots, Law of Large Numbers & Central Limit Theorem'
    ),
    course(
      'CSE-3211',
      'Operating Systems Lab',
      1.5,
      'Linux Shell Scripting, System Calls (fork, exec, wait) & Multi-threaded Programming with Pthreads; Implementation of CPU Scheduling, Process Synchronization (Semaphores/Mutexes) & Banker Algorithm; Memory Paging, Page Replacement & Disk Scheduling Simulation'
    ),
    course(
      'CSE-3212',
      'Numerical Methods Lab',
      0.75,
      'MATLAB/C++ Implementation of Root Finding (Bisection, Newton-Raphson, Secant) & Polynomial/Spline Interpolation; Numerical Integration (Trapezoidal, Simpson), Linear Solvers (Gaussian, Gauss-Seidel) & ODE Solvers (Euler, RK4)'
    ),
    course(
      'CSE-3216',
      'Software Design Patterns Lab',
      1.5,
      'SOLID Principles & Creational Design Patterns (Singleton, Factory, Abstract Factory, Builder, Prototype); Structural & Behavioral Design Patterns (Adapter, Decorator, Facade, Observer, Strategy, Command, State); Refactoring Legacy Code & Architectural Pattern Implementation Project'
    ),
    course(
      'ENG-3217',
      'Technical Writing and Presentation Lab',
      0.75,
      'Structuring Research Papers, Technical Reports, Project Proposals & Literature Reviews (LaTeX/Word); Data Visualization, Citation Management (IEEE/APA), Plagiarism Ethics & Technical Slide Deck Presentation'
    ),
  ],

  // Semester VII (4th Year 1st Semester) — Total: 20.50 Credits
  [
    course(
      'CSE-4101',
      'Artificial Intelligence',
      3.0,
      'Intelligent Agents & Uninformed Search: PEAS, Agent Architectures, BFS, Uniform Cost, DFS, Iterative Deepening & Bidirectional Search; Informed, Local & Adversarial Search: Best-First, A* Search, Heuristics, Hill Climbing, Simulated Annealing, Genetic Algorithms, CSPs, Minimax & Alpha-Beta Pruning; Knowledge Representation & Logic: Propositional Logic, First-Order Logic (FOL), Quantifiers, Unification, Resolution, Ontologies & Default Reasoning; Planning & Probabilistic Reasoning: Partial-Order Planning, Conditional Probability, Bayes Rule, Bayesian Networks & Exact/Approximate Inference; Machine Learning & Neural Networks: Supervised Decision Trees, Reinforcement Learning (Q-Learning), Perceptrons, Multi-Layer Neural Networks & Backpropagation; Robotics in AI: Robot Hardware, Perception, Localization, Planning & Human-Robot Interaction'
    ),
    course(
      'CSE-4102',
      'Mathematical and Statistical Analysis for Engineers',
      3.0,
      'Linear Models & Statistical Inference: Covariance, Correlation, Ordinary Least Squares (OLS), Confidence Intervals, Hypothesis Testing (Type I/II Errors) & Multiple Regression; Laplace Transforms: Forward/Inverse Transforms, Transform Pairs & Solving Differential Equations/Initial Value Problems; Fourier Series & Fourier Transforms: Sine/Cosine Series, Continuous/Discrete-Time Fourier Transform, DFT & Fast Fourier Transform (FFT); Stochastic Processes & Markov Chains: Poisson/Exponential Processes, Stationary Processes, Discrete/Continuous-Time Markov Chains, Birth-Death Process, Steady-State & Absorbing Chains; Queuing Theory: Kendall Notation, Little Formula, PASTA, M/M/1/K, M/M/c, M/M/c/c, M/D/1/B Queues & Open Jackson Networks; Linear Optimization: Linear Programming Formulations, Simplex/Standard Form, Duality Theory & Sensitivity Analysis'
    ),
    course(
      'SS-4103',
      'Entrepreneurship for IT Business',
      2.0,
      'Foundations of IT Entrepreneurship: Entrepreneurial Mindset, Innovation, Business Ethics & Feasibility Analysis; Business Models, Ownership & Strategic Planning: Designing Competitive Models, Franchising, Buyouts & Crafting a Winning Business Plan; Marketing & E-Commerce Strategy: Bootstrap Marketing, Advertising, Pricing/Credit Strategies & Global E-Commerce; Financial & Operational Planning: Cash-Flow Management, Equity/Debt Financing, Facility Layout, Supply Chain, Inventory & Staffing; Legal Aspects, Risk Management & Venture Team Building: Intellectual Property, Business Law, Succession & Scaling IT Startups'
    ),
    course(
      'CSE-4XXX (Opt-I)',
      'Option-I (Elective Theory)',
      3.0,
      'CSE-4121 Robotics Science and Systems (Kinematics, Vision, Motion Planning & SLAM); CSE-4123 Bio-molecular Sequence & Structure Analysis (BLAST, Phylogenetics, HMMs & Protein Folding); CSE-4125 Introduction to Machine Learning (Regression, Generative/Discriminative Models, SVM, Kernels, EM & HMM); CSE-4127 Information Retrieval (Inverted Index, Boolean/Vector Space Models, TF-IDF, Rocchio & Lucene); CSE-4131 Introduction to VLSI Design (CMOS Fabrication, Stick Diagrams, Delay Analysis, Logic Synthesis & FPGA); CSE-4133 Algorithm Engineering (Randomized, Approximation, Amortized, Online, Quantum & Parameterized Algorithms); CSE-4135 Software Requirements Specification and Analysis (Elicitation, Negotiation, Validation & UML/Scenario Modeling); CSE-4137 Cryptography and Security (AES, RSA, ECC, PKI, Kerberos, Access Control, SSL/TLS, DDoS & Malware); CSE-4139 Computer Graphics (Raster Algorithms, 2D/3D Transformations, Projection, Z-Buffer, Shading, Ray Tracing & Curves)'
    ),
    course(
      'CSE-4XXX (Opt-II)',
      'Option-II (Elective Theory)',
      3.0,
      'CSE-4122 Mathematics for Robotics (Interpolation, Optimization, Calculus of Variations, Markov Chains & Differential Geometry); CSE-4124 Introduction to Bioinformatics (Proteins, Enzymes, NCBI Databases, Pairwise/Multiple Sequence Alignment & ClustalW); CSE-4126 Introduction to Data Science (Data Cleaning, SQL/NoSQL, PCA, Wavelets, Clustering, Discretization & EDA); CSE-4128 Wireless Networks (Cellular/WLAN/Mesh/Ad-Hoc, OFDM/MIMO, MAC Scheduling, AODV/DSR Routing & Wireless TCP); CSE-4130 Introduction to Quantum Logic (Qubits, Quantum Gates, Quantum Circuits & Deutsch/Simon Algorithms); CSE-4132 Graph Theory (Spanning Trees, Connectivity, Planarity, Coloring, Digraphs, Network Flows, Ramsey & Perfect Graphs); CSE-4134 Software Project Management (Integration, Scope, Time, Cost, Quality, HR, Risk, Procurement & Stakeholder Management); CSE-4136 Computer Security (SQLi/XSS/CSRF, Network Attacks, Buffer Overflow, Return-Oriented Programming & Malware Reversing); CSE-4140 Compiler Design (Lexical Analysis, LL/LR Parsing, Syntax-Directed Translation, 3-Address Code, Dataflow Analysis & SSA Optimization)'
    ),
    course(
      'CSE-4111',
      'Artificial Intelligence Lab',
      1.5,
      'Implementation of Uninformed/Informed Search (BFS, DFS, UCS, A*), Local Search (Hill Climbing, Genetic Algorithms) & Alpha-Beta Game Playing; Knowledge Base/Prolog Inference, Bayesian Networks & Decision Tree/Neural Network Training; AI Mini-Project & Lab Viva Preparation'
    ),
    course(
      'CSE-4XXX (Opt-I Lab)',
      'Option-I Lab (Elective Sessional)',
      1.5,
      'Sessional Lab corresponding to selected Option-I Theory Course (CSE-4151 / 4153 / 4155 / 4157 / 4161 / 4163 / 4165 / 4167 / 4169); Practical Implementation, Experiments, Term Project & Viva Preparation'
    ),
    course(
      'CSE-4113',
      'Internet Programming Lab',
      1.5,
      'Frontend Web Engineering: Semantic HTML5, Modern CSS/Tailwind, JavaScript ES6+ & Reactive UI State Management; Backend & Database Integration: RESTful APIs, Authentication, Session/JWT Security & Database ORM/Queries; Full-Stack Web Application Deployment & Final Project Presentation'
    ),
    course(
      'CSE-4114',
      'Project (Part I)',
      2.0,
      'Topic Selection, Problem Statement & Comprehensive Literature Review; System Architecture, Methodology Design & Feasibility/Requirement Analysis; Prototype Implementation, Progress Report & Part-I Defense Presentation'
    ),
  ],

  // Semester VIII (4th Year 2nd Semester) — Total: 17.50 Credits
  [
    course(
      'ECO-4201',
      'Economics',
      2.0,
      'Introduction to Micro & Macroeconomics: Scarcity, Opportunity Cost, Factors of Production & Market Equilibrium; Theory of the Consumer: Cardinal/Ordinal Utility, Indifference Curves, Budget Line, Utility Maximization & Demand Elasticity; Choices Under Risk & Uncertainty: Expected Utility, Risk Aversion, Insurance & Maximin Strategy; Theory of the Firm: Production Functions (Cobb-Douglas), Returns to Scale, Cost Functions & Profit Maximization; Market Structures & Game Theory: Perfect Competition, Monopoly, Oligopoly, Monopolistic Competition, Normal-Form Games & Nash Equilibrium; Market Failure & Public Policy: Public Goods, Externalities, Asymmetric Information, Moral Hazard, Adverse Selection & Signaling'
    ),
    course(
      'CSE-4202',
      'Society and Technology',
      2.0,
      'Evolution of Scientific Thought: History and Philosophy of Science & Technology; Social Complexity & Technological Change: Elman Service Stages, Craft Specialization, Economy & Population Dynamics; Diffusion of Innovations: Nature of Technological Diffusion, Attributes of Innovation & Adoption Rates; Societal Impact of Modern Technologies: Robotics in Workforce/Warfare, Social Media, AI, Medical/Genetic Tech & Pro-Poor Tech; Privacy, Uncertainty, Ethics of Technology Design & Regulatory Governance'
    ),
    course(
      'SS-4203',
      'Engineering Ethics',
      2.0,
      'Engineering Professionalism & Codes of Ethics: Origins of Ethical Thought, Professional Responsibility & Corporate Ethics; Moral Frameworks & Ethical Problem-Solving: Utilitarianism, Duty/Rights Ethics & Analyzing Ethical Dilemmas; Engineering as Social Experimentation, Safety & Risk: Risk-Benefit Analysis, Safe-Exit & Fail-Safe System Design; Workplace Rights & Responsibilities: Confidentiality, Conflicts of Interest & Whistle-Blowing Case Studies; Research Integrity, Computer Ethics & Global Issues: IP Rights, Cyber Privacy, Environmental Sustainability & Moral Leadership'
    ),
    course(
      'CSE-4XXX (Opt-III)',
      'Option-III (Elective Theory)',
      3.0,
      'CSE-4221 Robot Learning (HMM, Kalman Filter, MDP Reinforcement Learning, SVM, Particle Filters & Deep Learning); CSE-4223 Fundamentals of Genomics and Proteomics (Genome Sequencing/Assembly, SNPs, Molecular Markers, 2D-PAGE & Mass Spectrometry); CSE-4225 Introduction to Data Mining and Warehousing (OLAP Cubes, Star/Snowflake Schemas, Apriori, FP-Growth, Association Rules & PrefixSpan); CSE-4227 Cloud Computing (IaaS/PaaS/SaaS, Virtualization, VM Provisioning, Fault Tolerance, Cloud Security & Mobile Cloud Computing); CSE-4229 Introduction to Reversible Computing (Feynman/Toffoli/Fredkin Gates, Quantum Cost & Reversible Combinational/Sequential Circuits); CSE-4231 Computational Geometry (Polygon Triangulation, 2D/3D Convex Hull, Voronoi Diagrams, Delaunay Triangulation & Line Arrangements); CSE-4233 Software Testing and Verification (STLC, V&V, Black-Box/White-Box/Mutation Testing, Regression, Metrics & TDD/BDD); CSE-4235 Digital Forensic (Disk/NTFS/Memory/Network/Mobile Forensics, Chain of Custody, Cyber Laws in Bangladesh & NIDS/Snort); CSE-4237 Digital Image Processing (Spatial/Frequency Filtering, DFT/DCT/Wavelets, Image Restoration, Morphology & Segmentation); CSE-4239 Parallel and Distributed Systems (HPC, Grid/Cloud, MapReduce, DHTs, Consistency Models, Byzantine Fault Tolerance, MPI, OpenMP & CUDA)'
    ),
    course(
      'CSE-4XXX (Opt-IV)',
      'Option-IV (Elective Theory)',
      3.0,
      'CSE-4222 Human Robot Interaction (Sensors, Multi-Modal Communication, Assistive/Social Robotics & Shared Autonomy); CSE-4224 Mobile Robotics (Wheeled/Legged Kinematics, Stereo/Omni Vision, Potential Field Planning, Localization & SLAM); CSE-4226 Aerial Robotics (Rotorcraft Dynamics, Flight Control, Obstacle Avoidance, Formation Flying & UAV Avionics); CSE-4228 Application of Computational Biology (Genome Annotation, ORF/Genscan/Glimmer, Neural/HMM Gene Prediction & RNA Folding); CSE-4230 Human Computer Interaction (Needfinding, Prototyping, Qualitative/Quantitative UX Research, Visual Design & Social/Ubiquitous Computing); CSE-4232 Internet of Things (IoT Architectures, SoC/Sensors, BLE/Zigbee/NFC/RFID/LTE Protocols, Cloud Analytics & IoT Security); CSE-4234 Introduction to Multiple-Valued Logic (MVL Algebras, Shannon/Reed-Muller Expansion, MVL Circuits & Quantum Decision Diagrams); CSE-4236 VLSI Layout Algorithms (Partitioning, Simulated Annealing, Floorplanning, Placement, Maze/Steiner Routing & Compaction); CSE-4238 Concepts of Concurrent Computation (Synchronization, Semaphores, Monitors, SCOOP, CCS, CSP & Lock-Free Programming); CSE-4240 Applied Cryptography (Information Theory, Finite Fields, Symmetric/RSA/Elliptic Curve Cryptography, SSH/TLS, Tor & Bitcoin); CSE-4242 Computer Vision (Camera Pipeline, SIFT, Hough Transform, RANSAC, Optical Flow, Graph Cuts & Object Recognition); CSE-4244 Computer and Network Security (Control Hijacking, Sandboxing, Static Analysis, Fuzzing, Web/Network Defense & Mobile Security); CSE-4246 Natural Language Processing (N-gram Language Models, POS Tagging, HMMs, CFG/PCFG, Weighted CYK & Machine Translation)'
    ),
    course(
      'CSE-4XXX (Opt-III Lab)',
      'Option-III Lab (Elective Sessional)',
      1.5,
      'Sessional Lab corresponding to selected Option-III Theory Course (CSE-4251 / 4253 / 4255 / 4257 / 4259 / 4261 / 4263 / 4265 / 4267 / 4269); Practical Implementation, Experiments, Term Project & Viva Preparation'
    ),
    course(
      'CSE-4214',
      'Project (Part II)',
      4.0,
      'Complete System Implementation, Experimental Evaluation & Performance Benchmarking; Bug Fixing, Result Analysis & Comparative Evaluation; Final Thesis/Project Book Writing, Publication Preparation & Final Defense Presentation'
    ),
  ],
];

// ============================================================================
// OFFICIAL DU AFFILIATED ENGINEERING COLLEGES — B.Sc. in EEE SYLLABUS
// (162.00 Credits across 8 Semesters)
// ============================================================================
const EEE = [
  // Semester I (1st Year 1st Semester) — Subtotal: 21.00 Credits
  [
    course(
      'EEE 1101',
      'Electrical Circuit I',
      3.0,
      'Circuit Variables & Elements: Voltage, Current, Power, Energy, Independent/Dependent Sources, Resistance, Inductance & Capacitance; Basic DC Circuit Laws & Simplifications: Ohm Law, Kirchhoff Laws (KVL/KCL), Series-Parallel Equivalents, Voltage/Current Dividers & Delta-Wye Transformations; General DC Circuit Analysis & Network Theorems: Node-Voltage Method, Mesh-Current Method, Source Transformations, Superposition, Thevenin/Norton Equivalents & Maximum Power Transfer; Inductors, Capacitors & DC Transients: Series-Parallel L/C Combinations, Transient & Steady-State Response with DC Excitation; Sinusoidal Steady-State AC Fundamentals: AC Voltage, Current, Power, Peak/Form/Power Factors, Phasors, Impedance, Admittance, Reactance & Susceptance of R-L-C Circuits; General AC Circuit Analysis & Power: Node/Mesh Analysis, Source Transformations, Thevenin/Norton, Phasor Diagrams, RMS, Real/Reactive Power, Maximum Power Transfer & Impedance Matching'
    ),
    course(
      'EEE 1102',
      'Electrical Circuit I Sessional',
      1.5,
      'Familiarization with Laboratory Measuring Instruments & Verification of Ohm Law, KVL and KCL; Experimental Verification of Superposition, Thevenin, Norton & Maximum Power Transfer Theorems; R-L, R-C & R-L-C AC Sinusoidal Steady-State & Phasor Measurements; Lab Reports & Viva Preparation'
    ),
    course(
      'CSE 1101',
      'Computer Programming',
      3.0,
      'Introduction to Digital Computers, Programming Languages, Algorithms & Flowcharts; Structured Programming in C — Basics & Control Flow: Variables, Constants, Operators, Expressions & Conditional/Loop Control Statements; Functions, Arrays & Pointers: Modular Functions, Recursion, 1D/2D Arrays & Pointer Operations; User-Defined Data Types & File I/O: Structures, Unions, Enumerations & File Read/Write Operations; Object-Oriented Programming in C++: Classes, Objects, Encapsulation, Function/Operator Overloading, Inheritance & Polymorphism'
    ),
    course(
      'CSE 1102',
      'Computer Programming Sessional',
      1.5,
      'Part I — Structured C Programming Lab: Control Structures, Arrays, Functions, Pointers, Structures & File Handling; Part II — Object-Oriented C++ & Software Program Design Project; Lab Coding Tests & Viva Preparation'
    ),
    course(
      'CE 1102',
      'Computer Aided Engineering Drawing',
      1.5,
      'Drawing Fundamentals: Lettering, Numbering, Headings & Use of Drawing Instruments; Sectional Views & Isometric Views of Solid Geometrical Figures; Plan, Elevation & Section of Multi-Storied Buildings, Building Services Drawings & Detailed Drawings of Lattice Towers; Introduction to CAD & 2D/3D Drafting using AutoCAD'
    ),
    course(
      'PHY 1101',
      'Electricity and Magnetism, Modern Physics and Mechanics',
      3.0,
      'Electrostatics & Current Electricity: Coulomb Law, Electric Field/Flux, Gauss Law (Vector Form & Applications), Electric Potential, Capacitors/Dielectrics, Current Density, Ohm Law & Resistivity; Electromagnetism & Maxwell Equations: Magnetic Field, Biot-Savart Law, Ampere Law, Faraday Law, Lenz Law, Self/Mutual Inductance, Magnetic Materials, Magnetization Curves & Maxwell Equations; Special Theory of Relativity & Quantum Physics: Galilean/Einstein Relativity, Lorentz Transformations, Length Contraction, Time Dilation, Mass-Energy Relation, Photoelectric/Compton Effects & De Broglie Matter Waves; Nuclear Physics: Atomic Nucleus Constituents, Binding Energy, Radioactive Decay Law, Half/Mean Life, Nuclear Fission/Fusion, Chain Reactions & Atomic Power Plants; Classical Mechanics & Gravitation: Linear/Angular Momentum Conservation, Newton Law of Gravitation, Kepler Laws of Planetary Motion, Satellite Motion & Escape Velocity; Introductory Quantum Mechanics: Wave Function, Heisenberg Uncertainty Principle, Time-Dependent/Independent Schrodinger Equations, Expectation Value & Particle in a Zero Potential'
    ),
    course(
      'PHY 1102',
      'Electricity and Magnetism, Modern Physics and Mechanics Sessional',
      1.5,
      'Electricity & Magnetism Experiments: P.O. Box, Potentiometer, Galvanometer, Magnetic Field & Inductance Measurements; Mechanics & Gravitation Experiments: Moment of Inertia, Compound Pendulum & Spring Constant; Modern Physics Experiments: Photoelectric Effect, Planck Constant & Characteristic Curves'
    ),
    course(
      'MATH 1101',
      'Differential & Integral Calculus and Co-ordinate Geometry',
      3.0,
      'Differential Calculus: Continuity, Differentiability, Successive Differentiation (Leibniz Theorem), Lagrange/Cauchy Remainders, Series Expansions & L Hospital Rule; Partial Differentiation & Applications: Euler Theorem, Tangents/Normals, Subtangent/Subnormal in Cartesian & Polar Coordinates and Maxima/Minima of Single-Variable Functions; Integral Calculus: Definite Integrals, Wallis Formula, Improper Integrals & Beta and Gamma Functions; Geometric Applications of Integration: Plane Area, Arc Length, Volume & Surface Area of Solids of Revolution (Cartesian/Polar) and Multiple Integrals; 2D Coordinate Geometry: Transformation of Axes, Reduction of Second-Degree Equations, Pair of Straight Lines, System of Circles & Coaxial Circles; Conic Sections: Parabola, Ellipse & Hyperbola Equations, Tangents/Normals, Chord of Contact, Pole/Polar, Parametric Coordinates, Conjugate Diameters & Asymptotes'
    ),
    course(
      'GED 1101',
      'English for Technical Communication',
      3.0,
      'Phonetics & Syntax: Approaches to Learning English, Correct Pronunciation, Vocabulary, Diction, Sentence Variety/Style & Common Grammatical Problems; Reading & Comprehension: Readability, Purposive Reading Strategies, Idea Generation & Analysis of Selected Stories; Effective Writing Principles: Planning, Organization, Paragraph/Essay Composition & Precis Writing; Technical & Business Communication: Business Letters, Tenders, Quotations, Journal Articles & Technical Reports; Listening & Speaking Skills: Lecture Note-Taking, Peer Dialogues, Group Discussions, Debates, Extempore Speech, Storytelling & Presentations'
    ),
  ],

  // Semester II (1st Year 2nd Semester) — Subtotal: 22.50 Credits
  [
    course(
      'EEE 1201',
      'Electrical Circuits II',
      3.0,
      'Non-Sinusoidal Excitations & AC Transients: Power and Power Factor of Multi-Frequency AC Circuits & Transient Response in AC Networks; Resonance in AC Circuits: Series and Parallel Resonance, Bandwidth, Selectivity & Quality (Q) Factor; Passive Filter Networks: Characteristic Impedance, Attenuation, Ladder Networks, Low-Pass/High-Pass Filters, Propagation Coefficient, Time Delay & Practical Composite Filters; Magnetically Coupled Circuits: Mutual Inductance, Dot Convention, Coupled Impedance & Ideal/Linear Transformers; Polyphase (Three-Phase) Circuit Analysis: Balanced and Unbalanced Three-Phase Supplies/Loads, Power Calculations, Two-Wattmeter Measurement & Power Factor Improvement; Magnetic Circuits & Materials: Flux Density, MMF, Permeability, B-H Curve, Reluctance, Ohm/Ampere Laws for Series-Parallel Magnetic Circuits, Hysteresis Loss & Magnetic Materials'
    ),
    course(
      'EEE 1202',
      'Electrical Circuits II Sessional',
      1.5,
      'Hardware & Simulation (PSpice/Proteus/Multisim) Verification of Series/Parallel Resonance & Passive Filters; Balanced and Unbalanced Three-Phase Circuit Power Measurement & Power Factor Correction; Magnetic Circuit & Mutually Coupled Inductor Experiments'
    ),
    course(
      'EEE 1203',
      'Electrical Properties of Materials',
      3.0,
      'Crystal Structures & Classical Conduction: Crystal Types, Lattice/Basis, Bravais Lattices, Miller Indices, Drift/Scattering Mobility, Matthiessen Rule, Hall Effect & Thermal Conductivity; Introductory Quantum Mechanics: Wave Nature of Electrons, Schrodinger Equation, 1D/3D Infinite Quantum Well, Potential Step/Barrier, Heisenberg Uncertainty & Hydrogen Atom; Band Theory of Solids & Carrier Statistics: Molecular Orbitals, Bloch Theorem, Kronig-Penney Model, Brillouin Zones, Effective Mass, Density of States, Maxwell-Boltzmann & Fermi-Dirac Distributions; Modern Theory of Metals: Fermi Energy Calculation, Average Electron Energy & Classical/Quantum Specific Heat; Dielectric & Magnetic Properties of Materials: Electronic/Ionic/Orientational/Interfacial Polarization, Clausius-Mossotti Equation, Dielectric Loss, Piezo/Ferro/Pyro-Electricity, Magnetic Moments, Domains & Ferromagnetism; Superconductivity & Metamaterials: Zero Resistance, Meissner Effect, Type-I/Type-II Superconductors, Critical Current, BCS Theory, Josephson Junctions, Magnetic Recording & Metamaterials'
    ),
    course(
      'PHY 1201',
      'Waves and Oscillations, Optics and Thermal Physics',
      3.0,
      'Waves and Oscillations: Simple Harmonic Oscillator, Lissajous Figures, Spring-Mass, Torsional Pendulum, Two-Body Reduced Mass, Damped/Forced Oscillations & Resonance; Wave Motion: Progressive/Stationary Transverse and Longitudinal Waves, Wave Power/Intensity & Phase and Group Velocity; Optics — Interference: Light Theories, Young Double Slit, Fringe Displacement, Fresnel Bi-Prism, Thin Films, Newton Rings & Interferometers; Optics — Diffraction & Polarization: Single/Double/N-Slit Diffraction, Resolving Power, Diffraction Grating, Brewster/Malus Laws, Double Refraction, Nicol Prism, Optical Activity & Polarimeters; Thermal Physics & Kinetic Theory: First Law of Thermodynamics, Molar Specific Heats, Isothermal/Adiabatic Processes, Equipartition of Energy, Mean Free Path & Maxwell Speed Distribution; Second Law & Thermodynamic Potentials: Reversible/Irreversible Processes, Carnot Cycle/Theorem, Entropy, Thermodynamic Functions, Maxwell Relations & Clausius-Clapeyron Equation'
    ),
    course(
      'PHY 1202',
      'Waves and Oscillations, Optics and Thermal Physics Sessional',
      1.5,
      'Waves & Harmonic Motion Experiments: Spring-Mass System, Torsional Pendulum & Melde Tuning Fork Apparatus; Optics Experiments: Newton Rings, Fresnel Bi-Prism, Spectrometer Diffraction Grating & Polarimeter; Thermal Physics Experiments: Lee Disc Thermal Conductivity, Specific Heat & Mechanical Equivalent of Heat'
    ),
    course(
      'MATH 1201',
      'Differential Equations and Complex Variables',
      3.0,
      'First-Order Ordinary Differential Equations: Formation of ODEs, First-Order/First-Degree Methods & First-Order/Higher-Degree Equations; Higher-Order Linear ODEs: Second and Higher-Order Equations with Constant Coefficients & Euler Homogeneous Linear Differential Equations; Partial Differential Equations (PDEs): Linear/Non-Linear First-Order Standard Forms, Higher-Order Linear PDEs & Second-Order Variable-Coefficient PDEs; Functions of a Complex Variable: Complex Number System, Limits, Continuity, Analytic Functions & Cauchy-Riemann Equations; Complex Integration & Power Series: Infinite Series, Uniform Convergence, Complex Line Integrals, Cauchy Integral Formula, Liouville Theorem & Taylor/Laurent Series; Singularities & Residue Calculus: Classification of Singular Points, Residues, Cauchy Residue Theorem & Contour Integration'
    ),
    course(
      'CHEM 1201',
      'Chemistry',
      3.0,
      'Atomic Structure, Periodic Table & Chemical Bonding: Quantum Numbers, Electronic Configuration, Noble Gases & Ionic/Covalent/Coordinate/Metallic Bonds; Acids, Bases & Volumetric Titration: Modern Acid-Base Concepts, Acid-Base Titration Calculations, Ionization of Water & pH; Electrochemistry & Cells: Electrolytic Conduction, Transport Number, Kohlrausch Law, Cell EMF, Single Electrode Potentials & Lead/Alkaline Accumulators; Solutions & Colligative Properties: Solution Classifications, Raoult Law, Elevation of Boiling Point, Depression of Freezing Point & Osmotic Pressure; Thermochemistry, Chemical Kinetics & Chemical Equilibria'
    ),
    course(
      'CHEM 1202',
      'Chemistry Sessional',
      1.5,
      'Volumetric Analysis Techniques & Standard Solution Preparation; Acid-Base Neutralization Titrations; Oxidation-Reduction (Redox) Titrations; Quantitative Volumetric Determination of Iron (Fe), Copper (Cu) & Calcium (Ca)'
    ),
    course(
      'GED 1201',
      'Bangladesh Studies',
      3.0,
      'History & Society of Bengal: Impact of British and Pakistan Rule on Economy and Education; Emergence of Bangladesh: Language Movement of 1952, Mass Upsurge of 1969 & War of Independence in 1971; Geography, Ecology & Natural Resources: Location, Boundaries, River System, Climate & Resources of Bangladesh; Social Structure, Language, Literature, Art & Culture of Bangladesh; Political Parties, Constitutional Development, Economy, Sectoral Achievements & Socio-Cultural Prospects'
    ),
  ],

  // Semester III (2nd Year 1st Semester) — Subtotal: 21.00 Credits
  [
    course(
      'EEE 2101',
      'Electronics I',
      3.0,
      'Semiconductor Diodes & Applications: PN Junction Physics, DC/AC Diode Models, Single-Phase Rectifiers, Filters, Zener Regulators, Clippers, Clampers, Photodiodes, LEDs & DC Power Supplies; Bipolar Junction Transistors (BJT): Structure, DC Biasing, Stability, CE/CB/CC Small-Signal Amplifier Configurations, AC Load Lines & Multistage BJT Amplifiers; BJT Frequency Response: System Transfer Functions, Coupling/Bypass/Internal Capacitances & Low/High-Frequency Response of BJT Amplifiers; Field Effect Transistors (JFET & MOSFET): Structure, I-V Characteristics, DC Biasing, Constant-Current Biasing & MOS Device Models; FET Amplifiers: Common-Source (CS), Common-Gate (CG), Source-Follower (CD), Single-Stage IC MOSFET Amplifiers, Multistage FETs & Frequency Response; Power Amplifiers: Power Transistors, Amplifier Classes, Class-A & Class-AB Push-Pull Complementary Output Stages'
    ),
    course(
      'EEE 2102',
      'Electronics I Sessional',
      1.5,
      'Hardware & Simulation (PSpice/Proteus/Multisim) of Diode Rectifiers, Clippers, Clampers & Zener Voltage Regulators; BJT & MOSFET Characteristic Curves, DC Biasing & CE/CS Amplifier Gain and Frequency Response; Class-A and Class-AB Push-Pull Power Amplifier Testing'
    ),
    course(
      'EEE 2103',
      'Energy Conversion I',
      3.0,
      'DC Generators: Construction, Types, No-Load Magnetization Curve, Voltage Build-up of Self-Excited Shunt Generators, Load-Voltage Characteristics, Speed Effects, Armature Reaction & Voltage Regulation; DC Motors: Operating Principle, Counter EMF, Torque-Speed Characteristics of Series/Shunt/Compound Motors, Starting, Braking & Speed Control Methods; Single-Phase Transformers: Principle, Construction, No-Load/Excitation Current, Leakage Flux, Equivalent Circuit, Open/Short-Circuit Tests, Per-Unit System, Voltage Regulation, Losses & Efficiency; Transformer Polarity, Vector Groups & Parallel Operation of Single-Phase and Three-Phase Transformers; Three-Phase Transformers & Harmonics: Excitation Harmonics, Inrush Current, Three-Phase Connections (Y/Delta) & Harmonic Suppression; Special Transformers: Autotransformers, Current Transformers (CT) & Potential Transformers (PT)'
    ),
    course(
      'EEE 2104',
      'Energy Conversion I Sessional',
      1.5,
      'No-Load and Load Characteristics of Self-Excited and Separately-Excited DC Shunt/Compound Generators; Starting, Speed Control & Torque-Speed Characteristics of DC Shunt and Series Motors; Single-Phase & Three-Phase Transformer Open-Circuit, Short-Circuit, Polarity, Regulation & Parallel Operation Tests'
    ),
    course(
      'EEE 2108',
      'Electrical and Electronic Workshop Practice',
      1.5,
      'Electrical & Electronic Safety, Soldering, PCB Layout Design, Etching & Component Assembly; Domestic & Industrial Electrical Wiring, Switching, Fuse/MCB Protection & Troubleshooting; Design, Fabrication & Testing of Practical Electrical/Electronic Hardware Mini-Projects'
    ),
    course(
      'ME 2101',
      'Basic Mechanical Engineering',
      3.0,
      'Sources of Energy & Steam Engineering: Boilers/Steam Generating Units with Accessories and Mountings & Steam Turbines; Internal Combustion Engines & Gas Turbines: SI/CI Engine Cycles (Otto, Diesel, Dual), Operation & Gas Turbine Cycles; Refrigeration and Air Conditioning: Refrigerants, Vapor Compression/Absorption Refrigeration & Psychrometric Air Conditioning Applications; Fluid Machinery: Reciprocating & Centrifugal Pumps, Impulse/Reaction Hydraulic Turbines (Pelton Wheel, Francis, Kaplan), Fans, Blowers & Compressors; Heat Transfer Fundamentals: Modes of Conduction and Convection & Critical Thickness of Insulation'
    ),
    course(
      'ME 2102',
      'Basic Mechanical Engineering Sessional',
      1.5,
      'Study and Performance Testing of IC Engines (Petrol/Diesel) & Boiler Models; Performance Characteristics of Centrifugal/Reciprocating Pumps and Pelton/Kaplan Hydraulic Turbines; Refrigeration, Air Conditioning & Heat Transfer Laboratory Experiments'
    ),
    course(
      'MATH 2101',
      'Linear Algebra and Vector Analysis',
      3.0,
      'Systems of Linear Equations & Matrices: Gaussian Elimination, Matrix Inverse, Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem; Vector Spaces & Subspaces: Euclidean n-Space, Real Vector Spaces, Basis, Dimension, Change of Basis, Rank & Nullity; Linear Transformations & Inner Product Spaces: Kernel, Range, Properties of Linear Maps from R^n to R^m, Orthogonality & Matrix Diagonalization; Vector Algebra: Addition, Resolution, Position Vectors, Scalar/Vector/Triple Products, Linear Independence & Geometric/Mechanical Applications; Vector Differential & Integral Calculus: Vector Differentiation, Gradient, Divergence, Curl & Line, Surface and Volume Integrals; Integral Theorems: Green Theorem, Gauss Divergence Theorem & Stokes Theorem with Physical Applications'
    ),
    course(
      'GED 2101',
      'Financial Account & Economic Analysis',
      3.0,
      'Financial Accounting Fundamentals: Accounting Principles, Transactions, Journal, Ledger, Cash Book, Bank Reconciliation & Financial Statements; Cost & Management Accounting: Cost Classification, Cost Sheets, Overhead Allocation, Relevant Costing, Standard Costing, Material Variance & Break-Even Analysis; Microeconomics — Demand & Production: Demand/Supply Elasticity, Price Determination, Indifference Curves, Marginal Analysis & Production Functions; Market Structure & Firm Optimization: Cost Functions, Small/Large-Scale Production, Market Structures, Optimization & Distribution Theory; Macroeconomics & Development: National Income, Savings, Investment, Employment, Inflation & Monetary/Fiscal/Trade Policies of Bangladesh'
    ),
  ],

  // Semester IV (2nd Year 2nd Semester) — Subtotal: 19.50 Credits
  [
    course(
      'EEE 2201',
      'Electronic II',
      3.0,
      'Operational Amplifiers & Linear/Non-Linear Applications: Inverting, Non-Inverting, Summing, Differential, Logarithmic, Exponential, OTA, Differentiator, Integrator, V-to-I Converter, Voltage Follower & Non-Ideal Op-Amp Characteristics; IC Biasing & Active Loads: BJT/FET Current Mirrors, Widlar/Wilson Current Sources, NMOS Current Source Design & Small-Signal Analysis with Active Loads; Differential & Multistage IC Amplifiers: BJT/FET Differential Pairs, Active-Loaded Differential Amplifiers, BiCMOS Circuits, Gain/Output Stages & Internal Circuitry of 741 BJT Op-Amp; Frequency Response of Amplifiers: Poles, Zeros, Bode Plots, Miller Theorem, 3-dB Bandwidth of Single-Stage, Cascode, Multistage & Differential Amplifiers; Feedback Amplifiers & Stability: Series-Series, Shunt-Shunt, Series-Shunt & Shunt-Series Topologies, Loop Gain, Nyquist/Bode Stability & Frequency Compensation; Active Filters, Oscillators & IC Timers: Butterworth/Chebyshev Active Bandpass/Lowpass Filters, Sinusoidal Oscillators (Wien Bridge, Phase-Shift, Colpitts, Hartley), Schmitt Trigger, 555 Timer IC & Voltage Regulators'
    ),
    course(
      'EEE 2202',
      'Electronic II Sessional',
      1.5,
      'Op-Amp Linear & Non-Linear Circuits: Inverting/Non-Inverting/Differential Amplifiers, Integrator, Differentiator & Schmitt Trigger; Active Low-Pass, High-Pass & Band-Pass Filter Design and Frequency Response; Sinusoidal Oscillators, 555 Timer Astable/Monostable Multivibrators & IC Voltage Regulators'
    ),
    course(
      'EEE 2203',
      'Energy Conversion II',
      3.0,
      'Three-Phase Induction Motors: Rotating Magnetic Field, Squirrel-Cage/Wound-Rotor Construction, Slip, Equivalent Circuit, Air-Gap/Mechanical Power, Torque-Speed Characteristics & NEMA Classes; Induction Motor Testing, Control & Induction Generators: No-Load/Blocked-Rotor Tests, Per-Unit Parameters, Starting, Braking, Speed Control & Wind Turbine Induction Generators; Synchronous Generators (Alternators): Construction, Exciter Systems, Distributed Short-Pitched Winding EMF, Harmonics, Equivalent Circuit, Synchronous Impedance & Voltage Regulation; Salient-Pole Synchronous Machines: Two-Reaction (d-q Axes) Theory, Phasor Diagrams, Slip Test & Power-Angle Characteristics; Parallel Operation of Alternators: Synchronization Conditions, Synchronoscope, Hunting/Oscillation, Active Load Sharing (Droop Control), Reactive Load Sharing (Voltage Control) & House Diagrams; Synchronous Motors: Starting Methods, Load/Excitation Variation Effects, V-Curves, Inverted V-Curves, Synchronous Condenser & Power Factor Correction'
    ),
    course(
      'EEE 2204',
      'Energy Conversion II Sessional',
      1.5,
      'Three-Phase Induction Motor No-Load, Blocked-Rotor, Load Performance & Speed Control Experiments; Synchronous Generator Open-Circuit, Short-Circuit, Voltage Regulation & Parallel Synchronization Tests; Synchronous Motor V-Curves & Power Factor Correction Experiments'
    ),
    course(
      'EEE 2205',
      'Engineering Electromagnetics',
      3.0,
      'Electrostatics: Coulomb Law, Gauss Law, Electric Potential, Conductors & Dielectrics in Static Fields, Boundary Conditions, Electrostatic Energy & Capacitance Calculation; Electrostatic Boundary Value Problems: Poisson and Laplace Equations in Cartesian, Cylindrical & Spherical Coordinates; Steady Electric Current: Current Density, Ohm Point Form, Continuity Equation, Joule Law & Resistance Calculation; Magnetostatics: Biot-Savart Law, Ampere Circuital Law, Vector Magnetic Potential, Magnetic Dipole, Magnetization, Boundary Conditions, Magnetic Energy/Forces & Inductance; Time-Varying Fields & Maxwell Equations: Faraday Law, Displacement Current, Differential/Integral Maxwell Equations, Retarded Potentials, Time-Harmonic Fields & Poynting Theorem; Plane Electromagnetic Waves: Propagation in Lossless/Lossy Dielectrics and Good Conductors, Skin Depth, Polarization, Phase/Group Velocity & Normal/Oblique Reflection and Refraction'
    ),
    course(
      'EEE 2208',
      'Electrical Services Design',
      1.5,
      'Building Codes, Symbols & CAD Drafting: BNBC, NFPA Standards, Electrical Legends & AutoCAD Electrical Layout; Illumination & Lighting Design: Lux, Lumen, Luminaire Selection & Lighting Calculations for Domestic, Office and Industrial Buildings; Low & High-Rise Electrical Distribution Design: Load Estimation, Conductor/Circuit Breaker Sizing, Bus-Bar Trunking (BBT) & Single-Line Diagrams (11kV/0.415kV, 500kVA Substation & 200kVA Pole Transformer); Earthing & Lightning Protection Systems: Earth Resistance Calculation, Earthing Methods & Lightning Arrester Layout; Low-Voltage Telecommunication & Security Systems: UTP/Fiber Optic Cabling, Intercom/PABX, Public Address (PA), CATV, LAN/Wi-Fi, CCTV & Burglar Alarm Design; Fire Safety & Building HVAC/Lift Services: Smoke/Heat Fire Detection, Voice Evacuation, Sprinkler/Hose Firefighting & AC/Elevator Electrical Provisioning'
    ),
    course(
      'MATH 2201',
      'Statistics & Probability',
      3.0,
      'Descriptive Statistics: Frequency Distributions, Mean, Median, Mode, Standard Deviation, Variance, Moments, Skewness & Kurtosis; Probability & Random Variables: Elementary Probability, Conditional Probability, Discrete & Continuous Random Variables, Expectation & Moment Generating Functions; Probability Distributions: Binomial, Poisson, Negative Binomial, Normal, Exponential & Derived Distributions; Point & Interval Estimation: Method of Moments, Maximum Likelihood Estimation (MLE), Bayesian Analysis & Confidence Intervals; Hypothesis Testing & Nonparametric Tests: Parametric Z/t/Chi-Square Tests, Nonparametric Tests & Analysis of Variance (ANOVA); Regression & Correlation Analysis: Simple and Multiple Linear Regression, Model Selection & Estimation Theory in Engineering'
    ),
    course(
      'GED 2201',
      'Professional Ethics and Moral Thoughts',
      3.0,
      'Foundations of Ethics & Moral Philosophy: Definition, Need for Ethics, Ethical Dilemmas, Reasons for Unethical Behavior & Moral Frameworks; Engineering as a Profession: Definition, Objectives, Code of Professional Ethics & History/Development of Engineering Ethics; Applied Ethics & Engineer Qualities: Human Qualities of an Engineer, Obligations to Clients/Public & Peer-to-Peer Engineer Relationships; Ethical Expectations in Workplace: Employer-Employee Rights, Inter-Professional Relations & Improving the Engineering Profession; Institutionalization of Ethical Conduct: Role of Professional Societies (IEB/IEEE) & Characteristics of Professional Codes'
    ),
  ],

  // Semester V (3rd Year 1st Semester) — Subtotal: 21.00 Credits
  [
    course(
      'EEE 3101',
      'Electrical Measurement & Instrumentation',
      3.0,
      'Measurement Fundamentals & Error Analysis: Methods of Measurement, Statistical Error Analysis, Uncertainty & Instrument Calibration; Resistance, Inductance & Capacitance Measurement: Low/Medium/High Resistance (Kelvin Double Bridge, Megger), AC/DC Bridges (Wheatstone, Maxwell, Hay, Schering, Wien), Earth/Insulation Resistance & Cable Fault Localization (Murray/Varley Loop); Magnetic Measurements: Ballistic Galvanometer, Fluxmeter, B-H Curve Determination & Separation of Eddy Current and Hysteresis Iron Losses; Electromechanical & Energy Measuring Instruments: Ammeters, Voltmeters, Electrodynamometer Wattmeters, Single/Three-Phase Energy Meters, Maximum Demand Meters, Tachometers, Frequency, Phase & Illumination Meters; Electronic Instruments & Range Extension: Digital Voltmeters/Multimeters, VTVM, Q-Meter, Cathode Ray Oscilloscope (CRO) & Instrument Transformers (CT and PT Burden/Errors); Transducers & Non-Electrical Instrumentation: Substation Instrumentation, Resistive/Inductive/Capacitive Transducers, Strain Gauges, RTD/Thermocouples, LVDT & Measurement of Temperature, Pressure, Displacement, Velocity and Acceleration'
    ),
    course(
      'EEE 3102',
      'Electrical Measurement & Instrumentation Sessional',
      1.5,
      'DC/AC Bridge Measurements of Resistance, Inductance, Capacitance & Earth/Insulation Resistance; Calibration of Single/Three-Phase Energy Meters, Wattmeters & Instrument Transformers (CT/PT); Transducer, Strain Gauge, Temperature/Displacement Sensor & CRO Measurement Experiments'
    ),
    course(
      'EEE 3103',
      'Digital Electronics',
      3.0,
      'Number Systems, Codes & Boolean Algebra: Binary/Octal/Hexadecimal, BCD/Gray/ASCII Codes, De Morgan Laws, Truth Tables & Karnaugh Map / Quine-McCluskey Minimization; CMOS & BiCMOS Digital Logic Families: Static CMOS, NMOS, BiCMOS, TTL & ECL Gate Implementations, Noise Margin & Propagation Delay; Combinational Logic & Arithmetic Circuits: Half/Full Adders, Carry-Lookahead Adder, ALU, Comparators, Decoders, Encoders, Multiplexers & Demultiplexers; Programmable Logic Devices (PLDs): ROM, PROM, EPROM, PLA, PAL & Field Programmable Logic Arrays (FPLA/FPGA); Sequential Logic & ASM Design: Latches, SR/JK/D/T Flip-Flops, Algorithmic State Machine (ASM) Charts, Timing Analysis (Setup/Hold) & Power Optimization; Modular Sequential Circuits: Shift Registers, Asynchronous/Synchronous Counters, Ring/Johnson Counters & Digital System Applications'
    ),
    course(
      'EEE 3104',
      'Digital Electronics Sessional',
      1.5,
      'Implementation and Testing of CMOS/TTL Logic Gates, Adders, Subtractors, Multiplexers & Decoders; Design of Flip-Flops, Synchronous/Asynchronous Counters & Shift Registers; Sequential State Machine (ASM) & Programmable Logic Mini-Project'
    ),
    course(
      'EEE 3105',
      'Power System I',
      3.0,
      'Power Supply Systems & Power Factor Improvement: AC/HV Transmission Overview, Economic Choice of Conductor Size (Kelvin Law) & Transmission Voltage, Causes of Low Power Factor & PF Correction; Mechanical Design of Overhead Lines: Conductor Materials (ACSR), Line Supports, Sag & Tension Calculations, Insulator Types, String Efficiency & Corona Power Loss; Transmission Line Parameters (Inductance & Capacitance): Internal/External Flux Linkages, GMD/GMR, Single/Three-Phase Symmetrical & Unsymmetrical Spacing, Transposition, Double Circuits, Bundled Conductors & Earth Effect; Performance of Transmission Lines: Short, Medium (Nominal-T, Nominal-Pi) & Long Transmission Line Rigorous Models, ABCD Constants & Ferranti Effect; Underground Cables: Oil-Filled, Gas-Insulated & XLPE Construction, Dielectric Stress, Grading, Capacitance, Charging Current, Dielectric Loss, Skin/Proximity Effects & Fault Location; Distribution Systems & Voltage Control: Radial, Ring-Main & Interconnected AC/DC Distribution, Feeder Reconfiguration, Tap-Changing/Booster/Phase-Shifting Transformers & Shunt/Series Capacitor Voltage Control'
    ),
    course(
      'EEE 3106',
      'Power System I Sessional',
      1.5,
      'ABCD Parameters, Voltage Regulation & Efficiency of Short, Medium and Long Transmission Line Models; Insulator String Voltage Distribution, Underground Cable Characteristics & Power Factor Improvement Experiments; Radial/Ring Distribution System & Voltage Control Simulation Studies'
    ),
    course(
      'EEE 3107',
      'Power Electronics and Industrial Drives',
      3.0,
      'Power Semiconductor Devices: Structure, I-V Characteristics, Switching, Snubber Protection & Gate/Base Drive Circuits of Power Diode, BJT, MOSFET, IGBT & Thyristors (SCR, TRIAC, GTO); AC-to-DC Converters (Rectifiers): Single-Phase and Three-Phase Uncontrolled & Phase-Controlled Half/Full-Wave Bridge Rectifiers, Effect of Source Inductance & Dual Converters; DC-to-DC Converters (Choppers & Switching Regulators): Step-Down, Step-Up, Four-Quadrant Choppers & Buck, Boost and Buck-Boost Switched-Mode Regulators; DC-to-AC Converters (Inverters): Single-Phase & Three-Phase Voltage-Source Inverters (120/180-Degree Conduction), Sinusoidal PWM & Harmonic Reduction; AC-to-AC Converters: Single-Phase and Three-Phase AC Voltage Controllers (Phase Control) & Cycloconverters; Industrial Motor Drives & Heating Applications: DC Motor Chopper/Rectifier Speed Control & Braking, Scalar (V/f) Control of Three-Phase Induction Motors, Electric Arc Furnace, Induction & Dielectric Heating'
    ),
    course(
      'EEE 3108',
      'Power Electronics and Industrial Drives Sessional',
      1.5,
      'SCR, MOSFET & IGBT Switching Characteristics and Triggering Circuits; Single/Three-Phase Controlled Rectifiers, Buck/Boost DC-DC Choppers & PWM Inverters; AC Voltage Controller & Solid-State DC/Induction Motor Speed Control Experiments'
    ),
    course(
      'GED 3101',
      'Engineering Management',
      3.0,
      'Business & Contract Law: Elements of Valid Contracts, Consideration, Sale of Goods, Hire-Purchase & Negotiable Instruments; Industrial Law in Bangladesh: Payment of Wages Ordinances, Factory/Shop/Industrial Employment Legislation & Trade Union Acts; Human Resource Management & MIS: Motivation, Leadership, Group Decision Making, Job Gradation, Performance Appraisal, Reward Systems & Management Information Systems; Marketing Management: Marketing Strategies, Market Research, Consumer/Business Market Analysis, Segmentation, Targeting & Competitive Positioning; Industrial Safety & Risk Management: Modern Safety Concepts, Industrial Hazards, Worker Health/Safety Standards, Fire Safety & Hazardous Materials Management'
    ),
  ],

  // Semester VI (3rd Year 2nd Semester) — Subtotal: 19.50 Credits
  [
    course(
      'EEE 3201',
      'Communication Engineering Fundamentals',
      3.0,
      'Overview of Communication Systems & Noise: Fundamental Elements, Bandwidth, Transmission Media, Thermal/Shot/White Noise & Signal-to-Noise Ratio (SNR); Information Theory: Measure of Information (Entropy), Source Encoding (Huffman/Shannon-Fano) & Shannon-Hartley Channel Capacity of Continuous/Discrete Memoryless Channels; Continuous-Wave Amplitude Modulation: Baseband vs Carrier Transmission, AM, DSB-SC, SSB, VSB, QAM, Spectral Analysis & Envelope/Coherent Detection; Angle Modulation (FM & PM): Instantaneous Frequency, Narrowband/Wideband FM, Carson Rule, Bessel Functions, FM Generation & Demodulation; Pulse Modulation & Digitization: Sampling Theorem, Nyquist Criterion, Aliasing, PAM, PCM Quantization/Companding, SQNR, DPCM, Delta Modulation (DM), Adaptive DM & Line Coding; Digital Carrier Modulation & Multiplexing: ASK/OOK, BPSK, DPSK, QPSK, FSK, MSK, Noise/BER Performance, TDM, FDM, WDM, TDMA, FDMA & CDMA Spread Spectrum'
    ),
    course(
      'EEE 3202',
      'Communication Engineering Fundamentals Sessional',
      1.5,
      'Amplitude Modulation (AM/DSB-SC/SSB) & Frequency Modulation (FM) Generation and Demodulation; Sampling, PAM, Pulse Code Modulation (PCM), Delta Modulation & Line Coding Experiments; Digital Modulation (ASK, FSK, BPSK, QPSK) & TDM/FDM Multiplexing Hardware/MATLAB Experiments'
    ),
    course(
      'EEE 3203',
      'Power System II',
      3.0,
      'Power System Load Flow Analysis: Bus Classification, Y-Bus Formulation, Gauss-Seidel, Newton-Raphson & Decoupled Load Flow Methods; Symmetrical Three-Phase Fault Analysis: Synchronous Machine Transient/Subtransient Reactances, Short-Circuit Currents, Z-Bus & Circuit Breaker Rating Selection; Symmetrical Components & Sequence Networks: Positive, Negative & Zero-Sequence Networks of Generators, Transformers and Transmission Lines; Unsymmetrical Fault Analysis: Single Line-to-Ground (L-G), Line-to-Line (L-L) & Double Line-to-Ground (L-L-G) Solid and Impedance Faults; Power System Stability: Rotor Dynamics, Swing Equation, Power-Angle Equation, Equal-Area Criterion, Multi-Machine Stability & Step-by-Step Numerical Solution; Reactive Power, FACTS, HVDC, Power Quality & Substations: FACTS Devices, HVDC Transmission, Harmonics/Voltage Sag/Swell & Substation Busbar Arrangements'
    ),
    course(
      'EEE 3205',
      'Signals and Systems',
      3.0,
      'Classification of Signals and Systems: Continuous/Discrete, Energy/Power, Periodic/Aperiodic, Impulse/Step/Ramp Signals & System Properties (Linearity, Causality, Time-Invariance, Memory, Stability, Invertibility); Time-Domain Analysis of Continuous LTI Systems: Differential Equation Representation, Zero-Input/Zero-State Response, Impulse Response & Convolution Integral; State-Variable Analysis: State Equations, State Transition Matrix & Time-Domain Solution of LTI Systems; Fourier Series & Fourier Transform: Trigonometric/Exponential Fourier Series, Continuous-Time Fourier Transform (CTFT), Properties, Transfer Function & Distortionless Transmission; Applications of Time/Frequency Analysis: Analog Electrical/Mechanical Networks, AM Modulation/Demodulation & TDM/FDM Multiplexing; Laplace Transform in System Analysis: ROC, Inverse Transform, Unilateral Laplace Transform, System Poles/Zeros, Stability & Frequency Response'
    ),
    course(
      'EEE 3207',
      'Numerical Methods',
      3.0,
      'Computer Algorithms, Error Analysis & Mathematical Modeling of Physical/Electrical Systems; Iterative Root-Finding Techniques: Bisection, False Position, Fixed-Point Iteration, Newton-Raphson & Secant Methods; Solution of Simultaneous Linear Equations: Gauss Elimination, Gauss-Jordan, LU Factorization, Jacobi & Gauss-Seidel Iterative Methods; Interpolation & Curve Fitting: Newton Forward/Backward/Divided Differences, Lagrange Interpolation, Cubic Splines & Least-Squares Regression; Numerical Differentiation & Integration: Finite Differences, Trapezoidal Rule, Simpson 1/3 and 3/8 Rules & Gauss Quadrature; Numerical Solution of ODEs & EEE Applications: Taylor Series, Euler, Modified Euler, Runge-Kutta (RK4) & Power/Circuit Numerical Applications'
    ),
    course(
      'EEE 3208',
      'Numerical Methods Sessional',
      1.5,
      'MATLAB/C/Python Implementation of Nonlinear Root-Finding & Linear System Solvers; Least-Squares Curve Fitting, Polynomial Interpolation & Numerical Integration Coding; Numerical ODE Solvers (Runge-Kutta) Applied to RLC Transient & Power System Load Flow Problems'
    ),
    course(
      'CSE 3201',
      'Microprocessor & Microcontroller',
      3.0,
      'Microprocessor Fundamentals & 8086 Architecture: MPU Building Blocks, Buses, Pin Diagram, Register Layout, Memory Segmentation, Bus Cycles & MASM Assembly Programming; Instruction Set & Data Conversion Algorithms: Addressing Modes, Instruction Formats, BCD-to-Binary, Binary-to-BCD & Binary Multiplication/Division; Programmable Peripheral & Interrupt Interfacing: Parallel I/O (8255 PPI), Serial I/O (8251 USART), Keyboard/Display (8279 & LCD), Timer/Counter (8254) & Interrupt Controller (8259 PIC); Microprocessor System Design Case Study: Top-Down/Bottom-Up Hardware & Control Software Design of Digital Weighing Machine (DWM); 8051 Microcontroller: Architecture, Memory Organization, Addressing Modes, Timers, Serial Port, Interrupts & Assembly/C Programming; PIC Microcontroller & PLC: PIC16F877 Architecture, I/O Ports, Timers, ADC & Programmable Logic Controller (PLC) Architecture and Ladder Programming'
    ),
    course(
      'CSE 3202',
      'Microprocessor & Microcontroller Sessional',
      1.5,
      '8086 Assembly Language Programming & Interfacing with 8255 PPI, 8254 Timer, 8259 PIC and LED/LCD/Keypad; 8051 & PIC16F877 Microcontroller Programming, ADC, PWM & Sensor/Motor Interfacing; Microcontroller/PLC Embedded System Mini-Project'
    ),
  ],

  // Semester VII (4th Year 1st Semester) — Subtotal: 21.00 Credits
  [
    course(
      'EEE 4100',
      'Project & Thesis (Part-I)',
      1.5,
      'Research/Design Topic Selection in Power, Electronics, Communication, Control, VLSI or Renewable Energy; Literature Survey, Problem Formulation & System Modeling/Methodology; Preliminary Simulation/Experimental Setup & Part-I Progress Report'
    ),
    course(
      'EEE 4101',
      'Digital Signal Processing',
      3.0,
      'Introduction to DSP: Sampling, Aliasing, Quantization Noise, SQNR & Analog Signal Reconstruction; Discrete-Time Systems in Time Domain: Impulse Response, Convolution Sum, Linear Constant-Coefficient Difference Equations & Cross/Auto-Correlation; Z-Transform & LTI System Analysis: ROC, Inverse Z-Transform, Pole-Zero Plots, Causality, Stability & Minimum/Maximum-Phase and All-Pass Systems; Frequency Analysis of Discrete-Time Signals: Discrete Fourier Series (DFS) & Discrete-Time Fourier Transform (DTFT); Discrete Fourier Transform (DFT) & Fast Fourier Transform (FFT): DFT Properties, Circular Convolution, Radix-2 Decimation-in-Time/Frequency FFT Algorithms & Spectral Estimation; Digital Filter Design (FIR & IIR): Linear-Phase FIR Design (Windowing, Frequency Sampling, Optimal Parks-McClellan) & IIR Filter Design (Impulse Invariance, Bilinear Transformation, Least-Squares)'
    ),
    course(
      'EEE 4102',
      'Digital Signal Processing Sessional',
      1.5,
      'MATLAB/DSP Processor Implementation of Discrete-Time Convolution, Correlation & Z-Transform Pole-Zero Analysis; Spectrum Analysis using DFT and Radix-2 FFT Algorithms; Design, Simulation & Real-Time Implementation of FIR and IIR Digital Filters'
    ),
    course(
      'EEE 4103',
      'Control System',
      3.0,
      'Control System Modeling & Transfer Functions: Laplace Review, Open-Loop vs Closed-Loop Feedback, Block Diagrams, Mason Gain Formula & Signal Flow Graphs; Time-Domain Response Analysis: Poles, Zeros, First/Second-Order Transient Response (Overshoot, Settling Time) & Steady-State Error Constants; State-Space Representation: Signal Flow/Transfer Function to State Variables, Canonical Forms, Controllability, Observability & State Transition Matrix; Stability & Root Locus Analysis: Routh-Hurwitz Criterion, Root Locus Construction & PID Controller Design via Root Locus and Pole Placement (Sylvester Theorem); Frequency-Domain Analysis & Compensator Design: Bode Plots, Nyquist Plot, Nyquist Stability Criterion, Gain/Phase Margins, Sensitivity, Robust Stability & Lead/Lag/PID Frequency Design; Introduction to Digital Control Systems: Sampled-Data Systems, Zero-Order Hold & Stability Analysis in the Z-Domain (Jury Test)'
    ),
    course(
      'EEE 4104',
      'Control System Sessional',
      1.5,
      'Time-Domain Transient, Steady-State & State-Space Modeling of Control Systems in MATLAB/Simulink; Root Locus, Bode & Nyquist Stability Analysis and Lead/Lag/PID Controller Tuning; Hardware Experiments on DC Servo Motor Position/Speed Control & Inverted Pendulum/Process Control'
    ),
    course(
      'EEE 4105',
      'VLSI Circuits and Design',
      3.0,
      'IC Trends & MOS Device Physics: Moore Law, NMOS/PMOS Structure, Threshold Voltage, Body Effect, Channel Length Modulation & I-V Characteristics; CMOS Inverters & Pass-Gate Logic: Ratioed (Resistive/Pseudo-NMOS) vs Ratioless CMOS Inverters, Transfer Curve, Noise Margins, Rise/Fall/Propagation Delay, Power Dissipation, Pass Transistors, Transmission Gates & Super-Buffers; IC Fabrication, Layout & Reliability: Photolithography, CMOS Process Flow, Lambda Design Rules, Stick Diagrams, Parasitic R/C Estimation, Latch-Up & Electromigration; Combinational & Dynamic CMOS Logic Styles: Complex Static CMOS Gates, Pseudo-NMOS, Dynamic CMOS, Clocked CMOS (C2MOS) & Domino Logic; Structured & Sequential VLSI Design: Parity Generator, Bus Arbitration, Mux/PLA Design, Two-Phase Clocking, Dynamic Shift Registers, CMOS Latches/Flip-Flops & 4-Bit ALU/Shifter Subsystem; Semiconductor Memory & Verilog FSM Testing: 1T/3T/4T DRAM & 6T SRAM Cells, Register/Memory Arrays, Moore/Mealy FSM Design using Verilog HDL & VLSI Fault Testing'
    ),
    course(
      'EEE 4106',
      'VLSI Circuits and Design Sessional',
      1.5,
      'SPICE Simulation of CMOS Inverter, Complex Gates, Dynamic/Domino Logic & Memory Cells; Schematic Entry, Stick Diagram, Lambda Layout Design & DRC/LVS Verification using Cadence/Microwind/Electric; RTL Design, Simulation & FPGA Synthesis of 4-Bit ALU and Moore/Mealy FSMs in Verilog HDL'
    ),
    course(
      'EEE 41XX (Elective-I)',
      'Elective I (4th Year 1st Semester)',
      3.0,
      'EEE 4111 Renewable Energy (Solar PV/MPPT, Solar Thermal, Wind Turbines/DFIG, Biomass & Grid Integration); EEE 4113 High Voltage Engineering (Townsend Breakdown, Corona, AC/DC/Impulse HV Generation, Measurement, Insulation Coordination & Testing); EEE 4115 Optoelectronics (Direct/Indirect Bandgap, DH/Surface/Edge LEDs, Semiconductor Lasers, DBR/DFB/VCSEL, PIN/APD Photodetectors, Solar Cells & Electro/Acousto-Optic Modulation); EEE 4117 Mobile Cellular Communication (Frequency Reuse, Co-Channel Interference, Radio Propagation, Channel Assignment, Handoffs, Diversity & GSM/TDMA/CDMA); EEE 4119 Biomedical Engineering (Bio-Potentials, ECG/EMG/EEG Amplifiers, Blood Pressure/Flow/Respiratory Sensors, X-Ray/CT/PET/MRI/Ultrasound, Pacemakers, Defibrillators & Patient Safety)'
    ),
    course(
      'EEE 41XX (Elective-II)',
      'Elective II (4th Year 1st Semester)',
      3.0,
      'Select a second 3.0-Credit Elective Course from 4th Year 1st Semester Options (EEE 4111 / EEE 4113 / EEE 4115 / EEE 4117 / EEE 4119); Complete Detailed Theoretical Modules, Design Assignments & Semester Final Exam'
    ),
  ],

  // Semester VIII (4th Year 2nd Semester) — Subtotal: 16.50 Credits (Grand Total: 162.00 Credits)
  [
    course(
      'EEE 4200',
      'Project & Thesis (Part-II)',
      1.5,
      'Complete Hardware Implementation, Simulation Validation & Experimental Data Collection; Performance Evaluation, Result Analysis & Comparison with Existing Literature; Final Thesis Book Writing, Seminar Presentation & Defense'
    ),
    course(
      'EEE 4201',
      'Power System Protection',
      3.0,
      'Switchgear & Instrument Transformers: Lightning Arresters, Wound/CCVT Potential Transformers, CT/MOCT, HRC/Drop-Out Fuses, Load-Break Switches, Contactors, Isolators, Earthing Switches & Busbar Layouts; Electric Arcs & Circuit Breakers: Arc Extinction Theories, Restriking & Transient Recovery Voltage (TRV), MCB, MCCB, ACB, Oil (OCB/MOCB), Air-Blast (ABCB), Vacuum (VCB) & SF6 Circuit Breakers; Fundamentals of Protective Relaying: Relay Zones, Primary/Backup Protection, Electromagnetic Attraction/Induction Relays & Static/Microprocessor Numerical Relays; Overcurrent, Directional & Distance Relays: Instantaneous, Definite-Time, IDMT, Directional Overcurrent & Impedance/Reactance/Mho Distance Relays; Differential & Pilot Relaying: Circulating-Current, Percentage Differential (Biased) & Wire/Carrier/Optical Pilot Relaying; Equipment & System Protection: Protection of Alternators, Motors, Power Transformers (Buchholz, Harmonic Restraint), Busbars, Transmission Lines, Feeders & HVDC Systems'
    ),
    course(
      'EEE 4202',
      'Power System Protection Sessional',
      1.5,
      'Operating Characteristics of IDMT Overcurrent, Earth-Fault, Directional & Percentage Differential Relays; Testing of MCB, MCCB, Circuit Breaker Tripping & CT/PT Saturation Characteristics; Generator, Transformer & Transmission Line Protection Simulation and Coordination Studies'
    ),
    course(
      'EEE 4203',
      'Power Plant Engineering and Economy',
      3.0,
      'Thermal, Hydro & Nuclear Power Stations: Steam/Gas/Hydro Plant Layouts, Nuclear Fission Reactors (BWR, PWR, CANDU), Reactor Control, Central Station Reactors & Nuclear Safety/Hazards; Variable Load Problems & Load Curves: Chronological Load Curves, Load Duration Curves, Load/Capacity/Demand/Utilization/Diversity Factors & Impact on Generation Cost; Load Forecasting, Unit Selection & Plant Location: Base-Load vs Peak-Load Plants & Load Sharing using Chronological Load Curves; Power Plant Economics & Optimal Dispatch: Input-Output Curves, Heat Rate Curves, Incremental Fuel Rate Curves, Economic Load Dispatch, Transmission Loss Coefficients (B-Matrix) & Tariff Design; Economic Conductor Selection & Distribution Location: Kelvin Law, Graphical Location of Distribution Substations, Busbar Systems, Current-Limiting Reactors & Short-Circuit Forces on Busbars'
    ),
    course(
      'EEE 4208',
      'Industrial Attachment',
      1.5,
      'Two-Week Intensive Practical Training at Power Plants, Grid Substations, Manufacturing Industries or Telecom/Service Agencies; Observation of Industrial Operations, Protection, Control, Safety Protocols & Maintenance Workflows; Submission of Comprehensive Industrial Training Report & Viva-Voce Presentation'
    ),
    course(
      'EEE 42XX (Elective-III)',
      'Elective III (4th Year 2nd Semester)',
      3.0,
      'EEE 4211 Smart Grid (Two-Way Communication, DERs, EV/PHEV, AMI Smart Meters, Modbus/DNP3/IEC 61850, Demand Response, Microgrids & Self-Healing); EEE 4213 Introduction to Nanotechnology and Nanoelectronics (STM/AFM, Lithography/CVD/Etching, Quantum Tunneling, RTD, Single-Electron Transistor, Carbon Nanotubes, Graphene & Molecular Electronics); EEE 4215 Optical Fiber Communication (Step/Graded-Index Fibers, Attenuation, Dispersion, LED/DFB Laser Sources, PIN/APD Detectors, Couplers, WDM, FBG & Optical Link Design); EEE 4217 Radar and Satellite Communication (Radar Equation, CW/FM/Tracking Radar, Duplexers, Satellite Orbits, AOCS, TT&C, Transponders, Multiple Access, Earth Stations & VSAT); EEE 4219 Medical Imaging (X-Ray Radiography, CT Reconstruction/Filtered Back-Projection, Ultrasound/Doppler, NMR/MRI Physics, fMRI & Nuclear PET/SPECT Imaging)'
    ),
    course(
      'EEE 42XX (Elective-IV)',
      'Elective IV (4th Year 2nd Semester)',
      3.0,
      'Select a second 3.0-Credit Elective Course from 4th Year 2nd Semester Options (EEE 4211 / EEE 4213 / EEE 4215 / EEE 4217 / EEE 4219); Complete Detailed Theoretical Modules, Design Assignments & Semester Final Exam'
    ),
  ],
];

// ============================================================================
// OFFICIAL DU AFFILIATED ENGINEERING COLLEGES — B.Sc. in CE SYLLABUS
// (160.00 Credits across 8 Semesters)
// ============================================================================
const CE = [
  // Semester I (1st Year 1st Semester) — Subtotal: 20.25 Credits
  [
    course(
      'PHY 101',
      'Physical Optics, Heat, Waves and Oscillation',
      3.0,
      'Physical Optics — Interference: Theories of Light, Huygens Principle, Young Double Slit Experiment, Fresnel Bi-Prism, Newton Rings & Interferometers; Physical Optics — Diffraction & Polarization: Fresnel/Fraunhofer Diffraction, Single/Double Slit, Diffraction Gratings, Polarized Light, Optical Activity & Crystal Optics; Heat and Thermodynamics: Zeroth & First Laws, Thermometers (Constant Volume, Platinum Resistance, Thermocouple), Specific Heats of Gases & Isothermal/Adiabatic Processes; Kinetic Theory & Second Law: Gas Laws, Equipartition of Energy, Mean Free Path, Van der Waals Equation, Reversible/Irreversible Processes, Carnot Cycle, Carnot Theorem & Entropy; Waves and Oscillations: Simple Harmonic Motion, Damped/Forced Oscillations, Resonance, Vibrations of Membranes/Columns & Lissajous Figures; Progressive/Stationary Waves & Acoustics: Wave Intensity/Energy, Phase/Group Velocity, Longitudinal Waves in Gas, Doppler Effect & Architectural Acoustics (Sabine Formula)'
    ),
    course(
      'PHY 102',
      'Physics Sessional',
      1.5,
      'Thermal Experiments: Specific Heat of Liquid by Cooling, Thermal Conductivity by Lee Method, Constant Volume Air Thermometer & Mechanical Equivalent of Heat; Optics Experiments: Focal Length of Concave Lens, Radius of Curvature by Newton Rings, Refractive Index by Spectrometer & Specific Rotation by Polarimeter; Electricity & Modern Physics Experiments: Resistance by P.O. Box, EMF Comparison by Potentiometer, Thermocouple Calibration, Melting Point, Temperature Coefficient of Resistance & Planck Constant (Photoelectric Effect); Waves & Mechanics Experiments: Tuning Fork Frequency by Melde Apparatus & Spring Constant/Effective Mass of Loaded Spring'
    ),
    course(
      'Chem 101',
      'Chemistry-I',
      3.0,
      'Atomic Structure, Periodic Table & Chemical Bonds; Chemistry of Cement, Silicates & Limes; Physical and Chemical Properties of Water; Types of Solutions & Concentration Units; Chemical Equilibria & Thermochemistry'
    ),
    course(
      'Chem 102',
      'Inorganic Quantitative Analysis',
      1.5,
      'Volumetric Analysis Fundamentals & Apparatus Calibration; Acid-Base Titration Experiments; Oxidation-Reduction (Redox) Titration Experiments; Volumetric Determination of Iron (Fe), Copper (Cu) & Calcium (Ca)'
    ),
    course(
      'Math 101',
      'Differential and Integral Calculus',
      3.0,
      'Limits, Continuity, Differentiability & n-th Derivatives of Standard Functions (Leibniz Theorem); Rolle Theorem, Mean Value Theorem, Finite/Infinite Series Expansions & Indeterminate Forms; Partial Differentiation & Euler Theorem on Homogeneous Functions; Tangents, Normals, Subtangent & Subnormal in Cartesian and Polar Coordinates; Maxima, Minima of Single-Variable Functions & Curvature; Integral Calculus: Integration by Parts, Standard Integrals, Successive Reduction & Definite/Improper Integrals; Beta & Gamma Functions, Multiple Integrals, Area & Volume of Solids of Revolution'
    ),
    course(
      'Hum 101',
      'English',
      2.0,
      'English Phonetics: Places and Manners of Articulation of English Sounds; Vocabulary Building & English Grammar: Sentence Construction and Common Grammatical Problems; Reading Comprehension & Composition on Current Affairs; Precis Writing, Formal Report Writing, Commercial Correspondence & Tenders; Analysis of Short Stories by Classic Writers'
    ),
    course(
      'Hum 102',
      'Developing English Language Skills',
      0.75,
      'Reading Skills: Skimming, Scanning, Predicting, Inferring & Literary/Non-Literary Text Interpretation; Writing Process & Techniques: Brainstorming, Peer/Self-Evaluation, Comparison/Contrast, Problem/Solution, Cause/Effect & Paragraph/Essay/Report Writing; Listening Skills: Note-Taking & Answering Questions from Recorded Lectures; Speaking Skills: Peer Dialogues, Group Discussions, Debates, Extempore Speech, Storytelling & Presentations'
    ),
    course(
      'CE 101',
      'Civil Engineering Drawing -I',
      1.5,
      'Introduction to Engineering Drawing: Lines, Lettering & Dimensioning; Plane Geometry: Drawing Pentagon, Hexagon, Octagon, Ellipse, Parabola & Hyperbola; Solid Geometry: Projections, Developments, True Shapes & Sections of Cube, Prism, Pyramid, Cone and Cylinder; Isometric and Oblique Drawings of Cube, Pyramid & Cone; Plan, Elevations and Sections of One-Storied Buildings and Bridges'
    ),
    course(
      'CE 102',
      'Engineering Mechanics',
      4.0,
      'SI Units, Fundamental Concepts, Resultants & Components of Forces; Coplanar Concurrent, Parallel & Non-Concurrent Non-Parallel Force Systems; Non-Coplanar Forces & Equilibrium of Rigid Bodies; Centroids & Moment of Inertia of Areas and Masses; Friction & Flexible Cords; Plane Motion & Force Systems Producing Rectilinear Motion; Work, Kinetic Energy, Power, Impulse & Momentum'
    ),
  ],

  // Semester II (1st Year 2nd Semester) — Subtotal: 20.75 Credits
  [
    course(
      'PHY 201',
      'Structure of Matter, Electricity and Magnetism and Modern Physics',
      3.0,
      'Structure of Matter: Amorphous/Crystalline Solids, Ceramics, Polymers, Metallic/Van der Waals/Covalent/Ionic Bonds, Crystal Packing, X-Ray Diffraction (Bragg Law), Plasticity/Elasticity & Metals/Insulators/Semiconductors; Electrostatics & Dielectrics: Coulomb Law, Electric Field, Dipole, Gauss Law, Electric Potential, Capacitors & Atomic View of Dielectrics; Current, Resistance & Electromagnetism: Current Density, Ohm Law, Resistivity, Ampere Law, Faraday Law, Lenz Law & Self/Mutual Inductance; Magnetic Properties of Matter: Magnetomotive Force, Field Intensity, Permeability, Susceptibility, Magnetic Material Classifications & Magnetization Curves; Special Theory of Relativity & Quantum Physics: Michelson-Morley Experiment, Galilean/Lorentz Transformations, Length Contraction, Time Dilation, Mass-Energy Relation, Photoelectric/Compton Effect, de Broglie Waves & Bohr Atom Model; Nuclear Physics: Radioactive Decay, Half-Life, Mean Life, Isotopes, Nuclear Binding Energy & Alpha/Beta/Gamma Decay'
    ),
    course(
      'Chem 201',
      'Chemistry- II',
      3.0,
      'Reaction Kinetics: Reaction Rate, Order, Molecularity, Rate Expressions, Temperature Effects & Activation Energy; Colloids & Colloidal Solutions: Classification, Preparation, Purification, Properties, Protective Action & Applications; Chemical Corrosion: Dry/Wet Corrosion of Metals & Alloys, Atmospheric/Soil Corrosion Mechanisms & Protective Measures; Chemistry of Environmental Pollution: Toxic Metal/Non-Metal Pollutants, Analytical Detection, DO, BOD, COD, Threshold Odor Number & Industrial Wastewater/Water Treatment Chemistry; Polymers & Composites: Polymerization Chemistry, Polymer Types/Properties, Degradation, Elastomers & Composite Materials; Paints and Varnishes: Surface Pretreatment, Metallic/Non-Metallic/Organic Protective Coatings & Paint Classifications'
    ),
    course(
      'Hum 201',
      'Sociology and Government',
      4.0,
      'Sociology Fundamentals: Scope, Social Evolution, Production Techniques, Culture & Civilization; Social Structure of Bangladesh, Population & World Resources; Oriental & Occidental Societies, Industrial Revolution, Family, Urbanization, Industrialization, Urban Ecology, Co-operative/Socialist Movements & Rural Sociology; Government & Political Theory: Functions, Organs & Forms of Modern State, Socialism, Fascism, Marxism & UNO; Government, Politics & Local Self-Government of Bangladesh and Major Administrative Systems of Developed Countries'
    ),
    course(
      'Math 201',
      'Differential Equation and Statistics',
      3.0,
      'First-Order Differential Equations: Formation, First-Order/First-Degree & Higher-Degree Equations; Higher-Order Linear ODEs: Constant Coefficients, Euler Homogeneous Linear Equations, Frobenius Series Method, Bessel Functions & Legendre Polynomials; Partial Differential Equations (PDEs): Linear/Non-Linear First-Order Standard Forms & Higher-Order/Variable-Coefficient Second-Order PDEs; Descriptive Statistics: Frequency Distribution, Mean, Median, Mode, Standard Deviation, Dispersion, Moments, Skewness & Kurtosis; Probability & Distributions: Discrete (Binomial, Poisson, Negative Binomial) & Continuous (Normal, Exponential) Distributions; Statistical Inference: Elementary Sampling Theory, Estimation, Hypothesis Testing & Regression Analysis'
    ),
    course(
      'CE 201',
      'Civil Engineering Drawing -II',
      1.5,
      'Introduction to Computer Usage & CAD Drafting Packages: Drawing, Editing & Dimensioning Simple Objects; Plan, Elevations and Sections of Multi-Storied Buildings; Reinforcement Detailing of Beams, Slabs & Stairs; Plan and Section of Septic Tank & Detailed Drawings of Roof Trusses; Plans, Elevations and Sections of Culverts, Bridges, Hydraulic Structures & Building Services Drawings'
    ),
    course(
      'CE 202',
      'Surveying',
      4.0,
      'Reconnaissance Survey, Linear Measurements & Traverse Surveying; Leveling, Contouring, Calculation of Areas/Volumes & Heights/Distances Problems; Curves & Curve Ranging: Circular, Transition & Vertical Curves; Tacheometry: Principles, Stadia Systems & Tacheometric Problems; Astronomical Surveying: Instruments, Astronomical Corrections & Systems of Time; Photogrammetry, Remote Sensing & GPS: Terrestrial/Aerial Photography, Photo Mosaic, Scale, Project Surveying, Survey Errors & Global Positioning System'
    ),
    course(
      'CE 203',
      'Practical Surveying',
      1.5,
      'Linear and Angular Measurement Field Techniques; Traverse Surveying, Leveling & Contouring Fieldwork; Curve Setting & Tacheometry Field Exercises; Project Surveying & Applications of Modern Surveying Equipment (Total Station/GPS)'
    ),
    course(
      'EEE 201',
      'Basic Electricity Sessional',
      0.75,
      'Electrical Units, Standards & DC Network Solutions (Series, Parallel & Mesh Current Methods); Instantaneous/Effective Current, Voltage & Average Power Measurements; Sinusoidal Single-Phase RLC Circuits, Phasor Algebra & Balanced Three-Phase Circuits; Residential/Commercial Electrical Wiring & Introduction to Transformers and Induction Motors'
    ),
  ],

  // Semester III (2nd Year 1st Semester) — Subtotal: 21.00 Credits
  [
    course(
      'Hum 301',
      'Engineering Economics',
      2.0,
      'Microeconomics & Macroeconomics for Engineers: Demand/Supply Theory, Elasticities, Demand Estimation & Price Determination; Indifference Curve Technique, Theory of Production, Cost Estimation & Market Structures; National Income Accounting, Circular Flow of Income/Expenditure & Depreciation; Engineering Project Evaluation: Cost-Benefit Analysis, Payback Period, NPV, IRR, Inflation & Economic Feasibility'
    ),
    course(
      'Math 301',
      'Matrix, Vectors and Laplace Transform',
      3.0,
      'Matrix Algebra & Linear Systems: Matrix Operations, Transpose, Inverse, Rank, Elementary Transformations & Linear Equations; Vector Spaces & Eigenvalues: Linear Dependence/Independence, Quadratic Forms, Matrix Polynomials, Characteristic Roots/Vectors, Null Space & Nullity; Vector Algebra & Calculus: Scalar/Vector/Triple Products, Geometry/Mechanics Applications & Vector Differentiation/Integration; Vector Integral Theorems: Line, Surface & Volume Integrals, Gradient, Divergence, Curl & Gauss/Stokes/Green Theorems; Laplace Transforms: Elementary Functions, Existence Conditions, Inverse Transforms, Derivatives, Unit Step/Periodic Functions, Partial Fractions, ODE Solutions & Improper Integrals'
    ),
    course(
      'CE 301',
      'Engineering Materials',
      4.0,
      'Bricks, Cement & Aggregates: Brick Properties/Efflorescence, Cement Chemistry, Aggregates, Lime/Cement Mortars & Standard Material Tests; Concrete Technology: Fresh/Hardened Concrete, Salinity Problems, Concrete Mix Design, Special Concrete & Ferrocement; Corrosion & Protective Coatings: Corrosion Prevention, Paints, Varnishes & Metallic Coatings; Material Science Fundamentals: Atomic Structure, Bonding, Crystal Structures, Mechanical Properties, Yielding, Fracture, Elasticity & Plasticity; Properties and Engineering Uses of Rubber, Timber & Plastics'
    ),
    course(
      'CE 302',
      'Details of Constructions',
      1.5,
      'Foundations: Types of Shallow and Deep Foundations; Brick Masonry, Framed Structures, Bearing Walls, Arches & Lintels; Details of Floors, Roofs, Pointing, Plastering & Interior Finishing; Scaffolding, Staging, Shoring & Underpinning; Thermal Insulation, Acoustics & House Plumbing Systems'
    ),
    course(
      'CE 303',
      'Engineering Geology and Geomorphology',
      3.0,
      'Mineralogy & Petrology: Mineral Identification, Physical Properties, Rock-Forming Minerals, Rock Types & Rock Cycle; Seismology & Structural Geology: Earthquake/Seismic Map of Bangladesh, Faults, Folds, Domes & Basins; Geomorphology & Erosional Processes: Quantitative Analysis of Erosional Landforms, Channel Development, Widening & Valley Shapes; Fluvial Geomorphology: Stream Terraces, Alluvial Flood Plains, Deltas, Alluvial Fans, Channel Morphology/Patterns & River Basins; Regional Geology and Geomorphology of Bangladesh'
    ),
    course(
      'CE 304',
      'Materials Sessional',
      1.5,
      'Aggregate Tests: Specific Gravity, Unit Weight, Voids, Bulking, Moisture Content, Absorption & Sieve Gradation of Coarse/Fine Aggregates; Cement & Mortar Tests: Normal Consistency, Initial Setting Time & Direct Tensile/Compressive Strength of Cement Mortar; Concrete Mix Design, Slump Test & Compressive Strength Testing of Concrete Cylinders/Cubes'
    ),
    course(
      'CE 305',
      'Mechanics of Solids- I',
      3.0,
      'Fundamental Concepts of Stress, Strain, Mechanical Properties of Materials & Strain Energy; Axial Loading & Thermal Stresses: Members Subjected to Tension, Compression, Shear & Temperature Changes; Shear Force and Bending Moment Diagrams (SFD & BMD) for Beams and Frames; Flexural (Bending) and Shearing Stresses in Beams & Shear Centre; Thin-Walled Pressure Vessels & Riveted/Welded Structural Joints'
    ),
    course(
      'CE 306',
      'Structural Mechanics and Materials Sessional',
      1.5,
      'Tension, Direct Shear & Charpy/Izod Impact Tests on Mild Steel Specimens; Compression Test on Timber & Slender Column Buckling Test; Static Bending Test, Metal Hardness Test (Brinell/Rockwell) & Helical Spring Test; Determination of Shear Centre & Load-Deflection Behavior of Simple Beam'
    ),
    course(
      'Shop 301',
      'Workshop (Carpentry shop, Machine shop and Welding shop) sessional',
      1.5,
      'Carpentry Shop: Woodworking Hand Tools & Machines (Band/Scroll/Circular Saw, Planer, Lathe), Timber Joints, Defects, Seasoning, Preservation & Practical Job; Machine Shop: Bench/Layout/Measuring/Cutting Tools & Operations on Drilling, Shaping, Lathe and Milling Machines; Welding Shop: Riveting, Soldering, Electric Arc Welding (Positions, Polarity, Electrodes, Fluxes) & Gas Welding Systems, Defects and Non-Destructive Testing'
    ),
  ],

  // Semester IV (2nd Year 2nd Semester) — Subtotal: 20.50 Credits
  [
    course(
      'Math 401',
      '3-D Co-ordinate Geometry, Fourier Analysis, and Harmonic Functions',
      3.0,
      '3D Coordinate Geometry — Lines & Planes: Coordinate Systems, Projections, Direction Cosines, Planes, Straight Lines, Coplanar Lines & Shortest Distance; 3D Quadric Surfaces (Conicoids): Sphere, Ellipsoid, Hyperboloid of One/Two Sheets, Tangent Planes, Normal Lines & Tangency Conditions; Fourier Analysis: Real/Complex Fourier Series, Finite Transforms, Fourier Integrals & Solving Boundary Value Problems; Harmonic Functions & Laplace Equation: Laplace Equation in Cartesian, Polar, Cylindrical & Spherical Coordinates; Potential Theory Applications: Gravitational Potential of a Ring, Steady-State Temperature & Potential Inside/Outside a Sphere'
    ),
    course(
      'Hum 401',
      'Principles of Accounting',
      2.0,
      'Accounting Fundamentals: Accounts, Transactions, Accounting Cycle, Double-Entry System & Financial Statements; Cost Accounting & Overhead: Cost Classifications, Overhead Allocation & Job/Operating/Process Cost Sheets; Marginal Costing & Cost-Volume-Profit (CVP) Break-Even Analysis; Relevant Costing for Internal Profitability & Engineering Decision Making; Long-Run Planning, Control & Capital Budgeting'
    ),
    course(
      'CE 401',
      'Numerical Methods and Basic Computer Programming',
      3.0,
      'Computer System Components & Structured Programming in FORTRAN/C/C++; Numerical Solution of Algebraic and Transcendental Equations (Root Finding); Matrices & Numerical Solution of Systems of Linear Equations; Curve Fitting by Least Squares, Finite Differences, Divided Differences & Interpolation; Numerical Differentiation, Numerical Integration & Solution of Ordinary Differential Equations; Computer Applications to Civil Engineering Problems'
    ),
    course(
      'CE 402',
      'Mechanics of Solids- II',
      4.0,
      'Torsional Stresses and Deformations in Circular Shafts and Thin-Walled Tubes; Compound Stresses, Principal Stresses, Mohr Circle & Stress Transformations; Analysis and Design of Helical Springs; Beam Deflections: Direct Integration, Moment-Area, Elastic Load & Conjugate Beam Methods; Elastic Stability & Buckling of Columns (Euler Formula, Secant Formula)'
    ),
    course(
      'CE 403',
      'Quantity Surveying',
      1.5,
      'Quantity Estimation of Civil Engineering Works: Buildings, Bridges, Roof Trusses & Highways; Analysis of Rates for Construction Items & Material Specifications; Computer Software Applications in Quantity Surveying & Cost Estimation'
    ),
    course(
      'CE 404',
      'Fluid Mechanics',
      4.0,
      'Fluid Properties, Fluid Statics, Manometry & Forces on Submerged Surfaces; Fluid Kinematics & Basic Equations: Continuity, Bernoulli, Energy & Momentum Equations and Fluid Forces; Similitude & Dimensional Analysis (Buckingham Pi Theorem); Steady Incompressible Pipe Flow: Laminar/Turbulent Flow, Darcy-Weisbach/Empirical Friction Equations & Minor Losses; Fluid Flow Measurement: Pitot Tube, Orifice, Mouthpiece, Nozzle, Venturimeter & Weirs; Pipe Network Analysis: Pipes in Series/Parallel, Branching Pipes & Hardy-Cross Pipe Networks'
    ),
    course(
      'CE 405',
      'Fluid Mechanics Sessional',
      1.5,
      'Hydrostatic Center of Pressure & Verification of Bernoulli Theorem; Flow Measurement through Venturimeter, Orifice, Mouthpiece (Trajectory Method), V-Notch & Sharp-Crested Weir; Determination of Major and Minor Fluid Friction Losses in Pipes'
    ),
    course(
      'CSE 401',
      'Computer Programming Sessional',
      1.5,
      'Programming Concepts, Algorithms, Number Systems & Data Representation; Structured C/C++ Programming: Data Types, Operators, Control Structures, Functions, Pointers, Arrays & File I/O; Object-Oriented Programming (OOP): Encapsulation, Inheritance, Polymorphism, Abstraction & Function/Class Templates; Development of Civil Engineering Analysis & Design Programs'
    ),
  ],

  // Semester V (3rd Year 1st Semester) — Subtotal: 20.50 Credits
  [
    course(
      'CE 501',
      'Structural Analysis and Design-I',
      3.0,
      'Stability and Static/Kinematic Determinacy of Structures; Analysis of Statically Determinate Trusses and Three-Hinged Arches; Influence Lines for Statically Determinate Beams, Frames & Trusses; Moving Loads: Maximum Shear and Bending Moment Envelopes on Beams, Frames & Trusses; Analysis of Cables and Cable-Supported Suspension Structures'
    ),
    course(
      'CE 502',
      'Structural Analysis and Design Sessional- I',
      1.5,
      'Analysis and Design of Steel Roof Trusses & Plate Girders; Design of Tension/Compression Members and Bolted/Welded Structural Joints; Computer Software Applications in Structural Analysis & Design'
    ),
    course(
      'CE 503',
      'Design of Concrete Structures- I',
      3.0,
      'Fundamental Behavior of Reinforced Concrete & Introduction to WSD (Working Stress) and USD (Ultimate Strength) Methods; Flexural Analysis and Design of Singly Reinforced, Doubly Reinforced & T-Beams (WSD & USD); Shear & Diagonal Tension Design in Reinforced Concrete Beams; Bond, Development Length & Anchorage Requirements (WSD & USD); Analysis and Design of One-Way Reinforced Concrete Slabs'
    ),
    course(
      'CE 504',
      'Environmental Engineering-I',
      3.0,
      'Water Supply Engineering Fundamentals: Water Demands & Surface/Groundwater Supply Sources; Groundwater Exploration & Well Hydraulics: Aquifer Properties, Well Design, Drilling, Construction, Maintenance & Rural Shallow/Deep Tara Pumps; Surface Water Collection & Distribution: Intakes, Pumping Machinery, Distribution Network Analysis/Design, Hydrants, Meters & Leak Detection; Water Quality Requirements & Conventional Treatment: Plain Sedimentation, Coagulation-Flocculation, Filtration & Disinfection; Miscellaneous & Low-Cost Rural Water Treatment Technologies (Arsenic/Iron Removal)'
    ),
    course(
      'CE 505',
      'Principles of Soil Mechanics',
      3.0,
      'Soil Formation, Mineral Composition, Soil Structure/Fabric & Field Identification; Index Properties, Grain Size Distribution, Atterberg Limits & Engineering Classification Systems (USCS, AASHTO); Soil Compaction, Total/Effective Stress Principles, Capillarity, Permeability & Seepage (Flow Nets); Stress Distribution in Soil Masses (Boussinesq & Westergaard Theories) & Compressibility/Consolidation Settlement; Stress-Strain-Strength Behavior of Soils (Mohr-Coulomb Failure Criterion) & Lateral Earth Pressure (Rankine & Coulomb Theories)'
    ),
    course(
      'CE 506',
      'Geotechnical Engineering Sessional-I',
      1.5,
      'Field Identification, Specific Gravity, Sieve/Hydrometer Grain Size Analysis & Atterberg Limits Tests; Constant/Falling Head Permeability, Proctor Compaction & Relative Density Tests; Unconfined Compression, Direct Shear & One-Dimensional Consolidation (Oedometer) Tests'
    ),
    course(
      'CE 507',
      'Open Channel Flow',
      4.0,
      'Open Channel Flow Classification, Velocity/Pressure Distributions & Energy/Momentum Equations; Specific Energy, Critical Flow, Channel Transitions & Open Channel Flow Measurement Devices; Uniform Flow Computation: Chezy & Manning Equations, Roughness Estimation & Hydraulically Efficient Channel Sections; Specific Momentum & Analysis of Hydraulic Jump and Energy Dissipators; Gradually Varied Flow (GVF) Theory, Surface Profile Classification/Computation & Regime/Tractive Force Channel Design'
    ),
    course(
      'CE 508',
      'Open Channel Flow Sessional',
      1.5,
      'Flow over Broad-Crested Weir & Flow under Sluice Gate; Discharge Measurement using Venturi Flume, Parshall Flume & Cutthroat Flume; Experimental Investigation of Hydraulic Jump, Velocity Distribution Profile, Manning Roughness Coefficient & Specific Energy/Force Curves'
    ),
  ],

  // Semester VI (3rd Year 2nd Semester) — Subtotal: 20.50 Credits
  [
    course(
      'CE 601',
      'Structural Analysis and Design-II',
      3.0,
      'Estimation of Wind and Earthquake Lateral Loads on Buildings according to Building Codes (BNBC); Approximate Analysis of Statically Indeterminate Structures: Braced Trusses, Portal Frames, Mill Bents & Multi-Storied Building Frames (Portal/Cantilever Methods); Deflection of Beams, Trusses & Frames by Virtual Work (Unit Load) Method; Analysis of 3D Space Trusses; Analysis of Statically Indeterminate Structures by Consistent Deformation (Force/Flexibility) Method'
    ),
    course(
      'CE 602',
      'Design of Concrete Structures- II',
      4.0,
      'Analysis and Design of Two-Way Reinforced Concrete Slabs (Direct Design, Equivalent Frame & Coefficient Methods) & Floor/Roof Systems; Design of Short and Slender Reinforced Concrete Columns under Axial Load and Uniaxial/Biaxial Bending; Design of Isolated, Combined & Wall Footings; Analysis and Design of Cantilever and Counterfort Reinforced Concrete Retaining Walls; Review of Building Codes, Yield Line Theory for Slabs & Preliminary Analysis/Design of Prestressed Concrete Beams'
    ),
    course(
      'CE 603',
      'Concrete Structures Sessional',
      1.5,
      'Comprehensive Reinforced Concrete Design & Detailing based on CE 503/602; Structural Analysis and Design of a Reinforced Concrete Slab Bridge & Simple Girder Bridge; Complete Analysis, Design & Structural Detailing of a Low-Rise Reinforced Concrete Building'
    ),
    course(
      'CE 604',
      'Principles of Foundation Engineering',
      3.0,
      'Subsurface Soil Investigation Techniques, Boring, Sampling & In-Situ Testing (SPT, CPT); Bearing Capacity Theories (Terzaghi, Meyerhof, Hansen) for Shallow Foundations; Immediate and Consolidation Settlement & Differential Distortion Computations; Design and Construction of Shallow Footings and Mat/Raft Foundations; Deep Foundations: Axial/Lateral Capacity & Group Action of Driven/Bored Piles and Slope Stability Analysis (Swedish Circle, Bishop Method)'
    ),
    course(
      'CE 605',
      'Transportation Engineering- I: Transport & Traffic Design',
      3.0,
      'Transportation Systems Overview, Modal Share in Bangladesh & Transportation Planning Process/Data Collection; Highway Location Surveys & Geometric Design of Highways: Cross-Section Elements, Horizontal/Vertical Curves & Sight Distances; Design of At-Grade and Grade-Separated Road Intersections; Traffic Engineering: Vehicle/Driver/Traffic Stream Characteristics (Speed, Volume, Density), Traffic Control Devices (Signs, Signals, Markings) & Traffic Studies; Parking Facilities, Roadway Lighting & Waterways/Terminals'
    ),
    course(
      'CE 606',
      'Transportation Engineering Sessional I',
      1.5,
      'Laboratory Testing of Subgrade, Sub-Base & Base Aggregates (CBR, Los Angeles Abrasion, Impact, Flakiness); Testing of Bituminous Binder (Penetration, Ductility, Softening Point, Flash/Fire Point, Specific Gravity) & Marshall Bituminous Mix Design; Roadway Capacity Analysis & Traffic Data Analysis using Simulation/Statistical Software'
    ),
    course(
      'CE 607',
      'Hydrology',
      3.0,
      'Hydrologic Cycle, Weather Systems & Hydrometeorology; Precipitation Measurement/Analysis, Evaporation, Evapotranspiration & Infiltration (Horton, Green-Ampt, Phi-Index); Streamflow Measurement, Stage-Discharge Rating Curves & Telemetry/Remote Sensing in Hydrology; Rainfall-Runoff Relationships, Hydrograph Analysis, Unit Hydrograph Theory & Synthetic Unit Hydrographs; Hydrologic Reservoir/Channel Routing (Muskingum Method) & Statistical Frequency Analysis in Hydrology'
    ),
    course(
      'CE 608',
      'Environmental Engineering Sessional',
      1.5,
      'Water and Wastewater Sampling, Preservation & Physical/Chemical/Biological Quality Testing (pH, Turbidity, DO, BOD, COD, Coliforms); Breakpoint Chlorination & Jar Test for Alum Coagulation Dose Determination; Sampling and Laboratory Analysis of Ambient Air Quality & Solid Waste Characteristics'
    ),
  ],

  // Semester VII (4th Year 1st Semester) — Subtotal: 19.00 Credits
  [
    course(
      'CE 700 (Part-I)',
      'Project and Thesis (Part-I)',
      1.5,
      'Selection of Research/Design Topic in Structural, Concrete, Environmental, Transportation, Geotechnical or Water Resources Engineering; Comprehensive Literature Review, Problem Formulation & Research Methodology Design; Preliminary Experimental/Analytical Setup & Part-I Progress Presentation'
    ),
    course(
      'CE 701',
      'Environmental Engineering- II',
      3.0,
      'Wastewater Engineering & Hydraulics: Wastewater Estimation, Collection Systems, Sewer Hydraulics & Design/Construction/Maintenance of Sanitary/Storm Sewers and Plumbing; Sewage Microbiology, Wastewater Characteristics & Preparatory/Primary/Secondary Biological Treatment (Activated Sludge, Trickling Filters, Oxidation Ponds); Industrial Effluent Treatment, Sludge Treatment/Disposal & Environmental Pollution Management; Low-Income & Rural Sanitation: On-Site Sanitation, Septic Tanks, Soak Wells, Small-Bore Sewerage & Participatory Community Water/Sanitation Management in Bangladesh'
    ),
    course(
      'CE 702',
      'Transportation Engineering- II: Highway Design & Railways',
      3.0,
      'Highway Materials & Soil Stabilization: Subgrade, Subbase, Base Courses, Soil-Aggregate Mixes & Low-Cost Roads; Bituminous Materials & Mix Design Methods; Analysis, Design (AASHTO, IRC, PCA), Construction & Maintenance of Flexible and Rigid Road Pavements & Construction Equipment; Railway Engineering: General Requirements, Track Alignment, Permanent Way (Rails, Sleepers, Ballast), Stations/Yards, Points/Crossings, Signaling & Maintenance'
    ),
    course(
      'CE 703',
      'Project Planning and Management',
      3.0,
      'Principles of Construction Management, Contracts, Specifications, Quality Inspection & Construction Safety; Project Scheduling & Resource Allocation: CPM, PERT, Cost Accounting & Linear Programming; Administration Psychology, Materials Management, Demand Forecasting, Inventory Control, Stores & Procurement; Project Economic Evaluation: Feasibility Reports, Cash Flow, Payback Period, IRR, Benefit-Cost Ratio, Construction Plant/Equipment & Replacement Studies'
    ),
    course(
      'CE 704',
      'Structural Analysis and Design-III',
      4.0,
      'Classical Displacement Methods for Indeterminate Structures: Slope-Deflection Method & Moment Distribution Method (Beams & Frames with/without Sidesway); Direct Stiffness Matrix Method: Member Stiffness, Coordinate Transformations, Global Stiffness Assembly & Solution for Beams, Trusses and Planar/Space Frames; Flexibility Matrix Method; Quantitative Influence Lines for Statically Indeterminate Beams, Frames, Arches & Grids (Muller-Breslau Principle); Modern High-Rise and Long-Span Structural Forms & Applications'
    ),
    course(
      'CE 705',
      'Structural Analysis and Design Sessional II',
      1.5,
      'Analysis, Design & Detailing of a Reinforced Concrete Cantilever/Balanced Cantilever Bridge; Complete Gravity and Lateral (Wind/Seismic) Load Analysis, Design & Detailing of a Multi-Storied Reinforced Concrete Building'
    ),
    course(
      'CE 706',
      'Irrigation and Flood Control',
      3.0,
      'Importance of Irrigation, Irrigation Water Sources/Quality & Soil-Water-Plant Relationships; Consumptive Use (Evapotranspiration) & Estimation of Crop Irrigation Water Requirements; Surface, Sprinkler & Drip Irrigation Methods and Design of Alluvial/Lined Irrigation Canal Systems; Irrigation Hydraulic Structures (Diversion Headworks, Regulators, Drops, Cross-Drainage), Irrigation Pumps & Waterlogging/Salinity Problems; Flood Causes, Floodplain Management & Structural/Non-Structural Flood Control Measures'
    ),
  ],

  // Semester VIII (4th Year 2nd Semester) — Subtotal: 17.50 Credits (Grand Total: 160.00 Credits)
  [
    course(
      'CE 700 (Part-II)',
      'Project and Thesis (Part-II)',
      3.0,
      'Experimental Testing, Field Data Collection or Numerical Modeling/Simulation; Data Processing, Result Analysis, Validation & Engineering Design Recommendations; Final Thesis Dissertation Writing, Poster/Slide Preparation & Oral Defense'
    ),
    course(
      'CE 801',
      'Professional Practice and Communication',
      2.0,
      'Engineering Project Cycle, Project Proposals, Contractual Provisions, Specification Writing, Bid Evaluation & Project Appraisal; Technical Communication: Literature Interpretation, Engineering Report Preparation & Oral Presentations; Industrial and Labor Relations, Engineering Law & Professional Ethics in Civil Engineering'
    ),
    course(
      'CE 802',
      'Socio-Economic Aspects of Development Projects',
      1.5,
      'Economic/Social Structure, Development Growth, Socio-Economic Indicators, Prosperity, Poverty & Workforce Employment; Project Displacement, Resettlement & Rehabilitation Strategies; Impact on Land Use/Ownership, Productivity, Fisheries/Aquaculture, Deforestation/Afforestation, Commerce & Water/Sanitation/Health; Inequalities in Distribution of Project Benefits/Losses, Socio-Economic Impact Surveys & Case Studies'
    ),
    course(
      'CE-8XX (Major Theory)',
      'Elective Group — Major Theory (2 Courses: 2.0 + 2.0)',
      4.0,
      'Structural Group: CE 803 Elasticity & Instability, CE 804 Pre-stressed Concrete, CE 805 Design of Steel Structures, CE 806 Finite Element Method, CE 807 Dynamics of Structures; Environmental Group: CE 809 Solid & Hazardous Waste Management, CE 810 Environmental Pollution Management, CE 811 Sustainable Environmental Management; Geotechnical Group: CE 813 Earth Retaining Structures, CE 814 Elementary Soil Dynamics, CE 815 Soil-Water Interaction; Transportation Group: CE 817 Traffic Engineering Design & Management, CE 818 Pavement Management, Drainage & Airport, CE 819 Urban Transportation Planning & Management'
    ),
    course(
      'CE-8XX (Minor Theory)',
      'Elective Group — Minor Theory (2 Courses: 2.0 + 2.0)',
      4.0,
      'Select 2 Theory Courses (2.0 + 2.0 = 4.0 Credits) from a second Civil Engineering Specialization Group (Structural / Environmental / Geotechnical / Transportation); Complete Unit-by-Unit Coursework, Design Assignments & Final Examination'
    ),
    course(
      'CE-8XX (Major Sessional)',
      'Elective Group — Sessional I (Major Group)',
      1.5,
      'CE 808 Structural Analysis and Design Sessional-III (Computer-Aided Design of Building, Water Tower & Folded Plate Roof); OR CE 812 Design of Water Supply, Sanitation and Sewerage Systems Sessional (Treatment Plant & Network Design); OR CE 816 Geotechnical Engineering Sessional-II (CAD of Foundations, Retaining Walls, Slope Stability & Soil Improvement); OR CE 820 Transportation Engineering Sessional-II (Highway/Airfield Pavement Design, Intersections & Traffic Studies)'
    ),
    course(
      'CE-8XX (Minor Sessional)',
      'Elective Group — Sessional II (Minor Group)',
      1.5,
      'Select a second Sessional Course (1.5 Credits) from CE 808 (Structural), CE 812 (Environmental), CE 816 (Geotechnical), or CE 820 (Transportation); Computer-Aided Design, Field/Lab Investigation, Design Report & Viva'
    ),
  ],
];

// ============================================================================
// OFFICIAL DU AFFILIATED ENGINEERING COLLEGES — B.Sc. in ME SYLLABUS
// (161.00 Credits across 8 Semesters)
// ============================================================================
const ME = [
  // Semester I (1st Year 1st Semester) — Subtotal: 20.50 Credits
  [
    course(
      'MAT 1101',
      'Mathematics-I',
      3.0,
      'Differential Calculus — Differentiation: Continuity, Explicit/Implicit & Parametric Differentiation, Successive Differentiation & Leibniz Theorem; Mean Value Theorems & Series Expansions: Rolle Theorem, Mean Value Theorem, Taylor & Maclaurin Theorems with Lagrange and Cauchy Remainders; Partial Differentiation, Euler Theorem & L Hospital Rule for Indeterminate Forms; Tangents, Normals, Subtangent/Subnormal in Cartesian & Polar Coordinates and Pedal Equations; Maxima/Minima, Points of Inflexion, Asymptotes & Curvature (Radius, Center, Chord); Integral Calculus — Techniques: Substitution, Integration by Parts, Standard Integrals, Successive Reduction, Definite Integrals, Wallis Formula, Improper Integrals & Beta/Gamma Functions; Geometric Applications of Integration: Plane Area, Arc Length (Cartesian, Polar, Parametric, Pedal, Intrinsic), Volumes of Revolution, Hollow Solids (Shell Method) & Surface Area of Revolution'
    ),
    course(
      'HUM 1101',
      'Functional English',
      2.0,
      'Vocabulary & Word Formation: Reading, Writing & Speaking Skills, Roots, Prefixes, Suffixes, Phrases, Idioms, Synonyms & Antonyms; Sentence Structure & Clauses: Simple, Complex & Compound Structures and Clause Identification/Analysis; Paragraph & Report Writing: Cohesive Paragraph Techniques and Formal/Informal Engineering Reports; Commercial & Official Correspondence: Memos, Business Letters, Job Applications & Tender Writing; Academic Writing: Free Composition, Precis Writing, Term Papers & Thesis Writing Techniques'
    ),
    course(
      'PHY 1101',
      'Physics-I',
      3.0,
      'Special Theory of Relativity: Reference Frames, Michelson-Morley Experiment, Galilean & Lorentz Transformations, Time Dilation, Length Contraction, Relativistic Mass, Mass-Energy Relation & Velocity Transformation; Particle & Wave Properties: Photoelectric Effect, Quantum Theory of Light, Compton Effect, De Broglie Matter Waves & Phase/Group Velocity; Atomic Structure: Bohr Atom Model, Electron Orbits/Energy, Hydrogen Spectral Series, Energy Level Diagram, Orbital Magnetic Moment Quantization & Electron Shells; Solid State Physics — Lattice & Heat Capacity: Crystal Structures, Classification of Solids, Einstein & Debye Models of Lattice Specific Heat (High/Low-Temperature Approximations); Free Electron Theory of Metals: Electrical/Thermal Conductivity, Ohm Law, Momentum Space, Fermi-Dirac Distribution, Quantum Free Electron Theory, Thermionic Escape & Hall Effect; Nuclear Physics & Radioactivity: Nuclear Constituents/Properties, Binding Energy, Packing Fraction, Nuclear Forces, Fission/Fusion, Radioactive Decay Laws, Half/Mean Life, Successive Disintegration & Practical Applications'
    ),
    course(
      'CHE 1101',
      'Engineering Chemistry',
      3.0,
      'Chemistry of Polymers: Polymerization, Co-Polymerization, Ionic Polymerization, Living Polymers & Macromolecular Structure/Properties; Plastics, Fibers & Rubbers: Raw Materials, Classification, Manufacturing & Properties of Plastics, Synthetic Fibers and Natural/Synthetic Rubber (Latex Treatment); Industrial Chemistry: Raw Materials & Manufacturing Processes of Fertilizer, Paper, Sugar and Cement; Colloids & Surface Chemistry: Colloidal Classifications/Preparation, Dialysis, Electrodialysis, Ultrafiltration, Electrophoresis, Electro-Osmosis, Electrical Double Layer, Zeta Potential & Micelles; Chemical Corrosion & Prevention: Direct Chemical, Electrochemical, Galvanic, Atmospheric & Soil Corrosion Mechanisms and Corrosion Control; Glass & Ceramics: Raw Materials, Classifications, Manufacturing Processes, Properties & Engineering Applications'
    ),
    course(
      'EEE 1101',
      'Electrical Circuits Analysis',
      3.0,
      'Basic Concepts & AC Waveforms: Charge, Current, Voltage, Power, DC Sources, Sinusoidal AC Phase, Average/RMS Values & Square/Triangular/Rectangular/Sawtooth Waveforms; Basic R, L, C Elements & Phasors: DC/Sinusoidal Response, Impedance, Reactance, Admittance, Susceptance, Frequency Response, Average Power & Power Factor; DC & AC Circuit Analysis Methods: Ohm Law, KVL/KCL, Independent/Dependent Sources, Source Conversions, Mesh/Supermesh, Nodal/Supernode & Delta-Wye Conversions; DC & AC Network Theorems: Superposition, Thevenin, Norton, Maximum Power Transfer, Millman, Substitution & Reciprocity Theorems; Transients, Filters & Resonance in RC, RL, RLC Circuits: Source-Free/Unit-Step Transients, Damping, Low/High/Band-Pass/Band-Stop Filters & Series/Parallel Resonance; AC Power & Polyphase Circuits: Instantaneous/Average/Apparent/Complex Power, Single-Phase 3-Wire Systems, Three-Phase Y-Y/Delta Connections & Three-Phase Power Measurement'
    ),
    course(
      'HUM 1102',
      'Sessional on HUM 1101',
      0.75,
      'Oral Communication, Pronunciation, Public Speaking & Group Discussion Practice; Technical Report, Business Letter, Memo & Tender Drafting Exercises; Listening Comprehension & Academic Presentation Skills'
    ),
    course(
      'PHY 1102',
      'Sessional on PHY 1101',
      0.75,
      'Modern Physics & Quantum Experiments: Photoelectric Effect, Planck Constant & Atomic Spectra; Solid State & Electrical Conductivity Experiments: Hall Effect, Specific Resistance & Temperature Coefficient; Mechanics & General Physics Laboratory Measurements'
    ),
    course(
      'CHE 1102',
      'Sessional on CHE 1101',
      0.75,
      'Volumetric Analysis: Acid-Base Neutralization & Oxidation-Reduction (Redox) Titrations; Volumetric Determination of Iron (Fe), Copper (Cu) & Calcium (Ca); Gravimetric Analysis: Quantitative Determination of Sulphate & Iron'
    ),
    course(
      'EEE 1102',
      'Sessional on EEE 1101',
      0.75,
      'Verification of Ohm Law, KVL, KCL & Mesh/Nodal DC Circuit Measurements; Experimental Verification of Superposition, Thevenin, Norton & Maximum Power Transfer Theorems; R-L-C Transient, Resonance, Filter & Three-Phase Power Measurement Experiments'
    ),
    course(
      'MEC 1100',
      'Engineering Drawing',
      1.5,
      'Drawing Instruments, Lettering, Dimensioning, Scales & Geometrical Constructions (Polygon, Ellipse, Parabola, Hyperbola); Orthographic Projections, Projection of Solids, Development of Surfaces & Intersection of Surfaces; Orthogonal, Oblique, Isometric & Auxiliary Projections (Pictorial-to-Orthographic and Vice Versa); Descriptive Geometry Principles, Transferring Projections & Sectional Views'
    ),
    course(
      'MES 1102',
      'Workshop Practice',
      2.0,
      'Woodworking & Pattern Shop: Hand/Machine Tools, Timber Identification, Sawing, Planing, Chiseling & Pattern Making; Foundry Shop: Foundry Tools/Appliances, Molding Sand Preparation & Metal Casting Practice; Welding Shop: Electric Arc Welding & Gas Welding Tools, Machines, Joint Preparation and Welding Practice'
    ),
  ],

  // Semester II (1st Year 2nd Semester) — Subtotal: 20.75 Credits
  [
    course(
      'MAT 1201',
      'Mathematics-II',
      3.0,
      '3D Coordinate Geometry — Points, Lines & Planes: Coordinate Systems, Distance, Section Formula, Projections, Direction Cosines, Planes & Straight Lines in 3D; 3D Quadric Surfaces: Standard Equations and Properties of Sphere, Cone & Central Conicoids (Ellipsoid, Hyperboloids); First-Order Ordinary Differential Equations: Origin, Formation, Order/Degree, First-Order/First-Degree Solution Methods & Geometric/Physical Applications; Higher-Order Linear ODEs: Constant-Coefficient Equations, Variation of Parameters, Undetermined Coefficients & Short Operator Methods; Cauchy-Euler Variable-Coefficient Differential Equations & Engineering Applications of Higher-Order ODEs'
    ),
    course(
      'PHY 1201',
      'Physics-II',
      3.0,
      'Lasers & Coherent Radiation: Temporal/Spatial Coherence, Population Inversion, Stimulated Emission, Gas, Ruby, Nd:YAG, Raman & Semiconductor Lasers and Applications; Thermal Physics & Thermodynamics: Kinetic Theory of Gases, Specific Heat Ratio, Mean Free Path, Zeroth/First/Second Laws, Isothermal/Adiabatic/Isochoric/Isobaric Processes, Carnot Cycle & Entropy; Electrostatics & Magnetostatics: Coulomb Law, Gauss Law, Continuous Charge Potential, Dipoles/Quadrupoles, Magnetic Force, Hall Effect, Biot-Savart & Ampere Laws; Electromagnetic Induction & Magnetic Properties of Matter: Faraday/Lenz Laws, Self/Mutual Inductance, Dia/Para/Ferromagnetism, Three Magnetic Vectors, Permeability, Susceptibility & Hysteresis; Geometrical Optics & Optical Instruments: Lens Equations, Compound Microscope Resolving Power, Camera/Photographic Techniques, Image Resolution & Fiber Optics; Magnetic Circuits: Ampere Circuital Law, B-H Curves, Magnetic Circuit Solutions, Hysteresis/Eddy Current Losses, Relays & Magnetic Resonance'
    ),
    course(
      'HUM 1201',
      'Bangladesh Studies',
      2.0,
      'History & Society of Bengal under British and Pakistan Rule: Economic and Educational Impacts; Emergence of Bangladesh: Language Movement of 1952, Mass Upsurge of 1969 & Liberation War of 1971; Geography, Ecology & Natural Resources: Location, Boundaries, River System, Climate & Demographic Resources; Social Structure, Language, Literature, Art & Culture of Bangladesh; Political Parties, Constitutional Development, Economy, Sectoral Achievements & Socio-Cultural Prospects'
    ),
    course(
      'EEE 1201',
      'Electrical Machines & Semiconductor Devices',
      3.0,
      'Transformers: Single-Phase and Three-Phase Transformer Principles, Construction & Open/Short-Circuit Tests; DC Machines: DC Generators and DC Motors Operation, Speed Control & Industrial Applications; AC Machines: Synchronous and Asynchronous (Induction) Machines, Starting Methods, Speed Control & Applications; Semiconductor Diodes & Transistors: PN Junction Diode, Zener Diode, BJT Biasing, FET & Transistor Amplifiers; Operational Amplifiers & Power/Digital Electronics: Op-Amp, Differential Amplifier, Silicon-Controlled Rectifier (SCR), Oscilloscope, Logic Circuits & A/D and D/A Conversion'
    ),
    course(
      'MEC 1201',
      'Thermodynamics',
      3.0,
      'Fundamental Concepts & Ideal Gases: Macroscopic/Microscopic Views, Path/Point Functions, Equations of State, Thermodynamic Processes, Specific Heat, Internal Energy & Enthalpy; Pure Substances & Steam Generation: Phase Diagrams, Triple/Critical Points, p-V/T-s/h-s Diagrams, Steam Tables, Mollier Chart, Modern Boilers, Mountings/Accessories, Equivalent Evaporation & Boiler Efficiency; Laws of Thermodynamics & Relations: First and Second Laws, Reversibility/Irreversibility, Entropy, Gibbs & Helmholtz Functions and Maxwell Relations; Air Standard Power Cycles & Compressors: Carnot, Otto, Diesel, Dual, Stirling, Ericsson, Joule & Brayton Cycles on p-V/T-s Planes, Efficiency & Air Compressors/Blowers; Vapor & Combined Power Cycles: Rankine, Reheat, Regenerative, Binary & Combined Power Cycles; Fuels & Mixture of Gases/Vapors (Psychrometry): Solid/Liquid/Gaseous/Nuclear Fuels, Calorific Value, Dalton Law, Gas Mixtures, Humidity, Dew Point, Dry/Wet Bulb Temperatures & Psychrometric Chart'
    ),
    course(
      'CSE 1201',
      'Introduction to Computer Programming',
      3.0,
      'Computer Fundamentals & Digital Logic: CPU, Memory, I/O, Logic Gates (AND, OR, NOT, NAND, NOR, XOR, XNOR), Flip-Flops, Shift Registers, Counters, Binary/BCD Codes & Comparators; C Programming Basics & Control Flow: Variables, Data Types, Operators, Formatted I/O, Debugging & Control Statements (if-else, switch, while, do-while, for); Arrays & Strings: 1D/Multi-Dimensional Arrays, Matrix Manipulation, Sorting & String Processing (Palindrome, Word Reversal, string.h Library); Functions, Recursion & Scope: Call by Value/Reference, Static/Global Variables & Recursive Algorithms (GCD, Fibonacci, Factorial, Tower of Hanoi); Pointers, Structures, Unions & Linked Lists: Dynamic Memory Allocation, Pointer Arrays & Struct/Union Data Processing; File I/O & Object-Oriented Programming Concepts: Data File Processing, Low-Level Programming & OOP Fundamentals (Objects, Encapsulation, Inheritance, Polymorphism, Interfaces)'
    ),
    course(
      'PHY 1202',
      'Sessional on PHY 1201',
      0.75,
      'Optics & Laser Experiments: Focal Length, Spectrometer, Microscope Resolving Power & Laser Diffraction; Thermal Physics & Sound Experiments: Thermal Conductivity, Specific Heat & Acoustic Resonance; Electricity & Magnetic Circuit Measurements'
    ),
    course(
      'EEE 1202',
      'Sessional on EEE 1201',
      0.75,
      'Single-Phase & Three-Phase Transformer Open-Circuit and Short-Circuit Tests; DC Motor/Generator & Three-Phase Induction/Synchronous Machine Performance and Speed Control; Diode, Zener, BJT, Op-Amp, SCR & ADC/DAC Circuit Experiments'
    ),
    course(
      'MEC 1202',
      'Sessional on MEC 1201',
      0.75,
      'Study of Boiler Models, Mountings & Accessories; Determination of Flash Point, Fire Point, Viscosity & Calorific Value of Fuels; Psychrometric Sling Psychrometer, Air Compressor & Steam/Gas Cycle Experiments'
    ),
    course(
      'CSE 1202',
      'Sessional on CSE 1201',
      1.5,
      'C Programming Lab: Conditional Statements, Loops, 1D/2D Arrays, Matrix Operations & String Manipulation; User-Defined Functions, Recursion (GCD, Fibonacci, Tower of Hanoi) & Pointer/Dynamic Memory Exercises; Structures, Linked Lists, File I/O & Object-Oriented Programming Assignments'
    ),
  ],

  // Semester III (2nd Year 1st Semester) — Subtotal: 18.00 Credits
  [
    course(
      'MAT 2101',
      'Mathematics-III',
      3.0,
      'Vector Differential & Integral Calculus: Vector Differentiation/Integration, Gradient, Divergence & Curl with Physical Significance; Line, Surface & Volume Integrals and Green, Gauss Divergence & Stokes Theorems; Curvilinear Coordinate Systems (Cylindrical & Spherical); Matrix Algebra & Linear Systems: Matrix Types, Elementary Transformations, Matrix Inverse, Rank, Linear Dependence/Independence & System Consistency; Eigenvalues & Eigenvectors of Matrices; Complex Variables: Limits, Continuity, Analytic Functions, Cauchy-Riemann Equations & Singularities'
    ),
    course(
      'HUM 2101',
      'Economics & Accounting',
      3.0,
      'Microeconomics: Demand/Supply Theory, Elasticity, Price Determination, Marginal Analysis, Optimization, Production Functions & Internal/External Economies; Macroeconomics & Project Appraisal: Savings, Investment, National Income, Inflation, NPV, IRR, Cost-Benefit Analysis & Monetary/Fiscal/Trade Policy in Bangladesh; Accounting Principles & Recording Process: GAAP, Accounting Equation, Debit/Credit Rules, Journal, Ledger, Trial Balance & Adjusting Entries; Financial Statements: Single/Multi-Step Income Statements, Owner Equity, Classified Balance Sheet & Cash Flow Statement; Cost Accounting: Cost Classification, Statement of Cost (Cost Sheet), Material/Labor Overhead & Operating/Service Costing'
    ),
    course(
      'MEC 2103',
      'Engineering Mechanics - I',
      3.0,
      'Fundamentals of Statics & Force Resolution: Concurrent Coplanar/3D Forces, Resultants & Component Resolution; Equilibrium of Particles & Rigid Bodies in 2D/3D: Free-Body Diagrams, Transmissibility, Moments, Couples & Force-Couple System Reduction; Centroids, Center of Gravity & Moments of Inertia: Area/Mass Moments of Inertia, Radius of Gyration, Parallel-Axis Theorem, Product/Ellipsoid of Inertia & Axis Rotation/Transfer; Analysis of Statically Determinate Structures, Trusses & Frames; Laws of Friction: Dry Sliding Friction, Wedges, Square-Threaded Screws, Journal/Thrust Bearings, Rolling Resistance & Belt Friction; Principle of Virtual Work & Potential Energy: Virtual Work Applications, Mechanical Efficiency & Stability of Equilibrium'
    ),
    course(
      'MEC 2105',
      'Engineering Metallurgy',
      3.0,
      'Mechanical Properties & Testing of Metals: Malleability, Ductility, Hardness, Toughness, Fatigue & Destructive/Non-Destructive Testing (NDT); Crystal Structure, Solidification & Phase Diagrams: Crystal Lattices, Nucleation, Grain Growth, Binary Equilibrium Diagrams & Iron-Iron Carbide (Fe-Fe3C) Phase Diagram; Heat Treatment of Steels: Hardening, Annealing, Normalizing, Quenching, Tempering, Case Hardening, Carburizing, Nitriding, Precipitation & TTT/S-Curve Diagrams; Ferrous Metallurgy: Production, Microstructures & Properties of Pig Iron, Wrought Iron, Cast Irons (Gray, White, Malleable, Nodular) & Carbon/Alloy/Stainless Steels; Non-Ferrous Metals & Special Alloys: Copper, Aluminum, Nickel, Tin, Lead, Noble Metal Alloys, Bearing Metals & Spring Steels; Metal Joining Metallurgy, Surface Coatings/Plating & Powder Metallurgy (Powder Production, Compacting, Sintering)'
    ),
    course(
      'MEC 2107',
      'Statistics & Quality Control',
      3.0,
      'Descriptive Statistics & Data Analysis: Grouped/Ungrouped Frequency Distributions, Mean, Median, Mode, Standard Deviation, Moments, Skewness, Kurtosis & Coefficient of Variation; Probability & Statistical Distributions: Sets, Venn Diagrams, Conditional Probability, Bayes Theorem, Binomial, Poisson, Hypergeometric, Geometric, Normal, Uniform, Exponential, Chi-Square & t-Distributions; Statistical Inference & Hypothesis Testing: Type I/II Errors, One/Two-Sided Tests, OC Curves & Goodness-of-Fit Tests; Statistical Process Control (SPC) Fundamentals: Quality Costs, Chance vs Assignable Causes, Pareto Analysis, Cause-and-Effect (Fishbone) Diagrams & Histograms; Control Charts for Variables & Attributes: X-bar, R & Sigma Charts, p-Chart (Fraction Nonconforming), c/u-Charts (Defects), ARL & Process Capability Analysis; Total Quality Management (TQM): QC Circles, TQC, Industrial Impact & ISO 9000 Series Standards'
    ),
    course(
      'MEC 2104',
      'Sessional on MEC 2103',
      0.75,
      'Verification of Polygon of Forces, Moments & Equilibrium of Coplanar/Non-Coplanar Force Systems; Determination of Centroids, Moment of Inertia & Coefficient of Sliding/Belt/Screw Friction; Truss Member Force Measurement & Virtual Work Lifting Machine Efficiency Experiments'
    ),
    course(
      'MEC 2106',
      'Sessional on MEC 2105',
      0.75,
      'Metallographic Specimen Preparation (Grinding, Polishing, Etching) & Optical Microscope Microstructure Study of Cast Irons and Steels; Heat Treatment Experiments: Annealing, Normalizing, Quenching & Tempering of Carbon Steels; Hardness Testing (Brinell, Rockwell, Vickers) & Non-Destructive Defect Detection'
    ),
    course(
      'MEC 2100',
      'CAD/CAM',
      1.5,
      '2D Computer-Aided Drafting & Working Drawings of Machine Elements using AutoCAD; 3D Parametric Part Modeling, Assembly Design & Detailing using SolidWorks; Toolpath Generation & Introduction to CAM/CNC Machining Workflows'
    ),
  ],

  // Semester IV (2nd Year 2nd Semester) — Subtotal: 18.75 Credits
  [
    course(
      'MAT 2201',
      'Mathematics-IV',
      3.0,
      'Fourier Series & Fourier Transform: Periodic Functions, Arbitrary-Period Fourier Series, Half-Range Sine/Cosine Series & Fourier Integrals/Transforms; Special Functions: Bessel Functions and Legendre Polynomials (Orthogonality, Generating Functions & Recurrence Relations); Partial Differential Equations (PDEs): Classification of PDEs & Analytical Solution of 1D Heat and Wave Equations; 2D & 3D Laplace Equations: Solution of Steady-State Heat/Potential Distribution in Cartesian, Polar, Cylindrical & Spherical Coordinates; Laplace Transforms: Existence, Properties, Inverse Transforms, Convolution Theorem & Solving ODEs and PDEs with Initial/Boundary Conditions'
    ),
    course(
      'HUM 2201',
      'Industrial Environment & Sociology',
      3.0,
      'Industrial Environment & Mass/Energy Balances: Industrialization, Urbanization, Pollution Causes & Steady/Unsteady-State Environmental Mass and Energy Balances; Industrial & Hazardous Waste Management: Waste Generation, Prevention, Collection, Transport, Treatment, Disposal & Environmental Regulations; Industrial & Labor Laws in Bangladesh: Factory Inspectors, Health, Hygiene, Safety, Welfare, Working Hours, Leave, Payment of Wages Act, Bangladesh Labour Act 2006, EPZ Act 2004, Environment Conservation Act 1995 & ILO; Sociology for Engineers: Society, Community, Association, Group Dynamics & Social History/Culture of Bangladesh; Urbanization & Social Problems: Urban Ecology, Population Growth, Poverty, Crime, Juvenile Delinquency & Industrialization Impacts'
    ),
    course(
      'MEC 2203',
      'Engineering Mechanics -II',
      3.0,
      'Kinematics of Particles: Rectilinear & Curvilinear Motion, Rectangular, Tangential/Normal, Radial/Transverse Components & Relative Motion of Translating Frames; Kinematics of Rigid Bodies: Translation, Fixed-Axis Rotation, General Plane Motion, Instantaneous Center, Relative Velocity/Acceleration & Coriolis Acceleration; Kinetics of Particles & Orbital Mechanics: Newton Second Law, Linear/Angular Momentum, Central-Force Motion, Two-Body Problem, Satellite Orbits & Escape Velocity; Work, Energy, Impulse & Impact of Particles: Conservative Forces, Potential Energy, Space Mechanics & Direct/Oblique Central Impact; Planar Kinetics of Rigid Bodies: d Alembert Principle, Equations of Plane Motion, Constrained Motion, Work-Energy, Impulse-Momentum & Eccentric Impact; 3D Rigid Body Kinetics & Gyroscopes: 3D Angular Momentum, Euler Equations, Eulerian Angles, Gyroscopic Precession & Gyroscopic Couple on Airplanes and Naval Ships'
    ),
    course(
      'MEC 2209',
      'Mechanics of Solid',
      3.0,
      'Stress, Strain & Thin-Walled Vessels: Tensile, Compressive, Bearing & Shear Stresses, Stress-Strain Diagrams, Axial/Biaxial/Triaxial Deformation, Statically Indeterminate Bars, Thermal Stresses & Thin-Walled Cylinders; Statically Determinate Beams: Support/Loading Types, SFD & BMD, Flexure Formula, Economic Sections, Shear Stress Distribution & Reinforced Concrete Beams; Beam Deflections & Indeterminate Beams: Double Integration, Area-Moment & Superposition Methods, Propped/Restrained Beams, Continuous Beams & Three-Moment Theorem (Clapeyron Equation); Torsion & Springs: Circular Shaft Torsion Formula, Angle of Twist, Flanged Couplings & Close-Coiled Helical Springs; Combined Stresses & Mohr Circle: Combined Axial/Bending/Torsional Loads, Kern of Section, Principal Stresses, Mohr Circle & Strain Rosettes; Columns & Structural Connections: Euler Buckling Load, Slenderness Ratio, Empirical/Secant Formulas & Concentric/Eccentric Riveted and Welded Connections'
    ),
    course(
      'MEC 2211',
      'Industrial Measurement & Instrumentation',
      3.0,
      'Instrumentation Fundamentals: Classification, Static/Dynamic Characteristics, Sensitivity, Resolution, Measurement Errors, Statistical Data Analysis & Calibration; Electromechanical & Electronic Sensors: Pressure, Temperature (RTD, Thermocouple, Pyrometer), Optical, Flow, Strain Gauge, Ultrasonic & Speed Sensors; Signal Conditioning & Data Acquisition: Analog/Digital Signal Processing, DAQ Hardware, Data Logging, Display & Basic Electricity Review; Mechanical & Motion Measurements: Distance, Linear/Angular Velocity, Acceleration, Vibration, Force, Torque, Stress & Strain Measurement Systems; Thermal & Fluid Measurements: High-Temperature Control, Humidity, Heat Flux, Viscosity, Flow Velocity, Volumetric/Mass Flow Rate & Pressure Instrumentation'
    ),
    course(
      'MEC 2204',
      'Sessional on MEC 2203',
      0.75,
      'Kinematics & Kinetics Experiments: Projectile Motion, Moment of Inertia of Flywheel, Compound Pendulum & Bifilar/Trifilar Suspension; Conservation of Momentum, Coefficient of Restitution in Impact & Centrifugal Force Balancing; Gyroscopic Couple & Precession Verification Experiments'
    ),
    course(
      'MEC 2210',
      'Sessional on MEC 2209',
      0.75,
      'Universal Testing Machine (UTM) Tensile, Compression & Direct Shear Tests on Mild Steel, Cast Iron and Timber; Torsion Test on Circular Shafts, Impact Toughness (Izod/Charpy) & Hardness Tests; Deflection of Simply Supported/Cantilever Beams, Helical Spring Stiffness & Column Buckling Experiments'
    ),
    course(
      'MEC 2212',
      'Sessional on MEC 2211',
      0.75,
      'Calibration and Testing of Temperature, Pressure, Flow, Strain Gauge, Ultrasonic & Speed Sensors; Data Acquisition (DAQ), Signal Conditioning & Statistical Error Analysis; Programmable Logic Controller (PLC) Interfacing & Industrial Instrumentation Experiments'
    ),
    course(
      'MEC 2200',
      'Simulation & Modelling',
      1.5,
      'Mathematical Modeling of Mechanical, Thermal & Fluid Engineering Systems; Numerical Simulation & Visualization using MATLAB/Simulink; Finite Element / Multiphysics Engineering Problem Solving using ANSYS/COMSOL/SolidWorks Simulation'
    ),
  ],

  // Semester V (3rd Year 1st Semester) — Subtotal: 18.75 Credits
  [
    course(
      'MEC 3101',
      'Heat and Mass Transfer',
      3.0,
      'Steady & Unsteady Conduction Heat Transfer: General Heat Conduction Equation, Plane Wall/Cylinder/Sphere Composite Structures, Thermal Contact Resistance & Transient Conduction (Lumped Capacity, Heisler Charts); Radiation Heat Transfer: Blackbody/Graybody Radiation Laws, View/Shape Factors, Radiation Exchange Between Surfaces, Radiation Shields & Gas Radiation; Forced Convection Heat Transfer: Laminar & Turbulent Velocity/Thermal Boundary Layers over Flat Plates and Inside Tubes/Ducts, Dimensionless Numbers (Re, Pr, Nu) & Empirical Correlations; Natural (Free) Convection Heat Transfer: Grashof/Rayleigh Numbers & Free Convection over Vertical/Horizontal Surfaces and Enclosures; Phase-Change Heat Transfer: Pool/Flow Boiling Regimes (Nukiyama Curve) & Film/Dropwise Condensation Correlations; Mass Transfer: Fick Law of Diffusion, Convective Mass Transfer, Simultaneous Heat/Mass Transfer & Heat-Mass Transfer Analogy'
    ),
    course(
      'MEC 3103',
      'Theory of Machine',
      3.0,
      'Turning Moment & Flywheels: Inertia Forces in Reciprocating Engines, Turning Moment Diagrams, Fluctuation of Energy/Speed & Flywheel Design; Balancing of Rotating & Reciprocating Masses: Static and Dynamic Balancing, In-Line & V-Engines, Direct/Reverse Cranks & Balancing Machines; Gears & Gear Trains: Law of Gearing, Involute/Cycloidal Tooth Profiles, Interference, Spur/Helical/Bevel/Worm Gears & Simple, Compound, Reverted and Epicyclic Gear Trains; Governors, Cams & Followers: Watt, Porter, Proell & Hartnell Centrifugal Governors, Sensitiveness/Hunting & Cam Profile Design for Follower Motions (SHM, Uniform Velocity/Acceleration, Cycloidal); Single-DOF Mechanical Vibrations: Undamped/Damped Free & Forced Vibrations, Resonance, Beats, Torsional Shaft Oscillations & Critical Whirling Speed of Shafts; Multi-DOF Vibrations, Isolation & Control: 2-DOF Systems, Multi-Rotor Torsional Vibration, Self-Excited Vibration, Vibration Measuring Instruments, Transmissibility/Isolation & Dynamic Vibration Absorbers'
    ),
    course(
      'MEC 3113',
      'Machine Tools & Tool Engineering',
      3.0,
      'Work Holding Devices — Location & Clamping: 6-DOF 3-2-1 Location Principle, Locators, Clamping Principles, Clamping Forces & Clamp Types; Design of Jigs and Fixtures: Drill Jigs (Template, Plate, Box, Indexing) & Lathe, Milling, Boring, Broaching and Grinding Fixtures; Press Tool & Die Design: Punch/Die Cutting Operations, Die Clearance, Strip Layout, Blanking/Piercing Dies & Bending, Forming and Deep Drawing Dies (Drawing Forces, Blank Size); Machine Tools & Gear/Thread Manufacturing: Engine/Turret/Capstan Lathes, Drilling, Boring, Shaper, Planer, Milling Machines & Thread/Gear Cutting Processes; Machine Tool Drives & Structures: Power Requirements, Stepped/Geared Speed & Feed Drives, Ray Diagrams, Speed Structure Diagrams, Machine Beds/Columns & Maintenance; Numerical Control & Automation: NC, CNC, DNC Systems & CAM Integration'
    ),
    course(
      'MEC 3115',
      'Fluid Mechanics - I',
      3.0,
      'Fluid Properties: Continuum Concept, Newtonian/Non-Newtonian Viscosity, Compressibility, Bulk Modulus, Surface Tension, Capillarity & Vapor Pressure; Fluid Statics & Buoyancy: Hydrostatic Pressure, Manometers, Forces on Plane/Curved Submerged Surfaces, Buoyancy, Metacenter, Stability of Floating Bodies & Rigid-Body Acceleration/Rotation of Fluids; Fluid Kinematics & Dynamics: Lagrangian/Eulerian Descriptions, System vs Control Volume (Reynolds Transport Theorem), Continuity, Euler, Bernoulli & Energy Equations, EGL and HGL; Viscous Laminar & Turbulent Pipe Flow: Hagen-Poiseuille Flow in Circular/Inclined/Annular Pipes and Parallel Plates, Darcy-Weisbach Equation, Moody Chart & Minor Losses; Fluid Flow Measurement & Tank Emptying: Pitot Tube, Anemometer, Venturimeter, Orifice Meter, Mouthpieces, Rotameter, Notches/Weirs & Unsteady Flow Time to Empty Tanks/Connected Vessels'
    ),
    course(
      'MEC 3117',
      'Numerical Computation for Mechanical Engineers',
      3.0,
      'Polynomial Interpolation: Newton Forward/Backward, Lagrange, Stirling & Bessel Central Difference Interpolation Formulas; Solution of Nonlinear Algebraic Equations: Fixed-Point Iteration, Regula Falsi (False Position) & Newton-Raphson Methods with Convergence Criteria; Solution of Linear Algebraic Systems & Eigenvalues: Matrix Inversion, Gauss Elimination with Pivoting, LU Triangular Factorization, Iterative Solvers & Eigenvalue/Eigenvector Estimation; Numerical Differentiation & Integration: Taylor Series Finite Differences (Forward, Backward, Central), Trapezoidal Rule, Simpson 1/3 & 3/8 Rules, Weddle Rule and Error Analysis; Numerical Solution of ODEs: Taylor Series, Euler, Multi-Order Runge-Kutta (RK2/RK4) & Predictor-Corrector (Milne/Adams-Bashforth) Methods; Numerical Solution of PDEs & Curve Fitting: Elliptic, Parabolic & Hyperbolic PDEs via Finite Difference, Crank-Nicolson, d Alembert Solution & Least-Squares Linear/Polynomial Regression'
    ),
    course(
      'MEC 3102',
      'Sessional on MEC 3101',
      0.75,
      'Thermal Conductivity of Metal Rod/Insulating Powder & Composite Wall Heat Conduction; Forced & Free Convection Heat Transfer Coefficient over Flat Plates, Fins and Inside Tubes; Stefan-Boltzmann Radiation Constant, Emissivity, Dropwise/Film Condensation & Boiling Heat Transfer Experiments'
    ),
    course(
      'MEC 3104',
      'Sessional on MEC 3103',
      0.75,
      'Static & Dynamic Balancing of Rotating and Reciprocating Masses; Centrifugal Governor Characteristics, Cam-Follower Motion Analysis & Epicyclic Gear Train Experiments; Free/Forced Damped Vibration, Torsional Oscillation & Whirling of Shaft Experiments'
    ),
    course(
      'MEC 3114',
      'Sessional on MEC 3113',
      0.75,
      'Study of Machine Tool Kinematics, Speed/Feed Gearboxes & Alignment Testing of Lathe/Milling Machines; Design and Fabrication of Drill Jigs, Milling Fixtures & Sheet-Metal Blanking/Piercing Dies; CNC Part Programming (G-Code/M-Code) & Machining Operations'
    ),
    course(
      'MEC 3116',
      'Sessional on MEC 3115',
      0.75,
      'Hydrostatic Center of Pressure, Metacentric Height of Floating Body & Bernoulli Theorem Verification; Flow Calibration of Venturimeter, Orifice Meter, Rotameter & V-Notch/Rectangular Weirs; Pipe Friction Factor (Laminar/Turbulent Reynolds Apparatus) & Minor Losses in Pipe Fittings'
    ),
    course(
      'MEC 3118',
      'Sessional on MEC 3117',
      0.75,
      'MATLAB/Python/C++ Implementation of Interpolation, Nonlinear Root-Finding & Linear System Solvers; Numerical Differentiation, Integration (Simpson/Weddle) & Least-Squares Curve Fitting Programs; Runge-Kutta ODE & Finite-Difference 1D/2D Heat/Wave PDE Solvers for Mechanical Systems'
    ),
  ],

  // Semester VI (3rd Year 2nd Semester) — Subtotal: 23.00 Credits
  [
    course(
      'MEC 3201',
      'Heat Transfer Equipment Design',
      3.0,
      'Thermal System Design Principles: Heat Transfer & Mechanical Requirements, Material Selection, Economic Optimization, Safety, Reliability & Cyclic Service; Extended Surface (Fin) Design: Longitudinal, Radial & Pin Fins, Fin Efficiency, Effectiveness, Fin Arrays & Unsteady Fin Conduction; Thermal & Hydraulic Design of Heat Exchangers: Parallel, Counter, Cross-Flow, Shell-and-Tube (Single/Multi-Pass) & Compact Heat Exchangers; Heat Exchanger Sizing & Rating Methods: LMTD Method, F-Correction Factor, Effectiveness-NTU Method, Pressure Drop & Fouling Analysis; Two-Phase Heat Transfer Equipment Design: Boilers, Condensers, Evaporators & Cooling Towers; Modeling of Thermal Systems with Internal Heat Generation'
    ),
    course(
      'MEC 3215',
      'Fluid Mechanics - II',
      3.0,
      'Dimensional Analysis & Hydraulic Similitude: Dimensional Homogeneity, Buckingham Pi Theorem, Reynold/Froude/Mach/Weber/Euler Numbers & Model Laws; External Flow over Submerged Bodies & Turbulence: Prandtl Mixing-Length Theory, Roughness Effects, Drag/Lift Coefficients & Flow Separation; Boundary Layer Theory: Laminar and Turbulent Boundary Layer Growth, Displacement/Momentum/Energy Thicknesses, Von Karman Momentum Integral Equation, Pressure Gradient Effects & Boundary Layer Control; Compressible Fluid Flow: 1D Continuity/Momentum/Energy Equations, Speed of Sound, Mach Cone, Stagnation Properties, Isentropic Convergent-Divergent Nozzle Flow, Normal Shock Waves, Fanno Line & Rayleigh Line; Ideal (Potential) Fluid Flow: Rotational/Irrotational Flow, Velocity Potential, Stream Function, Cauchy-Riemann Equations, Flow Nets, Source/Sink, Doublet, Free/Forced Vortex, Cylinder Flow with Circulation, Magnus Effect & Kutta-Joukowski Lift'
    ),
    course(
      'MEC 3219',
      'Manufacturing Process',
      3.0,
      'Manufacturing Systems & Production Planning: Production Types, Plant Organization, Scientific Management, Plant Location/Layout & Production Planning and Control (PPC); Metal Casting Processes: Sand Casting, Pattern Design, Molding Sand Properties/Testing, Core Making, Die Casting, Centrifugal, Investment & Continuous Casting and Casting Defects; Welding & Joining Processes: Oxy-Fuel Gas, SMAW, GMAW/GTAW, Resistance, Pressure, Thermite & Laser/Electron-Beam Welding, Welding Defects, Brazing, Soldering, Metal Spraying & Hardfacing; Hot & Cold Metal Forming Processes: Rolling, Forging, Extrusion, Wire/Tube Drawing & Sheet-Metal Working; Metal Cutting Mechanics: Orthogonal/Oblique Cutting, Chip Formation, Chip Breakers, Merchant Circle Cutting Forces, Tool Wear & Cutting Fluids; Abrasive Finishing & Non-Traditional Machining: Surface/Centerless Grinding, Honing, Lapping, Superfinishing & Modern Machining (ECM, EDM, USM, LBM, PAM)'
    ),
    course(
      'MEC 3221',
      'Machine Design - I',
      3.0,
      'Machine Design Philosophy & Stress Analysis: Design Standards, Engineering Materials, Fits, Limits, Tolerances, Allowances, Stress Concentration & Fatigue Failure Theories (Goodman, Soderberg, Gerber); Design of Threaded Fasteners & Permanent Joints: Power Screws, Bolted Joints under Preload/Eccentric Loads & Structural/Boiler Riveted Joints; Design of Mechanical Springs: Helical Compression/Tension, Torsion, Concentric & Leaf Springs under Static and Fluctuating Loads; Design of Columns & Struts: Central and Eccentric Loading on Machine Columns; Design for Combined Stresses — Shafts, Keys & Couplings: Transmission Shafts under Combined Bending/Torsion/Axial Loads, Square/Flat/Splined Keys & Rigid and Flexible Shaft Couplings'
    ),
    course(
      'MEC 3223',
      'Operation Management',
      3.0,
      'Operations Management & Economic Analysis: Production Systems, Cost Classification, Break-Even Analysis, Time Value of Money & Capital Investment Evaluation; Process & Work Design: Process Flow Charting, Energy/Environmental Considerations, Method Study, Work Measurement, Standard Time & Learning Curves; Facility Location, Plant Layout & Safety: Brown-Gibson Site Selection Model, Product/Process/Fixed-Position/Cellular Group Layouts & OSHA Safety Standards; Demand Forecasting Systems: Qualitative/Subjective, Causal Regression & Time-Series (Moving Average, Exponential Smoothing) Forecasting; Inventory Control Models & MRP/JIT: EOQ, EPQ, Planned Shortage, Quantity Discount, Safety Stock, Continuous/Periodic Review, Material Requirements Planning (MRP) & Just-in-Time (JIT) Systems; Operations & Project Scheduling: Flow-Shop (Johnson Rule), Job-Shop Sequencing & CPM/PERT Network Scheduling'
    ),
    course(
      'MEC 3225',
      'Research Methodology & Scientific Research',
      3.0,
      'Foundations of Scientific Research: Pure, Applied & Fundamental Research, Problem Statement, Research Gap, Research Questions, Objectives & Methodology Selection; Scientific Writing & Presentation: Literature Review, Dissertation/Thesis Framework, Journal Paper Structure, Results/Discussion, Conclusions & Technical Presentations; Data Collection & Quantitative/Qualitative Analysis: Primary/Secondary Data, Experimental Uncertainty, Correlation Modeling, Hypothesis Formulation & Statistical Validation; Research Ethics & Academic Integrity: Research Misconduct, Conflicts of Interest, Plagiarism Detection/Prevention & Publication Ethics; Citation Styles (IEEE, APA, Harvard, Vancouver) & Reference Management Tools (Mendeley, Zotero, EndNote)'
    ),
    course(
      'MEC 3202',
      'Sessional on MEC 3201',
      0.75,
      'Thermal Design, Sizing & Performance Testing of Parallel/Counter-Flow concentric Tube and Shell-and-Tube Heat Exchangers; Fin Array Efficiency & Unsteady Conduction Experiments; Cooling Tower, Condenser & Evaporator Performance Analysis'
    ),
    course(
      'MEC 3216',
      'Sessional on MEC 3215',
      0.75,
      'Subsonic Wind Tunnel Experiments: Boundary Layer Velocity Profile over Flat Plate & Pressure Distribution/Lift-Drag around Circular Cylinder and Airfoil; Compressible Flow through Convergent-Divergent Nozzle & Shock Wave Study; Vortex Flow & Reynolds/Froude Similitude Experiments'
    ),
    course(
      'MEC 3220',
      'Sessional on MEC 3219',
      0.75,
      'Machining Practice on Lathe (Turning, Taper, Threading), Drilling, Milling, Shaper & Surface Grinding Machines; Molding Sand Testing (Permeability, Moisture, Green Compression Strength) & Metal Casting; Chip Formation, Cutting Force Measurement & Welding Quality Inspection'
    ),
    course(
      'MEC 3222',
      'Sessional on MEC 3221',
      0.75,
      'Complete Analytical Design & CAD Drafting of Screwed/Riveted Joints, Power Screws & Helical/Leaf Springs; Design and Stress Verification of Transmission Shafts, Keys & Rigid/Flexible Couplings'
    ),
    course(
      'MEC 3200',
      'Integrated Project Design',
      2.0,
      'Group Engineering Design Project: Conceptual Design, CAD Modeling & Stress/Thermal Analysis of a Mechanical System or Machine Element; Material Selection, Cost Estimation, Prototype Fabrication & Final Design Defense'
    ),
  ],

  // Semester VII (4th Year 1st Semester) — Subtotal: 22.25 Credits
  [
    course(
      'MEC 4101',
      'Internal Combustion Engine',
      3.0,
      'Gas Turbines & Jet Propulsion: Open/Closed Brayton Cycles, Reheat, Regeneration, Intercooling, Turbojet/Turbofan/Ramjet/Rocket Propulsion, Specific Fuel Consumption & Propulsive Efficiency; Steam Turbines & Nozzles: Convergent-Divergent Nozzle Design, Supersaturated Flow, Impulse (De Laval, Curtis, Rateau) & Reaction (Parsons) Turbines, Velocity Diagrams, Compounding, Reheat Factor, Governing & Steam Condensers; Combustion Chemistry & Stoichiometry: Complete/Incomplete Combustion, Stoichiometric Air-Fuel Ratio, Enthalpy of Formation & Adiabatic Flame Temperature; IC Engine Performance & Testing: SI/CI Engine Classifications, Torque/Power/Fuel/Air Measurement, Indicator Diagrams, IP, BP, MEP, SFC, Thermal/Volumetric Efficiencies & Heat Balance Sheet; Fuel Metering, Combustion & Knocking in SI/CI Engines: Carburetion, Electronic Fuel Injection, Diesel Injection, Flame Propagation, Auto-Ignition, Octane/Cetane Rating, Detonation/Diesel Knock & Combustion Chamber Design; Scavenging, Turbocharging, Supercharging & Engine Emission Control'
    ),
    course(
      'MEC 4115',
      'Fluid Machineries',
      3.0,
      'Reciprocating Pumps: Classification, Work Done, Slip, Piston Acceleration & Friction Effects on Suction/Delivery Indicator Diagrams, Air Vessels & Cavitation; Centrifugal Pumps: Work Done (Euler Head), Efficiencies, Characteristic Curves, Minimum Starting Speed, Impeller Design, Specific Speed, Priming, NPSH & Cavitation; Hydraulic Turbines: Impulse (Pelton Wheel) & Reaction (Francis, Kaplan) Turbines, Euler Turbine Equation, Velocity Triangles, Efficiencies, Specific Speed, Governing, Cavitation & Model Testing; Positive-Displacement & Dynamic Blowers and Compressors; Impact of Fluid Jets: Linear Momentum Principle, Jet Force/Work on Fixed and Moving Flat/Curved Vanes & Momentum/Energy Correction Factors; Open Channel Hydraulics: Chezy, Manning, Ganguillet-Kutter & Bazin Formulas, Most Economical Channel Sections, Specific Energy, Critical Depth, Froude Number & Hydraulic Jump'
    ),
    course(
      'MEC 4121',
      'Machine Design - II',
      3.0,
      'Sliding Contact Bearings: Hydrodynamic Lubrication Theory (Sommerfeld Number), Thermal Equilibrium & Design of Journal and Thrust Bearings; Rolling Contact Bearings: Ball and Roller Bearing Types, Static/Dynamic Load Ratings, L10 Fatigue Life & Bearing Selection; Design of Spur & Helical Gears: Lewis Bending Equation, Buckingham Dynamic/Wear Loads & AGMA Gear Design Standards; Design of Bevel & Worm Gears: Straight Bevel Gear Forces/Stresses & Worm Gear Thermal/Strength Rating; Friction Clutches & Brakes: Single/Multi-Plate, Cone & Centrifugal Clutches and Block, Band & Internal Expanding Drum/Disc Brakes; Flexible Power Transmission & Welded Joints: Flat/V-Belts, Wire Ropes, Roller Chains & Axially/Eccentrically Loaded Welded Joints'
    ),
    course(
      'MEC 4127',
      'Refrigeration & Air - Conditioning',
      3.0,
      'Vapor Compression Refrigeration Systems: Carnot vs Actual Vapor Compression Cycles, p-h Charts, Subcooling/Superheating & Multi-Pressure/Compound Compression Systems; Vapor Absorption & Non-Conventional Refrigeration: Aqua-Ammonia & LiBr-Water Absorption Cycles, Air-Cycle (Bell-Coleman), Steam-Jet & Vortex Tube Refrigeration; Cryogenics & Low-Temperature Refrigeration: Cascade Systems & Gas Liquefaction (Linde-Hampson, Claude Cycles); Refrigerants & Refrigeration Equipment: ODP/GWP Refrigerant Classifications, Compressors (Reciprocating, Rotary, Screw, Centrifugal), Condensers, Evaporators & Expansion Devices (Capillary, TEV); Air-Conditioning & Psychrometric Processes: Psychrometric Chart Processes, ASHRAE Thermal Comfort & Detailed Building Cooling/Heating Load Calculations (CLTD/SCL); Air Distribution & HVAC Systems: Central vs Unitary AC, AHU, Dehumidified Air Quantity, Duct Design (Equal Friction, Static Regain), Fans, Filters & HVAC Controls'
    ),
    course(
      'MEC 40XX (Opt-I)',
      'Optional Course - I (4th Year 1st Semester)',
      3.0,
      'Select 1st Elective Course (3.0 Credits) from MEC 4035–4069: MEC 4035 Advanced Thermodynamics; MEC 4037 Automobile Engineering; MEC 4039 Aerodynamics; MEC 4041 Fluid Power Transmission and Control; MEC 4043 Finite Element Method; MEC 4045 Industrial Automation; MEC 4047 Operations Research; MEC 4049 Material Handling & Maintenance Engineering; MEC 4051 Engineering Tribology'
    ),
    course(
      'MEC 40XX (Opt-II)',
      'Optional Course - II (4th Year 1st Semester)',
      3.0,
      'Select 2nd Elective Course (3.0 Credits) from MEC 4035–4069: MEC 4053 Modern Manufacturing Processes; MEC 4055 Artificial Intelligence; MEC 4057 Robotics & Mechatronics; MEC 4059 Mechanical Vibration; MEC 4061 Nanomaterial & Nanotechnology; MEC 4063 Industrial Safety; MEC 4065 Project Management and Leadership; MEC 4067 Nuclear Power Plant Engineering; MEC 4069 Power Plant Economics'
    ),
    course(
      'MEC 4102',
      'Sessional on MEC 4101',
      0.75,
      'Valve Timing Diagram, Port Timing & Component Study of 2-Stroke and 4-Stroke SI/CI Engines; Load, Speed, Fuel Consumption, Morse Test & Heat Balance Sheet of Petrol and Diesel Engines; Exhaust Gas Emission Analysis & Gas/Steam Turbine Model Study'
    ),
    course(
      'MEC 4116',
      'Sessional on MEC 4115',
      0.75,
      'Performance Characteristics of Reciprocating & Centrifugal Pumps (Series and Parallel Operation, Cavitation); Impact of Water Jet on Vanes & Performance Testing of Pelton, Francis and Kaplan Hydraulic Turbines; Open Channel Hydraulic Jump & Weir/Flume Flow Experiments'
    ),
    course(
      'MEC 4122',
      'Sessional on MEC 4121',
      0.75,
      'Complete Design & CAD Assembly Drawing of Journal/Rolling Bearings, Clutches & Brakes; Spur, Helical, Bevel & Worm Gear Reducer Box Design Project; Fabrication/Prototype Construction of a Designed Machine Element & Term Presentation'
    ),
    course(
      'MEC 4000 (Part-I)',
      'Project & Thesis - I',
      2.0,
      'Selection of Theoretical/Experimental Research Topic in Mechanical Engineering; Comprehensive Literature Survey, Problem Formulation & Methodology Design; Seminar Presentation & Part-I Progress Report'
    ),
  ],

  // Semester VIII (4th Year 2nd Semester) — Subtotal: 19.00 Credits (Grand Total: 161.00 Credits)
  [
    course(
      'MEC 4229',
      'Renewable Energy Technology',
      3.0,
      'Global & Bangladesh Energy Scenario: Energy Cycle, Non-Renewable Reserves (Coal, Oil, Gas, Nuclear, Shale) & Renewable Prospects in Bangladesh; Environmental & Economic Aspects of Energy: Ozone Depletion, Global Warming, Acid Rain, Thermal Pollution & Sustainable Development Pathways; Solar Thermal & Photovoltaic Conversion: Flat-Plate/Concentrating Solar Collectors, Solar Ponds & Semiconductor PV Cell Physics/Systems; Biomass & Bioenergy Conversion: Thermo-Chemical (Pyrolysis, Gasification, Combustion), Bio-Chemical (Anaerobic Digestion, Fermentation) & Transesterification (Biodiesel) Processes; Wind, Hydro, Geothermal & Ocean Energy: Wind Turbine Aerodynamics, Micro/Mini-Hydro, Geothermal Extraction, Wave, Tidal & OTEC Systems; Direct Energy Conversion & Energy Storage: Thermoelectric, Thermionic, Fuel Cells, MHD Generators & Thermal/Electrochemical Energy Storage for Stationary and EV Applications'
    ),
    course(
      'MEC 4231',
      'Power Plant Engineering',
      3.0,
      'Power Plant Overview & Variable Load Economics: Bangladesh Power Sector, Chronological/Load Duration Curves, Load/Capacity/Demand/Diversity Factors, Load Forecasting, Tariffs & Economic Load Dispatch; Diesel Engine Power Plants: Plant Layout, Fuel Handling, Cooling/Lubrication/Starting Systems, Supercharging & Heat Balance; Steam Thermal Power Plants: Coal/Gas/Oil Fired Layouts, High-Pressure Boilers, Draught Systems, Ash/Coal Handling, Condensers & Feedwater Conditioning; Gas Turbine & Combined Cycle Power Plants: Open/Closed Gas Turbine Layouts, Regeneration, Intercooling, Reheating & Combined Cycle GT-ST Performance; Hydroelectric & Nuclear Power Plants: Hydrographs, Mass Curves, Dam/Spillway/Turbine Selection, Nuclear Fission Principles, PWR/BWR/CANDU/FBR Reactors, Safety & Radioactive Waste Disposal; Power Plant Auxiliaries, Safety & Environmental Regulations: Cooling Towers, Spray Ponds, Chimney/Foundation Design, Plant Starting/Stopping Protocols & EIA Regulations'
    ),
    course(
      'MEC 4233',
      'Industrial Management & Professional Ethics',
      3.0,
      'Management & Organization Fundamentals: Evolution of Management Thought, Functions/Principles of Management, Organizational Structures & Span of Control; Personnel Management & Motivation: Manpower Planning, Recruitment, Training, Leadership Styles, Morale, Motivation Theories (Maslow, Herzberg, McGregor) & Job Enrichment/Rotation; Wages, Incentives, MIS & Decision Making: Job Evaluation Methods, Wage Incentive Plans, Fringe Benefits, MIS, Decision Support Systems (DSS) & Strategic Planning; Budgeting, Purchasing & Industrial Marketing: Budgetary Control, Purchasing Procedures, Marketing Mix, Consumer/Industrial Selling, Distribution Channels & Sales Promotion; Research & Development (R&D) and Product Life Cycle Management; Professional & Engineering Ethics: Egoism, Relativism, Utilitarianism, Duty/Virtue Ethics, Moral Responsibility, Confidentiality, Privacy & Workplace Harassment Prevention'
    ),
    course(
      'MEC 40XX (Opt-III)',
      'Optional Course - III (4th Year 2nd Semester)',
      3.0,
      'Select 3rd Elective Course (3.0 Credits) from MEC 4035–4069: MEC 4035 Advanced Thermodynamics; MEC 4037 Automobile Engineering; MEC 4039 Aerodynamics; MEC 4041 Fluid Power Transmission and Control; MEC 4043 Finite Element Method; MEC 4045 Industrial Automation; MEC 4047 Operations Research; MEC 4049 Material Handling & Maintenance Engineering; MEC 4051 Engineering Tribology'
    ),
    course(
      'MEC 40XX (Opt-IV)',
      'Optional Course - IV (4th Year 2nd Semester)',
      3.0,
      'Select 4th Elective Course (3.0 Credits) from MEC 4035–4069: MEC 4053 Modern Manufacturing Processes; MEC 4055 Artificial Intelligence; MEC 4057 Robotics & Mechatronics; MEC 4059 Mechanical Vibration; MEC 4061 Nanomaterial & Nanotechnology; MEC 4063 Industrial Safety; MEC 4065 Project Management and Leadership; MEC 4067 Nuclear Power Plant Engineering; MEC 4069 Power Plant Economics'
    ),
    course(
      'MEC 4000 (Part-II)',
      'Project & Thesis - II',
      4.0,
      'Experimental Investigation, Prototype Testing or Computational Simulation/Modeling; Data Analysis, Validation, Engineering Interpretation & Cost/Performance Optimization; Final Thesis Dissertation Submission & Oral Defense Presentation'
    ),
  ],
];

export const DEPARTMENT_SYLLABUS = { CSE, EEE, CE, ME };

export const getSemesterCourses = (department, semester) => DEPARTMENT_SYLLABUS[department]?.[semester - 1] ?? [];

export const semesterLabel = (semester) => {
  const year = Math.ceil(semester / 2);
  return `Semester ${semester} (Year ${year}, ${semester % 2 === 1 ? '1st' : '2nd'} semester)`;
};


// ============================================================================
// DETAILED ELECTIVE / OPTION COURSES (7th & 8th Semesters — CSE)
// Use CSE_OPTION_COURSES and getOptionCourses('Option-I') to populate dropdowns
// ============================================================================
export const CSE_OPTION_COURSES = {
  'Option-I': [
    course(
      'CSE-4121',
      'Robotics Science and Systems',
      3.0,
      'Introduction, Microcontroller Boards, Communication & Collaboration; Motor Control, Cameras, Images & Low-Level Robot Vision; Robot Control Architectures & Sensing; Motion Planning: Configuration Space, Grasping & Object Transport; Localization, Manipulation Mechanisms, Grasp Analysis & Inverse Kinematics; Mapping & Simultaneous Localization and Mapping (SLAM)'
    ),
    course(
      'CSE-4123',
      'Computational Methods in Bio-molecular Sequence & Structure Analysis',
      3.0,
      'Protein & Nucleotide Scoring Matrices: PAM, BLOSUM & Gonnet Construction; Database Homology Search: BLAST (BLASTP, BLASTN), E-Value & FASTA vs BLAST; Phylogenetic Analysis: Distance/Parsimony Methods, Clustering & Rooted/Unrooted Trees; Predictive Methods Using DNA Sequences: Signal/Content/Homology Gene Prediction; Markov Models & HMMs in Gene/Promoter Prediction (Genscan, Glimmer, Grail); Protein Secondary & Tertiary Structure Prediction: Chou-Fasman, GOR, Homology Modeling, Threading & Ab Initio'
    ),
    course(
      'CSE-4125',
      'Introduction to Machine Learning',
      3.0,
      'Supervised & Unsupervised Learning: Parametric/Non-Parametric Models, Curse of Dimensionality, Overfitting & Model Selection; Linear Models for Regression: Maximum Likelihood, Regularized Least Squares, Bias-Variance & Bayesian Linear Regression; Linear Models for Classification: Fisher Linear Discriminant, Generative & Non-Parametric Density Estimation; Probabilistic Discriminative Models: Logistic Regression & Log-Linear Models; Kernel Methods & Sparse Kernel Machines (SVM); Clustering, Mixture Models, Expectation Maximization (EM) & Markov Models for Sequential Data'
    ),
    course(
      'CSE-4127',
      'Information Retrieval',
      3.0,
      'Boolean Retrieval & Inverted Index: Processing Boolean Queries & Extended Boolean Retrieval; Term Vocabulary & Postings Lists: Tokenization, Stop Words, Normalization, Stemming, Lemmatization, Skip Pointers & Biword/Positional Indexes; Dictionaries & Tolerant Retrieval: Wildcard Queries, k-gram Indexes & Spelling Correction; Index Construction: Blocked Sort-Based, Single-Pass In-Memory, Distributed & Dynamic Indexing; Scoring, Term Weighting & Vector Space Model (TF-IDF Variants); IR Evaluation, Relevance Feedback (Rocchio Algorithm), Query Expansion, Language Models & Apache Lucene'
    ),
    course(
      'CSE-4131',
      'Introduction to VLSI Design',
      3.0,
      'VLSI Metrics & MOS Technology: PMOS, NMOS, CMOS Transistors & Fabrication Process; Design Approaches: Stick Diagrams, Layout Design Rules, Contact Cuts & Double-Metal MOS Process; Delay Analysis: Inverter Delay & Sequential/Combinational Circuit Timing; Design Automation, Switch Logic & Gate Logic: Pass Transistors, Transmission Gates, Parity Generators, Multiplexers, Registers & 1T/3T DRAM Cells; High-Level Synthesis & Logic Synthesis: Scheduling, Allocation, Data Path Synthesis, Multilevel Minimization & PLA Reduction; VLSI Testing (Stuck-at Faults) & Introduction to FPGAs'
    ),
    course(
      'CSE-4133',
      'Algorithm Engineering',
      3.0,
      'Review of NP-Completeness: P, NP, NPC, Polynomial Verification & Reductions; Randomized Algorithms: Randomized Quick Sort, Min-Cut, Las Vegas & Monte Carlo Algorithms; Approximation Algorithms: Lower Bounds, Constant-Factor Approximation, FPTAS, Inapproximability & LP/Randomized Approximations; Amortized Analysis: Aggregate, Accounting & Potential Methods (Dynamic Tables, Binary Counter); Online, Bioinformatics & Quantum Algorithms: Competitive Analysis, Paging, Genome Sorting, Qubits & Quantum Circuits; Practical Heuristics, Dynamic Multithreading & Fixed-Parameter Tractability (Vertex Cover Buss Algorithm)'
    ),
    course(
      'CSE-4135',
      'Software Requirements Specification and Analysis',
      3.0,
      'Review of Software Process Models, Assessment, Improvement & Agile Development; Requirements Engineering Groundwork: Elicitation, Negotiation & Validation; Scenario-Based & UML Requirements Modeling; Data Modeling & Class-Based Modeling Strategies; Flow-Oriented & Behavioral Modeling; Requirements Modeling for Web Applications'
    ),
    course(
      'CSE-4137',
      'Cryptography and Security',
      3.0,
      'Security Concepts, Threats, Policies, Risk Analysis, CSIRT & Auditing; Symmetric Cryptography: Historical Ciphers, AES, Stream Ciphers (RC4), Block Cipher Modes & Differential Cryptanalysis; Public-Key Cryptography & Hashing: Diffie-Hellman, RSA, ECC, SHA, Kerberos, PKI, X.509 & Digital Signatures; Authentication & Access Control: Password/Token/Biometric Auth, DAC, RBAC, Access Matrix & Unix/Windows Capabilities; Internet, Database & OS Security: SSL/TLS, HTTPS, IPsec, Wireless/Cloud Security, DoS/DDoS Defense & Bell-LaPadula Model; Software Security, Malware Defense, Physical Forensics & Cybercrime Ethics'
    ),
    course(
      'CSE-4139',
      'Computer Graphics',
      3.0,
      'Graphics Hardware, Frame Buffer, Lookup Tables, Vector vs Raster Displays & Coordinate Systems; Scan Conversion & Polygon Filling: Mid-Point Line/Circle/Ellipse Algorithms, Polygon Triangulation & Filling; Windowing, Clipping & 2D/3D Homogeneous Transformations (Translation, Rotation, Scaling); Parallel & Perspective Projections and Hidden Surface Removal (Painter Algorithm, Z-Buffer, Ray Casting); Illumination, Shading & Color Models: Ambient/Diffuse/Specular Lighting, Gouraud/Phong Shading, Recursive Ray Tracing, RGB, CMY, YIQ, HSV & HLS; Image Formats (PPM, BMP), Parametric Curves/Surfaces (Hermite, Bezier, B-Splines) & Computer Animation'
    ),
  ],
  'Option-I Lab': [
    course('CSE-4151', 'Robotics Science and Systems Lab', 1.5, 'Microcontroller & Sensor Interfacing; Motor Control & Robot Kinematics Implementation; Computer Vision, Localization & SLAM Lab Project'),
    course('CSE-4153', 'Computational Methods in Bio-molecular Sequence & Structure Analysis Lab', 1.5, 'Scoring Matrix & BLAST Sequence Alignment Scripting; Phylogenetic Tree Construction & Gene Prediction Tools; Protein Structure Modeling & Lab Viva'),
    course('CSE-4155', 'Introduction to Machine Learning Lab', 1.5, 'Linear/Logistic Regression & Bayesian Classifier Implementation; SVM, Kernel Methods, Clustering (K-Means/GMM) & EM Algorithm; Sequential Models & End-to-End ML Term Project'),
    course('CSE-4157', 'Information Retrieval Lab', 1.5, 'Inverted Index Construction, Tokenization, Stemming & Boolean Query Processing; TF-IDF Vector Space Ranking & Spelling Correction Implementation; Search Engine Project using Apache Lucene'),
    course('CSE-4161', 'Introduction to VLSI Design Lab', 1.5, 'CMOS Inverter, NAND/NOR & Transmission Gate Schematic/Layout Design; Combinational & Sequential VLSI Circuit Simulation and Delay Analysis; FPGA Synthesis & Testing Experiments'),
    course('CSE-4163', 'Algorithm Engineering Lab', 1.5, 'Randomized & Approximation Algorithms Implementation; Amortized & Online Algorithm Empirical Benchmarking; Branch-and-Bound, Multithreaded & FPT Algorithm Coding'),
    course('CSE-4165', 'Software Requirements Specification and Analysis Lab', 1.5, 'Stakeholder Elicitation, Use-Case & Scenario Modeling; UML Class, Flow & Behavioral Diagrams; Complete IEEE Standard SRS Document & Prototype Validation'),
    course('CSE-4167', 'Cryptography and Security Lab', 1.5, 'Implementation of AES, RSA, Diffie-Hellman & SHA Cryptographic Primitives; PKI Certificates, SSL/TLS Configuration & Access Control Auditing; Network Security & Malware Analysis Experiments'),
    course('CSE-4169', 'Computer Graphics Lab', 1.5, 'OpenGL/WebGL Setup & Mid-Point Line/Circle/Polygon Scan Conversion; 2D/3D Transformations, Camera Projections & Z-Buffer Rendering; Lighting, Gouraud/Phong Shading, Bezier Curves & 3D Animation Project'),
  ],
  'Option-II': [
    course(
      'CSE-4122',
      'Mathematics for Robotics',
      3.0,
      'Linear Equations, Polynomial Interpolation & Nonlinear Root Finding; Resultants & Orthogonal Function Approximation (Fourier Series); Integration of ODEs, Optimization & Calculus of Variations in Mechanics; Probability, Stochastic Processes & Markov Chains; Computational Geometry & Differential Geometry for Robotics'
    ),
    course(
      'CSE-4124',
      'Introduction to Bioinformatics',
      3.0,
      'Amino Acids & Proteins: Properties, Primary/Secondary/Tertiary/Quaternary Structures; Enzymes & Carbohydrates: Enzyme Kinetics (Michaelis-Menten), Monosaccharides, Polysaccharides & Glycoconjugates; Biological Sequence Databases & Formats: GenBank, Uniprot, SwissProt, FASTA, ASN, NCBI Entrez & PubMed; Pairwise Sequence Alignment: Global (Needleman-Wunsch) & Local (Smith-Waterman) Alignment, Scoring Matrices & Affine Gap Penalties; Multiple Sequence Alignment: Sum-of-Pairs, Star/Tree Alignments, Motifs, Profiles, ClustalW, ClustalX & T-Coffee'
    ),
    course(
      'CSE-4126',
      'Introduction to Data Science',
      3.0,
      'Data Collection, Extraction & Preprocessing: Handling Missing Values & Noisy Data; Data Storage & Integration: SQL/NoSQL Databases, Redundancy/Correlation Analysis & Conflict Resolution; Data Reduction: Wavelet Transforms, Principal Component Analysis (PCA), Subset Selection, Regression, Histograms, Clustering & Data Cube Aggregation; Data Transformation & Discretization: Normalization, Binning & Concept Hierarchy Generation; Data Visualization, Exploratory Data Analysis (EDA) & Introduction to Data Modeling'
    ),
    course(
      'CSE-4128',
      'Wireless Networks',
      3.0,
      'Wireless Network Architectures: Cellular, WLAN, Sensor, Mesh, MANET & Intermittently Connected Networks; Physical Layer & Fading Channels: Radio Propagation Modeling, Digital Modulation, CDMA, OFDM, Diversity & MIMO; MAC & Resource Allocation: Power Control, ALOHA, CSMA & TDMA/FDMA/CDMA Scheduling; Network Layer Wireless Routing: Link Metric Estimation, AODV, DSR, Opportunistic, Backpressure & Network Coding; Wireless Transport Layer: TCP over Wireless, Congestion Sharing, Rate Control & Utility Optimization'
    ),
    course(
      'CSE-4130',
      'Introduction to Quantum Logic',
      3.0,
      'Nanotechnology & Quantum Building Blocks: Unitary, Hermitian & Pauli Matrices; Single-Qubit & Multiple-Qubit Systems: Quantum State Spaces, Superposition, Measurement & Quantum Key Distribution (QKD); Quantum Gates: Hadamard, Pauli-X/Y/Z, Phase Shift, Swap, Controlled & Universal Quantum Gates; Quantum Logic Synthesis & Circuits: Quantum Adder, Subtractor, Multiplier, Divider, Encoder/Decoder, Mux/Demux & Comparator; Introduction to Quantum Algorithms: Deutsch Problem & Simon Problem'
    ),
    course(
      'CSE-4132',
      'Graph Theory',
      3.0,
      'Fundamental Graph Varieties: Components, Degrees, Distances, Eccentricity, Paths, Cycles & Cliques; Trees & Spanning Trees: Tree Enumeration, Forests, Centroids, Cut-Sets & Co-Cycles; Connectivity & Traversability: Vertex/Edge Connectivity, Blocks, Menger Theorem, Eulerian Graphs, Kuratowski Theorem & Surface Embeddings (Genus, Thickness, Crossing Number); Graph Coloring & Homomorphisms: Vertex/Edge Coloring, Chromatic Number, Five-Color Theorem & Four-Color Conjecture; Digraphs, Tournaments, Network Flows, Graph Polynomials, Matching, Factorization, Perfect Graphs & Ramsey Theory'
    ),
    course(
      'CSE-4134',
      'Software Project Management',
      3.0,
      'IT Project Management Foundations: System View, Organization, Stakeholder Management & Project Lifecycle; Project Integration & Scope Management: Strategic Selection, Project Charter, Change Control & Scope Definition; Project Time & Cost Management: Activity Sequencing, Schedule Development/Control, Cost Estimation & Budgeting; Project Quality, HR & Communication Management: QA/QC Tools, Team Development & Communication Planning; Project Risk, Procurement & Stakeholder Engagement Management'
    ),
    course(
      'CSE-4136',
      'Computer Security',
      3.0,
      'Web Security: Three-Tier Architecture, SQL Injection, Prepared Statements, Same-Origin Policy, XSS & CSRF Defenses; Network Security: Internet Flaws, DDoS/Reflection/Amplification Attacks, WEP Cracking, DNS Hijacking & Routing Attacks; Buffer Overflow & Control Flow Attacks: x86/C Stack Frames, GDB, Shellcode, Integer Overflow, Stack Canaries, NX, ASLR, Return-to-libc & Return-Oriented Programming (ROP); Malware Analysis: Virus/Worm Propagation, Rootkits, Botnets & Code Injection; Reversing Malware: IDA-Pro, OllyDbg, REMnux, x86 Disassembly, Windows API DLL Injection/Hooking & Manual Unpacking'
    ),
    course(
      'CSE-4140',
      'Compiler Design',
      3.0,
      'Compiler Phases & Lexical Analysis: Front/Back End, Regular Expressions, DFA Pattern Matching & Input Buffering; Syntax Analysis & Parsing: Context-Free Grammars, LL Top-Down, Recursive Descent, LR Bottom-Up Parsing & Error Recovery; Semantic Analysis & Runtime Environments: Symbol Tables, Type Checking, Activation Records & Static/Dynamic Scoping; Intermediate Code Generation: ASTs, Three-Address Code & Syntax-Directed Translation for Declarations/Control Flow/Arrays; Code Optimization & Target Generation: Control Flow Graphs, Dataflow Analysis (Reaching Definitions, Live Variables), SSA Form, Graph-Coloring Register Allocation & Instruction Scheduling'
    ),
  ],
  'Option-III': [
    course(
      'CSE-4221',
      'Robot Learning',
      3.0,
      'Supervised Learning, Linear Regression & Gradient Descent in Robotics; Markov Processes, Discrete HMMs & Kalman Filtering; Reinforcement Learning: MDPs, Bellman Equation, Value/Policy Iteration & Continuous State Spaces; Maximum Likelihood, Kernels, Support Vector Machines (SVM), Clustering, PCA & Particle Filters; Learning by Observation/Demonstration, Model Learning, Deep Learning & Meta-Learning'
    ),
    course(
      'CSE-4223',
      'Fundamentals of Genomics and Proteomics',
      3.0,
      'Human Genome Project & Organization: Coding/Non-Coding Regions, Repeats & Genome Annotation; DNA & Genome Sequencing Methods: Maxam-Gilbert, Sanger, Pyrosequencing, Shotgun & Clone Contig Assembly; Polymorphisms & Molecular Markers: SNPs, SSCP, PCR, dHPLC, RFLP, VNTR, RAPD, SSR & AFLP; Genome Databases & Browsers: ENSEMBL, VISTA, UCSC Genome Browser & NCBI; Introduction to Proteomics: 2D-PAGE Sample Prep/Resolution & Mass Spectrometry De Novo Protein Sequencing'
    ),
    course(
      'CSE-4225',
      'Introduction to Data Mining and Warehousing',
      3.0,
      'Data Warehousing & OLAP: Multi-Tiered Architecture, Enterprise/Data Mart/Virtual Warehouses, Data Cubes, Star/Snowflake/Fact Constellation Schemas & Roll-up/Slice/Dice Operations; Mining Frequent Patterns: Market Basket Analysis, Apriori Algorithm, FP-Growth, Vertical Data Format & Closed/Maximal Itemsets; Mining Association Rules & Correlations: Rule Generation, Lift, Chi-Square, All-Conf, Max-Conf, Cosine & Kulc Measures; Mining Sequential Patterns: GSP, SPADE, PrefixSpan & Biological/Web/Time-Series Pattern Mining'
    ),
    course(
      'CSE-4227',
      'Cloud Computing',
      3.0,
      'Cloud Computing Foundations & Service Models: IaaS, PaaS, SaaS, XaaS & Public/Private/Hybrid/Federated Clouds; Cloud Architectures, OS Platforms, Cloud Brokers & SLA Tradeoffs; VM Resource & Capacity Provisioning: Static/Dynamic Provisioning & HARMONY Architecture; Scalability, Fault Tolerance, QoS & Data Center Power Management; Virtualization Platforms (VMWare ESX Memory Management), Cloud Security/Privacy & Mobile Cloud Computing (Code Offloading, VM Migration)'
    ),
    course(
      'CSE-4229',
      'Introduction to Reversible Computing',
      3.0,
      'Theory of Reversibility, Energy/Information Loss, Garbage Outputs, Delay & Quantum Cost; Reversible Logic Gates: Feynman, Double Feynman, Fredkin & Toffoli Gates; Reversible Combinational Circuits: Half/Full/Carry-Lookahead/Carry-Skip/BCD Adders, Subtractors, Multipliers, Dividers, Decoders & Multiplexers; Reversible Sequential Circuits: Reversible SR/JK/T/D Flip-Flops, Registers, Counters & Reversible RAM/ROM; Reversible Complex Circuits (PLA, PLD, CPLD, FPGA) & Transformation/BDD-Based Synthesis'
    ),
    course(
      'CSE-4231',
      'Computational Geometry',
      3.0,
      'Polygon Triangulation & Partitioning: Art Gallery Theorems, Ear Removal, Monotone Partitioning & Trapezoidalization; Convex Hulls in 2D & 3D: Graham Scan, Jarvis March (Gift Wrapping), Chan Algorithm & 3D Euler Formula; Voronoi Diagrams & Delaunay Triangulations: Properties, Incremental Construction, Nearest Neighbor, MST, Largest Empty Circle & Medial Axis; Line Arrangements & Point-Line Duality: Zone Theorem, Incremental Arrangement, Ham-Sandwich Cut & Red-Blue Matching; Line Segment Intersection, Polygon Overlap, Graph Drawing & 1D/2D Orthogonal Range Searching'
    ),
    course(
      'CSE-4233',
      'Software Testing and Verification',
      3.0,
      'Psychology/Economics of Testing, Software Testing Life Cycle (STLC) & V&V Model; Dynamic Black-Box Testing: Boundary Value Analysis, Equivalence Partitioning, State Transition, Decision Table, Cause-Effect Graphing & Error Guessing; Dynamic White-Box Testing & Reviews: Basis Path, Data Flow, Mutation Testing, Inspections & Walkthroughs; Testing Levels: Unit, Integration, Function, System, Acceptance & Regression Testing; Test Management, Software Quality Metrics, Web Security/Performance Testing, Debugging, TDD & BDD'
    ),
    course(
      'CSE-4235',
      'Digital Forensic',
      3.0,
      'Digital Forensics Fundamentals: Evidence Integrity, Cryptographic Hashes, Chain of Custody & Reporting; Cyber Law & Legal System in Bangladesh: e-Discovery, Warrants & Admissible Digital Evidence; Computer & Windows Forensics: Disk Imaging, Write Blockers, SSD/NTFS Analysis, File Carving, Windows Registry, Event Logs & USB/Browser/Email Artifacts; Forensics Psychology & Hacker Profiling (Kevin Mitnick, Edward Snowden, Gary McKinnon Case Studies); Network, Intrusion & Fraud Forensics: Packet/Flow Analysis (tcpdump, SiLK, Argus), NIDS/Snort Rules & Benford Law; Mobile Forensics: NAND Flash, YAFFS2, Android & iOS Evidence Acquisition'
    ),
    course(
      'CSE-4237',
      'Digital Image Processing',
      3.0,
      'Image Representation, Color Spaces, Sampling, Quantization & Quality Metrics; Spatial-Domain Enhancement: Intensity Transformations, Contrast Stretching, Histogram Equalization, Mean/Median Smoothing & Laplacian/Sobel Sharpening; Frequency-Domain Filtering & Transforms: 2D DFT, Gaussian/Butterworth Low/High-Pass Filters, DCT & Discrete Wavelet Transform (DWT); Image Restoration: Noise Models, Spatial/Frequency Restoration & Wiener Filtering; Morphological Processing, Edge/Region Segmentation & Image/Video Compression'
    ),
    course(
      'CSE-4239',
      'Parallel and Distributed Systems',
      3.0,
      'Distributed & HPC System Models: Grid, Cloud, Many-Core, MapReduce, Virtualization & Distributed Storage/Hash Tables (DHT); Consistency, Replication & Fault Tolerance: Data/Client-Centric Consistency & Byzantine Fault Tolerance; Parallel Architectures & Programming Models: Data/Task Parallelism, Shared/Distributed Memory, OpenMP, MPI, Pthreads & Hadoop; GPU Architecture & CUDA Multithreaded Programming; Interconnection Topologies, Load Balancing, Memory Consistency & Performance Tuning'
    ),
  ],
  'Option-III Lab': [
    course('CSE-4251', 'Robot Learning Lab', 1.5, 'Kalman/Particle Filtering & HMM State Estimation; Reinforcement Learning (MDP/Q-Learning) for Robot Navigation; Imitation & Deep Robot Learning Project'),
    course('CSE-4253', 'Fundamentals of Genomics and Proteomics Lab', 1.5, 'Genome Sequence Assembly & Annotation Pipelines; SNP/Molecular Marker Analysis using ENSEMBL/UCSC/NCBI; Proteomics Mass Spectrometry Data Analysis'),
    course('CSE-4255', 'Introduction to Data Mining and Warehousing Lab', 1.5, 'OLAP Cube Design & Star/Snowflake Schema Queries; Apriori, FP-Growth & Association Rule Mining Implementation; Sequential Pattern Mining (PrefixSpan) Term Project'),
    course('CSE-4257', 'Cloud Computing Lab', 1.5, 'Virtual Machine Provisioning, Docker Containers & Hypervisor Setup; AWS/OpenStack IaaS/PaaS Deployment & Auto-Scaling; Mobile Cloud Offloading & Cloud Security Experiments'),
    course('CSE-4259', 'Introduction to Reversible Computing Lab', 1.5, 'Simulation of Feynman, Toffoli & Fredkin Reversible Gates; Design of Reversible Adders, Multipliers, Counters & Memory Circuits;BDD-Based Reversible Logic Synthesis Project'),
    course('CSE-4261', 'Computational Geometry Lab', 1.5, 'Implementation of Polygon Triangulation & 2D/3D Convex Hull Algorithms; Voronoi Diagram, Delaunay Triangulation & Line Segment Intersection; Orthogonal Range Searching Project'),
    course('CSE-4263', 'Software Testing and Verification Lab', 1.5, 'Black-Box & White-Box Test Case Design, JUnit/PyTest & Mutation Testing; Automated Web UI, API, Performance & Security Testing; TDD/BDD Workflow Project'),
    course('CSE-4265', 'Digital Forensic Lab', 1.5, 'Forensic Disk Imaging, NTFS File Carving & Windows Registry/Event Log Analysis; Wireshark/tcpdump Network Packet Forensics & Snort IDS Rules; Mobile Device Artifact Extraction & Forensic Report'),
    course('CSE-4267', 'Digital Image Processing Lab', 1.5, 'Spatial/Frequency Image Enhancement, Histogram Equalization & Sobel/Laplacian Filtering; FFT, DCT, Wavelet Transforms & Wiener Restoration in Python/MATLAB; Morphological Operations & Image Segmentation Project'),
    course('CSE-4269', 'Parallel and Distributed Systems Lab', 1.5, 'Multi-threaded Shared Memory Programming with OpenMP & Pthreads; Distributed Message Passing with MPI & MapReduce/Hadoop Jobs; GPU Parallel Programming with CUDA'),
  ],
  'Option-IV': [
    course(
      'CSE-4222',
      'Human Robot Interaction',
      3.0,
      'Sensors, Perception, Expression & Gaze in Human-Robot Interaction; Multi-Modal Human-Robot Communication & HRI Architectures; Museum, Educational, Assistive & Social Robotics; Shared Autonomy & Situation Awareness; Urban Search and Rescue & Quality-of-Life HRI Case Studies'
    ),
    course(
      'CSE-4224',
      'Mobile Robotics',
      3.0,
      'Legged & Wheeled Locomotion and Differential Kinematics; Robot Perception: Omni-Directional & Stereo Cameras, Edge/Point Extraction & Place Recognition; Error Propagation in Mobile Robots; Path Planning: Collision Avoidance, Potential Field Methods & Graph Search; Mobile Robot Localization & Mapping'
    ),
    course(
      'CSE-4226',
      'Aerial Robotics',
      3.0,
      'Rotorcraft Dynamic Modeling, Stability & Flight Control; Autonomous Flight, Data Collection & Obstacle Avoidance; Aerial Path Planning, Formation Flying & Mission Navigation; Human Factors in Aerial Systems; Avionics, Electronics & Control Software Design for Small Civilian UAVs'
    ),
    course(
      'CSE-4228',
      'Application of Computational Biology',
      3.0,
      'Genome Annotation: Bacterial & Eukaryotic Genome Projects, Experimental/In-Silico Gene Identification (ORF Finders, GeneMark, Glimmer, Genscan, Grail); DNA Gene Prediction: Signal/Content/Homology Methods, Neural Networks, Markov Chains & HMMs; Promoter Analysis & Repeat Finders; RNA Secondary Structure Prediction: Thermodynamics & Folding Packages (Mfold, RNAfold, Sfold, ViennaRNA)'
    ),
    course(
      'CSE-4230',
      'Human Computer Interaction',
      3.0,
      'Cognitive Models, Socio-Organizational Issues & User Needfinding (Observation, Interviewing, Prototyping); Qualitative UX Research: Survey Design, Decision Analytics, Mental Models & Heuristic Evaluation; Quantitative UX Research & Data Science: Statistical Thinking, Uncertainty & ML in HCI; New Media, Mobile Systems, Social Network Usability & Visual/Information Design; Designing for Children, Accessibility, Pro-Poor Interfaces, Crowd Computing, AR & Wearables'
    ),
    course(
      'CSE-4232',
      'Internet of Things',
      3.0,
      'IoT Paradigm, Smart Objects & Industrial Applications (Sports, Smart Cities, Home, Retail, Healthcare); IoT Hardware Platforms: SoC, Sensors, Device Drivers, Cloud Integration, Bluetooth & BLE Beacons; IoT Communication Protocols: NFC, RFID, Zigbee, MIPI, SPI, GSM, CDMA & LTE; Big Data Analytics, Visualization, Dependability, Security, Privacy & Maintainability in IoT; Creative Problem-Solving & System Design for IoT Services'
    ),
    course(
      'CSE-4234',
      'Introduction to Multiple-Valued Logic',
      3.0,
      'Multiple-Valued Logic (MVL) Functions, Algebras, Shannon Expansion & Reed-Muller Expansion; MVL Combinational Circuits: Adders (Half, Full, BCD, Carry-Lookahead), Subtractors, Multipliers, Dividers, Decoders & Multiplexers; MVL Sequential Circuits & Memory: Flip-Flops (SR, JK, T, D), Registers, Counters, MVL RAM/ROM, PLA, PAL, PLD & CPLD; MVL Finite State Diagrams & Functional Expressions; MVL Decision Diagrams, Reduction Rules & Reversible/Quantum MVL Circuits'
    ),
    course(
      'CSE-4236',
      'VLSI Layout Algorithms',
      3.0,
      'VLSI Physical Design Cycle, Design Styles & Graph/Geometry Algorithms for Layout; Partitioning Algorithms: Group Migration (Kernighan-Lin, Fiduccia-Mattheyses) & Simulated Annealing; Floorplanning & Placement: Constraint-Based, Rectangular Dualization, ILP Floorplanning & Simulation/Partitioning Placement; Pin Assignment, Maze/Line-Probe/Steiner-Tree/River Routing; Constraint-Graph, Virtual-Grid & Hierarchical Compaction and Multi-Chip Module (MCM) Automation'
    ),
    course(
      'CSE-4238',
      'Concepts of Concurrent Computation',
      3.0,
      'Concurrent Computation Challenges, Synchronization Algorithms & Semaphores; Simple Concurrent Object-Oriented Programming (SCOOP) Principles & Type Systems; Monitors & Calculus of Communicating Systems (CCS); Communicating Sequential Processes (CSP); Lock-Free Programming Approaches & Modern Concurrency Languages'
    ),
    course(
      'CSE-4240',
      'Applied Cryptography',
      3.0,
      'Mathematical Background: Information Theory, Entropy, Modular Arithmetic, Rings, Finite Fields, Euclidean Algorithm & Integer/Elliptic-Curve Factoring; Symmetric Ciphers & Hashing: One-Time Pad, Perfect Secrecy, Block Cipher Modes, Cryptographic Hash Chains & Dictionary Attack Defenses; Key Distribution & Primality: Discrete Logarithm, Diffie-Hellman, Fermat/Miller-Rabin Primality Tests & Kerberos; Asymmetric Cryptosystems: RSA Correctness/Security, Padding Standards & Digital Signatures; Elliptic Curve Cryptography (ECDH, ECDSA), SSH/TLS Protocols, Onion Routing (Tor), Electronic Voting, Digital Cash, Blind Signatures & Bitcoin'
    ),
    course(
      'CSE-4242',
      'Computer Vision',
      3.0,
      'Image Formation, 3D-to-2D Projection, Illumination/Shading Models & Digital Camera Sensing Pipeline; Image Filtering, Template Matching & Image Pyramids; Feature Detection & Matching: Edge/Corner Detectors, SIFT, Hough Transform, Model Fitting & RANSAC; Motion & Feature Tracking: KLT Tracker & Optical Flow; Image Segmentation (Split/Merge, Mean-Shift, Graph Cuts) & Object Recognition (Eigenfaces, Bag-of-Words, Part-Based Models)'
    ),
    course(
      'CSE-4244',
      'Computer and Network Security',
      3.0,
      'Control Hijacking Exploits & Defenses: Buffer/Integer Overflows & Bypassing Browser Memory Protections; Sandboxing, Isolation, Static Program Analysis, Automated High-Coverage Testing & Fuzzing; Least Privilege, OS Access Control & Web Security (XSS, SQLi, CSRF, CSP, Secure Sessions); Cryptographic Protocols & HTTPS Pitfalls; Network Security (TCP, DNS, BGP Routing, IPsec, Firewalls, VPNs, IDS, DoS) & Mobile Platform Security'
    ),
    course(
      'CSE-4246',
      'Natural Language Processing',
      3.0,
      'NLP Foundations, Language Ambiguity & Probabilistic N-Gram Language Models with Smoothing; Part-of-Speech (POS) Tagging, Penn Treebank, Brown Corpus, Weighted FSA & Hidden Markov Models (HMMs); Syntax & Context-Free Grammars: Constituency, Chomsky Normal Form & Top-Down/Bottom-Up Parsing; Probabilistic CFGs (PCFG), Weighted CYK Algorithm, Beam Search & Treebanks; Statistical Machine Translation: Alignment Models (IBM Models 1 & 2), Expectation Maximization & MT Evaluation'
    ),
  ],
};

export const getOptionCourses = (optionGroup) => CSE_OPTION_COURSES[optionGroup] ?? [];

// ============================================================================
// DETAILED ELECTIVE / SPECIALIZATION GROUP COURSES (8th Semester — CE)
// Use CE_OPTION_COURSES and getCeOptionCourses('Structural Group') for dropdowns
// ============================================================================
export const CE_OPTION_COURSES = {
  'Structural Group': [
    course(
      'CE 803',
      'Theory of Elasticity and Elastic Instability of Structures',
      2.0,
      'Introduction to Theory of Elasticity, Stress/Strain Tensors, Equilibrium & Compatibility Equations; Plane Stress and Plane Strain Conditions in 2D Rectangular and Polar Coordinates (Airy Stress Function); Torsion of Circular and Non-Circular Prismatic Shafts (St. Venant & Membrane Analogy); Elastic Instability of Columns, Beams & Frames and Stability Functions'
    ),
    course(
      'CE 804',
      'Pre-stressed Concrete',
      2.0,
      'Prestressed Concrete Concepts, High-Strength Concrete/Steel Materials & Pre-Tensioning/Post-Tensioning Systems; Immediate and Time-Dependent Losses of Prestress; Elastic and Ultimate Analysis of Prestressed Sections for Flexure, Shear, Bond & Anchorage Zone Bearing; Beam Deflections, Camber, Cable Profile Layout, Partial Prestressing & Complete Section Design'
    ),
    course(
      'CE 805',
      'Design of Steel Structures',
      2.0,
      'Behavior of Structural Steel Members, Frames & AISC/BNBC Code Requirements; Design of Steel Tension Members (Net Section, Block Shear) by WSD and LRFD Methods; Design of Steel Compression Columns, Local/Flexural-Torsional Buckling & Built-Up Members; Design of Laterally Supported/Unsupported Beams, Plate Girders, Beam-Columns & Bolted/Welded Moment/Shear Connections'
    ),
    course(
      'CE 806',
      'Introduction to Finite Element Method',
      2.0,
      'Introduction to Finite Element Method (FEM) Steps, Direct Stiffness, Minimum Potential Energy & Galerkin Formulations; 1D Stress-Deformation (Bar, Truss, Beam Elements) and 1D Time-Dependent Seepage/Flow Problems; Shape Functions, Isoparametric Formulation & Numerical Gauss Quadrature; 2D Plane Stress and Plane Strain Analysis using Constant Strain Triangle (CST), Linear Strain Triangle (LST) & Bilinear Quadrilateral Elements'
    ),
    course(
      'CE 807',
      'Dynamics of Structures',
      2.0,
      'Formulation of Equations of Motion (d Alembert Principle, Virtual Work); Undamped and Damped Free Vibration Response of Single-Degree-of-Freedom (SDOF) Systems; SDOF Response to Harmonic, Periodic & Impulse Dynamic Loadings (Duhamel Integral); Multi-Degree-of-Freedom (MDOF) Systems: Modal Frequencies, Mode Shapes, Orthogonality, Rayleigh Method & Earthquake Response Spectrum Analysis'
    ),
    course(
      'CE 808',
      'Structural Analysis and Design Sessional-III',
      1.5,
      'Computer-Aided Modeling, Analysis & Design using Structural Engineering Software (ETABS/STAAD/SAP2000); Complete Structural Design & Detailing of a Multi-Storied Reinforced Concrete Building; Analysis and Design of an Elevated Overhead Water Tower & Folded Plate Roof Structure'
    ),
  ],
  'Environmental Group': [
    course(
      'CE 809',
      'Solid Hazardous Waste Management',
      2.0,
      'Sources, Types, Generation Rates & Physical/Chemical/Biological Properties of Municipal Solid Waste; On-Site Handling, Storage, Processing, Collection Routing & Transfer Stations; Ultimate Disposal Methods: Sanitary Landfill Design, Leachate/Gas Control, Composting, Incineration & Energy Recovery; Soil Pollution, Industrial Solid Waste Disposal & Hazardous Waste Treatment/Management'
    ),
    course(
      'CE 810',
      'Environmental Pollution Management',
      2.0,
      'Surface Water Pollution: Pollutant Sources, Stream Waste Assimilation Capacity, Streeter-Phelps Dissolved Oxygen Sag Modeling & Stream Ecology; Industrial, Heavy Metal, Detergent (Eutrophication), Groundwater & Marine Pollution and Water Quality Management; Air Pollution Sources, Health/Material/Plant Effects, Atmospheric Dispersion Meteorology, Global Warming & Greenhouse Effect; Air Quality Monitoring & Particulate/Gaseous Emission Control Technologies'
    ),
    course(
      'CE 811',
      'Sustainable Environmental Management',
      2.0,
      'Environment and Sustainable Development Principles, Environmental Policies, Legislation & Quality Standards; Environmental Implications of Sectoral Development Projects (Water, Transport, Industry, Energy); Environmental Impact Assessment (EIA): Baseline Studies, Impact Prediction/Assessment Methodologies & Environmental Management Plans (EMP); Economics of Environmental Management, Valuation of Ecosystem Services & Special Topics'
    ),
    course(
      'CE 812',
      'Design of Water Supply, Sanitation and Sewerage Systems Sessional',
      1.5,
      'Hydraulic Design of Municipal Water Supply Distribution Networks & Sanitary/Storm Sewerage Systems; Process and Unit Design of Water Treatment Plants & Wastewater Treatment Plants; Computer Software Applications in Environmental Engineering, Field Visits to Treatment Plants & Technical Reporting'
    ),
  ],
  'Geotechnical Group': [
    course(
      'CE 813',
      'Earth Retaining Structures',
      2.0,
      'Foundations Subjected to Lateral Loads, Rigid Retaining Walls & Bridge Abutments; Construction Operations, Dewatering Systems & Slurry-Wall (Diaphragm Wall) Construction; Flexible Earth Retaining Structures: Cantilever & Anchored Sheet Pile Walls, Braced Cuts, Cofferdams & Caissons; Machine Foundations: Elementary Soil-Foundation Vibrations, Dynamic Shear Modulus/Elastic Constants & Fundamentals of Soil Liquefaction'
    ),
    course(
      'CE 814',
      'Elementary Soil Dynamics',
      2.0,
      'Dynamic Loads on Soils, Wave Propagation in Elastic/Porous Media & Dynamic Soil Properties (Shear Modulus, Damping); Analysis and Design of Machine Foundations (Block, Frame) for Reciprocating, Impact & Rotary Loads; Seismic Site Response, Cyclic Stress-Strain Behavior of Soils & Evaluation/Mitigation of Earthquake-Induced Soil Liquefaction; Dynamic Earth Pressures on Retaining Structures & Seismic Slope Stability'
    ),
    course(
      'CE 815',
      'Soil-Water Interaction',
      2.0,
      'Critical State Soil Mechanics (Cam-Clay Models), SHANSEP & Lambe Stress Path Methods; Stress-Deformation, Pore Water Pressure Parameters (Skempton A & B) & Progressive Failure of Soil Masses; 1D, 2D & 3D Consolidation Theories, Vertical Drains & Soil-Structure Interaction; Earthquake Liquefaction, Ground Improvement Techniques & Numerical Modeling (FEM/FDM) in Geotechnical Engineering'
    ),
    course(
      'CE 816',
      'Geotechnical Engineering Sessional-II',
      1.5,
      'Computer-Aided Analysis and Design of Shallow/Deep Foundations, Retaining Walls & Mechanically Stabilized (Reinforced) Earth Structures; Numerical Slope Stability Analysis & Seepage Modeling using Geotechnical Software (GeoStudio/PLAXIS); Design of Ground Improvement Schemes (Sand Drains, Stone Columns, Geotextiles)'
    ),
  ],
  'Transportation Group': [
    course(
      'CE 817',
      'Transportation Engineering- III: Traffic Engineering Design and Management',
      2.0,
      'Urban Transportation Planning Process & Traffic Management Concepts (TSM, TDM); Traffic Accident Investigation, Blackspot Analysis & Road Safety Engineering; City Street Networks, Grade Separation, Interchanges, Urban Bypasses & Pedestrian/Bicycle Facilities; Fundamental Traffic Flow Theory (Macroscopic/Microscopic Models, Shockwaves, Queuing) & Environmental Impacts of Highway Traffic'
    ),
    course(
      'CE 818',
      'Transportation Engineering -IV: Pavement Management, Drainage and Airport',
      2.0,
      'Surface/Subsurface Highway Drainage Systems, Culverts & Pavement Evaluation/Strengthening (Condition Surveys, Benkelman Beam/FWD, Overlay Design); Air Transportation Trends, Aircraft Characteristics & Airport Master Planning/Site Selection; Airport Configuration, Runway Orientation (Wind Rose) & Geometric Design of Landing/Taxiway/Apron & Terminal Areas; Heliport Planning, Structural Design of Flexible/Rigid Airport Pavements (FAA Method), Visual Aids (Lighting, Marking, Signing) & Airport Drainage'
    ),
    course(
      'CE 819',
      'Transportation Engineering-V: Urban Transportation Planning and Management',
      2.0,
      'Highway Needs Studies, Four-Step Urban Travel Demand Modeling (Trip Generation, Distribution, Modal Split, Traffic Assignment), Economics & Financing; Economic Evaluation, Monitoring, Organization & Implementation of Transportation Projects; Traffic Engineering Administration, Legislation & Selected Urban Transport Case Studies; Urban Public Mass Transit Systems (BRT, MRT) & Urban Freight Movement Management'
    ),
    course(
      'CE 820',
      'Transportation Engineering Sessional- II: Pavement Design and Traffic Studies',
      1.5,
      'Structural Design of Flexible and Rigid Highway & Airfield Pavements; Geometric Design of At-Grade Road Intersections, Roundabouts & Grade-Separated Interchanges; Field Traffic Surveys, Signal Timing Design, Highway Capacity Calculations & Simulation Studies'
    ),
  ],
};

export const getCeOptionCourses = (groupName) => CE_OPTION_COURSES[groupName] ?? [];

// ============================================================================
// DETAILED ELECTIVE COURSES (7th & 8th Semesters — EEE)
// Use EEE_OPTION_COURSES and getEeeOptionCourses('4th Year 1st Semester')
// ============================================================================
export const EEE_OPTION_COURSES = {
  '4th Year 1st Semester': [
    course(
      'EEE 4111',
      'Renewable Energy',
      3.0,
      'Renewable Energy Sources Overview: Solar, Wind, Mini-Hydro, Geothermal, Biomass, Wave & Tidal Energy; Solar Photovoltaic (PV) Systems: PV Cell Models, Equivalent Circuits, Sun-Tracking, MPPT (Chopper/Inverter), Stand-Alone PV/Battery Sizing, EV/Space Applications & Grid-Connected PV Plants; Solar Thermal Systems: Concentration Principles, Solar Tower, Parabolic Dish, Receivers, Thermal Storage & Steam Turbine Generators; Wind Energy Conversion Systems: Wind Turbine Types, Betz Limit, Pitch/Yaw/Speed Control & Generators (DC, Synchronous, Self-Excited Induction & DFIG); Grid Interconnection (Active/Reactive Power Control) & Biomass/Biogas Electricity Generation'
    ),
    course(
      'EEE 4113',
      'High Voltage Engineering',
      3.0,
      'Breakdown in Gases, Liquids & Solids: Townsend Primary/Secondary Ionization, Paschen Law, Streamer Breakdown, Penning Effect, Corona Discharges & Liquid/Solid Dielectric Breakdown; Generation of High AC & DC Voltages: Cascaded Transformers, Series Resonant AC Test Systems, Voltage Doublers & Cockcroft-Walton DC Cascade Circuits; Generation of Impulse Voltages: Standard Lightning/Switching Impulse Waveshapes, Multistage Marx Impulse Generators & Tripping/Triggering Circuits; High Voltage Measurement Techniques: Sphere Gaps, Electrostatic Voltmeters, Potential Dividers (Resistive/Capacitive) & Peak Voltmeters; High Voltage Testing, Lightning Transients & Insulation Coordination: HV Testing of Insulators/Cables/Transformers/Oil, Direct Lightning Strokes, Traveling Waves, Surge Arresters & BIL Insulation Coordination'
    ),
    course(
      'EEE 4115',
      'Optoelectronics',
      3.0,
      'Optical Properties of Semiconductors & Light: Direct/Indirect Bandgaps, Radiative/Non-Radiative Recombination, Absorption, Luminescence, Quantum Efficiency, Polarization, Interference, Diffraction & Blackbody Radiation; Light Emitting Diodes (LEDs): Visible/IR Materials, Internal/External Quantum Efficiency, Double-Heterostructure (DH), Surface-Emitting & Edge-Emitting LEDs and Fiber Coupling; Stimulated Emission & Semiconductor Lasers: Einstein Relations, Population Inversion, Optical Feedback, Threshold Condition, Heterojunction Lasers, DBR, DFB, Quantum-Well Lasers, VCSELs & Optical Amplifiers; Photodetectors: Photoconductors, PN/PIN Photodiodes, Avalanche Photodiodes (APD), Heterojunction/Schottky Photodiodes, Phototransistors & Detector Noise/Design; Solar Cells & Light Modulation: Silicon/Schottky Solar Cells, Electro-Optic (Pockels/Kerr), Acousto-Optic, Magneto-Optic Modulators & Integrated Optics'
    ),
    course(
      'EEE 4117',
      'Mobile Cellular Communication',
      3.0,
      'Cellular Radio Concepts & Evolution: Analog vs Digital Cellular Systems, Frequency Reuse, Co-Channel Interference, Cell Splitting & Sectoring; Mobile Radio Propagation & Antennas: Large-Scale Path Loss, Multipath Fading, Propagation Models (Okumura-Hata) & Base-Station/Mobile Antennas; Frequency Management & Channel Assignment: Spectrum Utilization, Fixed vs Dynamic Channel Assignment & Erlang Traffic Theory; Handoffs & Dropped Calls: Handoff Initiation, Forced Handoffs, Mobile-Assisted Handoff (MAHO) & Dropped Call Rate Analysis; Diversity Techniques & Digital Cellular Standards: Space/Frequency/Polarization/Time Diversity, Combining Methods, CNR/CIR Performance & GSM, TDMA and CDMA Systems'
    ),
    course(
      'EEE 4119',
      'Biomedical Engineering',
      3.0,
      'Origin & Characteristics of Biological Signals: Action Potentials, Bio-Potential Electrodes, Instrumentation Amplifiers, ECG, EMG, EEG, PCG, VCG & Bio-Signal Noise/Artifacts; Physiological Pressure, Flow & Respiratory Measurements: Blood Pressure Transducers, Plethysmography, Electromagnetic/Ultrasonic Blood Flowmeters & Spirometry; Medical Diagnostic Imaging Systems: X-Ray Radiography, Computed Tomography (CT), Positron Emission Tomography (PET), MRI & Diagnostic Ultrasound; Patient Monitoring, Medical Telemetry & Therapeutic Devices: Intensive Care Monitors, Biotelemetry, Cardiac Pacemakers & Defibrillators; Electrical Safety in Biomedical Instrumentation: Microshock/Macroshock Hazards, Isolation & Grounding Standards'
    ),
  ],
  '4th Year 2nd Semester': [
    course(
      'EEE 4211',
      'Smart Grid',
      3.0,
      'Smart Grid Architecture & Distributed Energy Resources (DERs): Two-Way Communication, Distributed Generation (DG), Energy Storage (ES), High-Power Batteries, EVs/PHEVs & Smart Sensors/Appliances; Smart Grid Communication & Cybersecurity: TCP/IP, IEEE 802 Series, Bluetooth, Zigbee, WiMAX, Ethernet, Power Line Carrier (PLC) & Grid Cybersecurity; Smart Meters & Advanced Metering Infrastructure (AMI): Smart Meter Construction, Modbus, DNP3, IEC 61850 Standards, HAN/NAN/WAN Interfacing & Power Electronic DER Interfaces; Demand-Side Integration (DSI) & Energy Market: Demand-Side Management (DSM), Real-Time Pricing, Ancillary Markets & Demand Response (DR) for Load Shaping and Voltage/Frequency Control; Microgrids, Islanding, Self-Healing & Automated Grid Restoration'
    ),
    course(
      'EEE 4213',
      'Introduction to Nanotechnology and Nanoelectronics',
      3.0,
      'Nanotechnology Foundations & Nanotools: Quantum Size Effects, Scanning Tunneling Microscope (STM), Atomic Force Microscope (AFM), Electron Microscopy (SEM/TEM) & Fluorescence Characterization; Top-Down & Bottom-Up Nanofabrication: Wafer Processing, Evaporation, Sputtering, CVD, Epitaxy, Wet/Dry Etching, Photolithography, E-Beam Lithography, Nano-Imprint & Self-Assembly; Quantum Mechanics for Nanoelectronics: Schrodinger Equation, Particle in a Box, Band Theory, Density of States, Moore Law & ITRS Roadmap; Quantum Tunneling & Single-Electron Devices: Quantum Tunneling, Resonant Tunneling Diodes (RTD), Coulomb Blockade & Single-Electron Transistors (SET); Low-Dimensional Nanostructures: Quantum Wires, Quantum Dots, Carbon Nanotubes (CNTs), Graphene, Molecular Electronics & Nanobiology'
    ),
    course(
      'EEE 4215',
      'Optical Fiber Communication',
      3.0,
      'Optics Review & Lightwave Fundamentals: Ray Theory, Numerical Aperture, Electromagnetic Waves, Polarization, Resonant Cavities & Planar Slab Waveguides; Optical Fiber Waveguides: Step-Index & Graded-Index Fibers, Modes, Attenuation Mechanisms, Chromatic/Intermodal Dispersion, Pulse Broadening & Fiber Cable Construction; Optical Sources & Amplifiers: LEDs, Laser Diodes (LD), Distributed Feedback (DFB) Lasers, VCSELs, Fiber Lasers & Optical Amplifiers (EDFA/SOA); Optical Detectors, Couplers & Passive Components: PIN & Avalanche Photodiodes (APD), Splices, Connectors, Directional/Star Couplers, Optical Switches, Isolators, WDM & Fiber Bragg Gratings (FBG); Optical Modulation, Receiver Noise & Link Budget Design: Direct/External Modulation, Coherent Heterodyne Receivers, Thermal/Shot Noise, SNR, Bit-Error Rate (BER) & Analog/Digital Fiber System Design'
    ),
    course(
      'EEE 4217',
      'Radar and Satellite Communication',
      3.0,
      'Radar Fundamentals & Systems: Radar Range Equation, Operating Principles, Block Diagrams, Continuous-Wave (CW)/Doppler Radar, FM-CW Radar & Moving Target Indicator (MTI)/Tracking Radar; Radar Subsystems & Propagation: Radar Antennas, Transmitters (Magnetron, Klystron, TWT), Duplexers, Low-Noise Receivers, Radar Frequency Bands & Applications; Satellite System Engineering & Orbits: Orbital Mechanics, Look Angles, Spacecraft Subsystems, Attitude and Orbit Control (AOCS) & Telemetry, Tracking and Command (TT&C); Satellite Payloads, Antennas & Multiple Access: Transponders, Spacecraft Antennas, Frequency Reuse, Space Qualification/Reliability & FDMA/TDMA/CDMA Multiple Access; Earth Station Technology & Broadcasting: Low-Noise Earth Station Design, Large Antennas, Link Budget, Satellite Television (DBS/DTH) & VSAT Networks'
    ),
    course(
      'EEE 4219',
      'Medical Imaging',
      3.0,
      'Introduction to Medical Imaging Modalities: Evolution of Medical Imaging, Thermography, Laparoscopy & Physical Principles of X-Ray Radiography; Computed Tomography (CT): Evolution of CT Scanner Generations, Radon Transform, Image Reconstruction Algorithms (Filtered Back-Projection, Iterative Reconstruction) & Low-Dose CT; Diagnostic Ultrasound Imaging: Acoustic Wave Propagation, Piezoelectric Transducers, A/B/M-Mode & Doppler Ultrasound Imaging and Clinical Applications; Magnetic Resonance Imaging (MRI): NMR Spectroscopy Principles, Spin Physics, T1/T2 Relaxation, Pulse Sequences, Spatial Encoding (Gradients, k-Space), MRI Hardware & Functional MRI (fMRI); Nuclear Medicine Imaging: Radioisotopes, Gamma Camera, Single-Photon Emission Computed Tomography (SPECT) & Positron Emission Tomography (PET)'
    ),
  ],
};

export const getEeeOptionCourses = (semesterGroup) => EEE_OPTION_COURSES[semesterGroup] ?? [];

// ============================================================================
// DETAILED OPTIONAL / ELECTIVE COURSES (7th & 8th Semesters — ME)
// Use ME_OPTION_COURSES and getMeOptionCourses() to populate dropdowns
// ============================================================================
export const ME_OPTION_COURSES = [
  course(
    'MEC 4035',
    'Advanced Thermodynamics',
    3.0,
    'Availability (Exergy) & Irreversibility Analysis of Thermodynamic Systems; General Thermodynamic Relations, Maxwell Relations, Clausius-Clapeyron Equation, Compressibility Charts & Gibbs Phase Rule; Joule-Kelvin (Joule-Thomson) Effect, Thermodynamics of Magnetism & Magnetocaloric Effect; Chemical Thermodynamics & Reactive Systems: Enthalpy/Entropy of Formation, Adiabatic Flame Temperature, Combustion Irreversibility & Chemical Equilibrium; Non-Equilibrium Irreversible Thermodynamics: Phenomenological Laws & Onsager Reciprocity Relations; Direct Energy Conversion Thermodynamics: Thermoelectric, Thermionic, Fuel Cells & MHD Converters'
  ),
  course(
    'MEC 4037',
    'Automobile Engineering',
    3.0,
    'Automobile Layout & Engine Construction: Chassis, Cylinder Block, Crankcase, Piston/Rings, Crankshaft, Camshaft & Valve Timing Mechanisms; Fuel Supply, Carburetion, Electronic Fuel Injection, Turbocharging & Ignition Systems; Engine Lubrication, Cooling & Exhaust Emission Control (Catalytic Converters, EGR); Power Transmission & Driveline: Clutches, Manual/Automatic Gearboxes, Torque Converters, Propeller Shaft & Differential; Chassis, Suspension, Front Axle, Steering Geometry (Ackermann, Caster, Camber) & Tires; Braking Systems (Hydraulic, Pneumatic, ABS) & Automotive Electrical/HVAC Systems'
  ),
  course(
    'MEC 4039',
    'Aerodynamics',
    3.0,
    'Fluid Conservation Equations & Inviscid Incompressible Flow: Kelvin, Stokes & Helmholtz Vortex Theorems and Elementary Potential Flows; Airfoil & Wing Geometry: Aerodynamic Forces, Pitching Moments & Lift/Drag Coefficients; Thin Airfoil Theory: Biot-Savart Law, Bound Vortex Sheet & Cambered/Symmetrical Airfoils; Finite Wing Theory: Horseshoe Vortex, Prandtl Lifting-Line Theory, Downwash, Induced Drag, Elliptic/General Lift Distribution & Swept/Twisted Wings; Compressible Subsonic & Transonic Flow: Linearized Potential Flow, Prandtl-Glauert Compressibility Correction, Critical Mach Number, Area Rule & Supercritical Airfoils; Supersonic & Hypersonic Aerodynamics: Shock-Expansion Theory & Supersonic Airfoils/Wings'
  ),
  course(
    'MEC 4041',
    'Fluid Power Transmission and Control',
    3.0,
    'Fluid Power Fundamentals: Hydraulic Fluids, Additives, Seals, Filters, Contamination Control & ISO/JIC Circuit Symbols; Hydraulic Pumps, Accumulators & Intensifiers: Gear, Vane & Axial/Radial Piston Pumps, Characteristic Curves & Sizing; Hydraulic Actuators & Piping: Single/Double-Acting Cylinders, Cushioning, Vane/Gear/Piston Hydraulic Motors & Pressure Drop in Hoses/Pipes; Pressure, Direction & Flow Control Valves: Direct/Pilot Relief, Pressure-Reducing, Sequence, Counterbalance, Check, Solenoid Directional & Servo Valves; Pneumatic Power Systems: Compressors, FRL Air Preparation Units, Pneumatic Cylinders, Air Motors & Pneumatic Logic/Control Circuits; Electro-Hydraulic & Electro-Pneumatic Industrial Automation Circuits'
  ),
  course(
    'MEC 4043',
    'Finite Element Method',
    3.0,
    'FEM Fundamentals & Elasticity Review: Discretization, Nodes, Elements & Direct Stiffness Method; Variational & Energy Formulations: Principle of Virtual Work, Minimum Potential Energy, Calculus of Variations & Galerkin Method; 1D & 2D Element Formulations: Natural Coordinates, Shape Functions, CST/LST Triangular, Bilinear Rectangular, Lagrange/Serendipity & 3D Solid Elements; Solid Mechanics Applications: 1D Bars, Trusses, Beams, Planar Frames & 2D Plane Stress/Strain Problems; Thermal, Fluid & Electromagnetic FEM Applications; Implementation using Commercial FEM Software (ANSYS/ABAQUS) & Custom MATLAB/Python Codes'
  ),
  course(
    'MEC 4045',
    'Industrial Automation',
    3.0,
    'Automation Fundamentals: Continuous, Synchronous & Asynchronous Manufacturing, Analog/Digital I/O & Process Safety/OEE; Controllers, Operator Interfaces (HMI/SCADA) & Power Distribution; Actuators, AC/DC/Stepper/Servo Motors & Mechanical Motion Mechanisms; Automated Processing & Material Handling: Conveyors, Indexers, Part Feeders & Industrial Robotics in Metal/Plastic/Food Processing; Position, Velocity, Acceleration, Contact & Proximity Sensors and Complete Automation System Specification'
  ),
  course(
    'MEC 4047',
    'Operations Research',
    3.0,
    'Linear Programming & Graphical/Simplex Methods: Model Formulation, Primal Simplex, Big-M/Two-Phase, Degeneracy & Sensitivity Analysis; Duality Theory & Revised Simplex: Primal-Dual Relationships, Shadow/Dual Prices & Economic Interpretation; Transportation & Transshipment Models: Northwest Corner, Least Cost, Vogel Approximation (VAM) & MODI Optimality Test; Dynamic (Multistage) Programming: Bellman Principle of Optimality & Forward/Backward Recursive Equations; Decision Theory & Game Theory: Decisions under Risk/Uncertainty, Decision Trees, Two-Person Zero-Sum Games & Mixed Strategies; Queuing Theory Models: Poisson/Exponential Birth-Death Processes, M/M/1, M/M/c & Bulk-Arrival Queuing Systems'
  ),
  course(
    'MEC 4049',
    'Material Handling & Maintenance Engineering',
    3.0,
    'Material Handling Principles & Selection: Capacity Calculations, Limit-Load Concept & Classification of Conveying Equipment; Continuous & Industrial Conveyors: Belt, Apron, Flight, Bucket, Roller, Vibrating/Oscillating, Pneumatic & Hydraulic Conveyors; Hoisting & Industrial Trucks: Cranes, Lifts, Forklifts, Hoppers & Chute Safety; Maintenance Engineering & Lubrication: Preventive, Predictive & Breakdown Maintenance, Lubricant Properties/Additives & Seal/Gasket Maintenance; Maintenance Scheduling & Fault Diagnosis: Maintenance Planning and Repair for Boilers, Turbines, Industrial Machinery & Agricultural Pumps'
  ),
  course(
    'MEC 4051',
    'Engineering Tribology',
    3.0,
    'Surface Topography & Contact Mechanics: Surface Roughness Characterization, Hertzian Point/Line Elastic Contact, Real Area of Contact & Flash Temperature; Friction Laws & Mechanisms: Adhesion/Ploughing Theories, Elastic/Viscoelastic Friction & Friction Measurement; Wear Mechanisms & Modeling: Adhesive, Abrasive, Fatigue, Corrosive, Fretting & Erosional Wear, Wear Debris Analysis & Wear Maps; Lubrication Regimes & Reynolds Equation: Boundary, Mixed, Hydrostatic, Hydrodynamic (1D/2D Reynolds Equation) & Elastohydrodynamic Lubrication (EHL); Solid Lubricants, Biotribology & Tribological Design of Bearings, Seals, Gears and MEMS'
  ),
  course(
    'MEC 4053',
    'Modern Manufacturing Processes',
    3.0,
    'Mechanical Non-Traditional Machining: Abrasive Jet Machining (AJM), Ultrasonic Machining (USM), Water Jet/Abrasive Water Jet (WJM/AWJM) & Abrasive Flow Machining (AFM); Electrochemical & Chemical Machining: ECM, Electrochemical Grinding/Honing/Deburring, Electro-Stream, STEM & Chemical/Thermo-Chemical Milling; Thermal Energy Machining & Processing: Electrical Discharge Machining (EDM/Wire-EDM), Laser Beam (LBM), Electron Beam (EBM), Plasma Arc (PAM) & Ion Beam Machining; Advanced Coating & Surface Engineering: Physical Vapor Deposition (PVD), Chemical Vapor Deposition (CVD) & Plasma Spraying; High-Energy-Rate Forming (HERF) & Electroforming'
  ),
  course(
    'MEC 4055',
    'Artificial Intelligence',
    3.0,
    'AI Foundations & Intelligent Agents: Rationality, Environment Types & Problem-Solving Agents; Uninformed, Heuristic & Adversarial Search: BFS, DFS, Hill Climbing, A*, AO*, Minimax & Alpha-Beta Pruning; Knowledge Representation & First-Order Logic: Propositional/Predicate Logic, Semantic Nets, Frames, Rule-Based Systems, Unification, Forward/Backward Chaining & Resolution; Machine Learning Paradigms: Inductive Learning, Decision Trees, Explanation-Based, Statistical & Reinforcement Learning; Expert Systems & Knowledge Engineering: Architecture, Knowledge Acquisition, Inference Engines & Industrial Applications'
  ),
  course(
    'MEC 4057',
    'Robotics & Mechatronics',
    3.0,
    'Robotics Fundamentals & Components: Robot Anatomy, Classification, Specifications, Manipulator Arms, End-Effectors, Actuators, Transmissions & Sensors; Spatial Transformations & Manipulator Kinematics: Homogeneous Transformations, Denavit-Hartenberg (D-H) Forward Kinematics, Inverse Kinematics & Jacobian Velocities/Static Forces; Manipulator Dynamics: Newton-Euler Recursive Formulation, Lagrangian Mechanics & Cartesian-Space Dynamics; Trajectory Planning: Joint-Space & Cartesian-Space Polynomial Trajectories and Dynamic Path Planning; Robot Position/Force Control, Robot Programming Languages & Mechatronics System Integration'
  ),
  course(
    'MEC 4059',
    'Mechanical Vibration',
    3.0,
    'Vibration Fundamentals & Undamped SDOF Free Vibration: Spring/Mass/Damping Elements, Harmonic Analysis, Translational/Torsional Systems & Rayleigh Energy Method; Viscously Damped SDOF Free Vibration: Logarithmic Decrement, Overdamped, Critically Damped & Underdamped Response; Harmonically Excited SDOF Forced Vibration: Magnification Factor, Resonance, Base Excitation, Rotating Unbalance, Coulomb/Hysteresis Damping & Self-Excited Stability; Transient & General Forced Vibration: Periodic/Non-Periodic Excitation, Convolution Integral, Response Spectrum & Laplace Transform Solutions; Two-Degree-of-Freedom (2-DOF) Systems: Natural Frequencies, Mode Shapes, Coordinate Coupling, Principal Coordinates, Semi-Definite Systems & Dynamic Vibration Absorbers'
  ),
  course(
    'MEC 4061',
    'Nanomaterial & Nanotechnology',
    3.0,
    'Nanotechnology Perspectives & Synthesis of Nanomaterials: Top-Down/Bottom-Up Synthesis of Montmorillonite Nanoclays, Carbon Nanofibers (CNF), Carbon Nanotubes (CNT), Graphene Nanoplatelets & Metal-Oxide/Silver Nanoparticles; Nanostructure Characterization Techniques: WAXD, SEM, TEM, XPS, Raman Spectroscopy, AFM, ToF-SIMS & FTIR; Size-Scaling Properties: Nano-Optics, Nano-Electronics, Nano-Magnetism & Nano-Mechanics of Graphene Oxide, CNTs and Nanocomposites; Engineering Applications of Nanomaterials: Aerospace/Automotive Structural Composites, Thermal Interface Materials, Microwave Absorbers, Sensors, Catalysts, Drug Delivery & Fuel Cells/Batteries'
  ),
  course(
    'MEC 4063',
    'Industrial Safety',
    3.0,
    'Occupational Safety Regulations & Accident Causation: OSHA/WISHA Standards, Workers Compensation, Inspections, Ergonomic Hazards & Building/Walking-Surface Codes; Industrial & Workplace Hazards: Machine Guarding, Lockout-Tagout (LOTO), Electrical/Arc Hazards, Fire/Emergency Egress, Confined Spaces, Welding, Noise, Respiratory Protection & Chemical MSDS/Flammable Storage; Process Safety Management & PPE: Industrial Hygiene, Bloodborne Pathogens, Forklift/Ladder/Scaffold Safety, Heat Stress & Personal Protective Equipment (PPE) Hazard Assessment; Accident Investigation & Safety Culture: Root Cause Analysis (RCA), Fault Tree Analysis, Accident Prevention Strategies & Safety Culture Evaluation'
  ),
  course(
    'MEC 4065',
    'Project Management and Leadership',
    3.0,
    'Project Management Lifecycle & Organizational Context: Triple Constraints, Project Selection, Portfolio Management, Organizational Structures & Adaptive Leadership; Team Building, Scope, Risk & Budgeting: Conflict Negotiation, WBS Scope Definition, Cost Estimation, Budgeting & Risk Management Control Systems; Project Network Scheduling & Resource Management: CPM, PERT, Crashing, Lagging, Resource Leveling & Project Monitoring/Earned Value Control; Project Financing & Evaluation Models: Turnkey, BOO, BOOT, Financial Ratio/Break-Even/Liquidity/Sensitivity Analysis & Public Sector Approval Processes (DPP); Engineering Contract Management: Contract Types, Technical Bid Evaluation, Contract Award, Sub-Contracting & Claims/Damages Administration'
  ),
  course(
    'MEC 4067',
    'Nuclear Power Plant Engineering',
    3.0,
    'Nuclear Fission Physics & Reactor Kinetics: Fissile/Fertile Fuels, Enrichment, Moderation, Coolants, Multiplication Factor, Reactivity Control, Control Rods, Burnable Poisons & Core Heat Removal; Nuclear Reactor Generations & Classifications: Gen I to Gen IV Evolution, PWR, BWR, PHWR (CANDU), Gas-Cooled, Liquid-Metal Fast Breeder (LMFBR) & Small Modular Reactors (SMRs); Nuclear Fuel Cycle & Radioactive Waste Management: Open/Closed Fuel Cycles & Low, Intermediate and High-Level Waste Conditioning/Geological Disposal; Nuclear Reactor Safety & Licensing: Defense-in-Depth, Active, Passive & Inherent Safety Systems, ECCS & Probabilistic/Deterministic Safety Assessment'
  ),
  course(
    'MEC 4069',
    'Power Plant Economics',
    3.0,
    'Energy Markets & Economic Fundamentals: Global/Local Energy Statistics, Market Regulation/Competition, Micro/Macro Models, Supply-Demand & Keynesian Multiplier; Power Plant Cost Parameters: CAPEX, OPEX, Fixed/Variable O&M Costs, WACC, Plant Capacity Factor, Utilization Factor & Base-Load/Peak-Load Operation; Financial & Economic Project Appraisal: Discounting, Overnight Construction Cost, Interest During Construction (IDC), EPC/Turnkey Cost, NPV, IRR, BCR & Payback Period; Levelized Cost of Electricity (LCOE) Modeling: Theoretical & Simulation-Based LCOE Calculation for Fossil, Renewable and Nuclear Power Plants; Sensitivity & Variability Analysis: Impact of CAPEX, OPEX, Fuel Price, Discount Rate & Capacity Factor on LCOE'
  ),
];

export const getMeOptionCourses = () => ME_OPTION_COURSES;
