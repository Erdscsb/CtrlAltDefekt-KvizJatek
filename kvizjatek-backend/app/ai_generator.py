import json
from openai import OpenAI
from flask import current_app

def get_ai_client():
    """
    Initializes and returns the OpenAI client configured 
    with the api_key from the app config.
    """
    api_key = current_app.config.get('OPENAI_API_KEY')
    
    # Check for required configuration
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured in the application config.")
        
    client = OpenAI(
        api_key=api_key
        # No base_url is needed, client defaults to OpenAI's API
    )
    return client

def generate_quiz_questions(topic, difficulty, num_questions=5):
    """
    Generates a list of quiz questions using the configured OpenAI model.
    
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
        # This catches the missing API key error
        return {"error": "Configuration Error", "details": str(e)}

    # This system prompt is optimized for JSON mode.
    # It asks for a JSON object with a specific key ("questions")
    # which aligns perfectly with response_format={"type": "json_object"}.
    system_prompt = f"""
        You are an expert quiz generator. Your task is to generate {num_questions} multiple-choice quiz questions
        on the topic of "{topic}" with a difficulty of "{difficulty}".
        
        You MUST return ONLY a valid JSON object and nothing else.
        Do not include ```json, preambles, introductions, or any text other than the JSON object itself.
        
        The JSON object MUST contain a single key "questions", which holds a JSON array (a list) of question objects.
        
        The schema for the question objects inside the "questions" array MUST be:
        {{
        "question_text": "The text of the question.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_option_index": 1
        }}
        
        - "question_text" MUST be a string.
        - "options" MUST be an array of exactly 4 strings.
        - "correct_option_index" MUST be the integer index (0, 1, 2, or 3) of the correct answer.
        - Ensure the correct answer's position is varied across questions.
    """
    
    try:
        completion = client.chat.completions.create(
            # This is the model you requested
            model="gpt-5-nano", 
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            temperature=1,
            # This forces the model to output a valid JSON object
            response_format={"type": "json_object"}, 
        )
        
        raw_response = completion.choices[0].message.content
        data = json.loads(raw_response)
        
        # Robustly extract the list of questions from the expected key
        if not isinstance(data, dict) or "questions" not in data:
            raise json.JSONDecodeError(
                "AI response was not a dict or missing the 'questions' key.",
                raw_response, 0
            )
        
        questions_list = data.get("questions")
        
        if not isinstance(questions_list, list):
             raise json.JSONDecodeError(
                "AI response 'questions' key did not contain a list.",
                raw_response, 0
            )

        return questions_list

    except json.JSONDecodeError as e:
        return {"error": "AI returned invalid JSON or unexpected schema", "details": str(e), "raw_response": raw_response}
    except Exception as e:
        # Handle API errors (e.g., auth, rate limits, model not found)
        return {"error": "AI API request failed", "details": str(e)}