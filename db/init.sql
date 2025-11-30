-- Create the market table
CREATE TABLE IF NOT EXISTS market (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  chain_id ENUM('1', '56'),
  total_supply_cents BIGINT NOT NULL,
  total_borrow_cents BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO market (name, chain_id, total_supply_cents, total_borrow_cents) VALUES 
  ('Token 01', '1', 10482, 5915),
  ('Token 02', '1', 20459, 5712),
  ('Token 03', '1', 38394, 1841),
  ('Token 04', '1', 40825, 28921),
  ('Token 05', '1', 15012, 5447),
  ('Token 06', '1', 17200, 8924),
  ('Token 07', '1', 18811, 4784),
  ('Token 08', '1', 19877, 5918),
  ('Token 09', '1', 22830, 9081),
  ('Token 10', '1', 17089, 5904),
  ('Token 11', '1', 43827, 6601),
  ('Token 12', '1', 32811, 7910),
  ('Token 13', '1', 19287, 5239),
  ('Token 14', '56', 33008, 14091),
  ('Token 15', '56', 72450, 8821),
  ('Token 16', '56', 19399, 4791),
  ('Token 17', '56', 17281, 7247),
  ('Token 18', '56', 32197, 8271),
  ('Token 19', '56', 44726, 8921),
  ('Token 20', '56', 39811, 1920),
  ('Token 21', '56', 40401, 7281),
  ('Token 22', '56', 18927, 8233),
  ('Token 23', '56', 11739, 11000),
  ('Token 24', '56', 23502, 4777),
  ('Token 25', '56', 21738, 5931),
  ('Token 26', '56', 13290, 9021),
  ('Token 27', '56', 22915, 7233);
