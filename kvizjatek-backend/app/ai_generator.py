import json
from openai import OpenAI
from flask import current_app

def get_ai_client():
    """
    Initializes and returns the OpenAI client configured 
    with custom base_url and api_key from the app config.
    """
    api_key = current_app.config.get('OPENAI_API_KEY')
    base_url = current_app.config.get('OPENAI_BASE_URL') # For DeepSeek/other models
    
    # Check for required configurations
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured in the application config.")
    if not base_url:
        # Default to the recommended DeepSeek URL if not set
        base_url = 'https://api.deepseek.com/v1'
        current_app.logger.warning(f"OPENAI_BASE_URL not set, defaulting to {base_url}")
        
    client = OpenAI(
        api_key=api_key,
        base_url=base_url
    )
    return client

def generate_quiz_questions(topic, difficulty, num_questions=5):
    """
    Generates a list of quiz questions using the configured AI model.
    
    Args:
        topic (str): The topic for the quiz (e.g., "Roman History").
        difficulty (str): The difficulty (e.g., "Medium").
        num_questions (int): The number of questions to generate (default 5).

    Returns:
        list: A list of question objects formatted for the database.
        dict: An error dictionary if the request fails.
    """
    
    try:
        client = get_ai_client()
    except ValueError as e:
        return {"error": "Configuration Error", "details": str(e)}

    # This system prompt is crucial for forcing the AI to return *only* JSON
    # in the exact format we need.
    system_prompt = f"""
        You are an expert quiz generator. Your task is to generate {num_questions} multiple-choice quiz questions
        on the topic of "{topic}" with a difficulty of "{difficulty}".
        
        You MUST return ONLY a valid JSON array (a list of objects) and nothing else.
        Do not include ```json, preambles, introductions, or any text other than the JSON array itself.
        
        Each object in the array MUST follow this exact JSON schema, matching the database model:
        {{
        "question_text": "The text of the question.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_option_index": 1
        }}
        
        - "question_text" MUST be a string.
        - "options" MUST be an array of exactly 4 strings: one correct answer and three incorrect answers.
        - "correct_option_index" MUST be the integer index (0, 1, 2, or 3) of the correct answer in the "options" array.
        - Ensure the correct answer's position is varied across questions.
    """
    
    try:
        completion = client.chat.completions.create(
            model="gpt-5-nano", 
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=0.7,
            # Force JSON output if the model supports it
            response_format={"type": "json_object"}, 
        )
        
        raw_response = completion.choices[0].message.content
        data = json.loads(raw_response)
        
        # Robustly extract the list of questions, whether it's the root object or nested
        if isinstance(data, dict):
            for value in data.values():
                if isinstance(value, list):
                    return value
            raise json.JSONDecodeError("AI response was a dict but contained no list of questions.", raw_response, 0)
        
        if isinstance(data, list):
            return data
        
        raise json.JSONDecodeError("AI did not return a valid JSON list or object.", raw_response, 0)


    except json.JSONDecodeError as e:
        return {"error": "AI returned invalid JSON", "details": str(e), "raw_response": raw_response}
    except Exception as e:
        # Handle API errors (e.g., auth, rate limits, network issues)
        return {"error": "AI API request failed", "details": str(e)}
