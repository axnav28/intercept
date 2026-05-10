import httpx

from app.config import settings


class TranslationService:
    async def translate(self, source_text: str, fallback_translation: str) -> str:
        if not settings.gemini_api_key:
            return fallback_translation

        prompt = (
            "Translate this Tamil emergency utterance into Hindi for a government dispatcher. "
            "Preserve urgency and return only the Hindi translation.\n\n"
            f"Tamil: {source_text}"
        )

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent",
                    params={"key": settings.gemini_api_key},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.2},
                    },
                )
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"].strip() or fallback_translation
        except Exception:
            return fallback_translation
