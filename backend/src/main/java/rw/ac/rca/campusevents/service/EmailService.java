package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily (in production, use Redis or database)
    private Map<String, String> otpStore = new HashMap<>();

    /**
     * Generate a 6-digit OTP
     */
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Send OTP email
     */
    public void sendOTP(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Campus Events - Your OTP Code");
            message.setText(
                "Your OTP code is: " + otp + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you didn't request this code, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Campus Events Team"
            );
            
            mailSender.send(message);
            
            // Store OTP (expires in 10 minutes)
            otpStore.put(toEmail, otp);
            
            System.out.println("OTP sent to: " + toEmail + " | OTP: " + otp);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Verify OTP
     */
    public boolean verifyOTP(String email, String otp) {
        String storedOTP = otpStore.get(email);
        if (storedOTP != null && storedOTP.equals(otp)) {
            otpStore.remove(email); // Remove after verification
            return true;
        }
        return false;
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Campus Events - Password Reset");
            message.setText(
                "You requested a password reset.\n\n" +
                "Your reset token is: " + resetToken + "\n\n" +
                "This token will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Campus Events Team"
            );
            
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    /**
     * Send welcome email
     */
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Welcome to Campus Events!");
            message.setText(
                "Hello " + fullName + ",\n\n" +
                "Welcome to Campus Events Management System!\n\n" +
                "Your account has been created successfully.\n" +
                "You can now login and start exploring campus events and clubs.\n\n" +
                "Best regards,\n" +
                "Campus Events Team"
            );
            
            mailSender.send(message);
            System.out.println("Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
}