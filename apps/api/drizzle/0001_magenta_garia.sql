CREATE SCHEMA IF NOT EXISTS "example";

CREATE TABLE "example"."category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"org_id" text
);
--> statement-breakpoint
CREATE TABLE "example"."post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"org_id" text
);
--> statement-breakpoint
CREATE TABLE "example"."post_category" (
	"post_id" text,
	"category_id" text,
	"org_id" text
);
--> statement-breakpoint
ALTER TABLE "example"."category" ADD CONSTRAINT "category_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "core"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "example"."post" ADD CONSTRAINT "post_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "core"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "example"."post_category" ADD CONSTRAINT "post_category_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "example"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "example"."post_category" ADD CONSTRAINT "post_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "example"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "example"."post_category" ADD CONSTRAINT "post_category_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "core"."organization"("id") ON DELETE cascade ON UPDATE no action;