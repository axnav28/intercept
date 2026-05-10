class MapContextBuilder:
    async def build(self, analysis: dict, text: str, current_location_mentioned: bool) -> dict:
        location_focus = {
            "latitude": 28.6886,
            "longitude": 76.9865,
            "label": "Tikri, NH-48",
        }
        district_focus = {
            "latitude": 28.4595,
            "longitude": 77.0266,
            "label": "Delhi NCR / NH-48",
        }

        if not analysis["emergencyDetected"]:
            return {
                "visible": False,
                "focus": district_focus,
                "highlightedIds": [],
            }

        focus = district_focus
        highlighted_ids = ["svc-1", "svc-2", "svc-3"]

        if analysis["locationMentioned"]:
            focus = location_focus
            highlighted_ids = ["svc-3", "svc-4", "svc-6"]

        if analysis["severity"] == "critical":
            highlighted_ids = ["svc-1", "svc-3", "svc-6"]

        return {
            "visible": True,
            "focus": focus,
            "highlightedIds": highlighted_ids,
            "locationText": text if current_location_mentioned else "",
        }
