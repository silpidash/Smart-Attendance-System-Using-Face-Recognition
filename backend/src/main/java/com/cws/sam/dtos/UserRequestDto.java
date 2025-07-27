package com.cws.sam.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "User registration/update DTO")
public class UserRequestDto {

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Password", example = "StrongPassword123")
    private String password;

    @Schema(description = "Email address", example = "john@example.com")
    private String email;

    @Schema(description = "Role", example = "STUDENT")
    private String role;

}
