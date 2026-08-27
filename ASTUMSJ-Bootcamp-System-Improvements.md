# ASTU MSJ BOOTCAMP MANAGEMENT SYSTEM
# FINAL 7-DAY SPRINT — DAY 2 TASK DIVISION

**Team:** Imran, Seid, Awel  
**Time remaining:** 6 days after today

## IMPORTANT

Day 1 foundations are already completed. **Do NOT repeat or rebuild Day 1 work.**

Day 2 must extend the existing working system while following:

- The existing SRS
- The existing project architecture
- The existing database/models
- Existing routes and APIs
- The existing UI
- The full bootcamp flow
- The Day 1 work already completed

Do not create a different architecture or remove working functionality.

---

# TODAY'S MAIN GOAL

### IMRAN
**Admin Assignment Management + Interview Workflow**

### SEID
**DSA Problem Tracking + CP/DSA Performance Foundation**

### AWEL
**Resource Upload Fix + Forgot Password + Security Hardening**

---

# ============================================================
# IMRAN — ADMIN ASSIGNMENTS + INTERVIEW WORKFLOW
# ============================================================

## Main objective

Continue the admission workflow from Day 1 and fix the assignment permission model.

The assignment business rule is:

### Admin

- Creates assignments
- Views assignments
- Updates assignments
- Deletes assignments

### Mentor

- Views relevant assignments
- Evaluates student submissions
- Does NOT create/update/delete assignments

### Student

- Views assignments
- Submits assignments

Do NOT remove existing mentor grading functionality.

---

## 1. Assignment CRUD authorization

Inspect the existing:

- Assignment model
- Assignment controller
- Assignment routes
- Role middleware
- Assignment frontend

Change the authorization so that assignment document CRUD belongs to Admin.

Conceptually:

    ADMIN
     ├── Create assignment
     ├── Read assignment
     ├── Update assignment
     └── Delete assignment

    MENTOR
     ├── View assignments
     └── Evaluate submissions

    STUDENT
     └── View assignments / submit work

Do not redesign the Assignment model unnecessarily.

---

## 2. Preserve the existing Assignment schema

Keep the existing Assignment structure and business decisions:

- title
- description
- instructions
- batch
- deadline
- maxScore
- createdBy
- timestamps

`maxScore` is NOT fixed to 100.

An assignment can have a maximum score such as:

    5
    10
    20
    30
    100

Do not change this rule.

---

## 3. Preserve Submission behavior

Mentors evaluate student submissions.

The Submission contains:

- assignment
- student
- githubUrl
- liveDemoUrl
- notes
- attachments
- score
- feedback
- status
- submittedAt
- gradedAt

The student is identified from authentication.

The student does NOT manually submit another student's ID.

The score is initially null and is provided by the mentor during grading.

---

# 4. Continue the admission/interview workflow

Day 1 established the registration/application foundation.

Continue the intended flow:

    Registration
         ↓
    Admin Review
         ↓
    Approved
         ↓
    Interview
         ↓
    Admin assigns mentor
         ↓
    Mentor interviews applicant
         ↓
    Mentor submits:
       - interview score
       - pass/fail recommendation
         ↓
    Admin reviews
         ↓
    FINAL PASS / FAIL

IMPORTANT:

**Mentor does NOT make the final admission decision.**

The Admin makes the final decision.

---

# 5. Mentor assignment

Implement the necessary backend functionality so:

    Admin
      ↓
    Select applicant
      ↓
    Assign mentor
      ↓
    Mentor sees assigned applicant

A mentor should only access applicants assigned to that mentor.

Do NOT create a teacher-management system.

Teachers/lecturers exist in the bootcamp, but teacher management is outside this task.

---

# 6. Mentor interview result

Implement the functionality required for the mentor to submit:

- Overall interview score
- Pass/fail recommendation

The mentor's result must NOT automatically authenticate the student.

Instead:

    Mentor recommendation
            ↓
    Admin review
            ↓
    Admin final decision

---

# 7. Admin final decision foundation

The eventual behavior is:

### PASS

- Admin marks applicant as passed
- Student account is created/authenticated
- Temporary password is generated
- Successful admission email is sent

### FAIL

- Admin marks applicant as failed
- Rejection email is sent

If the existing email infrastructure is already available, integrate with it.

If email infrastructure is not ready, implement the state transition cleanly and document the email dependency instead of creating a fake email system.

---

# 8. Testing

Test:

- Admin creates assignment → SUCCESS
- Mentor attempts assignment creation → FORBIDDEN
- Mentor evaluates submission → SUCCESS
- Student cannot modify assignment → FORBIDDEN
- Admin assigns applicant to mentor → SUCCESS
- Different mentor cannot access another mentor's applicant → FORBIDDEN
- Mentor submits interview result → SUCCESS
- Mentor cannot make final admission decision → FORBIDDEN
- Admin can make final admission decision → SUCCESS

---

# ============================================================
# SEID — DSA PROBLEM TRACKING + PERFORMANCE FOUNDATION
# ============================================================

## Main objective

Continue the Day 1 CP foundation and implement the foundation for the weekly DSA activity system.

Do NOT rebuild the Codeforces contest foundation.

The bootcamp has TWO related but separate systems:

### System 1 — Weekly CP Contest Leaderboard

Based on Codeforces contest results.

### System 2 — Overall Bootcamp Leaderboard

Eventually combines performance such as:

- Attendance
- DSA problems
- CP contests
- Web-development assignment grades

Do NOT treat these as the same leaderboard.

---

# 1. Weekly DSA workflow

Every week students:

    Learn DSA topic
         ↓
    Receive problem links
         ↓
    Solve problems
         ↓
    Push solutions to repository
         ↓
    Submit problem information
         ↓
    Record time taken

The expected target is approximately:

**10 problems + 1 contest per week.**

---

# 2. DSA problem submission foundation

Build the backend structure needed for students to submit individual problem records.

A problem submission should be associated with:

- Student
- Problem link
- Platform
- Time taken
- Solution repository/link
- Submission date

Student identity must come from authentication.

Do NOT allow students to submit records for another student.

---

# 3. Supported platforms

At minimum support:

- Codeforces
- LeetCode

Do not hardcode the system to only Codeforces.

---

# 4. Weekly tracking

The system must eventually be able to determine activity for a particular week.

Example:

    Week 1

    Student A → 10 problems
    Student B → 7 problems
    Student C → 3 problems

This information will later contribute to:

- Performance
- At-risk identification
- Overall leaderboard

Do NOT implement the final at-risk decision today.

---

# 5. Time tracking

Students submit the time they took to solve each problem.

Validate that:

- Invalid values are rejected
- Negative values are rejected
- Obviously invalid values are rejected

Do NOT attempt to automatically calculate solving time from Codeforces/LeetCode unless the API actually supports that requirement.

The student records the time.

---

# 6. Solution repository

Students are expected to create a repository and push their solutions.

Support the solution repository URL.

Do not impose a repository naming convention unless the existing SRS specifies one.

---

# 7. Codeforces handle

Registration includes the student's Codeforces handle.

The CP system must eventually use that existing handle to associate Codeforces contest results with the correct student.

The relationship should be:

    Student
      ├── Codeforces handle
      ├── LeetCode handle
      ├── DSA problem submissions
      └── Contest results

Do NOT create duplicate student identity fields.

---

# 8. Preserve Day 1 contest foundation

Use the contest foundation created on Day 1.

Verify that contest information can eventually be associated with the correct students through their Codeforces handles.

Do NOT rebuild the contest creation system.

---

# 9. Do NOT finalize the overall leaderboard formula

The eventual overall leaderboard will use the bootcamp's performance data.

Relevant dimensions include:

    Attendance
    DSA problems
    CP contests
    Web-development assignment grades

However, the exact weights/formula have not been finalized here.

**Do NOT invent percentages or weights.**

Today's goal is to make sure the required data exists and can be calculated later.

---

# 10. Testing

Test:

- Student submits a DSA problem → SUCCESS
- Student identity comes from JWT → SUCCESS
- Invalid problem data → REJECTED
- Negative solving time → REJECTED
- Student cannot submit for another student → FORBIDDEN
- Admin can view student activity → SUCCESS
- Mentor can view relevant student activity where permitted → SUCCESS
- Codeforces handle remains associated with the correct student → SUCCESS

---

# ============================================================
# AWEL — RESOURCE UPLOAD + FORGOT PASSWORD + SECURITY
# ============================================================

## Main objective

Fix the currently broken Resource upload system and implement the missing Forgot Password functionality while continuing security hardening.

Do NOT repeat Day 1 password implementation unless integration problems are discovered.

---

# 1. Fix Resource uploads

The report specifically identifies:

**Resource uploads are broken.**

Inspect:

- Resource model
- Resource controller
- Resource routes
- Upload middleware
- Cloudinary configuration
- Resource frontend form
- Axios/API request

Find the actual cause of the failure.

Do NOT replace the entire upload architecture without first understanding the current implementation.

---

# 2. Resource upload security

Verify:

- Authentication
- Authorization
- File size limits
- MIME validation
- Extension validation
- Storage configuration
- Cloudinary response
- Database URL
- Filename handling
- Error handling

Do not trust only the extension supplied by the browser.

---

# 3. Resource fields

The Resource system will eventually support:

- Thumbnail
- Resource link
- Downloadable file
- Resource details

Do not build the complete visual redesign today unless it is necessary to fix the upload flow.

---

# 4. Forgot Password

Implement the backend foundation for:

    Forgot password
          ↓
    User enters email
          ↓
    Secure reset token generated
          ↓
    Reset link sent by email
          ↓
    User opens reset link
          ↓
    New strong password
          ↓
    Password updated

It must support:

- Student
- Mentor
- Admin

---

# 5. Reset-token security

The reset token must:

- Expire
- Be single-use
- Not expose passwords
- Not expose sensitive user information

After successful password reset, the token must no longer work.

Prefer storing a hashed reset token rather than the raw token where compatible with the existing architecture.

---

# 6. Password policy

The existing Day 1 password policy remains:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

The same policy must apply to password resets.

---

# 7. Prevent account enumeration

The forgot-password response should not unnecessarily reveal whether an email belongs to an existing account.

Use a safe generic response where appropriate.

---

# 8. Security review of admission workflow

Coordinate with Imran.

### Public applicant

Can:

- Submit registration

Cannot:

- Approve themselves
- Assign themselves a mentor
- Change their application status
- Make themselves a Student
- Create an Admin account

### Mentor

Can:

- See assigned applicants
- Submit interview result

Cannot:

- Make final admission decisions
- Assign applicants
- Create Admin accounts

### Admin

Can:

- Review applicants
- Approve/reject applications
- Assign mentors
- Make final admission decisions
- Create another Admin

---

# 9. Testing

## Forgot password

Test:

- Valid email
- Unknown email
- Expired token
- Reused token
- Invalid token
- Weak new password
- Strong new password

## Resource upload

Test:

- Valid file
- Invalid extension
- Invalid MIME type
- Oversized file
- Unauthorized upload
- Successful Cloudinary upload
- Database record creation

---

# ============================================================
# SHARED INTEGRATION REQUIREMENTS
# ============================================================

Because Day 2 features depend on Day 1 work, do not modify shared models or APIs without coordination.

## Imran ↔ Seid

Registration already includes:

- Codeforces handle
- LeetCode handle

Seid must use these existing student fields.

Do NOT create duplicate identity fields.

---

## Imran ↔ Awel

The admission flow is:

    Applicant
       ↓
    Admin
       ↓
    Mentor
       ↓
    Admin
       ↓
    Student

Awel must ensure authorization prevents users from bypassing this flow.

---

## Seid ↔ Imran

DSA activity and contest results will eventually contribute to overall student performance.

Do NOT create duplicate Student records.

---

# ============================================================
# SHARED RULES
# ============================================================

## Before coding

Each person must:

1. Pull the latest main.
2. Inspect the existing implementation.
3. Create a feature branch.
4. Identify files that will be modified.
5. Check whether another member is modifying the same files.

---

## Shared files

Be careful with:

- routes/index.js
- App.jsx
- AppRoutes.jsx
- AuthContext
- User model
- shared middleware
- shared API utilities
- shared CSS/components

If a shared file must be changed, communicate first.

---

## No destructive changes

Do NOT:

- Delete working features
- Replace working models unnecessarily
- Rewrite authentication unnecessarily
- Change existing API responses without a reason
- Change database fields used by existing features without checking dependencies

---

## Testing requirement

Every backend feature must be tested through:

- Postman
- Existing automated tests where available

Every frontend feature must be tested in the browser.

At minimum test:

- Happy path
- Invalid input
- Unauthorized access
- Empty data
- Error state

---

# ============================================================
# DAY 2 DEFINITION OF DONE
# ============================================================

## IMRAN

- [ ] Assignment CRUD restricted to Admin
- [ ] Mentor retains grading/evaluation ability
- [ ] Student retains assignment viewing/submission ability
- [ ] Admin can assign applicants to mentors
- [ ] Mentor can access assigned applicants
- [ ] Mentor can submit interview score/recommendation
- [ ] Admin final decision foundation implemented
- [ ] Existing Day 1 registration functionality preserved
- [ ] APIs tested

---

## SEID

- [ ] DSA problem tracking foundation implemented
- [ ] Student identity comes from authentication
- [ ] Codeforces supported
- [ ] LeetCode supported
- [ ] Problem URL stored
- [ ] Solution repository stored
- [ ] Time taken stored
- [ ] Weekly activity can be identified
- [ ] Codeforces handle connected to student
- [ ] Day 1 contest foundation preserved
- [ ] APIs tested

---

## AWEL

- [ ] Resource upload issue investigated
- [ ] Resource upload fixed
- [ ] Upload security verified
- [ ] Cloudinary/storage integration verified
- [ ] Forgot-password endpoint implemented
- [ ] Reset-token security implemented
- [ ] Password reset uses strong-password rules
- [ ] Token expiry/single-use behavior tested
- [ ] Admission-flow RBAC reviewed
- [ ] Upload + password recovery tested

---

# ============================================================
# END-OF-DAY REPORT
# ============================================================

Before finishing Day 2, each person must provide:

    Completed:
    Files changed:
    Tests performed:
    Problems/blockers:
    Dependencies on teammates:
    Branch:
    Commit:
    PR:

---

# MOST IMPORTANT

**Do NOT repeat Day 1.**

Day 1 established the foundations.

Day 2 turns those foundations into working functionality.

If a requirement is unclear:

1. Stop.
2. Tell the team.
3. Check the existing SRS and implementation.
4. Coordinate with the relevant teammate.
5. Do not invent a new business rule.

We have limited time remaining.

**Working, integrated, tested features are more important than unnecessary refactoring.**