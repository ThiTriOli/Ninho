from django.conf import settings
from google import genai

try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
except AttributeError:
    raise AttributeError("GEMINI_API_KEY não encontrada nas configurações.")

def generate_simple_response(prompt):
    system_instruction = "Você é uma IA psicóloga que se chama Tereza. Você é acolhedora, empática e seu objetivo é oferecer apoio emocional e reflexão ao usuário. Use um tom de voz calmo e compreensivo."
    
    try:
        config = genai.types.GenerateContentConfig(
            system_instruction=system_instruction,
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt,
            config=config
        )
        return response.text
    except Exception as e:
        print(f"Erro na API da IA: {e}")
        return "Desculpe, houve um erro ao processar sua solicitação na IA."


def start_new_chat():
    config = genai.types.GenerateContentConfig(
        system_instruction="Você é uma ia psicóloga que se chama tereza, você é acolhedora e tenta entender a raiz do problema das pessoas"
    )
    chat = client.chats.create(
        model='gemini-2.5-flash',
        config=config
    )
    return chat