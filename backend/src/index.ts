import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const STATUS_STEPS: Array<{ field: string; status: string }> = [
  { field: "probation_passed_at", status: "probation_passed" },
  { field: "hired_at", status: "hired" },
  { field: "start_date_at", status: "hired" },
  { field: "offer_accepted_at", status: "offer_accepted" },
  { field: "offer_sent_at", status: "offer_sent" },
  { field: "customer_interview_at", status: "customer_interview" },
  { field: "feedback_at", status: "feedback" },
  { field: "interview_actual_at", status: "interview_done" },
  { field: "interview_confirmed_at", status: "interview_confirmed" },
  { field: "interview_planned_at", status: "interview_planned" },
  { field: "secondary_contact_at", status: "secondary_contact" },
  { field: "primary_contact_at", status: "primary_contact" },
];

const CANDIDATE_TRIGGER_FIELDS = STATUS_STEPS.map((s) => s.field);

const normalizePhone = (phone?: string | null) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
};

const normalizeEmail = (email?: string | null) => {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return normalized || null;
};

const toDateOrNull = (value: unknown) => {
  if (value === null) return null;
  if (value === undefined) return undefined;
  return new Date(String(value));
};

const computeDerivedStatus = (candidate: Record<string, unknown>) => {
  for (const step of STATUS_STEPS) {
    if (candidate[step.field]) {
      return step.status;
    }
  }
  return "new";
};

const getCurrentUserId = async (req: express.Request) => {
  const fromHeader = req.header("x-user-id");
  if (fromHeader) return fromHeader;
  const firstUser = await prisma.users.findFirst({ orderBy: { created_at: "asc" } });
  return firstUser?.id ?? null;
};

const writeTimeline = async (data: {
  entity_type: string;
  entity_id: string;
  event_type: string;
  payload: object;
  created_by_user_id?: string | null;
}) => {
  return prisma.timeline_events.create({
    data: {
      ...data,
      created_by_user_id: data.created_by_user_id ?? null,
    },
  });
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/contacts", async (req, res) => {
  const search = String(req.query.search || "").trim();
  const contacts = await prisma.contacts.findMany({
    where: search
      ? {
          OR: [
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { middle_name: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { created_at: "desc" },
  });
  res.json(contacts);
});

app.post("/contacts", async (req, res) => {
  const body = req.body ?? {};
  const created = await prisma.contacts.create({
    data: {
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name ?? null,
      phone: normalizePhone(body.phone),
      email: normalizeEmail(body.email),
      city: body.city ?? null,
      birth_date: toDateOrNull(body.birth_date),
      age: body.age ?? null,
    },
  });
  res.status(201).json(created);
});

app.get("/contacts/:id", async (req, res) => {
  const contact = await prisma.contacts.findUnique({ where: { id: req.params.id } });
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
});

app.patch("/contacts/:id", async (req, res) => {
  const body = req.body ?? {};
  const updated = await prisma.contacts.update({
    where: { id: req.params.id },
    data: {
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      phone: body.phone !== undefined ? normalizePhone(body.phone) : undefined,
      email: body.email !== undefined ? normalizeEmail(body.email) : undefined,
      city: body.city,
      birth_date: toDateOrNull(body.birth_date),
      age: body.age,
    },
  });
  res.json(updated);
});

app.get("/contacts/:id/timeline", async (req, res) => {
  const items = await prisma.timeline_events.findMany({
    where: { entity_type: "contact", entity_id: req.params.id },
    orderBy: { created_at: "desc" },
  });
  res.json(items);
});

app.get("/users", async (_req, res) => res.json(await prisma.users.findMany({ orderBy: { created_at: "desc" } })));
app.post("/users", async (req, res) => {
  const body = req.body ?? {};
  const user = await prisma.users.create({
    data: {
      full_name: body.full_name,
      role: body.role,
      phone: normalizePhone(body.phone),
      email: normalizeEmail(body.email),
    },
  });
  res.status(201).json(user);
});
app.get("/users/:id", async (req, res) => {
  const user = await prisma.users.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
app.patch("/users/:id", async (req, res) => {
  const body = req.body ?? {};
  const user = await prisma.users.update({
    where: { id: req.params.id },
    data: {
      full_name: body.full_name,
      role: body.role,
      phone: body.phone !== undefined ? normalizePhone(body.phone) : undefined,
      email: body.email !== undefined ? normalizeEmail(body.email) : undefined,
    },
  });
  res.json(user);
});

app.get("/vacancies", async (req, res) => {
  const where: Record<string, unknown> = {};
  if (req.query.status) where.status = String(req.query.status);
  if (req.query.owner) where.owner_user_id = String(req.query.owner);
  const vacancies = await prisma.vacancies.findMany({ where, orderBy: { created_at: "desc" } });
  res.json(vacancies);
});

app.post("/vacancies", async (req, res) => {
  const body = req.body ?? {};
  const vacancy = await prisma.vacancies.create({
    data: {
      title: body.title,
      status: body.status,
      priority: body.priority,
      city: body.city ?? null,
      headcount: body.headcount ?? 1,
      deadline_at: toDateOrNull(body.deadline_at),
      description: body.description ?? null,
      customer_contact_id: body.customer_contact_id ?? null,
      owner_user_id: body.owner_user_id ?? null,
    },
  });
  res.status(201).json(vacancy);
});

app.get("/vacancies/:id", async (req, res) => {
  const vacancy = await prisma.vacancies.findUnique({ where: { id: req.params.id } });
  if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
  res.json(vacancy);
});

app.patch("/vacancies/:id", async (req, res) => {
  const body = req.body ?? {};
  const vacancy = await prisma.vacancies.update({
    where: { id: req.params.id },
    data: {
      title: body.title,
      status: body.status,
      priority: body.priority,
      city: body.city,
      headcount: body.headcount,
      deadline_at: toDateOrNull(body.deadline_at),
      description: body.description,
      customer_contact_id: body.customer_contact_id,
      owner_user_id: body.owner_user_id,
    },
  });
  res.json(vacancy);
});

app.get("/vacancies/:id/candidates", async (req, res) => {
  const candidates = await prisma.candidates.findMany({
    where: { vacancy_id: req.params.id },
    orderBy: { created_at: "desc" },
    include: { contact: true },
  });
  res.json(candidates);
});

app.get("/candidates", async (req, res) => {
  const where: Record<string, unknown> = {};
  if (req.query.status) where.derived_status = String(req.query.status);
  if (req.query.owner) where.owner_user_id = String(req.query.owner);
  if (req.query.vacancy) where.vacancy_id = String(req.query.vacancy);
  if (req.query.failed === "true") where.failed_at = { not: null };
  if (req.query.failed === "false") where.failed_at = null;

  const search = String(req.query.search || "").trim();
  if (search) {
    where.OR = [
      { contact: { first_name: { contains: search } } },
      { contact: { last_name: { contains: search } } },
      { contact: { email: { contains: search } } },
      { contact: { phone: { contains: search } } },
    ];
  }

  const candidates = await prisma.candidates.findMany({
    where,
    include: { contact: true, vacancy: true },
    orderBy: { created_at: "desc" },
  });
  res.json(candidates);
});

app.post("/candidates", async (req, res) => {
  const body = req.body ?? {};
  const currentUserId = await getCurrentUserId(req);
  if (!currentUserId) return res.status(400).json({ message: "No current user. Pass x-user-id header or create a user." });

  const candidate = await prisma.candidates.create({
    data: {
      contact_id: body.contact_id,
      vacancy_id: body.vacancy_id,
      owner_user_id: currentUserId,
      city_snapshot: body.city_snapshot ?? null,
      derived_status: "new",
    },
  });

  await writeTimeline({
    entity_type: "candidate",
    entity_id: candidate.id,
    event_type: "system",
    payload: {
      action: "created",
      contact_id: candidate.contact_id,
      vacancy_id: candidate.vacancy_id,
      owner_user_id: candidate.owner_user_id,
    },
    created_by_user_id: currentUserId,
  });

  res.status(201).json(candidate);
});

app.get("/candidates/:id", async (req, res) => {
  const candidate = await prisma.candidates.findUnique({ where: { id: req.params.id } });
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });
  res.json(candidate);
});

app.patch("/candidates/:id", async (req, res) => {
  const body = req.body ?? {};
  const currentUserId = await getCurrentUserId(req);
  const before = await prisma.candidates.findUnique({ where: { id: req.params.id } });
  if (!before) return res.status(404).json({ message: "Candidate not found" });

  const updates: Record<string, unknown> = {
    city_snapshot: body.city_snapshot,
  };
  for (const field of CANDIDATE_TRIGGER_FIELDS) {
    if (body[field] !== undefined) updates[field] = toDateOrNull(body[field]);
  }

  const projected = { ...before, ...updates } as Record<string, unknown>;
  const nextDerived = computeDerivedStatus(projected);
  updates.derived_status = nextDerived;

  const updated = await prisma.candidates.update({ where: { id: req.params.id }, data: updates });

  for (const field of CANDIDATE_TRIGGER_FIELDS) {
    if (updates[field] !== undefined && before[field as keyof typeof before] !== updated[field as keyof typeof updated]) {
      await writeTimeline({
        entity_type: "candidate",
        entity_id: updated.id,
        event_type: "field_change",
        payload: { field, from: before[field as keyof typeof before], to: updated[field as keyof typeof updated] },
        created_by_user_id: currentUserId,
      });
    }
  }

  if (before.derived_status !== updated.derived_status) {
    await writeTimeline({
      entity_type: "candidate",
      entity_id: updated.id,
      event_type: "status_derived",
      payload: { from: before.derived_status, to: updated.derived_status },
      created_by_user_id: currentUserId,
    });
  }

  res.json(updated);
});

app.post("/candidates/:id/fail", async (req, res) => {
  const reason = String(req.body?.reason || "").trim();
  if (!reason) return res.status(400).json({ message: "reason is required" });

  const currentUserId = await getCurrentUserId(req);
  const candidate = await prisma.candidates.findUnique({ where: { id: req.params.id } });
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  const failed = await prisma.candidates.update({
    where: { id: req.params.id },
    data: {
      failed_at: new Date(),
      failed_reason_text: reason,
      failed_stage_snapshot: candidate.derived_status,
    },
  });

  await writeTimeline({
    entity_type: "candidate",
    entity_id: candidate.id,
    event_type: "failure",
    payload: { reason, stage_snapshot: candidate.derived_status },
    created_by_user_id: currentUserId,
  });

  res.json(failed);
});

app.get("/candidates/:id/timeline", async (req, res) => {
  const events = await prisma.timeline_events.findMany({
    where: { entity_type: "candidate", entity_id: req.params.id },
    orderBy: { created_at: "desc" },
  });
  res.json(events);
});

app.get("/candidates/:id/related", async (req, res) => {
  const candidate = await prisma.candidates.findUnique({ where: { id: req.params.id } });
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  const related = await prisma.candidates.findMany({
    where: { contact_id: candidate.contact_id, id: { not: candidate.id } },
    include: { vacancy: true },
    orderBy: { created_at: "desc" },
  });
  res.json(related);
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
