package rw.ac.rca.campusevents.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void generateOTP_ReturnsSixDigits() {
        String otp = emailService.generateOTP();
        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d{6}"));
    }

    @Test
    void verifyOTP_Success() {
        String email = "test@example.com";
        String otp = "123456";
        
        emailService.sendOTP(email, otp);
        boolean verified = emailService.verifyOTP(email, otp);
        
        assertTrue(verified);
    }

    @Test
    void verifyOTP_Failure() {
        String email = "test@example.com";
        emailService.sendOTP(email, "123456");
        
        boolean verified = emailService.verifyOTP(email, "000000");
        
        assertFalse(verified);
    }
}
