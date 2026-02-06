-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "birth_date" DATETIME,
    "age" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE TABLE "vacancies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "city" TEXT,
    "headcount" INTEGER NOT NULL DEFAULT 1,
    "deadline_at" DATETIME,
    "description" TEXT,
    "customer_contact_id" TEXT,
    "owner_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "vacancies_customer_contact_id_fkey" FOREIGN KEY ("customer_contact_id") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vacancies_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "candidates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contact_id" TEXT NOT NULL,
    "vacancy_id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "city_snapshot" TEXT,
    "primary_contact_at" DATETIME,
    "secondary_contact_at" DATETIME,
    "interview_planned_at" DATETIME,
    "interview_confirmed_at" DATETIME,
    "interview_actual_at" DATETIME,
    "feedback_at" DATETIME,
    "customer_interview_at" DATETIME,
    "offer_sent_at" DATETIME,
    "offer_accepted_at" DATETIME,
    "start_date_at" DATETIME,
    "hired_at" DATETIME,
    "probation_passed_at" DATETIME,
    "failed_at" DATETIME,
    "failed_reason_text" TEXT,
    "failed_stage_snapshot" TEXT,
    "derived_status" TEXT NOT NULL DEFAULT 'new',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "candidates_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "candidates_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "candidates_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSON NOT NULL DEFAULT '{}',
    "created_by_user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "timeline_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "contacts_phone_idx" ON "contacts"("phone");
CREATE INDEX "contacts_email_idx" ON "contacts"("email");
CREATE INDEX "vacancies_status_idx" ON "vacancies"("status");
CREATE INDEX "vacancies_owner_idx" ON "vacancies"("owner_user_id");
CREATE UNIQUE INDEX "candidates_contact_id_vacancy_id_key" ON "candidates"("contact_id", "vacancy_id");
CREATE INDEX "candidates_status_idx" ON "candidates"("derived_status");
CREATE INDEX "candidates_owner_idx" ON "candidates"("owner_user_id");
CREATE INDEX "candidates_vacancy_idx" ON "candidates"("vacancy_id");
CREATE INDEX "candidates_failed_idx" ON "candidates"("failed_at");
CREATE INDEX "timeline_entity_idx" ON "timeline_events"("entity_type", "entity_id", "created_at" DESC);
