import { defineConfig } from 'cypress';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const backendDirectory = resolve(process.cwd(), '../pet_shop-backend-app');
const requireBackendDependency = createRequire(resolve(backendDirectory, 'package.json'));
const dotenv = requireBackendDependency('dotenv') as {
  config(options: { path: string }): void;
};

// Local E2E tests exercise the development backend, which loads `.env.dev`.
// An alternate target must opt in through CYPRESS_BACKEND_ENV or MONGODB_E2E_URI.
const backendEnvironmentFile =
  process.env.CYPRESS_BACKEND_ENV === 'production' ? '.env' : '.env.dev';
dotenv.config({ path: resolve(backendDirectory, backendEnvironmentFile) });

const e2eDatabaseUri = process.env.MONGODB_E2E_URI ?? process.env.MONGODB_URI;
const registerRateLimitKeyPattern = 'rate-limit:users:POST:/api/users/register:*';

type DatabaseDocument = Record<string, unknown>;
type DatabaseCollection = {
  deleteOne(filter: DatabaseDocument): Promise<unknown>;
  findOne(filter: DatabaseDocument): Promise<DatabaseDocument | null>;
  insertOne(document: DatabaseDocument): Promise<unknown>;
};

type E2EMongoose = {
  connect(uri: string): Promise<unknown>;
  connection: { collection(name: string): DatabaseCollection };
  disconnect(): Promise<void>;
  Types: { ObjectId: new () => unknown };
};

function getE2EMongoose() {
  return requireBackendDependency('mongoose') as E2EMongoose;
}

function requireE2EDatabaseUri() {
  if (!e2eDatabaseUri) {
    throw new Error('MONGODB_E2E_URI or MONGODB_URI is required for E2E database fixtures.');
  }

  return e2eDatabaseUri;
}

async function deleteE2ERegisteredUser(phoneNumber: string) {
  if (!/^09\d{9}$/.test(phoneNumber)) {
    throw new Error('Refusing to delete an E2E user with an invalid phone number.');
  }

  const mongoose = getE2EMongoose();

  await mongoose.connect(requireE2EDatabaseUri());
  try {
    await mongoose.connection.collection('users').deleteOne({ phoneNumber });
  } finally {
    await mongoose.disconnect();
  }

  return null;
}

async function createE2EProduct() {
  const mongoose = getE2EMongoose();
  const fixtureSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const title = 'محصول آزمایشی جزئیات';
  const slug = `e2e-product-${fixtureSuffix}`;
  const petTypeId = new mongoose.Types.ObjectId();
  const categoryId = new mongoose.Types.ObjectId();
  const brandId = new mongoose.Types.ObjectId();
  const productId = new mongoose.Types.ObjectId();
  const weightId = new mongoose.Types.ObjectId();
  const now = new Date();

  await mongoose.connect(requireE2EDatabaseUri());
  try {
    await mongoose.connection.collection('pettypes').insertOne({
      _id: petTypeId,
      title: `نوع ${fixtureSuffix.slice(-8)}`,
      description: '',
      mainImage: '/images/fallback-image.webp',
      thumbnail: 'data:image/webp;base64,AAAA',
      isEnabled: true,
      propertyDefinitions: [],
      slug: `e2e-pet-type-${fixtureSuffix}`,
      createdAt: now,
      updatedAt: now,
    });
    await mongoose.connection.collection('categories').insertOne({
      _id: categoryId,
      title: `دسته ${fixtureSuffix.slice(-8)}`,
      petType: petTypeId,
      mainImage: '/images/fallback-image.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      slug: `e2e-category-${fixtureSuffix}`,
      isEnable: true,
      createdAt: now,
      updatedAt: now,
    });
    await mongoose.connection.collection('brands').insertOne({
      _id: brandId,
      title: `e2e-brand-${fixtureSuffix}`,
      title_fa: `برند ${fixtureSuffix.slice(-8)}`,
      logo: '/images/fallback-image.webp',
      thumbnailLogo: 'data:image/webp;base64,AAAA',
      slug: `e2e-brand-${fixtureSuffix}`,
      isEnable: true,
      description: '',
      createdAt: now,
      updatedAt: now,
    });
    await mongoose.connection.collection('products').insertOne({
      _id: productId,
      title,
      mainImage: '/images/fallback-image.webp',
      images: [],
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      summary: 'محصول آزمایشی برای بررسی چیدمان صفحه جزئیات',
      description: 'توضیحات محصول آزمایشی',
      category: categoryId,
      brand: brandId,
      quantity: 5,
      weights: [
        {
          _id: weightId,
          metric: 'KG',
          quantity: 5,
          value: 1,
          price: 250_000,
          discountPercentage: 10,
        },
      ],
      userRate: 4,
      userRateCount: 1,
      propertyDefinitions: [],
      salesVolume: 0,
      minimumPayablePrice: 225_000,
      maximumDiscountPercentage: 10,
      isEnable: true,
      slug,
      createdAt: now,
      updatedAt: now,
    });

    return { slug, title };
  } catch (error) {
    await Promise.all([
      mongoose.connection.collection('products').deleteOne({ _id: productId }),
      mongoose.connection.collection('categories').deleteOne({ _id: categoryId }),
      mongoose.connection.collection('brands').deleteOne({ _id: brandId }),
      mongoose.connection.collection('pettypes').deleteOne({ _id: petTypeId }),
    ]);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteE2EProduct(slug: string) {
  if (!/^e2e-product-\d+-[a-f\d]{8}$/.test(slug)) {
    throw new Error('Refusing to delete an E2E product with an invalid slug.');
  }

  const mongoose = getE2EMongoose();
  await mongoose.connect(requireE2EDatabaseUri());
  try {
    const products = mongoose.connection.collection('products');
    const product = await products.findOne({ slug });
    if (!product) return null;

    const categoryId = product.category;
    const brandId = product.brand;
    const category = categoryId
      ? await mongoose.connection.collection('categories').findOne({ _id: categoryId })
      : null;

    await products.deleteOne({ slug });
    await Promise.all([
      categoryId
        ? mongoose.connection.collection('categories').deleteOne({ _id: categoryId })
        : Promise.resolve(),
      brandId
        ? mongoose.connection.collection('brands').deleteOne({ _id: brandId })
        : Promise.resolve(),
      category?.petType
        ? mongoose.connection.collection('pettypes').deleteOne({ _id: category.petType })
        : Promise.resolve(),
    ]);
  } finally {
    await mongoose.disconnect();
  }

  return null;
}

async function resetE2ERegisterRateLimit() {
  const { createClient } = requireBackendDependency('redis') as {
    createClient(options?: { url?: string; socket?: { host: string; port: number } }): {
      connect(): Promise<void>;
      del(keys: string[]): Promise<number>;
      isOpen: boolean;
      quit(): Promise<void>;
      scanIterator(options: { MATCH: string }): AsyncIterable<string[]>;
    };
  };
  const redisUrl = process.env.REDIS_URL?.trim();
  const configuredPort = Number.parseInt(process.env.REDIS_PORT ?? '', 10);
  const client = createClient(
    redisUrl
      ? { url: redisUrl }
      : {
          socket: {
            host: process.env.REDIS_HOST?.trim() || '127.0.0.1',
            port: Number.isInteger(configuredPort) ? configuredPort : 6379,
          },
        },
  );

  await client.connect();
  try {
    const keys: string[] = [];
    for await (const batch of client.scanIterator({ MATCH: registerRateLimitKeyPattern })) {
      keys.push(...batch);
    }
    if (keys.length) await client.del(keys);
  } finally {
    if (client.isOpen) await client.quit();
  }

  return null;
}

process.env.PETSHOP_CYPRESS_COMPONENT_TEST = 'true';

export default defineConfig({
  allowCypressEnv: false,
  defaultCommandTimeout: 30_000,
  pageLoadTimeout: 30_000,
  requestTimeout: 30_000,
  responseTimeout: 30_000,
  taskTimeout: 30_000,
  execTimeout: 30_000,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.component.cy.tsx',
    supportFile: 'cypress/support/component.tsx',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 30_000,
    pageLoadTimeout: 30_000,
    requestTimeout: 30_000,
    responseTimeout: 30_000,
    taskTimeout: 30_000,
    execTimeout: 30_000,
    specPattern: '**/**/**.cy.ts',
    excludeSpecPattern: ['node_modules/**', '.next/**'],
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('task', {
        createE2EProduct,
        deleteE2EProduct,
        deleteE2ERegisteredUser,
        resetE2ERegisterRateLimit,
      });
    },
  },
});
