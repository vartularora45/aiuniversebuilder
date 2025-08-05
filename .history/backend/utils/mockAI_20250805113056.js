/**
 * Mock AI service for generating questions and flow structures
 * This is used when OpenAI API key is not available
 */

const questionTemplates = {
  education: [
    { question: "What type of educational institution is this for?", type: "choice", choices: ["School", "College", "University", "Training Center"], priority: 5 },
    { question: "How many students will use this system?", type: "number", priority: 4 },
    { question: "What is the primary purpose?", type: "choice", choices: ["Admissions", "Course Registration", "Student Support", "General Information"], priority: 5 },
    { question: "Do you need multilingual support?", type: "boolean", priority: 2 },
    { question: "What grade levels or programs are offered?", type: "text", priority: 3 }
  ],
  ecommerce: [
    { question: "What type of products will you sell?", type: "text", priority: 5 },
    { question: "Do you need inventory management?", type: "boolean", priority: 4 },
    { question: "Which payment methods do you want to support?", type: "choice", choices: ["Credit Card", "PayPal", "Stripe", "Bank Transfer", "Cryptocurrency"], priority: 4 },
    { question: "Do you need order tracking features?", type: "boolean", priority: 3 },
    { question: "What is your target market?", type: "choice", choices: ["Local", "National", "International"], priority: 3 }
  ],
  healthcare: [
    { question: "What type of healthcare service do you provide?", type: "text", priority: 5 },
    { question: "Do you need appointment scheduling?", type: "boolean", priority: 4 },
    { question: "Should the bot handle emergency situations?", type: "boolean", priority: 5 },
    { question: "Do you need patient data integration?", type: "boolean", priority: 4 },
    { question: "What languages should be supported?", type: "text", priority: 2 }
  ],
  support: [
    { question: "What type of support will this bot provide?", type: "choice", choices: ["Technical", "Customer Service", "Sales", "General"], priority: 5 },
    { question: "Should it escalate to human agents?", type: "boolean", priority: 4 },
    { question: "What are your business hours?", type: "text", priority: 3 },
    { question: "Do you need ticket creation features?", type: "boolean", priority: 3 },
    { question: "What tone should the bot use?", type: "choice", choices: ["Professional", "Friendly", "Casual", "Technical"], priority: 2 }
  ],
  generic: [
    { question: "What is the main goal of this chatbot?", type: "text", priority: 5 },
    { question: "Who is your target audience?", type: "text", priority: 4 },
    { question: "What tone should the bot use?", type: "choice", choices: ["Professional", "Friendly", "Casual", "Witty"], priority: 3 },
    { question: "Do you need data collection features?", type: "boolean", priority: 3 },
    { question: "Should the bot remember previous conversations?", type: "boolean", priority: 2 }
  ]
};

/**
 * Generate questions based on prompt analysis
 */
exports.generateQuestions = (prompt, context = {}) => {
  const lowerPrompt = prompt.toLowerCase();
  let selectedQuestions = [];

  // Determine category based on keywords
  if (lowerPrompt.match(/(school|college|university|student|education|course|class|teacher|learning)/)) {
    selectedQuestions = questionTemplates.education;
  } else if (lowerPrompt.match(/(shop|store|ecommerce|e-commerce|sell|product|buy|payment|order)/)) {
    selectedQuestions = questionTemplates.ecommerce;
  } else if (lowerPrompt.match(/(health|medical|doctor|patient|appointment|clinic|hospital)/)) {
    selectedQuestions = questionTemplates.healthcare;
  } else if (lowerPrompt.match(/(support|help|customer|service|ticket|issue|problem)/)) {
    selectedQuestions = questionTemplates.support;
  } else {
    selectedQuestions = questionTemplates.generic;
  }

  // Add context-specific information
  const questionsWithContext = selectedQuestions.map(q => ({
    ...q,
    context: `This question helps understand ${q.question.toLowerCase().replace('?', '')} for better chatbot customization.`
  }));

  // Return top 4 questions sorted by priority
  return questionsWithContext
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
};

/**
 * Generate flow structure from questions and answers
 */
exports.generateFlowStructure = (questions, answers, initialPrompt) => {
  const nodes = [];
  const edges = [];
  let yPosition = 50;
  const xPosition = 250;
  const verticalSpacing = 150;

  // Start node
  nodes.push({
    id: 'start-1',
    type: 'start',
    data: {
      label: 'Welcome',
      question: `Hello! ${initialPrompt}`
    },
    position: { x: xPosition, y: yPosition }
  });

  let lastNodeId = 'start-1';
  yPosition += verticalSpacing;

  // Create question nodes
  questions.forEach((question, index) => {
    const nodeId = `question-${index + 1}`;
    const answer = answers[question.question] || answers[index];

    nodes.push({
      id: nodeId,
      type: 'question',
      data: {
        label: question.question,
        question: question.question,
        expectedAnswerType: question.type,
        choices: question.choices || []
      },
      position: { x: xPosition, y: yPosition }
    });

    // Connect to previous node
    edges.push({
      id: `edge-${lastNodeId}-${nodeId}`,
      source: lastNodeId,
      target: nodeId,
      label: answer ? `Answer: ${answer}` : ''
    });

    lastNodeId = nodeId;
    yPosition += verticalSpacing;
  });

  // Add condition node based on answers
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

  // Add action node
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

  return {
    nodes,
    edges,
    flowConfiguration: {
      startNodeId: 'start-1',
      endNodeIds: [endNodeId],
      variables: questions.map((q, index) => ({
        name: `response_${index + 1}`,
        type: q.type,
        defaultValue: null
      }))
    }
  };
};
