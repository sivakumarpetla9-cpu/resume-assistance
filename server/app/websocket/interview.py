from fastapi import WebSocket, WebSocketDisconnect
import json
import time

class InterviewWebSocketHandler:
    @staticmethod
    async def handle_connection(websocket: WebSocket, session_id: str):
        await websocket.accept()
        
        # 1. Connection Status Event
        await websocket.send_json({
            "type": "connection_status",
            "payload": {"status": "CONNECTED", "session_id": session_id}
        })

        # 2. Initial Question Generated Event
        await websocket.send_json({
            "type": "question_generated",
            "payload": {
                "question_id": "q1",
                "question_index": 0,
                "text": "How would you optimize a React application that is experiencing frame drops and slow rendering on large lists?",
                "category": "Technical",
                "difficulty": "Medium",
                "expected_concepts": ["React.memo", "useCallback", "Virtualization (windowing)", "Code Splitting"]
            }
        })

        try:
            while True:
                data = await websocket.receive_text()
                event = json.loads(data) if data else {}
                event_type = event.get("type", "unknown")

                if event_type == "answer_received":
                    # Send processing event
                    await websocket.send_json({
                        "type": "ai_processing",
                        "payload": {"message": "Analyzing speech clarity, pacing, and concept depth..."}
                    })

                    # Send telemetry update event
                    await websocket.send_json({
                        "type": "telemetry_update",
                        "payload": {
                            "wpm": 142,
                            "fillers": 2,
                            "clarity": 88,
                            "confidence": 83
                        }
                    })

                    # Send feedback ready event
                    await websocket.send_json({
                        "type": "feedback_ready",
                        "payload": {
                            "score": 84,
                            "comment": "Clear explanation of memoization. Explicitly mention react-window virtualization."
                        }
                    })

        except WebSocketDisconnect:
            print(f"Client disconnected from interview session {session_id}")
