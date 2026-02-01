import { hash } from 'bcryptjs';
import prisma from './../src/shared/lib/prisma';

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // 1. Check/Create Users (Admin + Test Users)
  // ============================================
  console.log('👤 Creating users...');

  // Check if admin already exists
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@resellify.pk' },
  });

  if (!adminUser) {
    const hashedPassword = await hash('Admin@123', 12);
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@resellify.pk',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        phoneNumber: '+923001234567',
        isMLMEnabled: true,
        mlmLevel: 1,
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Create test users
  const testUsers = [
    {
      name: 'Muhammad Ali',
      email: 'ali@test.com',
      phoneNumber: '+923011111111',
      role: 'USER' as const,
    },
    {
      name: 'Fatima Khan',
      email: 'fatima@test.com',
      phoneNumber: '+923022222222',
      role: 'USER' as const,
    },
    {
      name: 'Ahmed Hassan',
      email: 'ahmed@test.com',
      phoneNumber: '+923033333333',
      role: 'USER' as const,
    },
    {
      name: 'Support Agent',
      email: 'support@resellify.pk',
      phoneNumber: '+923044444444',
      role: 'SUPPORT' as const,
    },
  ];

  const createdUsers: (typeof adminUser)[] = [adminUser];

  for (const userData of testUsers) {
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      const hashedPassword = await hash('Test@123', 12);
      user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          isActive: true,
          isMLMEnabled: true,
          mlmLevel: 1,
          uplineId: adminUser.id, // Admin is upline for all test users
        },
      });
      console.log(`✅ User ${userData.name} created`);
    }
    createdUsers.push(user);
  }

  // ============================================
  // 2. Create Categories
  // ============================================
  console.log('📁 Creating categories...');

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Smartphones, Laptops, Tablets & More',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, Shoes & Accessories',
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Furniture, Decor & Kitchen',
    },
    {
      name: 'Beauty & Health',
      slug: 'beauty-health',
      description: 'Skincare, Makeup & Wellness',
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Fitness, Sports Equipment & Outdoor Gear',
    },
  ];

  const createdCategories = [];

  for (const catData of categories) {
    let category = await prisma.category.findUnique({
      where: { slug: catData.slug },
    });

    if (!category) {
      category = await prisma.category.create({ data: catData });
      console.log(`✅ Category ${catData.name} created`);
    }
    createdCategories.push(category);
  }

  // Create subcategories
  const subCategories = [
    // Electronics subcategories
    {
      name: 'Smartphones',
      slug: 'smartphones',
      parentId: createdCategories[0].id,
    },
    { name: 'Laptops', slug: 'laptops', parentId: createdCategories[0].id },
    {
      name: 'Accessories',
      slug: 'electronics-accessories',
      parentId: createdCategories[0].id,
    },
    // Fashion subcategories
    {
      name: "Men's Clothing",
      slug: 'mens-clothing',
      parentId: createdCategories[1].id,
    },
    {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      parentId: createdCategories[1].id,
    },
    { name: 'Shoes', slug: 'shoes', parentId: createdCategories[1].id },
    // Home subcategories
    { name: 'Furniture', slug: 'furniture', parentId: createdCategories[2].id },
    {
      name: 'Kitchen',
      slug: 'kitchen-items',
      parentId: createdCategories[2].id,
    },
  ];

  for (const subCat of subCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: subCat.slug },
    });
    if (!existing) {
      await prisma.category.create({ data: subCat });
      console.log(`✅ Subcategory ${subCat.name} created`);
    }
  }

  // ============================================
  // 3. Create Tags
  // ============================================
  console.log('🏷️ Creating tags...');

  const tags = [
    { name: 'New Arrival', slug: 'new-arrival' },
    { name: 'Best Seller', slug: 'best-seller' },
    { name: 'Hot Deal', slug: 'hot-deal' },
    { name: 'Limited Edition', slug: 'limited-edition' },
    { name: 'Trending', slug: 'trending' },
    { name: 'Sale', slug: 'sale' },
    { name: 'Premium', slug: 'premium' },
    { name: 'Budget Friendly', slug: 'budget-friendly' },
  ];

  const createdTags = [];
  for (const tagData of tags) {
    let tag = await prisma.tag.findUnique({ where: { slug: tagData.slug } });
    if (!tag) {
      tag = await prisma.tag.create({ data: tagData });
      console.log(`✅ Tag ${tagData.name} created`);
    }
    createdTags.push(tag);
  }

  // ============================================
  // 4. Create Brands
  // ============================================
  console.log('🏢 Creating brands...');

  const brands = [
    { name: 'Samsung', description: 'Korean Electronics Giant' },
    { name: 'Apple', description: 'Premium Tech Products' },
    { name: 'Nike', description: 'Sports & Lifestyle Brand' },
    { name: 'Adidas', description: 'German Sports Brand' },
    { name: 'Sony', description: 'Japanese Electronics' },
    { name: 'LG', description: "Life's Good - Electronics" },
    { name: 'Xiaomi', description: 'Chinese Tech Innovation' },
    { name: "Levi's", description: 'American Denim Brand' },
  ];

  const createdBrands = [];
  for (const brandData of brands) {
    let brand = await prisma.brand.findUnique({
      where: { name: brandData.name },
    });
    if (!brand) {
      brand = await prisma.brand.create({
        data: {
          ...brandData,
          createdById: adminUser.id,
        },
      });
      console.log(`✅ Brand ${brandData.name} created`);
    }
    createdBrands.push(brand);
  }

  // ============================================
  // 5. Create Option Sets & Options (for variants)
  // ============================================
  console.log('⚙️ Creating option sets...');

  // Color Option Set
  let colorOptionSet = await prisma.optionSet.findUnique({
    where: { name: 'Color' },
  });
  if (!colorOptionSet) {
    colorOptionSet = await prisma.optionSet.create({
      data: {
        name: 'Color',
        type: 'COLOR',
        options: {
          create: [
            { name: 'Black', value: '#000000', position: 1 },
            { name: 'White', value: '#FFFFFF', position: 2 },
            { name: 'Red', value: '#FF0000', position: 3 },
            { name: 'Blue', value: '#0000FF', position: 4 },
            { name: 'Green', value: '#00FF00', position: 5 },
            { name: 'Gold', value: '#FFD700', position: 6 },
          ],
        },
      },
    });
    console.log('✅ Color option set created');
  }

  // Size Option Set
  let sizeOptionSet = await prisma.optionSet.findUnique({
    where: { name: 'Size' },
  });
  if (!sizeOptionSet) {
    sizeOptionSet = await prisma.optionSet.create({
      data: {
        name: 'Size',
        type: 'SIZE',
        options: {
          create: [
            { name: 'XS', value: 'xs', position: 1 },
            { name: 'S', value: 's', position: 2 },
            { name: 'M', value: 'm', position: 3 },
            { name: 'L', value: 'l', position: 4 },
            { name: 'XL', value: 'xl', position: 5 },
            { name: 'XXL', value: 'xxl', position: 6 },
          ],
        },
      },
    });
    console.log('✅ Size option set created');
  }

  // Storage Option Set (for electronics)
  let storageOptionSet = await prisma.optionSet.findUnique({
    where: { name: 'Storage' },
  });
  if (!storageOptionSet) {
    storageOptionSet = await prisma.optionSet.create({
      data: {
        name: 'Storage',
        type: 'TEXT',
        options: {
          create: [
            { name: '64GB', value: '64', position: 1 },
            { name: '128GB', value: '128', position: 2 },
            { name: '256GB', value: '256', position: 3 },
            { name: '512GB', value: '512', position: 4 },
            { name: '1TB', value: '1024', position: 5 },
          ],
        },
      },
    });
    console.log('✅ Storage option set created');
  }

  // ============================================
  // 6. Create Products
  // ============================================
  console.log('📦 Creating products...');

  const products = [
    {
      title: 'Samsung Galaxy S24 Ultra',
      description: 'Latest Samsung flagship with S Pen, 200MP camera, and Snapdragon 8 Gen 3',
      shortDescription: 'Premium Samsung smartphone with AI features',
      basePrice: 299999,
      salePrice: 279999,
      slug: 'samsung-galaxy-s24-ultra',
      sku: 'SAM-S24U-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 50,
      categorySlug: 'smartphones',
      tags: ['new-arrival', 'premium', 'best-seller'],
    },
    {
      title: 'iPhone 15 Pro Max',
      description: "Apple's most advanced iPhone with A17 Pro chip, titanium design, and USB-C",
      shortDescription: 'Apple flagship with titanium design',
      basePrice: 449999,
      salePrice: 429999,
      slug: 'iphone-15-pro-max',
      sku: 'APL-IP15PM-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 30,
      categorySlug: 'smartphones',
      tags: ['premium', 'best-seller'],
    },
    {
      title: 'MacBook Pro 16-inch M3 Max',
      description:
        'Professional laptop with M3 Max chip, 36GB RAM, and stunning Liquid Retina XDR display',
      shortDescription: "Apple's most powerful laptop",
      basePrice: 799999,
      salePrice: null,
      slug: 'macbook-pro-16-m3-max',
      sku: 'APL-MBP16-M3-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 15,
      categorySlug: 'laptops',
      tags: ['premium', 'trending'],
    },
    {
      title: 'Nike Air Jordan 1 Retro High OG',
      description: 'Iconic basketball sneakers with premium leather and Air cushioning',
      shortDescription: 'Classic Jordan 1 sneakers',
      basePrice: 32999,
      salePrice: 28999,
      slug: 'nike-air-jordan-1-retro-high',
      sku: 'NIK-AJ1-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 100,
      categorySlug: 'shoes',
      tags: ['hot-deal', 'trending', 'best-seller'],
    },
    {
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise cancellation with 30-hour battery life',
      shortDescription: 'Premium wireless headphones',
      basePrice: 89999,
      salePrice: 79999,
      slug: 'sony-wh-1000xm5',
      sku: 'SNY-WH1000XM5-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 45,
      categorySlug: 'electronics-accessories',
      tags: ['premium', 'best-seller'],
    },
    {
      title: "Levi's 501 Original Fit Jeans",
      description: 'The original blue jean since 1873, straight leg with button fly',
      shortDescription: "Classic Levi's 501 jeans",
      basePrice: 12999,
      salePrice: 9999,
      slug: 'levis-501-original-jeans',
      sku: 'LEV-501-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 200,
      categorySlug: 'mens-clothing',
      tags: ['budget-friendly', 'sale'],
    },
    {
      title: 'Xiaomi Smart Air Fryer 6.5L',
      description: 'Large capacity air fryer with WiFi connectivity and Mi Home app control',
      shortDescription: 'Smart kitchen air fryer',
      basePrice: 24999,
      salePrice: 19999,
      slug: 'xiaomi-smart-air-fryer',
      sku: 'XIA-AF65-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 80,
      categorySlug: 'kitchen-items',
      tags: ['hot-deal', 'trending'],
    },
    {
      title: 'Adidas Ultraboost 23',
      description: 'Premium running shoes with BOOST midsole technology for maximum energy return',
      shortDescription: 'Performance running shoes',
      basePrice: 29999,
      salePrice: 25999,
      slug: 'adidas-ultraboost-23',
      sku: 'ADI-UB23-001',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 75,
      categorySlug: 'shoes',
      tags: ['trending', 'new-arrival'],
    },
    {
      title: 'LG 55-inch OLED C3 TV',
      description: '4K OLED smart TV with perfect blacks, Dolby Vision, and gaming features',
      shortDescription: 'Premium OLED TV',
      basePrice: 289999,
      salePrice: 249999,
      slug: 'lg-oled-c3-55',
      sku: 'LG-OLEDC3-55',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 20,
      categorySlug: 'electronics',
      tags: ['premium', 'hot-deal'],
    },
    {
      title: 'Premium Cotton T-Shirt Pack (3pc)',
      description: 'Pack of 3 premium cotton t-shirts in black, white, and grey',
      shortDescription: 'Essential cotton t-shirts',
      basePrice: 4999,
      salePrice: 3999,
      slug: 'premium-cotton-tshirt-pack',
      sku: 'GEN-TSHIRT-3PK',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      inventory: 500,
      categorySlug: 'mens-clothing',
      tags: ['budget-friendly', 'best-seller'],
    },
  ];

  const createdProducts = [];

  for (const productData of products) {
    let product = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (!product) {
      // Find category
      const category = await prisma.category.findUnique({
        where: { slug: productData.categorySlug },
      });

      // Create product
      product = await prisma.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          shortDescription: productData.shortDescription,
          basePrice: productData.basePrice,
          salePrice: productData.salePrice,
          slug: productData.slug,
          sku: productData.sku,
          status: productData.status,
          visibility: productData.visibility,
          inventory: productData.inventory,
          createdById: adminUser.id,
          publishedById: adminUser.id,
          publishedAt: new Date(),
          featured: Math.random() > 0.5,
          averageRating: Math.floor(Math.random() * 2) + 3 + Math.random(), // 3-5 rating
          reviewCount: Math.floor(Math.random() * 100),
        },
      });

      // Link to category
      if (category) {
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: category.id,
          },
        });
      }

      // Link to tags
      for (const tagSlug of productData.tags) {
        const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
        if (tag) {
          await prisma.productTag.create({
            data: {
              productId: product.id,
              tagId: tag.id,
            },
          });
        }
      }

      console.log(`✅ Product ${productData.title} created`);
    }
    createdProducts.push(product);
  }

  // ============================================
  // 7. Create Addresses for Users
  // ============================================
  console.log('📍 Creating addresses...');

  const addresses = [
    {
      userId: createdUsers[1]?.id, // Ali
      label: 'Home',
      fullName: 'Muhammad Ali',
      phone: '+923011111111',
      whatsappNumber: '+923011111111',
      line1: 'House 123, Street 5',
      city: 'Lahore',
      area: 'DHA Phase 5',
      state: 'Punjab',
      postalCode: '54000',
      isDefault: true,
    },
    {
      userId: createdUsers[2]?.id, // Fatima
      label: 'Office',
      fullName: 'Fatima Khan',
      phone: '+923022222222',
      whatsappNumber: '+923022222222',
      line1: 'Office 45, Clifton Block 8',
      city: 'Karachi',
      area: 'Clifton',
      state: 'Sindh',
      postalCode: '75600',
      isDefault: true,
    },
    {
      userId: createdUsers[3]?.id, // Ahmed
      label: 'Home',
      fullName: 'Ahmed Hassan',
      phone: '+923033333333',
      whatsappNumber: '+923033333333',
      line1: 'Flat 12-B, F-10 Markaz',
      city: 'Islamabad',
      area: 'F-10',
      state: 'Islamabad Capital Territory',
      postalCode: '44000',
      isDefault: true,
    },
  ];

  const createdAddresses = [];
  for (const addrData of addresses) {
    if (addrData.userId) {
      const existingAddr = await prisma.address.findFirst({
        where: { userId: addrData.userId, isDefault: true },
      });

      if (!existingAddr) {
        const address = await prisma.address.create({ data: addrData });
        createdAddresses.push(address);
        console.log(`✅ Address for user created`);
      }
    }
  }

  // ============================================
  // 8. Create Coupons
  // ============================================
  console.log('🎟️ Creating coupons...');

  const coupons = [
    {
      code: 'WELCOME10',
      description: '10% off on your first order',
      type: 'PERCENT' as const,
      value: 10,
      discountType: 'PERCENT' as const,
      maxDiscount: 2000,
      isActive: true,
      firstOrderOnly: true,
      minOrderValue: 5000,
    },
    {
      code: 'FLAT500',
      description: 'Flat Rs. 500 off on orders above Rs. 5000',
      type: 'FIXED' as const,
      value: 500,
      discountType: 'FLAT' as const,
      isActive: true,
      minOrderValue: 5000,
    },
    {
      code: 'NEWYEAR25',
      description: '25% off - New Year Special',
      type: 'PERCENT' as const,
      value: 25,
      discountType: 'PERCENT' as const,
      maxDiscount: 5000,
      isActive: true,
      startsAt: new Date('2026-01-01'),
      endsAt: new Date('2026-01-31'),
    },
    {
      code: 'ELECTRONICS15',
      description: '15% off on Electronics',
      type: 'PERCENT' as const,
      value: 15,
      discountType: 'PERCENT' as const,
      maxDiscount: 10000,
      isActive: true,
      categoryId: createdCategories[0]?.id, // Electronics
    },
  ];

  for (const couponData of coupons) {
    const existing = await prisma.coupon.findUnique({
      where: { code: couponData.code },
    });
    if (!existing) {
      await prisma.coupon.create({ data: couponData });
      console.log(`✅ Coupon ${couponData.code} created`);
    }
  }

  // ============================================
  // 9. Create Offers
  // ============================================
  console.log('🎁 Creating offers...');

  const offers = [
    {
      title: 'Winter Sale',
      description: 'Up to 30% off on winter collection',
      type: 'PERCENT' as const,
      offType: 'ALL_PRODUCTS' as const,
      value: 30,
      discountType: 'PERCENT' as const,
      maxDiscount: 10000,
      isActive: true,
      appliesToAll: true,
    },
    {
      title: 'Flash Sale - Electronics',
      description: 'Limited time electronics sale',
      type: 'PERCENT' as const,
      offType: 'CATEGORY' as const,
      value: 20,
      discountType: 'PERCENT' as const,
      maxDiscount: 15000,
      isActive: true,
      categoryId: createdCategories[0]?.id,
    },
  ];

  for (const offerData of offers) {
    const existing = await prisma.offer.findFirst({
      where: { title: offerData.title },
    });
    if (!existing) {
      await prisma.offer.create({ data: offerData });
      console.log(`✅ Offer ${offerData.title} created`);
    }
  }

  // ============================================
  // 10. Create Sample Orders
  // ============================================
  console.log('🛒 Creating sample orders...');

  // Only create orders if there are addresses
  if (createdAddresses.length > 0) {
    const orderStatuses = [
      'CREATED',
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
    ] as const;

    for (let i = 0; i < 5; i++) {
      const userIndex = (i % 3) + 1; // Cycle through test users
      const user = createdUsers[userIndex];
      const address = createdAddresses.find((a) => a.userId === user?.id);

      if (user && address && createdProducts.length > 0) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = randomProduct.salePrice || randomProduct.basePrice;
        const subTotal = price * quantity;
        const shippingFee = subTotal > 10000 ? 0 : 200;
        const totalAmount = subTotal + shippingFee;

        const orderNumber = `ORD-${Date.now()}-${String(i + 1).padStart(4, '0')}`;

        const existingOrder = await prisma.order.findUnique({
          where: { orderNumber },
        });

        if (!existingOrder) {
          await prisma.order.create({
            data: {
              userId: user.id,
              addressId: address.id,
              orderNumber,
              status: orderStatuses[i % orderStatuses.length],
              paymentMethod: i % 2 === 0 ? 'COD' : 'JAZZCASH',
              paymentStatus: i > 3 ? 'SUCCEEDED' : 'PENDING',
              subTotal,
              shippingFee,
              totalAmount,
              placedAt: new Date(),
              items: {
                create: {
                  productId: randomProduct.id,
                  sku: randomProduct.sku,
                  title: randomProduct.title,
                  price,
                  quantity,
                  lineTotal: price * quantity,
                },
              },
            },
          });
          console.log(`✅ Order ${orderNumber} created`);
        }
      }
    }
  }

  // ============================================
  // 11. Create Reviews
  // ============================================
  console.log('⭐ Creating reviews...');

  const reviewTexts = [
    { title: 'Great product!', comment: 'Exceeded my expectations. Highly recommend!', rating: 5 },
    { title: 'Good value', comment: 'Good quality for the price. Fast delivery.', rating: 4 },
    { title: 'Satisfied', comment: 'Product as described. Happy with purchase.', rating: 4 },
    { title: 'Excellent!', comment: "Best purchase I've made. Will buy again!", rating: 5 },
    { title: 'Worth it', comment: 'Took some time to deliver but product is great.', rating: 4 },
  ];

  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i];
    const userIndex = (i % 3) + 1;
    const user = createdUsers[userIndex];
    const reviewData = reviewTexts[i % reviewTexts.length];

    if (user && product) {
      const existingReview = await prisma.review.findFirst({
        where: { userId: user.id, productId: product.id },
      });

      if (!existingReview) {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            ...reviewData,
          },
        });
        console.log(`✅ Review for ${product.title} created`);
      }
    }
  }

  // ============================================
  // 12. Create Subscription Plans
  // ============================================
  console.log('💳 Creating subscription plans...');

  const subscriptionPlans = [
    {
      name: 'Basic',
      type: 'BASIC' as const,
      description: 'Perfect for small sellers',
      price: 999,
      maxProducts: 50,
      maxStorage: 500,
      features: ['50 Products', '500MB Storage', 'Email Support'],
      isActive: true,
    },
    {
      name: 'Pro',
      type: 'PRO' as const,
      description: 'For growing businesses',
      price: 2999,
      maxProducts: 500,
      maxStorage: 5000,
      prioritySupport: true,
      analytics: true,
      features: ['500 Products', '5GB Storage', 'Priority Support', 'Analytics Dashboard'],
      isActive: true,
    },
    {
      name: 'Enterprise',
      type: 'ENTERPRISE' as const,
      description: 'For large scale operations',
      price: 9999,
      maxProducts: null,
      maxStorage: null,
      prioritySupport: true,
      analytics: true,
      apiAccess: true,
      features: [
        'Unlimited Products',
        'Unlimited Storage',
        '24/7 Support',
        'API Access',
        'Custom Integrations',
      ],
      isActive: true,
    },
  ];

  for (const planData of subscriptionPlans) {
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { name: planData.name },
    });
    if (!existing) {
      await prisma.subscriptionPlan.create({ data: planData });
      console.log(`✅ Subscription plan ${planData.name} created`);
    }
  }

  // ============================================
  // 13. Create MLM Settings & Commission Rules
  // ============================================
  console.log('🔗 Creating MLM settings...');

  const mlmSettings = await prisma.mLMSettings.findFirst();
  if (!mlmSettings) {
    await prisma.mLMSettings.create({
      data: {
        isMLMEnabled: true,
        maxLevels: 5,
        minWithdrawal: 500,
        withdrawalFeePercent: 2,
        defaultSignupBonus: 100,
        autoApproveCommissions: false,
        autoEnableMLM: true,
      },
    });
    console.log('✅ MLM Settings created');
  }

  const commissionRules = [
    { name: 'Level 1 Sales', type: 'SALE' as const, level: 1, percentage: 10, isActive: true },
    { name: 'Level 2 Sales', type: 'SALE' as const, level: 2, percentage: 5, isActive: true },
    { name: 'Level 3 Sales', type: 'SALE' as const, level: 3, percentage: 3, isActive: true },
    { name: 'Level 4 Sales', type: 'SALE' as const, level: 4, percentage: 2, isActive: true },
    { name: 'Level 5 Sales', type: 'SALE' as const, level: 5, percentage: 1, isActive: true },
    {
      name: 'Signup Bonus',
      type: 'SIGNUP' as const,
      level: 1,
      percentage: 0,
      fixedAmount: 100,
      isActive: true,
    },
  ];

  for (const rule of commissionRules) {
    const existing = await prisma.commissionRule.findFirst({
      where: { type: rule.type, level: rule.level },
    });
    if (!existing) {
      await prisma.commissionRule.create({ data: rule });
      console.log(`✅ Commission rule ${rule.name} created`);
    }
  }

  // ============================================
  // 14. Create Wallets for Users
  // ============================================
  console.log('💰 Creating wallets...');

  for (const user of createdUsers) {
    if (user) {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });
      if (!existingWallet) {
        await prisma.wallet.create({
          data: {
            userId: user.id,
            balance: 0,
            pending: 0,
            totalEarned: 0,
          },
        });
        console.log(`✅ Wallet for ${user.name} created`);
      }
    }
  }

  // ============================================
  // 15. Create Spec Groups
  // ============================================
  console.log('📋 Creating spec groups...');

  const specGroups = [
    { title: 'Phone Specs', keys: ['Display', 'Processor', 'RAM', 'Storage', 'Battery', 'Camera'] },
    {
      title: 'Laptop Specs',
      keys: ['Display', 'Processor', 'RAM', 'Storage', 'Graphics', 'Battery Life'],
    },
    { title: 'Clothing Specs', keys: ['Material', 'Fit Type', 'Care Instructions', 'Origin'] },
  ];

  for (const spec of specGroups) {
    const existing = await prisma.specGroup.findFirst({
      where: { title: spec.title },
    });
    if (!existing) {
      await prisma.specGroup.create({ data: spec });
      console.log(`✅ Spec group ${spec.title} created`);
    }
  }

  // ============================================
  // 16. Create Some Visits (Analytics)
  // ============================================
  console.log('📊 Creating sample visits...');

  for (let i = 0; i < 20; i++) {
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];

    await prisma.visit.create({
      data: {
        userId: randomUser?.id,
        productId: randomProduct?.id,
        path: randomProduct ? `/products/${randomProduct.slug}` : '/',
        referrer: ['google.com', 'facebook.com', 'instagram.com', 'direct'][
          Math.floor(Math.random() * 4)
        ],
        country: 'Pakistan',
        city: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'][Math.floor(Math.random() * 4)],
        time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        metadata: {},
      },
    });
  }
  console.log('✅ Sample visits created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('='.repeat(50));
  console.log('📧 Admin Login: admin@resellify.pk / Admin@123');
  console.log('📧 Test User Login: ali@test.com / Test@123');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
