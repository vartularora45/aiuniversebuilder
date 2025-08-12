import express from 'express';
import axios from 'axios';
import { getExtractionPrompt, getModelMapping } from '../utils/extractPrompt.js';
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

router.post('/suggest-model', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea || idea.trim() === '') {
      return res.status(400).json({ error: 'Startup idea is required' });
    }

    // Get AI keywords using Hugging Face Inference API
    const keywords = await extractKeywords(idea);

    // Map keywords to models
    const modelMapping = getModelMapping();
    const suggestedModels = [];

    if (keywords.length === 0) {
      suggestedModels.push('distilbert-base-uncased');
    } else {
      keywords.forEach(keyword => {
        const model = modelMapping[keyword.toLowerCase()];
        if (model && !suggestedModels.includes(model)) {
          suggestedModels.push(model);
        }
      });

      // If no models found for keywords, use default
      if (suggestedModels.length === 0) {
        suggestedModels.push('distilbert-base-uncased');
      }
    }

    res.json({
      keywords,
      suggested_models: suggestedModels
    });

  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({
      error: 'Failed to process startup idea',
      details: error.message
    });
  }
});

async function extractKeywords(idea) {
  try {
    // First try the rule-based approach (fastest and most reliable)
    let keywords = extractKeywordsFromText(idea);
    
    if (keywords.length > 0 && !keywords.includes('machine learning')) {
      return keywords; // Return if we found specific keywords
    }

    // If only generic keywords found, try Hugging Face API
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        const apiKeywords = await callHuggingFaceClassification(idea);
        if (apiKeywords.length > 0) {
          return apiKeywords;
        }
      } catch (apiError) {
        console.log('API failed, using rule-based keywords:', apiError.message);
      }
    }

    // Fallback to OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = getExtractionPrompt(idea);
        return await callOpenAI(prompt);
      } catch (openaiError) {
        console.log('OpenAI failed:', openaiError.message);
      }
    }

    // Final fallback - return the rule-based keywords
    return keywords.length > 0 ? keywords : ['machine learning', 'artificial intelligence'];

  } catch (error) {
    console.error('Error extracting keywords:', error.message);
    // Return default keywords to prevent empty results
    return ['machine learning', 'artificial intelligence'];
  }
}

async function callHuggingFace(prompt) {
  try {
    // Use the proven working zero-shot classification approach
    return await callHuggingFaceClassification(prompt);
  } catch (error) {
    console.error('Hugging Face classification failed:', error.message);
    
    // Fallback to simple text generation models that are known to work
    const workingModels = [
      'gpt2',
      'distilgpt2'
    ];

    for (const model of workingModels) {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          { 
            inputs: prompt,
            parameters: {
              max_length: 100,
              temperature: 0.7,
              return_full_text: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        let text = '';
        if (Array.isArray(response.data) && response.data.length > 0) {
          text = response.data[0].generated_text || '';
        }

        const keywords = parseKeywords(text);
        if (keywords.length > 0) {
          console.log(`Successfully extracted keywords using model: ${model}`);
          return keywords;
        }
      } catch (modelError) {
        console.log(`Model ${model} failed: ${modelError.message}`);
        continue;
      }
    }

    throw new Error('All Hugging Face models failed');
  }
}

// Alternative approach using text classification for keyword extraction
async function callHuggingFaceClassification(idea) {
  try {
    // Use the proven working zero-shot classification model
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        inputs: idea,
        parameters: {
          candidate_labels: [
            // Core NLP & Text Processing
            "chatbot", "conversational ai", "text generation", "language modeling", "text classification", 
            "sentiment analysis", "emotion recognition", "named entity recognition", "text summarization", 
            "question answering", "document qa", "machine translation", "multilingual processing", 
            "text-to-speech", "speech-to-text", "voice synthesis", "speech recognition", "voice cloning",
            "intent classification", "dialogue systems", "text mining", "information extraction",
            "semantic search", "content generation", "copywriting ai", "grammar correction",
            
            // Computer Vision & Image Processing
            "image classification", "object detection", "object segmentation", "instance segmentation", 
            "semantic segmentation", "image generation", "image-to-image translation", "style transfer", 
            "face recognition", "facial expression recognition", "pose estimation", "action recognition", 
            "optical character recognition", "document analysis", "medical imaging", "satellite imagery", 
            "autonomous driving", "scene understanding", "3d reconstruction", "depth estimation",
            "image enhancement", "super resolution", "image inpainting", "background removal",
            "gan networks", "diffusion models", "variational autoencoders",
            
            // Advanced ML & AI Techniques
            "deep learning", "neural networks", "transformer models", "attention mechanisms", 
            "reinforcement learning", "federated learning", "transfer learning", "meta learning", 
            "few-shot learning", "zero-shot learning", "self-supervised learning", "contrastive learning",
            "graph neural networks", "knowledge graphs", "embedding models", "representation learning",
            "multi-modal learning", "cross-modal retrieval", "vision-language models",
            
            // Recommendation & Information Systems
            "recommendation systems", "collaborative filtering", "content-based filtering", 
            "hybrid recommendations", "personalization", "ranking algorithms", "information retrieval", 
            "search engines", "knowledge discovery", "pattern recognition", "clustering algorithms",
            "association rule mining", "market basket analysis", "customer segmentation",
            
            // Time Series & Forecasting
            "time series forecasting", "time series analysis", "predictive analytics", "demand forecasting", 
            "financial modeling", "algorithmic trading", "risk assessment", "fraud detection", 
            "anomaly detection", "outlier detection", "change point detection", "survival analysis",
            "econometric modeling", "statistical modeling", "bayesian inference",
            
            // Specialized Domains
            "natural language processing", "computer vision", "robotics", "automation", "iot analytics", 
            "edge computing", "real-time processing", "stream processing", "big data analytics", 
            "data mining", "business intelligence", "predictive maintenance", "quality control",
            "supply chain optimization", "logistics optimization", "route optimization",
            
            // Healthcare & Biotech
            "medical ai", "drug discovery", "clinical decision support", "medical diagnosis", 
            "biomarker discovery", "genomics analysis", "protein folding", "medical image analysis", 
            "epidemiological modeling", "healthcare analytics", "precision medicine", "telemedicine ai",
            
            // Finance & Fintech
            "algorithmic trading", "robo advisors", "credit scoring", "risk management", 
            "compliance monitoring", "anti-money laundering", "insurance analytics", "portfolio optimization", 
            "market making", "high frequency trading", "cryptocurrency analysis", "blockchain analytics",
            
            // Security & Cybersecurity
            "cybersecurity", "threat detection", "intrusion detection", "malware analysis", 
            "network security", "behavioral analysis", "biometric authentication", "identity verification", 
            "privacy preserving ml", "differential privacy", "homomorphic encryption",
            
            // Manufacturing & Industrial
            "predictive maintenance", "quality assurance", "process optimization", "digital twins", 
            "industrial automation", "smart manufacturing", "supply chain analytics", "inventory optimization", 
            "energy optimization", "sustainability analytics", "carbon footprint analysis",
            
            // Marketing & Business
            "marketing analytics", "customer analytics", "churn prediction", "lifetime value modeling", 
            "price optimization", "demand sensing", "market research", "brand monitoring", 
            "social media analytics", "influencer analysis", "competitor analysis", "lead scoring",
            
            // Emerging Technologies
            "quantum machine learning", "neuromorphic computing", "explainable ai", "interpretable ml", 
            "ethical ai", "fairness in ml", "ai governance", "model interpretability", "causal inference", 
            "synthetic data generation", "data augmentation", "active learning", "continual learning",
            "multi-agent systems", "swarm intelligence", "evolutionary algorithms", "genetic programming"
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const results = response.data;
    const keywords = [];

    // Get labels with confidence > 0.1 (lowered threshold for better results)
    if (results.labels && results.scores) {
      for (let i = 0; i < Math.min(results.labels.length, 5); i++) {
        if (results.scores[i] > 0.05) { // Even lower threshold to get more results
          keywords.push(results.labels[i]);
        }
      }
    }

    console.log('Classification results:', { labels: results.labels?.slice(0, 5), scores: results.scores?.slice(0, 5) });
    return keywords.length > 0 ? keywords : ['machine learning', 'artificial intelligence']; // Fallback keywords
    
  } catch (error) {
    console.error('Classification model failed:', error.message);
    
    // If the main classification fails, try a simple rule-based approach
    return extractKeywordsFromText(idea);
  }
}

// Fallback function for keyword extraction without API
function extractKeywordsFromText(text) {
  const keywords = [];
  const aiTerms = {
    // NLP & Text Processing
    'chat': 'chatbot', 'bot': 'conversational ai', 'conversation': 'dialogue systems',
    'sentiment': 'sentiment analysis', 'emotion': 'emotion recognition', 'feeling': 'sentiment analysis',
    'translate': 'machine translation', 'translation': 'multilingual processing', 'language': 'language modeling',
    'text': 'text generation', 'write': 'content generation', 'copywriting': 'copywriting ai',
    'speech': 'speech recognition', 'voice': 'voice synthesis', 'audio': 'speech-to-text',
    'question': 'question answering', 'qa': 'document qa', 'answer': 'question answering',
    'summary': 'text summarization', 'summarize': 'text summarization',
    'search': 'semantic search', 'retrieval': 'information retrieval',
    
    // Computer Vision & Image Processing
    'image': 'image classification', 'photo': 'image classification', 'picture': 'computer vision',
    'detect': 'object detection', 'recognition': 'face recognition', 'identify': 'object segmentation',
    'video': 'action recognition', 'camera': 'computer vision', 'visual': 'computer vision',
    'face': 'face recognition', 'facial': 'facial expression recognition', 'pose': 'pose estimation',
    'medical imaging': 'medical imaging', 'xray': 'medical image analysis', 'scan': 'medical imaging',
    'autonomous': 'autonomous driving', 'self-driving': 'autonomous driving', 'vehicle': 'computer vision',
    'satellite': 'satellite imagery', 'drone': 'computer vision', 'surveillance': 'computer vision',
    'gan': 'gan networks', 'diffusion': 'diffusion models', 'generation': 'image generation',
    
    // Advanced ML & AI
    'neural': 'neural networks', 'deep': 'deep learning', 'transformer': 'transformer models',
    'reinforcement': 'reinforcement learning', 'federated': 'federated learning', 'transfer': 'transfer learning',
    'few-shot': 'few-shot learning', 'zero-shot': 'zero-shot learning', 'self-supervised': 'self-supervised learning',
    'graph': 'graph neural networks', 'embedding': 'embedding models', 'representation': 'representation learning',
    'multimodal': 'multi-modal learning', 'cross-modal': 'cross-modal retrieval',
    
    // Recommendation & Information Systems  
    'recommend': 'recommendation systems', 'suggestion': 'recommendation systems', 'personalization': 'personalization',
    'collaborative': 'collaborative filtering', 'content-based': 'content-based filtering',
    'ranking': 'ranking algorithms', 'retrieval': 'information retrieval', 'search': 'search engines',
    'clustering': 'clustering algorithms', 'segmentation': 'customer segmentation',
    'market basket': 'market basket analysis', 'association': 'association rule mining',
    
    // Time Series & Forecasting
    'forecast': 'time series forecasting', 'predict': 'predictive analytics', 'trend': 'time series analysis',
    'financial': 'financial modeling', 'trading': 'algorithmic trading', 'risk': 'risk assessment',
    'fraud': 'fraud detection', 'anomaly': 'anomaly detection', 'outlier': 'outlier detection',
    'econometric': 'econometric modeling', 'statistical': 'statistical modeling', 'bayesian': 'bayesian inference',
    
    // Specialized Domains
    'robot': 'robotics', 'automation': 'industrial automation', 'iot': 'iot analytics',
    'edge': 'edge computing', 'real-time': 'real-time processing', 'stream': 'stream processing',
    'big data': 'big data analytics', 'data mining': 'data mining', 'business intelligence': 'business intelligence',
    'maintenance': 'predictive maintenance', 'quality': 'quality control', 'optimization': 'process optimization',
    'supply chain': 'supply chain optimization', 'logistics': 'logistics optimization', 'route': 'route optimization',
    
    // Healthcare & Biotech
    'medical': 'medical ai', 'drug': 'drug discovery', 'clinical': 'clinical decision support',
    'diagnosis': 'medical diagnosis', 'biomarker': 'biomarker discovery', 'genomics': 'genomics analysis',
    'protein': 'protein folding', 'epidemiological': 'epidemiological modeling', 'healthcare': 'healthcare analytics',
    'precision medicine': 'precision medicine', 'telemedicine': 'telemedicine ai',
    
    // Finance & Fintech
    'trading': 'algorithmic trading', 'robo advisor': 'robo advisors', 'credit': 'credit scoring',
    'compliance': 'compliance monitoring', 'aml': 'anti-money laundering', 'insurance': 'insurance analytics',
    'portfolio': 'portfolio optimization', 'market making': 'market making', 'hft': 'high frequency trading',
    'crypto': 'cryptocurrency analysis', 'blockchain': 'blockchain analytics',
    
    // Security & Cybersecurity
    'cyber': 'cybersecurity', 'threat': 'threat detection', 'intrusion': 'intrusion detection',
    'malware': 'malware analysis', 'network security': 'network security', 'behavioral': 'behavioral analysis',
    'biometric': 'biometric authentication', 'identity': 'identity verification', 'privacy': 'privacy preserving ml',
    
    // Manufacturing & Industrial
    'manufacturing': 'smart manufacturing', 'industrial': 'industrial automation', 'digital twin': 'digital twins',
    'inventory': 'inventory optimization', 'energy': 'energy optimization', 'sustainability': 'sustainability analytics',
    'carbon': 'carbon footprint analysis',
    
    // Marketing & Business
    'marketing': 'marketing analytics', 'customer': 'customer analytics', 'churn': 'churn prediction',
    'lifetime value': 'lifetime value modeling', 'price': 'price optimization', 'demand': 'demand sensing',
    'market research': 'market research', 'brand': 'brand monitoring', 'social media': 'social media analytics',
    'influencer': 'influencer analysis', 'competitor': 'competitor analysis', 'lead': 'lead scoring',
    
    // Emerging Technologies
    'quantum': 'quantum machine learning', 'neuromorphic': 'neuromorphic computing', 'explainable': 'explainable ai',
    'interpretable': 'interpretable ml', 'ethical': 'ethical ai', 'fairness': 'fairness in ml',
    'governance': 'ai governance', 'causal': 'causal inference', 'synthetic': 'synthetic data generation',
    'augmentation': 'data augmentation', 'active learning': 'active learning', 'continual': 'continual learning',
    'multi-agent': 'multi-agent systems', 'swarm': 'swarm intelligence', 'evolutionary': 'evolutionary algorithms',
    'genetic': 'genetic programming'
  };

  const lowerText = text.toLowerCase();
  
  Object.keys(aiTerms).forEach(term => {
    if (lowerText.includes(term)) {
      const aiCategory = aiTerms[term];
      if (!keywords.includes(aiCategory)) {
        keywords.push(aiCategory);
      }
    }
  });

  // If no specific keywords found, return general AI terms
  if (keywords.length === 0) {
    keywords.push('machine learning', 'artificial intelligence');
  }

  return keywords.slice(0, 8); // Increased to 8 for more comprehensive results
}

async function callOpenAI(prompt) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.1
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const text = response.data.choices[0]?.message?.content || '';
  return parseKeywords(text);
}

function parseKeywords(text) {
  const keywords = [];
  const aiTerms = [
    'chatbot', 'image classification', 'sentiment analysis', 'speech recognition',
    'recommendation system', 'object detection', 'text generation', 'translation',
    'question answering', 'summarization', 'named entity recognition', 'text classification',
    'image generation', 'voice synthesis', 'anomaly detection', 'time series forecasting',
    'natural language processing', 'computer vision', 'machine learning', 'artificial intelligence',
    'deep learning', 'neural network', 'nlp', 'cv', 'ml', 'ai', 'data analysis'
  ];

  const lowerText = text.toLowerCase();
  aiTerms.forEach(term => {
    if (lowerText.includes(term)) {
      keywords.push(term);
    }
  });

  return [...new Set(keywords)].slice(0, 5); // Remove duplicates and limit to 5
}

// Enhanced function that combines both approaches
async function extractKeywordsEnhanced(idea) {
  try {
    let keywords = [];

    // Try classification approach first (more accurate for categorization)
    try {
      keywords = await callHuggingFaceClassification(idea);
      if (keywords.length > 0) {
        return keywords;
      }
    } catch (error) {
      console.log('Classification approach failed, trying text generation:', error.message);
    }

    // Fallback to text generation approach
    const prompt = getExtractionPrompt(idea);
    if (process.env.HUGGINGFACE_API_KEY) {
      keywords = await callHuggingFace(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      keywords = await callOpenAI(prompt);
    }

    return keywords;
    
  } catch (error) {
    console.error('All keyword extraction methods failed:', error.message);
    return [];
  }
}

export default router;