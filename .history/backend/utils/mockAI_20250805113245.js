/**
 * Mock AI service for generating questions and flow structures
 * This is used when Gemini API key is not available
 */

const questionTemplates = {
  education: [
    { 
      question: "What type of educational institution is this for?", 
      type: "choice", 
      choices: ["School", "College", "University", "Training Center"], 
      priority: 5 
    },
    { 
      question: "How many students will use this system?", 
      type: "number", 
      priority: 4 
    },
    { 
      question: "What is the primary purpose?", 
      type: "choice", 
      choices: ["Admissions", "Course Registration", "Student Support", "General Information"], 
      priority: 5 
    },
    { 
      question: "Do you need multilingual support?", 
      type: "boolean", 
      priority: 2 
    },
    { 
      question: "What grade levels or programs are offered?", 
      type: "text", 
      priority: 3 
    }
  ],
  ecommerce: [
    { 
      question: "What type of products will you sell?", 
      type: "text", 
      priority: 5 
    },
    { 
      question: "Do you need inventory management?", 
      type: "boolean", 
      priority: 4 
    },
    { 
      question: "Which payment methods do you want to support?", 
      type: "choice", 
      choices: ["Credit Card", "PayPal", "Stripe", "Bank Transfer", "Cryptocurrency"], 
      priority: 4 
    },
    { 
      question: "Do you need order tracking features?", 
      type: "boolean", 
      priority: 3 
    },
    { 
      question: "What is your target market?", 
      type: "choice", 
      choices: ["Local", "National", "International"], 
      priority: 3 
    }
  ],
  healthcare: [
    { 
      question: "What type of healthcare service do you provide?", 
      type: "text", 
      priority: 5 
    },
    { 
      question: "Do you need appointment scheduling?", 
      type: "boolean", 
      priority: 4 
    },
    { 
      question: "Should the bot handle emergency situations?", 
      type: "boolean", 
      priority: 5 
    },
    { 
      question: "Do you need patient data integration?", 
      type: "boolean", 
      priority: 4 
    },
    { 
      question: "What languages should be supported?", 
      type: "text", 
      priority: 2 
    }
  ],
  support: [
    { 
      question: "What type of support will this bot provide?", 
      type: "choice", 
      choices: ["Technical", "Customer Service", "Sales", "General"], 
      priority: 5 
    },
    { 
      question: "Should it escalate to human agents?", 
      type: "boolean", 
      priority: 4 
    },
    { 
      question: "What are your business hours?", 
      type: "text", 
      priority: 3 
    },
    { 
      question: "Do you need ticket creation features?", 
      type: "boolean", 
      priority: 3 
    },
    { 
      question: "What tone should the bot use?", 
      type: "choice", 
      choices: ["Professional", "Friendly", "Casual", "Technical"], 
      priority: 2 
    }
  ],
  generic: [
    { 
      question: "What is the main goal of this chatbot?", 
      type: "text", 
      priority: 5 
    },
    { 
      question: "Who is your target audience?", 
      type: "text", 
      priority: 4 
    },
    { 
      question: "What tone should the bot use?", 
      type: "choice", 
      choices: ["Professional", "Friendly", "Casual", "Witty"], 
      priority: 3 
    },
    { 
      question: "Do you need data collection features?", 
      type: "boolean", 
      priority: 3 
    },
    { 
      question: "Should the bot remember previous conversations?", 
      type: "boolean", 
      priority: 2 
    }
  ]
};

// Category detection patterns
const categoryPatterns = {
  education: /(?:school|college|university|student|education|course|class|teacher|learning)/i,
  ecommerce: /(?:shop|store|ecommerce|e-commerce|sell|product|buy|payment|order)/i,
  healthcare: /(?:health|medical|doctor|patient|appointment|clinic|hospital)/i,
  support: /(?:support|help|customer|service|ticket|issue|problem)/i
};

/**
 * Detect category based on prompt analysis
 */
const detectCategory = (prompt) => {
  const categories = Object.keys(categoryPatterns);
  const detectedCategory = categories.find(category => 
    categoryPatterns[category].test(prompt)
  );
  return detectedCategory || 'generic';
};

/**
 * Generate questions based on prompt analysis
 */
export const generateQuestions = (prompt, context = {}) => {
  const category = detectCategory(prompt);
  const selectedQuestions = questionTemplates[category];

  // Add context-specific information using template literals
  const questionsWithContext = selectedQuestions.map(question => ({
    ...question,
    context: `This question helps understand ${question.question.toLowerCase().replace('?', '')} for better chatbot customization.`
  }));

  // Return top 4 questions sorted by priority (descending)
  return questionsWithContext
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
};

/**
 * Generate flow structure from questions and answers
 */
export const generateFlowStructure = (questions, answers, initialPrompt) => {
  const nodes = [];
  const edges = [];
  const config = {
    initialY: 50,
    xPosition: 250,
    verticalSpacing: 150
  };

  let yPosition = config.initialY;

  // Start node
  const startNode = {
    id: 'start-1',
    type: 'start',
    data: {
      label: 'Welcome',
      question: `Hello! ${initialPrompt}`
    },
    position: { x: config.xPosition, y: yPosition }
  };
  nodes.push(startNode);

  let lastNodeId = 'start-1';
  yPosition += config.verticalSpacing;

  // Create question nodes with enhanced data
  const questionNodes = questions.map((question, index) => {
    const nodeId = `question-${index + 1}`;
    const answer = answers[question.question] || answers[index];

    const node = {
      id: nodeId,
      type: 'question',
      data: {
        label: question.question,
        question: question.question,
        expectedAnswerType: question.type,
        choices: question.choices || [],
        priority: question.priority
      },
      position: { x: config.xPosition, y: yPosition }
    };

    // Connect to previous node
    const edge = {
      id: `edge-${lastNodeId}-${nodeId}`,
      source: lastNodeId,
      target: nodeId,
      label: answer ? `Answer: ${answer}` : ''
    };

    nodes.push(node);
    edges.push(edge);

    lastNodeId = nodeId;
    yPosition += config.verticalSpacing;

    return { nodeId, answer };
  });

  // Add processing nodes
  const processingNodes = createProcessingNodes(lastNodeId, config.xPosition, yPosition);
  nodes.push(...processingNodes.nodes);
  edges.push(...processingNodes.edges);

  // Generate flow configuration
  const flowConfiguration = {
    startNodeId: 'start-1',
    endNodeIds: ['end-1'],
    variables: questions.map((question, index) => ({
      name: `response_${index + 1}`,
      type: question.type,
      defaultValue: getDefaultValue(question.type),
      question: question.question
    })),
    metadata: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      category: detectCategory(initialPrompt)
    }
  };

  return {
    nodes,
    edges,
    flowConfiguration
  };
};

/**
 * Create processing nodes (condition, action, end)
 */
const createProcessingNodes = (lastNodeId, xPosition, startY) => {
  const nodes = [];
  const edges = [];
  let yPosition = startY;
  const verticalSpacing = 150;

  // Condition node
  const conditionNodeId = 'condition-1';
  nodes.push({
    id: conditionNodeId,
    type: 'condition',
    data: {
      label: 'Process Requirements',
      conditions: [
        { field: 'responses', operator: 'complete', value: true }
      ]
    },
    position: { x: xPosition, y: yPosition }
  });

  edges.push({
    id: `edge-${lastNodeId}-${conditionNodeId}`,
    source: lastNodeId,
    target: conditionNodeId
  });

  yPosition += verticalSpacing;

  // Action node
  const actionNodeId = 'action-1';
  nodes.push({
    id: actionNodeId,
    type: 'action',
    data: {
      label: 'Generate Response',
      actions: [
        { type: 'generate_response', parameters: { based_on: 'user_requirements' } }
      ]
    },
    position: { x: xPosition, y: yPosition }
  });

  edges.push({
    id: `edge-${conditionNodeId}-${actionNodeId}`,
    source: conditionNodeId,
    target: actionNodeId,
    label: 'Requirements Complete'
  });

  yPosition += verticalSpacing;

  // End node
  const endNodeId = 'end-1';
  nodes.push({
    id: endNodeId,
    type: 'end',
    data: {
      label: 'Complete',
      question: 'Thank you! Your chatbot configuration is ready.'
    },
    position: { x: xPosition, y: yPosition }
  });

  edges.push({
    id: `edge-${actionNodeId}-${endNodeId}`,
    source: actionNodeId,
    target: endNodeId
  });

  return { nodes, edges };
};

/**
 * Get default value based on question type
 */
const getDefaultValue = (type) => {
  const defaults = {
    text: '',
    number: 0,
    boolean: false,
    choice: null,
    email: '',
    phone: ''
  };
  return defaults[type] || null;
};

// Default export for backward compatibility
export default {
  generateQuestions,
  generateFlowStructure
};
