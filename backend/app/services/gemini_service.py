from google import genai
import os

# To use this service, make sure the GEMINI_API_KEY environment variable is set.
# Example: os.environ["GEMINI_API_KEY"] = "your_key"

def generate_ai_response(prompt: str) -> str:
    """
    Calls the Gemini API to generate a helpful response using the new google-genai SDK.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured."
        
    try:
        # Initialize the new client
        client = genai.Client(api_key=api_key)
        
        # Using the recommended model
        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error connecting to AI service: {str(e)}"
