package com.cws.sam.dtos;

import lombok.Data;

import java.awt.image.BufferedImage;

@Data
public class LoginResponseDto {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String token;
//    private BufferedImage avatar;

}
