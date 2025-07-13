-- Sample data for testing the hackathon admin dashboard
-- This would be inserted into MongoDB, but shown as SQL for reference

-- Sample teams data structure:
{
  "team_name": "Code Crusaders",
  "team_size": 3,
  "idea_title": "AI-Powered Study Assistant",
  "idea_document_url": "https://docs.google.com/document/d/sample1",
  "participants": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "age": 22,
      "phone": "+1234567890",
      "student_or_professional": "Student",
      "college_or_company_name": "MIT",
      "github_profile": "https://github.com/johndoe",
      "linkedin_profile": "https://linkedin.com/in/johndoe",
      "devfolio_profile": "https://devfolio.co/@johndoe"
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "age": 21,
      "phone": "+1234567891",
      "student_or_professional": "Student",
      "college_or_company_name": "Stanford",
      "github_profile": "https://github.com/janesmith",
      "linkedin_profile": "https://linkedin.com/in/janesmith",
      "devfolio_profile": "https://devfolio.co/@janesmith"
    }
  ],
  "status": "registered",
  "selected": false,
  "createdAt": new Date()
}
