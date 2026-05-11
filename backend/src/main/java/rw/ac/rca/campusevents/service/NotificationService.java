package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.NotificationRepository;
import rw.ac.rca.campusevents.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Notification createNotification(User recipient, String message, Notification.Type type, Long relatedId, String relatedEntity) {
        Notification notification = new Notification(message, recipient, type, relatedId, relatedEntity);
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void notifyAllUsers(String message, Notification.Type type, Long relatedId, String relatedEntity) {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            createNotification(user, message, type, relatedId, relatedEntity);
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
    
    public Page<Notification> getUserNotificationsPaginated(Long userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        notification.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }
}
