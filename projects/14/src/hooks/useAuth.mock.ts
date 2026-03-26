// Mock data for testing
export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export const MockUsers: MockUser[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User' },
  { id: '2', email: 'user@example.com', name: 'Regular User' },
];
