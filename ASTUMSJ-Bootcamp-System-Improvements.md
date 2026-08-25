# ASTU MSJ Bootcamp Management System
# FINAL 7-DAY SPRINT — DAY 1 TASK DIVISION

Team: Imran, Seid, Awel
Time remaining: 1 week before submission

## IMPORTANT RULES FOR THIS FINAL WEEK

1. We are NOT rebuilding the existing system.
2. We are extending/fixing the current working system.
3. Follow the existing SRS, current project architecture, existing database models, routes, APIs, and UI.
4. Do NOT create a completely different architecture.
5. Do NOT implement features that are assigned to another member unless coordination is required.
6. If your task depends on another member's work, communicate before changing shared files/models.
7. Do NOT remove working functionality just to implement a new feature.
8. Every feature must be tested before considering it complete.
9. Use feature branches:
   feature/<short-description>
10. No direct commits to main.
11. Open a PR after finishing your assigned work.
12. If you discover an existing bug outside your task, report it instead of silently changing unrelated code.

---

# TODAY'S MAIN GOAL

Today we are establishing the foundations for the major missing features.

Today's work is divided into:

- IMRAN → Registration + Admin workflow foundation
- SEID → CP Contest + Codeforces foundation
- AWEL → Security + Authentication foundation

The three tasks are related, but each person owns a different part.

---

# ============================================================
# IMRAN — ADMIN / REGISTRATION / INTERVIEW FOUNDATION
# ============================================================

## Main objective

Start implementing the new bootcamp admission flow:

Registration
→ Admin Review
→ Interview
→ Admin Final Decision
→ Student Authentication

Today you are NOT required to finish the entire flow.

Today's goal is to establish the backend/data foundation and admin-side foundation so that the rest can be completed during the next days.

---

## 1. Understand the registration flow

The registration process is NOT the same as creating a normal authenticated Student account.

A person first applies through the public registration form.

The flow is:

    Public Registration
            ↓
    Admin Review
       ↓         ↓
    Approved    Rejected
       ↓           ↓
    Interview    Rejection Email
       ↓
    Mentor Interview
       ↓
    Mentor submits:
    - Interview score
    - Pass/Fail recommendation
       ↓
    Admin makes FINAL decision
       ↓
    PASS                FAIL
      ↓                   ↓
    Student account     Rejection Email
    created
      ↓
    Temporary password
    sent by email
      ↓
    Student logs in
      ↓
    Student changes password

IMPORTANT:

- Mentor does NOT make the final admission decision.
- Mentor only interviews assigned applicants and submits the interview result.
- Admin makes the final decision.
- An applicant must NOT automatically become a Student simply because a mentor marked them as passed.

---

# 2. Registration information

The registration form must support these fields:

### Required

- name
- email
- academic year
- department
- gender
- daily time commitment
- motivation

### Optional

- Codeforces handle
- LeetCode handle
- GitHub link

### Daily time commitment

This is REQUIRED.

Minimum:

    5 hours/day

The system must reject a value below 5 hours.

The motivation field is also required.

The applicant is expected to write the motivation themselves; do not build an AI-generated motivation feature.

---

# 3. Decide/implement the applicant data structure

Inspect the existing User model first.

Do NOT blindly put all registration fields into User if that would mix applicants with authenticated users.

The important distinction is:

    Applicant ≠ authenticated Student

Use the existing project architecture and SRS to determine whether a separate registration/application model is appropriate.

If a new model is required, follow the existing naming conventions.

The application data must be capable of representing the registration lifecycle.

At minimum, we need to be able to know:

- applicant information
- registration status
- whether admin approved/rejected the application
- interview status
- assigned mentor
- interview score
- mentor's recommendation
- final admin decision

Do not invent unnecessary fields.

---

# 4. Registration status

The application needs a clear lifecycle.

The intended states are conceptually:

    Registered
    ↓
    Admin Review
    ↓
    Approved → Interview
    OR
    Rejected

Then:

    Interview
    ↓
    Mentor evaluation
    ↓
    Admin final decision
    ↓
    Passed / Failed

Use the project's existing conventions for status values.

Do not create multiple overlapping status fields if one well-designed status structure is enough.

---

# 5. Admin registration API foundation

Create the backend foundation needed for the Admin to manage applications.

The Admin must eventually be able to:

- View applications
- View application details
- Approve application
- Reject application
- Move approved applicants to interview
- Assign a mentor

For TODAY:

Focus on the model + controller/routes foundation.

Do not spend the whole day building a polished UI.

---

# 6. Mentor assignment foundation

The Admin is responsible for assigning applicants to mentors.

The intended relationship is:

    Applicant
       ↓
    assigned mentor
       ↓
    Mentor interviews applicant

Make sure the data structure supports this.

Do NOT create a teacher-management system.

Teachers/lecturers exist in the bootcamp, but teacher management is NOT part of this current task.

---

# 7. Today's API endpoints

Follow the existing route structure.

The exact endpoint names should follow the current project conventions.

Conceptually, we need endpoints for:

    GET    applications
    GET    application/:id
    PUT/PATCH application/:id/approve
    PUT/PATCH application/:id/reject
    PUT/PATCH application/:id/assign-mentor

Do NOT blindly copy these exact routes if the existing project uses another convention.

Inspect the current routes first.

---

# 8. Admin authorization

Only Admin should be able to:

- View/manage all applications
- Approve/reject applications
- Assign mentors
- Make final admission decisions

Do not remove authentication/authorization just to make testing easier.

Use the existing auth/RBAC system.

---

# 9. What should be completed today

By the end of today you should have:

- Registration/application data structure
- Required registration fields
- 5-hour minimum validation
- Application status structure
- Admin application controller foundation
- Admin application routes
- Mentor assignment foundation
- RBAC protection for admin actions
- Basic API testing

---

# 10. Testing for Imran

Test at minimum:

### Valid registration

Should succeed.

### Missing required field

Should fail.

### Daily time < 5 hours

Should fail.

### Daily time = 5 hours

Should succeed.

### Optional Codeforces handle missing

Should still succeed.

### Optional GitHub missing

Should still succeed.

### Student attempting admin application management

Should return unauthorized/forbidden.

### Mentor attempting admin application approval

Should return unauthorized/forbidden.

---

# 11. Do NOT implement today

Do NOT spend today's time on:

- CP leaderboard
- Codeforces API
- Resource thumbnails
- Reports
- Attendance redesign
- Forgot password
- Security audit
- Student dashboard
- Full interview UI
- Final email flow

Those belong to later work or another member.

---

# ============================================================
# SEID — CP CONTEST + CODEFORCES FOUNDATION
# ============================================================

## Main objective

Build the foundation for the bootcamp's weekly Competitive Programming system.

You are the owner of this area because you have strong CP experience.

The system needs to support TWO different concepts:

1. Weekly CP Contest Leaderboard
2. Overall Bootcamp Leaderboard

DO NOT treat them as the same leaderboard.

---

# 1. Understand the CP flow

Every week:

    Admin teaches/organizes the bootcamp activity
             ↓
    Admin creates a bootcamp CP contest
             ↓
    Admin chooses problems
             ↓
    Admin sets contest details/time
             ↓
    Students participate
             ↓
    Codeforces records results
             ↓
    Our system fetches the results
             ↓
    Our own website displays the leaderboard

The contest is for the bootcamp students.

It is not a generic Codeforces contest browser.

---

# 2. Codeforces handles

Students provide their Codeforces handle during registration.

That handle will later be used to associate the Codeforces participant with the corresponding Student account.

Example:

    Student:
    Imran

    Codeforces handle:
    imran123

Our system must be able to identify that Codeforces participant as Imran.

Do NOT rely on students manually entering their contest score.

---

# 3. Contest data foundation

Inspect the current project before creating anything.

Create the necessary backend structure for bootcamp contests.

The system needs to represent information such as:

- Contest name
- Codeforces contest ID
- Contest URL
- Contest date/time
- Duration
- Problems
- Admin who created the contest
- Contest status

Use the existing project conventions.

Do not add unnecessary fields.

---

# 4. Admin contest creation foundation

The Admin must eventually be able to create a weekly contest.

The concept is:

    Admin
      ↓
    Create Contest
      ↓
    Enter/select Codeforces contest information
      ↓
    Save contest
      ↓
    Students can view contest

Today focus on the backend/model/API foundation.

The polished UI can come later.

---

# 5. Codeforces integration research + foundation

Investigate the Codeforces API/endpoints that are actually appropriate for retrieving contest results.

We need to eventually retrieve information such as:

- Participant handle
- Rank
- Points/score
- Problems solved
- Contest result

Do not scrape HTML if the official API provides the required information.

Do not hardcode leaderboard results.

Do not manually store screenshots.

The whole purpose of this feature is to replace the current process:

    Admin takes screenshot of Codeforces leaderboard
            ↓
    Sends screenshot to Telegram

with:

    Codeforces results
            ↓
    Our backend
            ↓
    Our leaderboard page

---

# 6. Handle edge cases

Today, investigate how the system should behave when:

- Contest has not started
- Contest is still running
- Contest has finished
- Codeforces API is unavailable
- Student has no Codeforces handle
- Handle is invalid
- Student did not participate
- Codeforces returns no results

Do not allow an external API failure to crash the entire application.

---

# 7. CP leaderboard foundation

Do NOT build the complete final leaderboard today.

Create the foundation required for:

    Contest
       ↓
    Codeforces contest ID
       ↓
    Codeforces results
       ↓
    CP leaderboard

The final UI and overall scoring integration will come later.

---

# 8. DSA problem tracking awareness

The bootcamp also requires students to solve DSA problems every week.

The expected activity is approximately:

- At least 10 problems/week
- Problems can come from Codeforces/LeetCode
- Students submit the problem links
- Students record the time taken
- Students push their solutions to a repository

This is separate from the weekly CP contest.

Do not accidentally merge:

    DSA problem submission

with:

    CP contest participation

They are related to the overall performance system but are separate activities.

---

# 9. Today's testing

Test the contest foundation with sample data.

Verify:

- Admin can create a contest
- Unauthorized users cannot create contests
- Contest information is saved correctly
- Codeforces contest ID is stored correctly
- Student Codeforces handle can be associated later
- Invalid contest data is rejected
- API failure is handled safely

---

# 10. Do NOT implement today

Do NOT spend today's time on:

- Final overall leaderboard formula
- Attendance calculation
- Reports
- Registration workflow
- Password system
- Resource uploads
- Admin creation
- Mentor interview system

Those are handled separately.

---

# ============================================================
# AWEL — SECURITY + AUTHENTICATION FOUNDATION
# ============================================================

## Main objective

Audit and harden the existing security/authentication system before we add more sensitive workflows.

You are the owner of security-related work.

Do NOT rewrite authentication unless the current implementation actually requires it.

---

# 1. Strong password policy

Implement the required password policy.

Password must contain:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

This should be validated whenever a user creates or changes a password.

This applies to:

- Student
- Mentor
- Admin

---

# 2. Inspect current authentication

Review the existing:

- Auth controller
- User model
- Password hashing
- JWT generation
- Auth middleware
- Role middleware
- Protected routes

Do not remove protect/authorize middleware simply because Postman testing is inconvenient.

Use valid authentication tokens during testing.

---

# 3. RBAC audit

Verify that roles are properly enforced.

At minimum:

    Admin
    Mentor
    Student

Test that each role can only perform the actions it is supposed to perform.

Pay particular attention to the new workflows because they contain sensitive actions.

---

# 4. Prevent privilege escalation

The client must NOT be able to simply send:

    role: "admin"

and turn themselves into an admin.

Check user creation/update endpoints for mass-assignment problems.

Role changes must be controlled by the appropriate authorized operation.

---

# 5. Registration security

Coordinate with Imran.

The registration system will accept public user input.

Review it for:

- Required-field validation
- Invalid input
- Duplicate email
- Malicious values
- Unauthorized status changes
- Unauthorized mentor assignment
- Unauthorized approval/rejection

The public registration endpoint must NOT allow someone to create an authenticated Admin/Mentor/Student account directly.

---

# 6. File upload security foundation

Review the current upload implementation because resource uploads are currently broken.

Check:

- Allowed file types
- File size limits
- MIME validation
- Extension validation
- Storage configuration
- Unauthorized uploads
- File naming
- Path traversal concerns
- Authentication/authorization

Do not trust the filename extension alone.

Coordinate with Imran because he will work on the Resource UI.

---

# 7. Error handling

Review the current API error behavior.

Make sure sensitive information is not leaked through errors.

For example, don't expose:

- Password hashes
- Secrets
- JWT secrets
- Internal stack traces in production
- Database connection details

---

# 8. Today's security tests

Test:

### Authentication

- No token
- Invalid token
- Expired token
- Valid token

### Authorization

- Student → Admin endpoint ❌
- Mentor → Admin endpoint ❌
- Student → Mentor endpoint ❌
- Admin → Admin endpoint ✅

### Password

Test:

    abc123
    → reject

    Password1
    → reject if no special character

    password!
    → reject if no uppercase/number

    Password1!
    → accept

### Privilege escalation

Attempt to create/update a user with:

    role: "admin"

from an unauthorized account.

It must fail.

---

# 9. Do NOT implement today

Do NOT spend today's time on:

- CP leaderboard
- Registration UI
- Reports
- Attendance
- Resource UI
- Recent activities
- Mentor dashboard
- Landing page
- Contest scoring

Those belong to other tasks/days.

---

# ============================================================
# SHARED RULES BETWEEN ALL THREE
# ============================================================

## 1. Before coding

Each person must:

1. Pull the latest main.
2. Inspect the existing implementation.
3. Create a feature branch.
4. Identify files that will be modified.
5. Check whether another member is modifying the same files.

---

# 2. Shared files

Be careful with:

- routes/index.js
- App.jsx
- AppRoutes.jsx
- AuthContext
- User model
- shared middleware
- shared API utilities
- shared CSS/components

If you need to modify a shared file, communicate first.

---

# 3. No destructive changes

Do NOT:

- Delete working features
- Replace working models unnecessarily
- Rewrite authentication unnecessarily
- Change existing API responses without a reason
- Change database fields used by existing features without checking dependencies

---

# 4. Testing requirement

Every completed backend feature must be tested through:

- Postman
- Existing tests where available

Every frontend feature must be tested in the browser.

At minimum verify:

- Happy path
- Invalid input
- Unauthorized access
- Empty data
- Error state

---

# 5. End-of-day report

Before finishing today, each person sends:

### Completed
- What was implemented

### Files changed
- Exact files modified/created

### Testing
- What was tested
- Result

### Problems
- Any blocker
- Any dependency on another member

### Commit
- Branch name
- Commit message
- PR status

Example:

    Branch:
    feature/registration-foundation

    Commit:
    feat: add registration application foundation

---

# ============================================================
# DAY 1 DEFINITION OF DONE
# ============================================================

## IMRAN

[ ] Registration/application foundation exists
[ ] All registration fields are supported
[ ] Daily commitment minimum 5 hours enforced
[ ] Applicant status lifecycle foundation exists
[ ] Admin application API foundation exists
[ ] Admin can approve/reject through protected API
[ ] Admin can assign mentor through protected API
[ ] Unauthorized roles are rejected
[ ] Basic Postman testing completed

---

## SEID

[ ] CP contest foundation exists
[ ] Codeforces contest ID can be stored
[ ] Contest information can be created by Admin
[ ] Codeforces API approach identified/implemented at foundation level
[ ] Student Codeforces handle can be associated
[ ] CP result data structure is understood
[ ] API failure/invalid data cases considered
[ ] Basic testing completed

---

## AWEL

[ ] Strong password policy implemented
[ ] Existing authentication audited
[ ] RBAC audited
[ ] Privilege escalation checked
[ ] Registration security reviewed
[ ] Upload security reviewed
[ ] Sensitive error exposure checked
[ ] Authentication/RBAC tests completed

---

# MOST IMPORTANT

Today's objective is NOT to finish the entire new system.

Today's objective is to create solid foundations so that Days 2–6 can be implemented quickly without having to rewrite today's work.

If you encounter a requirement that is unclear:

1. Stop.
2. Tell the team.
3. Check the existing SRS/current implementation.
4. Do not invent a new business rule.

We have only one week left, so correctness and integration are more important than unnecessary refactoring.