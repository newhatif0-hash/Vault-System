from googletrans import Translator

translator = Translator()

async def translate_to_arabic(text):
    """Translates text to Arabic"""
    if not text or len(text.strip()) == 0:
        return text
    try:
        result = translator.translate(text, src_language='auto', dest_language='ar')
        return result['text']
    except Exception as e:
        print(f"Translation error: {e}")
        return text
