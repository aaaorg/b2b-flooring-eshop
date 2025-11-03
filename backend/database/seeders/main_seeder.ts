import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Company from '#models/company'
import User from '#models/user'
import Category from '#models/category'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    // Create companies
    const company1 = await Company.create({
      name: 'Podlahy Pro s.r.o.',
      registrationNumber: '12345678',
      taxId: 'CZ12345678',
      address: 'Hlavní 123',
      city: 'Praha',
      postalCode: '110 00',
      country: 'Czech Republic',
      phone: '+420 123 456 789',
      email: 'info@podlahy-pro.cz',
      isActive: true,
    })

    const company2 = await Company.create({
      name: 'Stavební Materiály Czech',
      registrationNumber: '87654321',
      taxId: 'CZ87654321',
      address: 'Průmyslová 456',
      city: 'Brno',
      postalCode: '602 00',
      country: 'Czech Republic',
      phone: '+420 987 654 321',
      email: 'kontakt@stav-mat.cz',
      isActive: true,
    })

    // Create users
    await User.create({
      companyId: company1.id,
      fullName: 'Admin User',
      email: 'admin@karsis.cz',
      password: 'password123',
      role: 'admin',
      isActive: true,
      isApproved: true,
    })

    await User.create({
      companyId: company1.id,
      fullName: 'Jan Novák',
      email: 'jan.novak@podlahy-pro.cz',
      password: 'password123',
      phone: '+420 123 456 789',
      role: 'customer',
      isActive: true,
      isApproved: true,
    })

    await User.create({
      companyId: company2.id,
      fullName: 'Petra Svobodová',
      email: 'petra.svobodova@stav-mat.cz',
      password: 'password123',
      phone: '+420 987 654 321',
      role: 'customer',
      isActive: true,
      isApproved: true,
    })

    // Create categories
    const vinylCategory = await Category.create({
      name: 'Vinyl Flooring',
      slug: 'vinyl-flooring',
      description: 'High-quality vinyl flooring for residential and commercial use',
      isActive: true,
      displayOrder: 1,
    })

    const laminateCategory = await Category.create({
      name: 'Laminate Flooring',
      slug: 'laminate-flooring',
      description: 'Durable laminate flooring with authentic wood appearance',
      isActive: true,
      displayOrder: 2,
    })

    const woodCategory = await Category.create({
      name: 'Wood Flooring',
      slug: 'wood-flooring',
      description: 'Solid and engineered wood flooring',
      isActive: true,
      displayOrder: 3,
    })

    // Create products - Vinyl
    await Product.create({
      categoryId: vinylCategory.id,
      name: 'Premium Vinyl Oak Natural',
      sku: 'VIN-OAK-NAT-001',
      slug: 'premium-vinyl-oak-natural',
      description: 'Premium vinyl flooring with natural oak texture',
      basePrice: 450.0,
      stock: 150,
      unit: 'm²',
      isActive: true,
      finish: 'Matte',
      wearLayer: '0.5mm',
      thickness: '8mm',
      dimensions: '1200x200mm',
      color: 'Natural Oak',
      material: 'Vinyl',
      manufacturer: 'FloorPro',
    })

    await Product.create({
      categoryId: vinylCategory.id,
      name: 'Luxury Vinyl Stone Grey',
      sku: 'VIN-STO-GRY-002',
      slug: 'luxury-vinyl-stone-grey',
      description: 'Luxury vinyl with stone texture, perfect for high-traffic areas',
      basePrice: 520.0,
      stock: 200,
      unit: 'm²',
      isActive: true,
      finish: 'Textured',
      wearLayer: '0.7mm',
      thickness: '10mm',
      dimensions: '600x600mm',
      color: 'Stone Grey',
      material: 'Vinyl',
      manufacturer: 'LuxFloor',
    })

    await Product.create({
      categoryId: vinylCategory.id,
      name: 'Commercial Vinyl Black',
      sku: 'VIN-COM-BLK-003',
      slug: 'commercial-vinyl-black',
      description: 'Heavy-duty vinyl for commercial applications',
      basePrice: 380.0,
      stock: 80,
      unit: 'm²',
      isActive: true,
      finish: 'Glossy',
      wearLayer: '0.3mm',
      thickness: '6mm',
      dimensions: '1200x200mm',
      color: 'Black',
      material: 'Vinyl',
      manufacturer: 'IndustrialFloor',
    })

    // Create products - Laminate
    await Product.create({
      categoryId: laminateCategory.id,
      name: 'Classic Laminate Walnut',
      sku: 'LAM-WAL-CLA-004',
      slug: 'classic-laminate-walnut',
      description: 'Classic laminate with walnut design',
      basePrice: 320.0,
      stock: 250,
      unit: 'm²',
      isActive: true,
      finish: 'Matte',
      wearLayer: null,
      thickness: '8mm',
      dimensions: '1380x193mm',
      color: 'Walnut Brown',
      material: 'Laminate',
      manufacturer: 'WoodLook',
    })

    await Product.create({
      categoryId: laminateCategory.id,
      name: 'Premium Laminate Ash White',
      sku: 'LAM-ASH-WHT-005',
      slug: 'premium-laminate-ash-white',
      description: 'Premium laminate with white ash appearance',
      basePrice: 410.0,
      stock: 180,
      unit: 'm²',
      isActive: true,
      finish: 'Glossy',
      wearLayer: null,
      thickness: '10mm',
      dimensions: '1380x193mm',
      color: 'White Ash',
      material: 'Laminate',
      manufacturer: 'PremiumFloor',
    })

    await Product.create({
      categoryId: laminateCategory.id,
      name: 'Rustic Laminate Pine',
      sku: 'LAM-PIN-RUS-006',
      slug: 'rustic-laminate-pine',
      description: 'Rustic style laminate with pine texture',
      basePrice: 290.0,
      stock: 120,
      unit: 'm²',
      isActive: true,
      finish: 'Textured',
      wearLayer: null,
      thickness: '7mm',
      dimensions: '1380x193mm',
      color: 'Natural Pine',
      material: 'Laminate',
      manufacturer: 'RusticWood',
    })

    // Create products - Wood
    await Product.create({
      categoryId: woodCategory.id,
      name: 'Solid Oak European',
      sku: 'WOD-OAK-EUR-007',
      slug: 'solid-oak-european',
      description: 'Solid European oak flooring, premium quality',
      basePrice: 850.0,
      stock: 50,
      unit: 'm²',
      isActive: true,
      finish: 'Oil',
      wearLayer: null,
      thickness: '15mm',
      dimensions: '1200x150mm',
      color: 'Natural Oak',
      material: 'Wood',
      manufacturer: 'OakMaster',
    })

    await Product.create({
      categoryId: woodCategory.id,
      name: 'Engineered Maple Light',
      sku: 'WOD-MAP-LGT-008',
      slug: 'engineered-maple-light',
      description: 'Engineered maple with light finish',
      basePrice: 720.0,
      stock: 90,
      unit: 'm²',
      isActive: true,
      finish: 'Lacquer',
      wearLayer: null,
      thickness: '14mm',
      dimensions: '1900x190mm',
      color: 'Light Maple',
      material: 'Wood',
      manufacturer: 'MapleWorks',
    })

    await Product.create({
      categoryId: woodCategory.id,
      name: 'Exotic Teak Plantation',
      sku: 'WOD-TEK-EXO-009',
      slug: 'exotic-teak-plantation',
      description: 'Plantation teak, sustainable and beautiful',
      basePrice: 1200.0,
      stock: 30,
      unit: 'm²',
      isActive: true,
      finish: 'Oil',
      wearLayer: null,
      thickness: '18mm',
      dimensions: '1200x120mm',
      color: 'Golden Teak',
      material: 'Wood',
      manufacturer: 'ExoticWoods',
    })

    // Add some out-of-stock products
    await Product.create({
      categoryId: vinylCategory.id,
      name: 'Designer Vinyl Marble White',
      sku: 'VIN-MAR-WHT-010',
      slug: 'designer-vinyl-marble-white',
      description: 'Premium marble-look vinyl (Currently out of stock)',
      basePrice: 680.0,
      stock: 0,
      unit: 'm²',
      isActive: true,
      finish: 'Glossy',
      wearLayer: '0.7mm',
      thickness: '12mm',
      dimensions: '600x600mm',
      color: 'Marble White',
      material: 'Vinyl',
      manufacturer: 'MarbleLux',
    })

    console.log('✅ Database seeded successfully!')
  }
}
