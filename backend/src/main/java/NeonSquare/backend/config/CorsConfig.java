// backend/src/main/java/NeonSquare/backend/config/CorsConfig.java
package NeonSquare.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Value("${cors.allowed-origins:http://localhost:3000}")
  private String allowed;

  @Override
  public void addCorsMappings(CorsRegistry reg) {
    reg.addMapping("/**")
      .allowedOriginPatterns(allowed.split(",")) 
      .allowedMethods("*")
      .allowedHeaders("*")
      .allowCredentials(true);
  }
}
