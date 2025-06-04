import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Dict, Any, Optional
from datetime import datetime

class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        # In production, these would be environment variables
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "skilllens.noreply@gmail.com")
        self.to_email = "mutsvedu.work@gmail.com"  # Feedback recipient
    
    def send_feedback_email(self, feedback_data: Dict[str, Any]) -> Optional[str]:
        """
        Send feedback email
        
        Args:
            feedback_data: Feedback data
            
        Returns:
            Optional[str]: Error message if any
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = self.to_email
            msg["Subject"] = f"SkillLens Feedback - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            
            # Create email body
            body = f"""
            <html>
            <body>
                <h2>SkillLens Feedback</h2>
                <p><strong>Analysis ID:</strong> {feedback_data.get('analysis_id', 'N/A')}</p>
                <p><strong>Rating:</strong> {feedback_data.get('rating', 'N/A')} / 5</p>
                <p><strong>Comment:</strong> {feedback_data.get('comment', 'No comment provided')}</p>
                <p><strong>Timestamp:</strong> {datetime.now().isoformat()}</p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, "html"))
            
            # For development/testing without actual SMTP credentials
            if not self.smtp_username or not self.smtp_password:
                print("=== FEEDBACK EMAIL (DEVELOPMENT MODE) ===")
                print(f"To: {self.to_email}")
                print(f"Subject: {msg['Subject']}")
                print(body)
                print("=======================================")
                return None
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return None
        
        except Exception as e:
            error_msg = f"Error sending email: {str(e)}"
            print(error_msg)
            return error_msg
