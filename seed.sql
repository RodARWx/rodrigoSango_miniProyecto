-- ==============================================================================
-- Initial Mock Data Seed Script for Students Database
-- ==============================================================================

UPDATE estudiantes SET 
  descripcion = 'Entusiasta de programacion web y backend con Spring Boot.',
  image_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
WHERE id = 2;

INSERT INTO estudiantes (nombre, correo, curso, descripcion, image_url) VALUES
('Ana Morales', 'ana.morales@uce.edu.ec', 'Programacion Web 7mo', 'Especialista en diseno UI/UX y maquetacion web responsiva.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'),
('Carlos Mendoza', 'carlos.mendoza@uce.edu.ec', 'Sistemas Distribuidos', 'Entusiasta de microservicios, bases de datos y arquitectura cloud.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'),
('Valeria Rios', 'valeria.rios@uce.edu.ec', 'Inteligencia Artificial', 'Investigando modelos de procesamiento de lenguaje natural y machine learning.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'),
('David Torres', 'david.torres@uce.edu.ec', 'Seguridad Informatica', 'Interesado en auditoria de sistemas, pentesting y seguridad web.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'),
('Sofia Castro', 'sofia.castro@uce.edu.ec', 'Programacion Web 7mo', 'Desarrolladora Full Stack enfocada en arquitecturas REST con Spring Boot.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80'),
('Mateo Salazar', 'mateo.salazar@uce.edu.ec', 'Redes y Telecomunicaciones', 'Configuracion de redes de alto rendimiento y protocolos de comunicacion.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'),
('Camila Herrera', 'camila.herrera@uce.edu.ec', 'Gestion de Proyectos TI', 'Liderazgo de proyectos con metodologias agiles Scrum y DevOps.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (correo) DO NOTHING;
