-- CreateEnum
CREATE TYPE "Tone" AS ENUM ('CONCISE', 'IMPACT', 'LEADERSHIP');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "supabase_user_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "job_title" TEXT,
    "job_description" TEXT NOT NULL,
    "resume_original" TEXT NOT NULL,
    "resume_optimized" TEXT NOT NULL,
    "cover_letter" TEXT NOT NULL,
    "ats_score" INTEGER NOT NULL,
    "matched_keywords" JSONB NOT NULL,
    "missing_keywords" JSONB NOT NULL,
    "tone" "Tone" NOT NULL DEFAULT 'CONCISE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "stripe_subscription_id" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "generations_count" INTEGER NOT NULL DEFAULT 0,
    "exports_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_user_id_key" ON "users"("supabase_user_id");

-- CreateIndex
CREATE INDEX "generations_user_id_idx" ON "generations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "usage_user_id_date_idx" ON "usage"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "usage_user_id_date_key" ON "usage"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_stripe_event_id_key" ON "webhook_events"("stripe_event_id");

-- AddForeignKey
ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
