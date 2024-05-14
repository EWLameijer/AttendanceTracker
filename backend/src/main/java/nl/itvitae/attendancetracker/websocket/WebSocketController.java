package nl.itvitae.attendancetracker.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/broadcast")
    @SendTo("/topic/updates")
    public String broadcastMessage(@Payload String message) {
        return "You have received a message: " + message;
    }
}
