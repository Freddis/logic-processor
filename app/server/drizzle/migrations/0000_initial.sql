--> commented out since drizzle creates this schema when it creates migration table for itself
-- CREATE SCHEMA "logic_constructor";
--> statement-breakpoint
CREATE TABLE "logic_constructor"."components" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logic_constructor"."components_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" integer NOT NULL,
	"componentid" integer,
	"label" varchar NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "logic_constructor"."connections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logic_constructor"."connections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" integer NOT NULL,
	"inputX" integer NOT NULL,
	"inputY" integer NOT NULL,
	"inputJointId" integer,
	"inputComponentId" integer,
	"inputConnectorId" integer,
	"inpuitConnectorPosition" integer,
	"outputX" integer NOT NULL,
	"outputY" integer NOT NULL,
	"outputJointId" integer,
	"outputComponentId" integer,
	"outputConnectorId" integer,
	"outputConnectorPosition" integer,
	"createdat" timestamp with time zone NOT NULL,
	"updatedat" timestamp with time zone,
	"deletedat" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "logic_constructor"."project_joints" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logic_constructor"."project_joints_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectId" integer NOT NULL,
	"type" varchar NOT NULL,
	"label" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logic_constructor"."projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "logic_constructor"."projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "logic_constructor"."components" ADD CONSTRAINT "components_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "logic_constructor"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."components" ADD CONSTRAINT "components_componentid_projects_id_fk" FOREIGN KEY ("componentid") REFERENCES "logic_constructor"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "logic_constructor"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_outputComponentId_components_id_fk" FOREIGN KEY ("outputComponentId") REFERENCES "logic_constructor"."components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_inputConnectorId_connections_id_fk" FOREIGN KEY ("inputConnectorId") REFERENCES "logic_constructor"."connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_outputConnectorId_connections_id_fk" FOREIGN KEY ("outputConnectorId") REFERENCES "logic_constructor"."connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_inputComponentId_components_id_fk" FOREIGN KEY ("inputComponentId") REFERENCES "logic_constructor"."components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_inputJointId_project_joints_id_fk" FOREIGN KEY ("inputJointId") REFERENCES "logic_constructor"."project_joints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."connections" ADD CONSTRAINT "connections_outputJointId_project_joints_id_fk" FOREIGN KEY ("outputJointId") REFERENCES "logic_constructor"."project_joints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logic_constructor"."project_joints" ADD CONSTRAINT "project_joints_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "logic_constructor"."projects"("id") ON DELETE no action ON UPDATE no action;