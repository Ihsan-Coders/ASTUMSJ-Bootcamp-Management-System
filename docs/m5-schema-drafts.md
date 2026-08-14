# M5 — Bonus Feature Schema Drafts (Day 1 — Planning Only)

These are **drafts for team review today**, not final code. Real Mongoose models get
written on the day each feature is built (Resource: Day 3, Badge/MentorNote: Day 4,
Alumni: Day 3). Sharing them now so M1/M2 can confirm the `User`/`Batch`/`Attendance`
references line up before I code against them.

---

## Resource (Resource Library)

```
Resource {
  title: String
  description: String
  type: enum ["Link", "Document", "Video"]
  url: String
  fileAttachment: { url: String, filename: String }   // optional, if uploaded not linked
  topic: String        // e.g. "React" — reuse M2's Progress topic list for consistency
  batch: ObjectId (ref: Batch, optional — null = visible to all batches)
  uploadedBy: ObjectId (ref: User)
  createdAt: Date
}
```

**To confirm with team:** topic values should match whatever list M2 uses for `Progress.topic`
so the two features stay consistent (e.g. both use "HTML/CSS", "JavaScript", "React", "Node.js"...).

---

## Badge (Achievement Badges)

```
Badge {
  student: ObjectId (ref: User)
  type: enum ["PerfectAttendance", "TopScorer", "FastSubmitter", "ConsistentPerformer"]
  title: String
  description: String
  awardedAt: Date
  relatedData: Mixed   // optional context, e.g. { batchId, weekRange }
}
```

**To confirm with M2:** the badge rules engine (built Day 4) needs to query Attendance
records to check things like "2 weeks 100% attendance" — need M2's exact `Attendance`
field names (`status`, `date`, `student`) confirmed before I write `badge.service.js`.

**To confirm with M3:** "TopScorer"/"FastSubmitter" badges read `Submission.score` and
`Submission.submittedAt` vs `Assignment.deadline` — need those field names confirmed too.

---

## MentorNote (Private mentor notes on students)

```
MentorNote {
  student: ObjectId (ref: User)
  mentor: ObjectId (ref: User)
  batch: ObjectId (ref: Batch)
  note: String
  isPrivate: Boolean (default: true)   // must NEVER be exposed on student-facing routes
  createdAt: Date
}
```

**Security note for whoever builds the route:** any GET endpoint for `MentorNote` must
check `req.user.role !== 'student'` — this is private-by-design, not just a UI hide.

---

## AlumniProfile (Public alumni page)

```
AlumniProfile {
  student: ObjectId (ref: User)
  batch: ObjectId (ref: Batch)
  graduationDate: Date
  currentRole: String        // optional, e.g. "Frontend Developer at X"
  testimonial: String        // optional
  photoUrl: String           // optional
  isPublic: Boolean (default: true)
}
```

**To confirm with M1:** this is populated by Admin after a batch completes — needs an
Admin-only "convert student to alumni" action, likely in `user.controller.js` or its own
`alumni.controller.js` — decide which on the day this gets built.

---

## Open questions to raise in today's team sync

1. What exact `topic` values will `Progress` use? (needed for Resource Library filtering)
2. Confirm `Attendance` and `Submission` field names before Day 4 (badge rules engine).
3. Who owns "mark student as alumni" — Admin action in M1's user controller, or a
   separate M5-owned endpoint?
