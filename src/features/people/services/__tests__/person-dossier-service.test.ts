/**
 * Tests for getPersonDossier server action
 */

jest.mock('@/shared/db', () => ({
  db: {
    query: {
      persons: { findFirst: jest.fn() },
    },
  },
}));

jest.mock('@/shared/lib/tenant', () => ({
  getTenantBySlug: jest.fn(),
}));

jest.mock('@/shared/lib/logger', () => ({
  logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

import { db as mockDb } from '@/shared/db';
import { getTenantBySlug } from '@/shared/lib/tenant';
import { getPersonDossier } from '../person-dossier-service';

const mockTenant = { id: 'tenant-1', slug: 'test-tenant' };
const mockPerson = { id: 'person-1', firstName: 'John', lastName: 'Doe', tenantId: 'tenant-1' };

describe('getPersonDossier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getTenantBySlug as jest.Mock).mockResolvedValue(mockTenant);
  });

  it('should return null when person is not found', async () => {
    (mockDb.query.persons.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await getPersonDossier('test-tenant', 'person-1');
    expect(result).toBeNull();
  });

  it('should return dossier with person data', async () => {
    (mockDb.query.persons.findFirst as jest.Mock).mockResolvedValue(mockPerson);

    const result = await getPersonDossier('test-tenant', 'person-1');
    expect(result).not.toBeNull();
    expect(result?.person).toEqual(mockPerson);
  });

  it('should throw when tenant is not found', async () => {
    (getTenantBySlug as jest.Mock).mockResolvedValue(null);
    await expect(getPersonDossier('bad-tenant', 'person-1')).rejects.toThrow('Tenant not found');
  });
});
