-- =============================================
-- MEDICAL INVENTORY DATABASE SETUP
-- Run this in Neon SQL Editor
-- =============================================

-- STEP 1: Create Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    type VARCHAR(255),
    category VARCHAR(50) DEFAULT 'medical',
    partner VARCHAR(255),
    remarks TEXT,
    brand VARCHAR(255),
    expired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STEP 2: Insert 48 Medical Equipment, Hygiene & Logistics Items
INSERT INTO products (name, unit, quantity, type, category, partner, remarks, brand, expired) VALUES
('Coton Hydrophile', '25g', 4, 'Matériel médical', 'medical', NULL, NULL, 'BANDLUX', false),
('couches bébé', NULL, 16, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Best Baby', false),
('lingette', '1 paquet', 72, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Baby pure', false),
('pansement prédécoupées', NULL, 3, 'Matériel médical', 'medical', 'Para Moon', NULL, 'MegaPlast', false),
('pansement à découpé', NULL, 1, 'Matériel médical', 'medical', 'Para Moon', NULL, 'MegaPlast', false),
('gants', '1 paquet', 100, 'Matériel médical', 'medical', 'Para Moon', NULL, 'SkinG', false),
('masque', '1 paquet', 50, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Face Mask', false),
('bandages', '1 sac', 12, 'Matériel médical', 'medical', 'Para Moon', NULL, NULL, false),
('compresses stérile (petit format)', '5 paquets', 100, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Megacomp', false),
('abaisse langue', '5 paquets', 500, 'Matériel médical', 'medical', 'Para Moon', NULL, 'medhave', false),
('bandelettes glycémie', '1 paquet', 100, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Bionime', false),
('thermométres', NULL, 2, 'Matériel médical', 'medical', 'Para Moon', NULL, 'Accutherm', false),
('déambulateur', NULL, 1, 'Matériel médical', 'medical', 'As para', NULL, NULL, false),
('Cake', '1 paquet', 50, 'Matériel Logistique', 'logistics', NULL, NULL, 'TOM', false),
('Jus', '30*125 cl', 30, 'Matériel Logistique', 'logistics', NULL, NULL, 'JUGO KIDS', false),
('couches bébé', '5', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 4', 'Giggle', false),
('couches bébé', '12', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 1', 'LILAS CONFORT MAX ACTIF', false),
('couches bébé', '5', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 4', 'LILAS CONFORT MAX ACTIF', false),
('gel hydralcolique', '125ml', 50, 'Matériel hygiène', 'hygiene', 'médical Santé Service', NULL, 'young health antivirus +', false),
('tensiométre', 'hm60', 1, 'Matériel médical', 'medical', 'médical Santé Service', 'poignet viscor hm60', 'viscor', false),
('lingette', '24 paquet', 72, 'Matériel hygiène', 'hygiene', 'médical Santé Service', NULL, 'Babirose', false),
('bandages', 'N,C 5 CM *3 M', 100, 'Matériel médical', 'medical', 'médical Santé Service', NULL, 'BANDLUX', false),
('Bandages', '10 cm *3M', 24, 'Matériel médical', 'medical', 'médical Santé Service', NULL, 'baNDLUX', false),
('GLUCOMETRE', 'GM 550', 1, 'Matériel médical', 'medical', 'médical Santé Service', 'coffret promotionelle', 'Bionime', false),
('abaisse langue', '3', 100, 'Matériel médical', 'medical', 'médical Santé Service', NULL, NULL, false),
('couches bébé', '5 paquets', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 5', 'LILAS CONFORT MAX ACTIF', false),
('couches bébé', '5 paquets', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 3', 'LILAS CONFORT MAX ACTIF', false),
('couches bébé', '4 paquets', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 6', 'Giggle', false),
('couches bébé', '2 paquets', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 5', 'Giggle', false),
('couches bébé', '5 paquets', 0, 'Matériel hygiène', 'hygiene', 'médical Santé Service', 'taille 3', 'Giggle', false),
('glucomètre', NULL, 1, 'Matériel médical', 'medical', NULL, '+50 bandelette +10 LANCETs', 'accu-check', false),
('glucomètre', NULL, 1, 'Matériel médical', 'medical', NULL, '+7 bandelette +10 LANCETs', 'on call plus', false),
('glucomètre', NULL, 1, 'Matériel médical', 'medical', NULL, '+100 banelettes', 'on call vivid', false),
('thermométres', NULL, 1, 'Matériel médical', 'medical', 'HERMES', NULL, 'THERMOPLUS', false),
('tensiométre', NULL, 1, 'Matériel médical', 'medical', NULL, NULL, NULL, false),
('compresses non stériles', NULL, 100, 'Matériel médical', 'medical', NULL, NULL, NULL, false),
('masque', '1 paquet', 50, 'Matériel médical', 'medical', NULL, NULL, NULL, false),
('cake', '3 paquets', 108, 'Matériel Logistique', 'logistics', NULL, NULL, 'SAIDA', false),
('jus', '2 paquets', 12, 'Matériel Logistique', 'logistics', NULL, NULL, 'TROPICO', false),
('masque', '2', 50, 'Matériel médical', 'medical', NULL, NULL, 'BAIY ERKANG', false),
('COMPRESSES CHIRURGICALES', '1', 100, 'Matériel médical', 'medical', NULL, NULL, 'MEGA', false),
('masque', '1', 40, 'Matériel médical', 'medical', NULL, NULL, NULL, false),
('glucomètre', NULL, 2, 'Matériel médical', 'medical', 'HERMES', '+20 bandelette +35 LANCETs', 'on call plus', false),
('cotton', '500g', 0, 'Matériel médical', 'medical', 'médical Santé Service', NULL, 'bandLUX', false),
('lancets', NULL, 72, 'Matériel médical', 'medical', 'taha', '72 piéces', 'accu-check', false),
('lancets', NULL, 200, 'Matériel médical', 'medical', 'taha', '200 lancets', 'microlet', false),
('perfuseur', NULL, 2, 'Matériel médical', 'medical', 'taha', NULL, 'inflow set', false),
('seringue', NULL, 2, 'Matériel médical', 'medical', 'taha', NULL, NULL, false);

-- Verify
SELECT COUNT(*) as total_products FROM products;
