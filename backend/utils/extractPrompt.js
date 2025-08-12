function getExtractionPrompt(idea) {
  return `Analyze this startup idea and extract 3-5 AI/ML related keywords that would be most relevant for implementation. Focus on specific AI capabilities like: chatbot, image classification, sentiment analysis, speech recognition, recommendation system, object detection, text generation, translation, question answering, summarization, named entity recognition, text classification, image generation, voice synthesis, anomaly detection, time series forecasting.

Startup idea: "${idea}"

Return only the relevant AI/ML keywords, separated by commas. If no specific AI capabilities are mentioned, suggest the most likely ones based on the business context.`;
}

function getModelMapping() {
  return {
    'chatbot': 'microsoft/DialoGPT-medium',
    'text generation': 'gpt2',
    'sentiment analysis': 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    'image classification': 'google/vit-base-patch16-224',
    'object detection': 'facebook/detr-resnet-50',
    'speech recognition': 'facebook/wav2vec2-base-960h',
    'recommendation system': 'sentence-transformers/all-MiniLM-L6-v2',
    'translation': 'Helsinki-NLP/opus-mt-en-de',
    'question answering': 'deepset/roberta-base-squad2',
    'summarization': 'facebook/bart-large-cnn',
    'named entity recognition': 'dbmdz/bert-large-cased-finetuned-conll03-english',
    'text classification': 'distilbert-base-uncased-finetuned-sst-2-english',
    'image generation': 'runwayml/stable-diffusion-v1-5',
    'voice synthesis': 'facebook/fastspeech2-en-ljspeech',
    'anomaly detection': 'microsoft/DialoGPT-medium',
    'time series forecasting': 'huggingface/pytorch-timeseries-transformer'
  };
}

export { getExtractionPrompt, getModelMapping };
