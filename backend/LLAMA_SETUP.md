# OpenAI Integration Setup Guide

This guide will help you set up OpenAI for your healthcare chatbot.

## 🔧 Option 1: Use OpenAI (if quota available)

If you have OpenAI quota available:
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-3-small
```

## 🧪 Testing Your Setup

Run the test script to verify everything works:

```bash
cd backend
python test_llama.py
```

This will:
1. Check if OpenAI is configured
2. Test OpenAI connection
3. Generate sample responses
4. Test the full RAG system

## 🚀 Running the Application

1. Start the backend:
   ```bash
   cd backend
   python main.py
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## 📊 Performance Comparison

| Provider | Speed | Quality | Cost | Privacy |
|----------|-------|---------|------|---------|
| OpenAI | Fast | High | Pay-per-use | Data sent to OpenAI |
| Fallback | Fast | Good | Free | Completely local |

## 🔍 Troubleshooting

### General Issues
- **No providers available**: Check your `.env` file configuration
- **Timeout errors**: Increase the timeout values in your configuration
- **Poor responses**: Try adjusting temperature or using a different model

## 🎯 Benefits of This Setup

1. **Simple**: Only OpenAI and fallback system
2. **Reliable**: Always works with local questionnaires
3. **Cost-effective**: Free fallback when OpenAI quota is exceeded
4. **Privacy**: Fallback system keeps data local
5. **No Setup**: Works out of the box

## 📝 Notes

- OpenAI provides high-quality responses when quota is available
- Fallback system provides good responses using local questionnaires
- The system automatically switches to fallback when OpenAI fails
- No additional software installation required
