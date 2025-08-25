import { createAttribute, createAttributeValue } from '../modules/products/services/attribute.service';

// Dữ liệu mẫu cho các thuộc tính
const attributesData = [
  {
    name: 'Color',
    values: ['Đen', 'Trắng', 'Xám', 'Bạc', 'Vàng', 'Xanh', 'Đỏ']
  },
  {
    name: 'RAM',
    values: ['4GB', '8GB', '16GB', '32GB', '64GB']
  },
  {
    name: 'SSD',
    values: ['128GB', '256GB', '512GB', '1TB', '2TB']
  }
];

export const seedAttributes = async () => {
  try {
    console.log('Bắt đầu tạo dữ liệu mẫu cho thuộc tính...');
    
    for (const attributeData of attributesData) {
      try {
        // Tạo thuộc tính
        console.log(`Tạo thuộc tính: ${attributeData.name}`);
        const attributeRes = await createAttribute({ name: attributeData.name });
        const attribute = attributeRes.data || attributeRes;
        
        if (attribute && attribute.id) {
          // Tạo các giá trị cho thuộc tính
          for (const value of attributeData.values) {
            try {
              console.log(`  - Tạo giá trị: ${value}`);
              await createAttributeValue({
                attribute_id: attribute.id,
                value: value
              });
            } catch (error) {
              console.log(`    Giá trị "${value}" có thể đã tồn tại, bỏ qua...`);
            }
          }
          console.log(`✅ Hoàn thành thuộc tính: ${attributeData.name}`);
        }
      } catch (error) {
        console.log(`⚠️ Thuộc tính "${attributeData.name}" có thể đã tồn tại, bỏ qua...`);
      }
    }
    
    console.log('🎉 Hoàn thành tạo dữ liệu mẫu!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', error);
    return false;
  }
};