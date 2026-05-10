class SemanticAnalyzer:
    async def analyze(self, text: str) -> dict:
        normalized = text.lower()
        critical_keywords: list[str] = []

        if "सांस" in text or "breath" in normalized:
            critical_keywords.append("not_breathing")
        if "बेहोश" in text or "unconscious" in normalized:
            critical_keywords.append("unconscious")
        if "दर्द" in text:
            critical_keywords.append("pain")
        if "खून" in text or "bleeding" in normalized:
            critical_keywords.append("bleeding")

        emergency_detected = any(
            token in normalized for token in ["accident", "injured", "injury"]
        ) or any(token in text for token in ["एक्सीडेंट", "टक्कर", "दर्द"]) or bool(critical_keywords)

        location_mentioned = any(
            token in text for token in ["टिकरी", "एनएच-48", "NH-48", "सीमा", "गांव", "पेट्रोल पंप"]
        )

        severity = "critical" if {"not_breathing", "unconscious"} & set(critical_keywords) else "elevated"
        if not emergency_detected and not location_mentioned:
            severity = "monitoring"

        return {
            "emergencyDetected": emergency_detected,
            "injuryMentioned": any(token in text for token in ["दर्द", "टूटा", "खून"]),
            "locationMentioned": location_mentioned,
            "criticalKeywords": critical_keywords,
            "severity": severity,
            "summary": self._summary(emergency_detected, critical_keywords, location_mentioned),
        }

    @staticmethod
    def _summary(emergency_detected: bool, critical_keywords: list[str], location_mentioned: bool) -> str:
        if "not_breathing" in critical_keywords:
            return "AI context: breathing emergency detected."
        if "unconscious" in critical_keywords:
            return "AI context: unconscious victim mentioned."
        if location_mentioned:
            return "AI context: probable roadside location extracted."
        if emergency_detected:
            return "AI context: road accident and injury signals detected."
        return "AI context: monitoring live call for emergency details."
