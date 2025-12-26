CREATE TABLE "scans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"image_url" varchar(255) NOT NULL,
	"analysis" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
