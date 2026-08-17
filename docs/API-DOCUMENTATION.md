# API Documentation

## Announcement Schema

| Field | Type | Required | Description |
|---|---|---|---|
| title | String | Yes | Announcement title |
| content | String | Yes | Announcement content |
| targetAudience | Enum | Yes | All, Students, Mentors, or SpecificBatch |
| batch | ObjectId | No | References Batch; used for SpecificBatch |
| publishDate | Date | Yes | Publication date |
| createdBy | ObjectId | Yes | References User who created it |

## Notification Schema

| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | User receiving the notification |
| type | Enum | Yes | NewAssignment, DeadlineApproaching, GradePosted, Announcement |
| message | String | Yes | Notification message |
| isRead | Boolean | Yes | Defaults to false |
| relatedId | ObjectId | No | Related Assignment, Submission, or Announcement |
| createdAt | Date | Yes | Creation date |

## Report Data Needs

- Total students, mentors, and batches
- Attendance percentage per batch and student over time
- Progress completion rate per topic and batch
- Assignment submission rate
- Average grade per assignment and batch
- At-risk students based on attendance, progress, and missed deadlines