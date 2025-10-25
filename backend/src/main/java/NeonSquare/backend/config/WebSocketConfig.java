// backend/src/main/java/NeonSquare/backend/config/WebSocketConfig.java
package NeonSquare.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // Reads from env/property: cors.allowed-origins (e.g. "https://*.vercel.app,http://localhost:3000")
    @Value("${cors.allowed-origins:*}")
    private String allowedOriginsCsv;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // IMPORTANT: split CSV → varargs; passing the CSV string directly won’t match CORS
        List<String> patterns = Arrays.stream(allowedOriginsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(
                        patterns.isEmpty() ? new String[]{"*"} : patterns.toArray(new String[0])
                );
        // No SockJS (your frontend uses native ws://.../ws via @stomp/stompjs)
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Clients SUBSCRIBE to /topic/...
        registry.enableSimpleBroker("/topic");
        // If you ever SEND from client to server app endpoints, use /app/...
        registry.setApplicationDestinationPrefixes("/app");
    }
}
