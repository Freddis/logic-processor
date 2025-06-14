--
-- Data for Name: projects; Type: TABLE DATA; Schema: logic_constructor; Owner: postgres
--

INSERT INTO logic_constructor.projects OVERRIDING SYSTEM VALUE VALUES (1, 'Test project', NULL, '2025-01-21 16:15:43.586+00', NULL, NULL);
INSERT INTO logic_constructor.projects OVERRIDING SYSTEM VALUE VALUES (2, 'And Gate', 'Predefined And Gate Component Project', '2025-01-23 11:52:31.307+00', NULL, NULL);
INSERT INTO logic_constructor.projects OVERRIDING SYSTEM VALUE VALUES (3, 'Not Gate', 'Predefined Not Gate Component Project', '2025-01-23 17:06:54.938+00', NULL, NULL);
INSERT INTO logic_constructor.projects OVERRIDING SYSTEM VALUE VALUES (4, 'Logic 1', NULL, '2025-01-23 17:08:21.646+00', NULL, NULL);


--
-- Data for Name: components; Type: TABLE DATA; Schema: logic_constructor; Owner: postgres
--

INSERT INTO logic_constructor.components OVERRIDING SYSTEM VALUE VALUES (2,1,2, 'AND', 0, 0, '2025-01-23 11:43:04.405+00', NULL, NULL);
INSERT INTO logic_constructor.components OVERRIDING SYSTEM VALUE VALUES (3,1,3, 'NOT', 150, 0, '2025-01-23 13:54:29.416+00', NULL, NULL);
INSERT INTO logic_constructor.components OVERRIDING SYSTEM VALUE VALUES (5,1,4, '1', 150, 120, '2025-01-23 17:00:39.982+00', NULL, NULL);


--
-- Data for Name: project_joints; Type: TABLE DATA; Schema: logic_constructor; Owner: postgres
--

INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (1, 2, 'input', 'a');
INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (2, 2, 'input', 'b');
INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (3, 2, 'output', 'out');
INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (6, 4, 'output', 'out');
INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (4, 3, 'input', 'in');
INSERT INTO logic_constructor.project_joints OVERRIDING SYSTEM VALUE VALUES (5, 3, 'output', 'out');


--
-- Data for Name: connections; Type: TABLE DATA; Schema: logic_constructor; Owner: postgres
--

INSERT INTO logic_constructor.connections OVERRIDING SYSTEM VALUE VALUES (3, 1, -50, -50, NULL, NULL, NULL, NULL, 100, -100, NULL, NULL, NULL, NULL, '2025-01-29 15:17:23.072+00', NULL, NULL);
INSERT INTO logic_constructor.connections OVERRIDING SYSTEM VALUE VALUES (5, 1, -70, -70, NULL, NULL, NULL, NULL, 80, -120, NULL, NULL, NULL, NULL,'2025-01-30 01:04:45.107+00', NULL, NULL);
INSERT INTO logic_constructor.connections OVERRIDING SYSTEM VALUE VALUES (6, 1, -90, -90, NULL, NULL, NULL, NULL, 60, -140, NULL, NULL, NULL, NULL,'2025-01-30 01:05:55.627+00', NULL, NULL);


--
-- Name: connections_id_seq; Type: SEQUENCE SET; Schema: logic_constructor; Owner: postgres
--

SELECT pg_catalog.setval('logic_constructor.connections_id_seq', 6, true);


--
-- Name: logic_constructor.components_id_seq; Type: SEQUENCE SET; Schema: logic_constructor; Owner: postgres
--

SELECT pg_catalog.setval('logic_constructor.components_id_seq', 4, true);


--
-- Name: project_joints_id_seq; Type: SEQUENCE SET; Schema: logic_constructor; Owner: postgres
--

SELECT pg_catalog.setval('logic_constructor.project_joints_id_seq', 6, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: logic_constructor; Owner: postgres
--

SELECT pg_catalog.setval('logic_constructor.projects_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

