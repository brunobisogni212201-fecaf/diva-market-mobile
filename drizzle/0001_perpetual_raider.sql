CREATE TABLE "deletion_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" text NOT NULL,
	"cpf" text,
	"reason" text,
	"status" text DEFAULT 'pending_review' NOT NULL,
	"ip_address" text,
	"requested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_url" text;