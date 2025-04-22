const panelistRegistrationMail = (firstName, hackathonId) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to the Hackathon Judging Panel, ${firstName}!</h2>
        <p>You've been successfully added as a panelist for an upcoming hackathon.</p>
        <p><strong>Your Hackathon ID:</strong> <code>${hackathonId}</code></p>
        <p>Please keep this Hackathon ID safe. You'll need it to log in and evaluate teams.</p>
        <br/>
        <p>Best regards,<br/>Team HackManager</p>
      </div>
    `;
  };
  
  module.exports = panelistRegistrationMail;
  