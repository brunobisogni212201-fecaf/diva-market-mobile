CREATE TABLE "consent_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"consent_type" text NOT NULL,
	"version" text NOT NULL,
	"ip_address" text,
	"accepted_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;