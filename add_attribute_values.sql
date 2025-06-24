-- Thêm nhiều giá trị cho Color (attribute_id = 1)
INSERT INTO `attribute_values` (`attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(1, 'Đen', NOW(), NOW()),
(1, 'Trắng', NOW(), NOW()),
(1, 'Xám', NOW(), NOW()),
(1, 'Bạc', NOW(), NOW()),
(1, 'Vàng', NOW(), NOW()),
(1, 'Xanh', NOW(), NOW()),
(1, 'Đỏ', NOW(), NOW());

-- Thêm nhiều giá trị cho SSD (attribute_id = 2)  
INSERT INTO `attribute_values` (`attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(2, '128GB', NOW(), NOW()),
(2, '256GB', NOW(), NOW()),
(2, '512GB', NOW(), NOW()),
(2, '1TB', NOW(), NOW()),
(2, '2TB', NOW(), NOW());

-- Thêm nhiều giá trị cho RAM (attribute_id = 3)
INSERT INTO `attribute_values` (`attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(3, '4GB', NOW(), NOW()),
(3, '8GB', NOW(), NOW()),
(3, '16GB', NOW(), NOW()),
(3, '32GB', NOW(), NOW()),
(3, '64GB', NOW(), NOW());